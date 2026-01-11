# Certified Roofers Directory - Nationwide

## Project Overview
A comprehensive nationwide roofing directory featuring only certified, high-quality local roofers with 4.5+ star Google ratings.

## Platform
- **CMS**: WordPress
- **Plugin**: Directorist (for directory management, listings, and monetization)
- **Domain**: TBD

## Listing Criteria
1. **Minimum 4.5 Star Google Rating** - Only quality-verified companies
2. **NOT on first page of Google** - Supporting smaller, quality local businesses
3. **3 Companies per Metro Area** - Curated selection across the country
4. **Certified/Licensed** - Verified professional credentials

## Featured Company
- **Charlotte Metro Area**: bestroofingnow.com (featured listing)

## Metro Areas Coverage
See `data/metro-areas.json` for complete list of 150+ metro areas nationwide.

## Data Sources
- City/Neighborhood data from instantroofestimate project
- Company data from charlotteroofinghub project
- BrightData scraping for nationwide company discovery
- Google Business Profile data for ratings/reviews

## Directory Structure
```
roofing-directory/
├── README.md
├── data/
│   ├── metro-areas.json          # All metro areas with coverage targets
│   ├── companies/                 # Company data by metro
│   │   ├── charlotte-nc.json
│   │   ├── atlanta-ga.json
│   │   └── ...
│   └── import/                    # WordPress/Directorist import files
├── wordpress/
│   ├── theme-customizations/      # Theme modifications
│   ├── directorist-config/        # Plugin configuration
│   └── submission-workflow/       # Company submission forms
└── scripts/
    ├── scrape-companies.js        # BrightData scraping script
    ├── validate-company.js        # Rating/criteria validation
    └── generate-import.js         # WordPress import file generator
```

## Submission System
Companies can submit their listing through the website:
1. Fill out company information form
2. Provide Google Business Profile URL (for rating verification)
3. System automatically verifies 4.5+ star rating
4. Admin review before publishing
5. Payment processing for premium listings

## Pricing Tiers (Directorist)
- **Basic Listing**: Free (limited features)
- **Premium Listing**: $XX/month (enhanced visibility)
- **Featured Listing**: $XX/month (top placement in metro area)

## Next Steps
1. Set up WordPress with Directorist
2. Import metro area data
3. Scrape/collect company data per metro
4. Configure submission workflow
5. Set up payment processing
