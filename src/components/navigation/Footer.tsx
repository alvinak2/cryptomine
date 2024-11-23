// src/components/navigation/Footer.tsx
export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-4">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <h3 className="font-semibold mb-2">About</h3>
            <ul className="space-y-1">
              <li><a href="/about" className="hover:text-white">About Us</a></li>
              <li><a href="/contact" className="hover:text-white">Contact</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Legal</h3>
            <ul className="space-y-1">
              <li><a href="/terms" className="hover:text-white">Terms</a></li>
              <li><a href="/privacy" className="hover:text-white">Privacy</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Support</h3>
            <ul className="space-y-1">
              <li><a href="/faq" className="hover:text-white">FAQ</a></li>
              <li><a href="/help" className="hover:text-white">Help Center</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Connect</h3>
            <ul className="space-y-1">
              <li><a href="#" className="hover:text-white">Twitter</a></li>
              <li><a href="#" className="hover:text-white">Telegram</a></li>
            </ul>
          </div>
        </div>
        <div className="text-center mt-4 text-xs">
          © {new Date().getFullYear()} Mining Investment. All rights reserved.
        </div>
      </div>
    </footer>
  )
}