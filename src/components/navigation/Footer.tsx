// src/components/navigation/Footer.tsx
export default function Footer() {
    return (
      <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">About Us</h3>
              <p className="text-gray-400">
                Professional mining investment platform providing secure and profitable solutions.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="/terms" className="text-gray-400 hover:text-white transition">Terms & Conditions</a></li>
                <li><a href="/privacy" className="text-gray-400 hover:text-white transition">Privacy Policy</a></li>
                <li><a href="/contact" className="text-gray-400 hover:text-white transition">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Email: support@mininginvestment.com</li>
                <li>24/7 Customer Support</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Mining Investment. All rights reserved.</p>
          </div>
        </div>
      </footer>
    )
  }