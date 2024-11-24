// src/components/navigation/Footer.tsx
export default function Footer() {
  return (
    <footer className="bg-crypto-secondary text-gray-300 py-4">
      <div className="container mx-auto px-4 text-center">
        <p>&copy; {new Date().getFullYear()} Mining Investment Platform. All rights reserved.</p>
      </div>
    </footer>
  )
}