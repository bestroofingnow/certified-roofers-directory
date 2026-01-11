/**
 * Company Validation Script
 *
 * Validates roofing company submissions against directory criteria:
 * 1. Google rating >= 4.5
 * 2. Not on first page of Google for "roofers [city]"
 * 3. Valid business information
 *
 * Used for:
 * - Validating scraped company data
 * - Processing user submissions
 * - Periodic re-verification of listings
 */

const fs = require('fs');
const path = require('path');

// Validation configuration
const VALIDATION_CONFIG = {
  minGoogleRating: 4.5,
  requiredFields: ['name', 'phone', 'city', 'state', 'googleRating'],
  phonePattern: /^\(\d{3}\) \d{3}-\d{4}$/,
  emailPattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  websitePattern: /^https?:\/\/.+/
};

// Validation result types
const ValidationStatus = {
  VALID: 'valid',
  INVALID: 'invalid',
  PENDING_VERIFICATION: 'pending_verification',
  NEEDS_REVIEW: 'needs_review'
};

/**
 * Validate required fields
 */
function validateRequiredFields(company) {
  const errors = [];

  for (const field of VALIDATION_CONFIG.requiredFields) {
    if (!company[field] || company[field] === '') {
      errors.push({
        field,
        message: `Missing required field: ${field}`
      });
    }
  }

  return errors;
}

/**
 * Validate Google rating
 */
function validateGoogleRating(company) {
  const errors = [];

  if (typeof company.googleRating !== 'number') {
    errors.push({
      field: 'googleRating',
      message: 'Google rating must be a number'
    });
    return errors;
  }

  if (company.googleRating < VALIDATION_CONFIG.minGoogleRating) {
    errors.push({
      field: 'googleRating',
      message: `Google rating ${company.googleRating} is below minimum ${VALIDATION_CONFIG.minGoogleRating}`
    });
  }

  if (company.googleRating > 5.0) {
    errors.push({
      field: 'googleRating',
      message: 'Google rating cannot exceed 5.0'
    });
  }

  return errors;
}

/**
 * Validate phone format
 */
function validatePhone(company) {
  const errors = [];

  if (company.phone && !VALIDATION_CONFIG.phonePattern.test(company.phone)) {
    errors.push({
      field: 'phone',
      message: 'Phone must be in format (XXX) XXX-XXXX',
      suggestion: formatPhoneNumber(company.phone)
    });
  }

  return errors;
}

/**
 * Attempt to format phone number
 */
function formatPhoneNumber(phone) {
  // Remove all non-digits
  const digits = phone.replace(/\D/g, '');

  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  } else if (digits.length === 11 && digits[0] === '1') {
    return `(${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }

  return null;
}

/**
 * Validate email format
 */
function validateEmail(company) {
  const errors = [];

  if (company.email && !VALIDATION_CONFIG.emailPattern.test(company.email)) {
    errors.push({
      field: 'email',
      message: 'Invalid email format'
    });
  }

  return errors;
}

/**
 * Validate website format
 */
function validateWebsite(company) {
  const errors = [];

  if (company.website) {
    if (!VALIDATION_CONFIG.websitePattern.test(company.website)) {
      errors.push({
        field: 'website',
        message: 'Website must start with http:// or https://',
        suggestion: company.website.startsWith('www.')
          ? `https://${company.website}`
          : `https://www.${company.website}`
      });
    }
  }

  return errors;
}

/**
 * Validate services array
 */
function validateServices(company) {
  const errors = [];
  const validServices = [
    'residential', 'commercial', 'repairs', 'inspections',
    'emergency', 'gutters', 'siding', 'storm-damage',
    'insurance-claims', 'metal', 'flat-roofing', 'skylights'
  ];

  if (company.services) {
    if (!Array.isArray(company.services)) {
      errors.push({
        field: 'services',
        message: 'Services must be an array'
      });
    } else {
      const invalidServices = company.services.filter(s => !validServices.includes(s));
      if (invalidServices.length > 0) {
        errors.push({
          field: 'services',
          message: `Invalid services: ${invalidServices.join(', ')}`,
          validOptions: validServices
        });
      }
    }
  }

  return errors;
}

/**
 * Check for duplicate companies
 */
function checkForDuplicates(company, existingCompanies) {
  const warnings = [];

  // Check by name similarity
  const nameLower = company.name.toLowerCase();
  const similarNames = existingCompanies.filter(c => {
    const existingLower = c.name.toLowerCase();
    return existingLower === nameLower ||
      existingLower.includes(nameLower) ||
      nameLower.includes(existingLower);
  });

  if (similarNames.length > 0) {
    warnings.push({
      type: 'potential_duplicate',
      message: `Found ${similarNames.length} similar company names`,
      matches: similarNames.map(c => ({ name: c.name, city: c.city }))
    });
  }

  // Check by phone
  if (company.phone) {
    const samePhone = existingCompanies.filter(c => c.phone === company.phone);
    if (samePhone.length > 0) {
      warnings.push({
        type: 'duplicate_phone',
        message: 'Phone number already exists in directory',
        matches: samePhone.map(c => ({ name: c.name, phone: c.phone }))
      });
    }
  }

  // Check by website
  if (company.website) {
    const sameWebsite = existingCompanies.filter(c => c.website === company.website);
    if (sameWebsite.length > 0) {
      warnings.push({
        type: 'duplicate_website',
        message: 'Website already exists in directory',
        matches: sameWebsite.map(c => ({ name: c.name, website: c.website }))
      });
    }
  }

  return warnings;
}

