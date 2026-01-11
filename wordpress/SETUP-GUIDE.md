# WordPress + Directorist Setup Guide

## Overview
This guide covers setting up WordPress with the Directorist plugin to create a nationwide roofing company directory.

## Prerequisites
- Domain name registered
- Web hosting with PHP 8.0+ and MySQL 5.7+
- SSL certificate (required for payment processing)
- Stripe account for payment processing

## Step 1: WordPress Installation

1. Install WordPress on your hosting
2. Complete the initial setup wizard
3. Set permalink structure to: `/%postname%/`

## Step 2: Install Required Plugins

### Core Plugins
1. **Directorist - Business Directory Plugin** (Free core)
   - Install from WordPress plugin repository
   - This handles all directory functionality

2. **Directorist Pricing Plans** (Premium add-on)
   - Required for monetization
   - Purchase from: https://directorist.com/product/pricing-plans/

3. **Directorist Stripe** (Premium add-on)
   - Payment processing integration
   - Purchase from: https://directorist.com/product/stripe/

4. **Directorist WooCommerce Pricing Plans** (Alternative)
   - If you prefer WooCommerce checkout flow

### Recommended Plugins
- Yoast SEO or Rank Math (SEO optimization)
- WP Rocket or W3 Total Cache (Performance)
- Wordfence (Security)
- UpdraftPlus (Backups)

## Step 3: Directorist Configuration

### General Settings
Navigate to: `Directory > Settings > General`

```
Business Name: Certified Roofers Directory
Currency: USD
Date Format: F j, Y
Map API: Google Maps (recommended for accuracy)
```

### Listings Settings
Navigate to: `Directory > Settings > Listings`

```
Listings Per Page: 12
Default Listing View: Grid
Show Reviews: Yes
Show Ratings: Yes
Require Login to Submit: Yes
```

### Custom Fields Setup
Navigate to: `Directory > Form Builder`

Create the following custom fields:

#### Required Fields:
| Field Name | Field Type | Required |
|------------|------------|----------|
| Business Name | Text | Yes |
| Phone | Phone | Yes |
| Email | Email | Yes |
| Website | URL | No |
| Address | Text | Yes |
| City | Text | Yes |
| State | Dropdown | Yes |
| ZIP Code | Text | Yes |
| Google Rating | Number | Yes |
| Review Count | Number | Yes |
| Description | Textarea | Yes |

#### Optional Fields:
| Field Name | Field Type | Required |
|------------|------------|----------|
| Google Business URL | URL | No |
| Years in Business | Number | No |
| Veteran Owned | Checkbox | No |
| Family Owned | Checkbox | No |
| Logo | File | No |
| Cover Image | File | No |

### Categories (Services)
Navigate to: `Directory > Categories`

Create these categories:
- Residential Roofing
- Commercial Roofing
- Roof Repairs
- Roof Inspections
- Emergency Services
- Gutters
- Siding
- Storm Damage
- Insurance Claims
- Metal Roofing
- Flat Roofing
- Skylights

### Locations (Metro Areas)
Navigate to: `Directory > Locations`

Import locations from `data/metro-areas.json`:
- Create parent locations for states
- Create child locations for metros
- Create grandchild locations for neighborhoods

Example hierarchy:
```
North Carolina (NC)
├── Charlotte Metro
│   ├── South End
│   ├── NoDa
│   ├── Dilworth
│   └── ...
├── Raleigh Metro
│   ├── Downtown
│   └── ...
```

## Step 4: Pricing Plans Setup

Navigate to: `Directory > Pricing Plans`

### Basic Plan (Free)
- Price: $0
- Duration: Unlimited
- Features:
  - Basic listing
  - Company name & contact
  - 1 category
  - No featured placement

### Premium Plan
- Price: $29/month or $299/year
- Features:
  - Enhanced listing
  - Logo display
  - 3 categories
  - Social media links
  - Photo gallery (5 images)
  - Priority in search results

