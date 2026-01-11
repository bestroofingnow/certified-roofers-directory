import Link from 'next/link'

// Import company data
import charlotteData from '../../data/companies/charlotte-nc.json'

const featuredCities = [
  { name: 'Charlotte, NC', slug: 'charlotte-nc', companies: 3 },
  { name: 'Atlanta, GA', slug: 'atlanta-ga', companies: 3 },
  { name: 'Dallas, TX', slug: 'dallas-tx', companies: 3 },
  { name: 'Houston, TX', slug: 'houston-tx', companies: 3 },
  { name: 'Phoenix, AZ', slug: 'phoenix-az', companies: 3 },
  { name: 'Denver, CO', slug: 'denver-co', companies: 3 },
  { name: 'Miami, FL', slug: 'miami-fl', companies: 3 },
  { name: 'Chicago, IL', slug: 'chicago-il', companies: 3 },
  { name: 'Seattle, WA', slug: 'seattle-wa', companies: 3 },
  { name: 'Los Angeles, CA', slug: 'los-angeles-ca', companies: 3 },
  { name: 'San Francisco, CA', slug: 'san-francisco-ca', companies: 3 },
  { name: 'Boston, MA', slug: 'boston-ma', companies: 3 },
  { name: 'Nashville, TN', slug: 'nashville-tn', companies: 3 },
  { name: 'Las Vegas, NV', slug: 'las-vegas-nv', companies: 3 },
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-5 h-5 ${i < rating ? 'text-amber-400' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="ml-2 text-gray-600 font-medium">{rating.toFixed(1)}</span>
    </div>
  )
}

export default function Home() {
  const featuredCompany = charlotteData.featuredCompany

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Find Certified Roofers Near You
          </h1>
          <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
            Every contractor in our directory has a verified 4.5+ star Google rating and
            professional certifications. No guesswork, just quality roofers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/roofers/charlotte-nc"
              className="bg-white text-primary-700 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
            >
              Browse Charlotte Roofers
            </Link>
            <Link
              href="/locations"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-700 transition-colors"
            >
              View All Locations
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="bg-gray-50 py-8 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary-600">4.5+</div>
              <div className="text-gray-600">Minimum Star Rating</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600">100%</div>
              <div className="text-gray-600">Verified & Licensed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600">14+</div>
              <div className="text-gray-600">Metro Areas</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600">40+</div>
              <div className="text-gray-600">Certified Contractors</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Company */}
      {featuredCompany && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <span className="featured-badge mb-4 inline-block">Featured Contractor</span>
              <h2 className="text-3xl font-bold text-gray-900">
                {featuredCompany.name}
              </h2>
              <p className="text-gray-600 mt-2">Charlotte, NC Metro Area</p>
            </div>

            <div className="company-card featured max-w-4xl mx-auto p-8">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <StarRating rating={featuredCompany.googleRating} />
                    <span className="text-gray-500">({featuredCompany.reviewCount} reviews)</span>
                  </div>
                  <p className="text-gray-700 mb-6">{featuredCompany.description}</p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {featuredCompany.certifications.slice(0, 4).map((cert) => (
                      <span key={cert} className={`cert-badge ${cert.toLowerCase().includes('bbb') ? 'bbb' : cert.toLowerCase().includes('gaf') ? 'gaf' : cert.toLowerCase().includes('certainteed') ? 'certainteed' : cert.toLowerCase().includes('owens') ? 'owens-corning' : ''}`}>
                        {cert.replace(/-/g, ' ')}
                      </span>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Phone:</span>
                      <a href={`tel:${featuredCompany.phone}`} className="ml-2 text-primary-600 font-medium hover:underline">
                        {featuredCompany.phone}
                      </a>
                    </div>
                    <div>
                      <span className="text-gray-500">Location:</span>
                      <span className="ml-2">{featuredCompany.city}, {featuredCompany.state}</span>
                    </div>
                    {featuredCompany.veteranOwned && (
                      <div className="col-span-2">
                        <span className="inline-flex items-center text-green-700">
                          <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Veteran Owned & Family Operated
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="md:w-64 flex flex-col gap-4">
                  <a
                    href={featuredCompany.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-primary-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                  >
                    Visit Website
                  </a>
                  <a
                    href={`tel:${featuredCompany.phone}`}
                    className="w-full border-2 border-primary-600 text-primary-600 text-center py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
                  >
                    Call Now
                  </a>
                  <Link
                    href="/roofers/charlotte-nc"
                    className="text-center text-primary-600 hover:underline text-sm"
                  >
                    View all Charlotte roofers →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Cities Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
            Browse by City
          </h2>
          <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">
            Find certified roofing contractors in your area. Each city features hand-picked
            contractors with verified ratings and professional credentials.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {featuredCities.map((city) => (
              <Link
                key={city.slug}
                href={`/roofers/${city.slug}`}
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              >
                <h3 className="font-semibold text-gray-900">{city.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{city.companies} certified contractors</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Why Choose Our Directory?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Verified Ratings</h3>
              <p className="text-gray-600">
                Every contractor has a minimum 4.5-star Google rating, verified by our team.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Licensed & Insured</h3>
              <p className="text-gray-600">
                All contractors are licensed in their state and carry proper insurance coverage.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Manufacturer Certified</h3>
              <p className="text-gray-600">
                Many contractors hold elite certifications from GAF, CertainTeed, and Owens Corning.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Are You a Certified Roofing Contractor?
          </h2>
          <p className="text-primary-100 mb-8 max-w-2xl mx-auto">
            Join our directory and connect with homeowners looking for quality roofing services.
            Must have 4.5+ star rating and proper licensing.
          </p>
          <Link
            href="/submit-listing"
            className="inline-block bg-white text-primary-700 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
          >
            Submit Your Company
          </Link>
        </div>
      </section>
    </div>
  )
}
