/**
 * WordPress/Directorist Import Generator
 *
 * Converts collected company data into WordPress-compatible import format
 * for the Directorist plugin.
 *
 * Output formats:
 * - CSV for bulk import
 * - JSON for API import
 * - WXR (WordPress eXtended RSS) for native import
 */

const fs = require('fs');
const path = require('path');

// Directorist field mapping
const FIELD_MAPPING = {
  // Post fields
  name: 'post_title',
  description: 'post_content',
  slug: 'post_name',

  // Custom fields (Directorist)
  phone: '_phone',
  email: '_email',
  website: '_website',
  address: '_address',
  city: '_city',
  state: '_state',
  zipCode: '_zip',
  googleRating: '_google_rating',
  reviewCount: '_review_count',
  yearsInBusiness: '_years_in_business',
  veteranOwned: '_veteran_owned',
  familyOwned: '_family_owned',
  logoUrl: '_logo',

  // Taxonomies
  services: 'at_biz_dir-category',
  materials: 'at_biz_dir-tags',
  metroArea: 'at_biz_dir-location'
};

// Service categories mapping (for Directorist taxonomy)
const SERVICE_CATEGORIES = {
  'residential': 'Residential Roofing',
  'commercial': 'Commercial Roofing',
  'repairs': 'Roof Repairs',
  'inspections': 'Roof Inspections',
  'emergency': 'Emergency Services',
  'gutters': 'Gutters',
  'siding': 'Siding',
  'storm-damage': 'Storm Damage',
  'insurance-claims': 'Insurance Claims',
  'metal': 'Metal Roofing',
  'flat-roofing': 'Flat Roofing',
  'skylights': 'Skylights'
};

/**
 * Load all company data from JSON files
 */
function loadAllCompanies() {
  const companiesDir = path.join(__dirname, '..', 'data', 'companies');
  const files = fs.readdirSync(companiesDir).filter(f => f.endsWith('.json'));

  const allCompanies = [];

  for (const file of files) {
    const filePath = path.join(companiesDir, file);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    // Add featured company if exists
    if (data.featuredCompany) {
      allCompanies.push({
        ...data.featuredCompany,
        metroArea: data.metroArea.slug
      });
    }

    // Add regular companies
    if (data.companies) {
      for (const company of data.companies) {
        if (company.status !== 'pending') {
          allCompanies.push({
            ...company,
            metroArea: data.metroArea.slug
          });
        }
      }
    }
  }

  return allCompanies;
}

/**
 * Generate CSV for Directorist bulk import
 */
function generateCSV(companies) {
  // CSV headers matching Directorist import format
  const headers = [
    'listing_title',
    'listing_content',
    'tagline',
    'phone',
    'email',
    'website',
    'address',
    'city',
    'state',
    'zip',
    'category',
    'tags',
    'location',
    'featured',
    'google_rating',
    'review_count',
    'veteran_owned',
    'family_owned',
    'years_in_business'
  ];

  const rows = companies.map(company => {
    const services = (company.services || [])
      .map(s => SERVICE_CATEGORIES[s] || s)
      .join('|');

    const materials = (company.materials || []).join('|');

    return [
      company.name,
      company.description || '',
      company.tagline || '',
      company.phone || '',
      company.email || '',
      company.website || '',
      company.address || '',
      company.city || '',
      company.state || '',
      company.zipCode || '',
      services,
      materials,
      company.metroArea || '',
      company.isFeatured ? '1' : '0',
      company.googleRating || '',
      company.reviewCount || '',
      company.veteranOwned ? '1' : '0',
      company.familyOwned ? '1' : '0',
      company.yearsInBusiness || ''
    ];
  });

  // Escape CSV values
  const escapeCSV = (val) => {
    if (val === null || val === undefined) return '';
    const str = String(val);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(escapeCSV).join(','))
  ].join('\n');

  return csvContent;
}

/**
 * Generate JSON for REST API import
 */