### Featured Plan
- Price: $99/month or $999/year
- Features:
  - All Premium features
  - Featured badge
  - Top placement in metro area
  - Homepage spotlight rotation
  - Dedicated company page
  - Analytics dashboard

## Step 5: Submission Form Setup

### Enable User Submissions
Navigate to: `Directory > Settings > Submission`

```
Enable Submission: Yes
Require Login: Yes
Require Payment: Yes (for Premium/Featured)
Admin Approval Required: Yes
Guest Submission: No
```

### Submission Validation Rules
Add custom validation in your theme's functions.php:

```php
// Validate Google rating on submission
add_filter('atbdp_listing_validation', function($errors, $data) {
    if (isset($data['google_rating'])) {
        if ($data['google_rating'] < 4.5) {
            $errors[] = 'Your Google rating must be 4.5 or higher to be listed in our directory.';
        }
    }
    return $errors;
}, 10, 2);
```

## Step 6: Stripe Payment Setup

1. Get Stripe API keys from: https://dashboard.stripe.com/apikeys
2. Navigate to: `Directory > Settings > Monetization > Stripe`
3. Enter:
   - Publishable Key
   - Secret Key
   - Webhook Secret (for subscription management)

### Webhook Configuration
In Stripe Dashboard, create webhook for:
- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

## Step 7: Import Company Data

### Using CSV Import
1. Navigate to: `Tools > Import`
2. Install CSV Importer
3. Upload `data/import/directorist-import.csv`
4. Map fields according to schema

### Using WXR Import
1. Navigate to: `Tools > Import`
2. Select WordPress
3. Upload `data/import/directorist-import.xml`
4. Assign to admin user

### Using REST API (Programmatic)
```bash
# Example using WP-CLI
wp post create --post_type=at_biz_dir \
  --post_title="Best Roofing Now LLC" \
  --post_status=publish \
  --meta_input='{"_phone":"(704) 605-6047","_city":"Charlotte"}'
```

## Step 8: Theme Customization

### Recommended Themes
1. **Developer Theme** - Made for Directorist
2. **Developer Theme** - Flexible directory theme
3. **Developer Theme** - Clean, modern design

### Custom CSS
Add to Appearance > Customize > Additional CSS:

```css
/* Featured listing highlight */
.directorist-listing.featured-listing {
  border: 2px solid #fbbf24;
  background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
}

/* Star rating color */
.directorist-rating .rating-star.active {
  color: #f59e0b;
}

/* Trust badges */
.badge-verified {
  background: #10b981;
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
}
```

## Step 9: SEO Configuration

### Yoast SEO Settings
1. Set title template for listings:
   `%%title%% - Certified Roofer in %%cf_city%%, %%cf_state%% | Directory Name`

2. Set meta description template:
   `%%excerpt%% %%cf_google_rating%% star rating with %%cf_review_count%% reviews. Serving %%cf_city%%, %%cf_state%%.`

### Schema Markup
Directorist includes basic schema. Enhance with:

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "{{company_name}}",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "{{google_rating}}",
    "reviewCount": "{{review_count}}"
  }
}
```

## Step 10: Go Live Checklist

- [ ] All test listings removed
- [ ] Payment processing tested
- [ ] Email notifications configured
- [ ] SSL certificate active
- [ ] Backup system configured
- [ ] Google Analytics connected
- [ ] Search Console submitted
- [ ] Social media meta tags set
- [ ] Mobile responsiveness verified
- [ ] Page speed optimized
- [ ] Contact forms tested
- [ ] Terms of Service page created
- [ ] Privacy Policy page created

## Ongoing Maintenance

### Weekly Tasks
- Review and approve pending submissions
- Verify Google ratings haven't dropped below 4.5
- Respond to user inquiries

### Monthly Tasks
- Run validation script on all listings
- Update companies with changed information
- Review analytics and adjust

### Quarterly Tasks
- Re-verify all Google ratings
- Update metro area coverage
- Add new companies to fill gaps
