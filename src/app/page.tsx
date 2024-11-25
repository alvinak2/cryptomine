// src/app/page.tsx
'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4 text-gray-300">Welcome to Investopia</h1>
        <p className="text-xl mb-8 text-gray-400">Your Gateway to Cryptocurrency Mining Investments</p>
        <div className="flex justify-center space-x-4">
          <Link href="/plans" className="bg-crypto-success hover:bg-crypto-success/90 text-white font-bold py-2 px-4 rounded">
            View Plans
          </Link>
          <Link href="/about" className="bg-crypto-secondary hover:bg-crypto-secondary/90 text-crypto-success font-bold py-2 px-4 rounded border border-crypto-success">
            Learn More
          </Link>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-8 mb-16">
        <div className="bg-crypto-secondary text-gray-300 rounded-lg p-6 shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Easy Investment</h2>
          <p>Start investing in cryptocurrency mining with just a few clicks. No technical knowledge required.</p>
        </div>
        <div className="bg-crypto-secondary text-gray-300 rounded-lg p-6 shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Secure Platform</h2>
          <p>Your investments are protected by state-of-the-art security measures and encryption technologies.</p>
        </div>
        <div className="bg-crypto-secondary text-gray-300 rounded-lg p-6 shadow-md">
          <h2 className="text-2xl font-semibold mb-4">High Returns</h2>
          <p>Benefit from the potential of high returns in the growing cryptocurrency market.</p>
        </div>
      </section>

      <section className="text-center mb-16">
        <h2 className="text-3xl font-bold mb-4 text-gray-300">How It Works</h2>
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="bg-crypto-success text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">1</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-300">Sign Up</h3>
            <p className="text-gray-400">Create your account in minutes</p>
          </div>
          <div>
            <div className="bg-crypto-success text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">2</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-300">Choose a Plan</h3>
            <p className="text-gray-400">Select an investment plan that suits you</p>
          </div>
          <div>
            <div className="bg-crypto-success text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">3</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-300">Invest</h3>
            <p className="text-gray-400">Make your investment using various payment methods</p>
          </div>
          <div>
            <div className="bg-crypto-success text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">4</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-300">Earn</h3>
            <p className="text-gray-400">Start earning returns on your investment</p>
          </div>
        </div>
      </section>

      <section className="text-center">
        <h2 className="text-3xl font-bold mb-4 text-gray-300">Ready to Start Mining?</h2>
        <p className="text-xl mb-8 text-gray-400">Join thousands of investors already using Investopia</p>
        <Link href="/register" className="bg-crypto-success hover:bg-crypto-success/90 text-white font-bold py-3 px-6 rounded text-lg">
          Create Your Account Now
        </Link>
      </section>
    </div>
  )
}