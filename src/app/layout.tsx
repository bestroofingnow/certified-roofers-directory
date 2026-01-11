import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Certified Roofers Directory | Find Top-Rated Roofing Contractors',
  description: 'Find BBB A+ accredited roofers with 4.5+ star Google ratings. Compare verified roofing contractors nationwide. Free quotes from certified local experts.',
  keywords: 'roofers, roofing contractors, roofing companies, roof repair, roof replacement, certified roofers',
  openGraph: {
    title: 'Certified Roofers Directory',
    description: 'Find top-rated roofing contractors with verified 4.5+ star ratings',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="bg-white shadow-sm border-b">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <a href="/" className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-primary-700">Certified Roofers</span>
                <span className="text-sm text-gray-500">Directory</span>
              </a>
              <div className="hidden md:flex space-x-8">
                <a href="/roofers/charlotte-nc" className="text-gray-600 hover:text-primary-600">Charlotte, NC</a>
                <a href="/roofers/atlanta-ga" className="text-gray-600 hover:text-primary-600">Atlanta, GA</a>
                <a href="/roofers/dallas-tx" className="text-gray-600 hover:text-primary-600">Dallas, TX</a>
                <a href="/locations" className="text-gray-600 hover:text-primary-600">All Locations</a>
              </div>
            </div>
          </nav>
        </header>
        <main className="min-h-screen">
          {children}
        </main>
        <footer className="bg-gray-900 text-white py-12 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Certified Roofers Directory</h3>
                <p className="text-gray-400 text-sm">
                  Find verified roofing contractors with 4.5+ star ratings and BBB accreditation.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Popular Cities</h4>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li><a href="/roofers/charlotte-nc" className="hover:text-white">Charlotte, NC</a></li>
                  <li><a href="/roofers/atlanta-ga" className="hover:text-white">Atlanta, GA</a></li>
                  <li><a href="/roofers/dallas-tx" className="hover:text-white">Dallas, TX</a></li>
                  <li><a href="/roofers/houston-tx" className="hover:text-white">Houston, TX</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Services</h4>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li><a href="/services/roof-repair" className="hover:text-white">Roof Repair</a></li>
                  <li><a href="/services/roof-replacement" className="hover:text-white">Roof Replacement</a></li>
                  <li><a href="/services/storm-damage" className="hover:text-white">Storm Damage</a></li>
                  <li><a href="/services/inspections" className="hover:text-white">Roof Inspections</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">For Contractors</h4>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li><a href="/submit-listing" className="hover:text-white">Submit Your Company</a></li>
                  <li><a href="/advertising" className="hover:text-white">Advertising</a></li>
                  <li><a href="/contact" className="hover:text-white">Contact Us</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
              <p>&copy; 2026 Certified Roofers Directory. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
