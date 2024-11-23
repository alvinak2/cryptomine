// src/components/navigation/Footer.tsx
export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-4">
      <div className="container mx-auto px-4">  
        <div className="text-center mt-4 text-xs">
          © {new Date().getFullYear()} Mining Investment. All rights reserved.
        </div>
      </div>
    </footer>
  )
}