function generateJSON(companies) {
  return companies.map(company => ({
    post_title: company.name,
    post_content: company.description || '',
    post_name: company.slug,
    post_status: 'publish',
    post_type: 'at_biz_dir',
    meta_input: {
      _phone: company.phone || '',
      _email: company.email || '',
      _website: company.website || '',
      _address: company.address || '',
      _city: company.city || '',
      _state: company.state || '',
      _zip: company.zipCode || '',
      _google_rating: company.googleRating || '',
      _review_count: company.reviewCount || '',
      _veteran_owned: company.veteranOwned || false,
      _family_owned: company.familyOwned || false,
      _years_in_business: company.yearsInBusiness || '',
      _featured: company.isFeatured || false,
      _listing_type: company.listingTier || 'basic'
    },
    tax_input: {
      'at_biz_dir-category': (company.services || []).map(s => SERVICE_CATEGORIES[s] || s),
      'at_biz_dir-tags': company.materials || [],
      'at_biz_dir-location': [company.metroArea]
    }
  }));
}

/**
 * Generate WXR (WordPress eXtended RSS) for native WordPress import
 */
function generateWXR(companies) {
  const now = new Date().toISOString();

  const items = companies.map((company, index) => {
    const services = (company.services || [])
      .map(s => `<category domain="at_biz_dir-category" nicename="${s}"><![CDATA[${SERVICE_CATEGORIES[s] || s}]]></category>`)
      .join('\n      ');

    const materials = (company.materials || [])
      .map(m => `<category domain="at_biz_dir-tags" nicename="${m}"><![CDATA[${m}]]></category>`)
      .join('\n      ');

    return `
    <item>
      <title><![CDATA[${company.name}]]></title>
      <link>https://yourdomain.com/listing/${company.slug}/</link>
      <pubDate>${now}</pubDate>
      <dc:creator><![CDATA[admin]]></dc:creator>
      <guid isPermaLink="false">https://yourdomain.com/?post_type=at_biz_dir&amp;p=${1000 + index}</guid>
      <description></description>
      <content:encoded><![CDATA[${company.description || ''}]]></content:encoded>
      <excerpt:encoded><![CDATA[]]></excerpt:encoded>
      <wp:post_id>${1000 + index}</wp:post_id>
      <wp:post_date><![CDATA[${now}]]></wp:post_date>
      <wp:post_date_gmt><![CDATA[${now}]]></wp:post_date_gmt>
      <wp:post_modified><![CDATA[${now}]]></wp:post_modified>
      <wp:post_modified_gmt><![CDATA[${now}]]></wp:post_modified_gmt>
      <wp:comment_status><![CDATA[closed]]></wp:comment_status>
      <wp:ping_status><![CDATA[closed]]></wp:ping_status>
      <wp:post_name><![CDATA[${company.slug}]]></wp:post_name>
      <wp:status><![CDATA[publish]]></wp:status>
      <wp:post_type><![CDATA[at_biz_dir]]></wp:post_type>
      <wp:is_sticky>0</wp:is_sticky>
      ${services}
      ${materials}
      <category domain="at_biz_dir-location" nicename="${company.metroArea}"><![CDATA[${company.metroArea}]]></category>
      <wp:postmeta><wp:meta_key><![CDATA[_phone]]></wp:meta_key><wp:meta_value><![CDATA[${company.phone || ''}]]></wp:meta_value></wp:postmeta>
      <wp:postmeta><wp:meta_key><![CDATA[_email]]></wp:meta_key><wp:meta_value><![CDATA[${company.email || ''}]]></wp:meta_value></wp:postmeta>
      <wp:postmeta><wp:meta_key><![CDATA[_website]]></wp:meta_key><wp:meta_value><![CDATA[${company.website || ''}]]></wp:meta_value></wp:postmeta>
      <wp:postmeta><wp:meta_key><![CDATA[_address]]></wp:meta_key><wp:meta_value><![CDATA[${company.address || ''}]]></wp:meta_value></wp:postmeta>
      <wp:postmeta><wp:meta_key><![CDATA[_city]]></wp:meta_key><wp:meta_value><![CDATA[${company.city || ''}]]></wp:meta_value></wp:postmeta>
      <wp:postmeta><wp:meta_key><![CDATA[_state]]></wp:meta_key><wp:meta_value><![CDATA[${company.state || ''}]]></wp:meta_value></wp:postmeta>
      <wp:postmeta><wp:meta_key><![CDATA[_zip]]></wp:meta_key><wp:meta_value><![CDATA[${company.zipCode || ''}]]></wp:meta_value></wp:postmeta>
      <wp:postmeta><wp:meta_key><![CDATA[_google_rating]]></wp:meta_key><wp:meta_value><![CDATA[${company.googleRating || ''}]]></wp:meta_value></wp:postmeta>
      <wp:postmeta><wp:meta_key><![CDATA[_review_count]]></wp:meta_key><wp:meta_value><![CDATA[${company.reviewCount || ''}]]></wp:meta_value></wp:postmeta>
      <wp:postmeta><wp:meta_key><![CDATA[_featured]]></wp:meta_key><wp:meta_value><![CDATA[${company.isFeatured ? '1' : '0'}]]></wp:meta_value></wp:postmeta>
    </item>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0"
  xmlns:excerpt="http://wordpress.org/export/1.2/excerpt/"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:wfw="http://wellformedweb.org/CommentAPI/"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:wp="http://wordpress.org/export/1.2/"
>
  <channel>
    <title>Certified Roofers Directory</title>
    <link>https://yourdomain.com</link>
    <description>Nationwide directory of certified roofing professionals</description>
    <pubDate>${now}</pubDate>
    <language>en-US</language>
    <wp:wxr_version>1.2</wp:wxr_version>
    <wp:base_site_url>https://yourdomain.com</wp:base_site_url>
    <wp:base_blog_url>https://yourdomain.com</wp:base_blog_url>
    ${items}
  </channel>
</rss>`;
}

/**
 * Generate summary report
 */
function generateSummary(companies) {
  const byMetro = {};
  const byTier = { basic: 0, premium: 0, featured: 0 };
  let totalRating = 0;
  let totalReviews = 0;

  for (const company of companies) {
    // By metro
    const metro = company.metroArea || 'unknown';
    byMetro[metro] = (byMetro[metro] || 0) + 1;

    // By tier
    const tier = company.listingTier || 'basic';
    byTier[tier]++;

    // Ratings
    if (company.googleRating) {
      totalRating += company.googleRating;
    }
    if (company.reviewCount) {
      totalReviews += company.reviewCount;
    }
  }

  return {
    totalCompanies: companies.length,
    byMetroArea: byMetro,
    byListingTier: byTier,
    averageRating: (totalRating / companies.length).toFixed(2),
    totalReviews,
    generatedAt: new Date().toISOString()
  };
}

/**
 * Main execution
 */
function main() {
  console.log('WordPress/Directorist Import Generator');
  console.log('======================================\n');

  // Load all companies
  const companies = loadAllCompanies();
  console.log(`Loaded ${companies.length} companies from data files\n`);

  if (companies.length === 0) {
    console.log('No companies found. Run scrape-companies.js first.');
    return;
  }

  // Create import directory
  const importDir = path.join(__dirname, '..', 'data', 'import');
  if (!fs.existsSync(importDir)) {
    fs.mkdirSync(importDir, { recursive: true });
  }

  // Generate CSV
  const csv = generateCSV(companies);
  const csvPath = path.join(importDir, 'directorist-import.csv');
  fs.writeFileSync(csvPath, csv);
  console.log(`Generated: ${csvPath}`);

  // Generate JSON
  const json = generateJSON(companies);
  const jsonPath = path.join(importDir, 'directorist-import.json');
  fs.writeFileSync(jsonPath, JSON.stringify(json, null, 2));
  console.log(`Generated: ${jsonPath}`);

  // Generate WXR
  const wxr = generateWXR(companies);
  const wxrPath = path.join(importDir, 'directorist-import.xml');
  fs.writeFileSync(wxrPath, wxr);
  console.log(`Generated: ${wxrPath}`);

  // Generate summary
  const summary = generateSummary(companies);
  const summaryPath = path.join(importDir, 'import-summary.json');
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
  console.log(`Generated: ${summaryPath}`);

  console.log('\n--- Summary ---');
  console.log(`Total companies: ${summary.totalCompanies}`);
  console.log(`Average rating: ${summary.averageRating}`);
  console.log(`Total reviews: ${summary.totalReviews}`);
  console.log(`\nFiles ready for WordPress import in: ${importDir}`);
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  loadAllCompanies,
  generateCSV,
  generateJSON,
  generateWXR,
  generateSummary
};