/**
 * Main validation function
 */
function validateCompany(company, existingCompanies = []) {
  const errors = [];
  const warnings = [];

  // Run all validations
  errors.push(...validateRequiredFields(company));
  errors.push(...validateGoogleRating(company));
  errors.push(...validatePhone(company));
  errors.push(...validateEmail(company));
  errors.push(...validateWebsite(company));
  errors.push(...validateServices(company));

  // Check for duplicates
  warnings.push(...checkForDuplicates(company, existingCompanies));

  // Determine status
  let status;
  if (errors.length > 0) {
    status = ValidationStatus.INVALID;
  } else if (warnings.some(w => w.type === 'duplicate_phone' || w.type === 'duplicate_website')) {
    status = ValidationStatus.NEEDS_REVIEW;
  } else if (!company.notOnGoogleFirstPage) {
    status = ValidationStatus.PENDING_VERIFICATION;
  } else {
    status = ValidationStatus.VALID;
  }

  return {
    company: company.name,
    status,
    errors,
    warnings,
    validatedAt: new Date().toISOString()
  };
}

/**
 * Validate all companies in a metro area file
 */
function validateMetroAreaFile(filePath) {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const results = {
    metroArea: data.metroArea?.slug || 'unknown',
    totalCompanies: 0,
    valid: 0,
    invalid: 0,
    needsReview: 0,
    pendingVerification: 0,
    validations: []
  };

  const allCompanies = [];

  // Validate featured company
  if (data.featuredCompany) {
    allCompanies.push(data.featuredCompany);
    const validation = validateCompany(data.featuredCompany, []);
    results.validations.push(validation);
  }

  // Validate regular companies
  if (data.companies) {
    for (const company of data.companies) {
      if (company.status !== 'pending') {
        allCompanies.push(company);
        const validation = validateCompany(company, allCompanies);
        results.validations.push(validation);
      }
    }
  }

  // Summarize results
  results.totalCompanies = results.validations.length;
  for (const v of results.validations) {
    switch (v.status) {
      case ValidationStatus.VALID:
        results.valid++;
        break;
      case ValidationStatus.INVALID:
        results.invalid++;
        break;
      case ValidationStatus.NEEDS_REVIEW:
        results.needsReview++;
        break;
      case ValidationStatus.PENDING_VERIFICATION:
        results.pendingVerification++;
        break;
    }
  }

  return results;
}

/**
 * Process user submission
 */
function processSubmission(submissionData) {
  console.log('\nProcessing company submission...');
  console.log(`Company: ${submissionData.name}`);
  console.log(`City: ${submissionData.city}, ${submissionData.state}`);

  // Step 1: Basic validation
  const validation = validateCompany(submissionData);

  if (validation.status === ValidationStatus.INVALID) {
    console.log('\nSubmission REJECTED:');
    for (const error of validation.errors) {
      console.log(`  - ${error.field}: ${error.message}`);
    }
    return {
      accepted: false,
      reason: 'validation_failed',
      errors: validation.errors
    };
  }

  // Step 2: Check Google rating requirement
  if (submissionData.googleRating < VALIDATION_CONFIG.minGoogleRating) {
    return {
      accepted: false,
      reason: 'rating_too_low',
      message: `Your Google rating (${submissionData.googleRating}) is below our minimum requirement of ${VALIDATION_CONFIG.minGoogleRating} stars.`
    };
  }

  // Step 3: Queue for first-page verification
  console.log('\nSubmission requires verification:');
  console.log('  - Google first page check needed');

  return {
    accepted: true,
    status: 'pending_verification',
    nextSteps: [
      'Verify company not on first page of Google',
      'Admin review of submission',
      'Payment processing (if applicable)'
    ]
  };
}

/**
 * Main execution
 */
function main() {
  console.log('Company Validation Script');
  console.log('=========================\n');

  const companiesDir = path.join(__dirname, '..', 'data', 'companies');
  const files = fs.readdirSync(companiesDir).filter(f => f.endsWith('.json'));

  const allResults = [];

  for (const file of files) {
    const filePath = path.join(companiesDir, file);
    console.log(`Validating: ${file}`);

    const results = validateMetroAreaFile(filePath);
    allResults.push(results);

    console.log(`  Total: ${results.totalCompanies}`);
    console.log(`  Valid: ${results.valid}`);
    console.log(`  Invalid: ${results.invalid}`);
    console.log(`  Needs Review: ${results.needsReview}`);
    console.log(`  Pending Verification: ${results.pendingVerification}\n`);
  }

  // Save validation report
  const reportPath = path.join(__dirname, '..', 'data', 'validation-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(allResults, null, 2));
  console.log(`\nValidation report saved to: ${reportPath}`);
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  validateCompany,
  validateMetroAreaFile,
  processSubmission,
  ValidationStatus,
  formatPhoneNumber
};
