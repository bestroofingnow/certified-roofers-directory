/**
 * BrightData Roofing Company Scraper
 *
 * This script uses BrightData's Web Scraper API to find roofing companies
 * that meet our directory criteria:
 * - 4.5+ Google rating
 * - NOT on first page of Google search
 * - Local to the metro area
 *
 * Prerequisites:
 * - BrightData account with SERP API access
 * - Google Maps scraping dataset configured
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  brightdata: {
    // These will be loaded from environment variables
    apiKey: process.env.BRIGHTDATA_API_KEY,
    customerId: process.env.BRIGHTDATA_CUSTOMER_ID,
    zone: process.env.BRIGHTDATA_ZONE || 'serp'
  },
  criteria: {
    minGoogleRating: 4.5,
    companiesPerMetro: 3,
    excludeNationalChains: true
  }
};

// National chains to exclude
const NATIONAL_CHAINS = [
  'servpro',
  '1-800',
  'roto-rooter',
  'homeadvisor',
  'angi',
  'thumbtack'
];

/**
 * Search for roofing companies in a metro area using Google Maps
 */
async function searchGoogleMapsRoofers(metro) {
  const searchQuery = `roofing companies ${metro.city} ${metro.stateAbbr}`;

  console.log(`Searching Google Maps: "${searchQuery}"`);

  // BrightData Google Maps scraping request
  const requestBody = {
    url: `https://www.google.com/maps/search/${encodeURIComponent(searchQuery)}`,
    country: 'us',
    render_js: true,
    // Additional BrightData specific options
  };

  // TODO: Implement actual BrightData API call
  // const response = await fetch('https://api.brightdata.com/serp/search', {
  //   method: 'POST',
  //   headers: {
  //     'Authorization': `Bearer ${CONFIG.brightdata.apiKey}`,
  //     'Content-Type': 'application/json'
  //   },
  //   body: JSON.stringify(requestBody)
  // });

  return {
    metro: metro.slug,
    results: [],
    status: 'pending_implementation'
  };
}

/**
 * Check if a company is on the first page of Google organic search
 */
async function checkGoogleFirstPage(companyName, metro) {
  const searchQuery = `roofers ${metro.city} ${metro.stateAbbr}`;

  console.log(`Checking Google first page for "${companyName}" with query: "${searchQuery}"`);

  // BrightData SERP API request
  const requestBody = {
    query: searchQuery,
    country: 'us',
    results_per_page: 10,
    parse: true
  };

  // TODO: Implement actual BrightData SERP API call
  // Check if company appears in top 10 organic results

  return {
    companyName,
    isOnFirstPage: false, // Will be determined by API response
    status: 'pending_implementation'
  };
}

/**
 * Filter companies based on our criteria
 */
function filterCompanies(companies, metro) {
  return companies.filter(company => {
    // Check minimum rating
    if (company.googleRating < CONFIG.criteria.minGoogleRating) {
      console.log(`  Excluding ${company.name}: Rating ${company.googleRating} < 4.5`);
      return false;
    }

    // Check for national chains
    const isNationalChain = NATIONAL_CHAINS.some(chain =>
      company.name.toLowerCase().includes(chain)
    );
    if (isNationalChain && CONFIG.criteria.excludeNationalChains) {
      console.log(`  Excluding ${company.name}: National chain`);
      return false;
    }

    return true;
  });
}

/**
 * Main scraping workflow for a single metro area
 */
async function scrapeMetroArea(metro) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Scraping roofing companies for: ${metro.city}, ${metro.stateAbbr}`);
  console.log(`${'='.repeat(60)}`);

  try {
    // Step 1: Search Google Maps for roofing companies
    const mapsResults = await searchGoogleMapsRoofers(metro);

    // Step 2: Filter by rating criteria
    const filteredByRating = filterCompanies(mapsResults.results, metro);
    console.log(`Found ${filteredByRating.length} companies with 4.5+ rating`);

    // Step 3: Check each company for Google first page presence
    const qualifiedCompanies = [];
    for (const company of filteredByRating) {
      const firstPageCheck = await checkGoogleFirstPage(company.name, metro);

      if (!firstPageCheck.isOnFirstPage) {
        qualifiedCompanies.push({
          ...company,
          notOnGoogleFirstPage: true,
          metroArea: metro.slug
        });

        // Stop once we have enough companies
        if (qualifiedCompanies.length >= CONFIG.criteria.companiesPerMetro) {
          break;
        }
      }
    }

    console.log(`\nQualified companies for ${metro.city}: ${qualifiedCompanies.length}`);

    return {
      metro: metro.slug,
      companies: qualifiedCompanies,
      status: 'complete'
    };

  } catch (error) {
    console.error(`Error scraping ${metro.city}: ${error.message}`);
    return {
      metro: metro.slug,
      companies: [],
      status: 'error',
      error: error.message
    };
  }
}

/**
 * Save results to JSON file
 */
function saveResults(metro, results) {
  const outputPath = path.join(__dirname, '..', 'data', 'companies', `${metro.slug}.json`);

  // Read existing file if it exists
  let existingData = {};
  if (fs.existsSync(outputPath)) {
    existingData = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
  }

  // Merge with new results
  const updatedData = {
    ...existingData,
    metroArea: {
      slug: metro.slug,
      city: metro.city,
      state: metro.stateAbbr,
      lastUpdated: new Date().toISOString()
    },
    companies: results.companies
  };

  fs.writeFileSync(outputPath, JSON.stringify(updatedData, null, 2));
  console.log(`Saved results to: ${outputPath}`);
}

/**
 * Main execution
 */
async function main() {
  // Load metro areas
  const metrosPath = path.join(__dirname, '..', 'data', 'metro-areas.json');
  const metrosData = JSON.parse(fs.readFileSync(metrosPath, 'utf8'));

  // Get all metros from all regions
  const allMetros = [];
  for (const region of Object.values(metrosData.regions)) {
    allMetros.push(...region.metros);
  }

  console.log(`Total metro areas to scrape: ${allMetros.length}`);
  console.log(`Target: ${CONFIG.criteria.companiesPerMetro} companies per metro`);
  console.log(`Total target companies: ${allMetros.length * CONFIG.criteria.companiesPerMetro}`);

  // Process metros by priority
  const sortedMetros = allMetros.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  // Process each metro
  for (const metro of sortedMetros) {
    const results = await scrapeMetroArea(metro);
    saveResults(metro, results);

    // Rate limiting - wait between requests
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  console.log('\n\nScraping complete!');
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  scrapeMetroArea,
  searchGoogleMapsRoofers,
  checkGoogleFirstPage,
  filterCompanies
};
