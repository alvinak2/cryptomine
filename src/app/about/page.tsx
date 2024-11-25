'use client'

import Link from 'next/link'

export default function About() {
  return (
    <div className="text-gray-300 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-5xl font-bold mb-12 text-center text-gray-300">About CryptoMine</h1>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-crypto-secondary rounded-lg p-8 shadow-md flex flex-col">
            <h2 className="text-2xl font-semibold mb-4 text-center">Our Mission</h2>
            <p className="text-lg mb-4 text-gray-400 flex-grow">
              At CryptoMine, our mission is to make cryptocurrency mining accessible to everyone. We believe in the power of blockchain technology and its potential to revolutionize the financial world. Our platform provides an easy and secure way for individuals to invest in cryptocurrency mining operations without the need for technical expertise or expensive hardware.
            </p>
          </div>

          <div className="bg-crypto-secondary rounded-lg p-8 shadow-md flex flex-col">
            <h2 className="text-2xl font-semibold mb-4 text-center">Our Technology</h2>
            <p className="text-lg mb-4 text-gray-400 flex-grow">
              CryptoMine utilizes cutting-edge mining hardware and software to ensure optimal performance and energy efficiency. Our mining operations are spread across multiple locations to minimize risks and maximize uptime. We constantly monitor and upgrade our infrastructure to stay ahead in the competitive world of cryptocurrency mining.
            </p>
          </div>

          <div className="bg-crypto-secondary rounded-lg p-8 shadow-md flex flex-col">
            <h2 className="text-2xl font-semibold mb-4 text-center">Security and Transparency</h2>
            <p className="text-lg mb-4 text-gray-400 flex-grow">
              We prioritize the security of our investors' funds and personal information. Our platform employs industry-standard encryption and security protocols to protect your data. We also believe in full transparency, providing real-time updates on mining operations and regular financial reports to our investors.
            </p>
          </div>
        </section>

        <section className="text-center py-12 border-t border-crypto-secondary">
          <h2 className="text-3xl font-bold mb-6 text-gray-300">Join the Investopia Community</h2>
          <p className="text-xl mb-8 text-gray-400">Be part of the future of finance with CryptoMine</p>
          <Link href="/register" className="inline-block bg-crypto-success hover:bg-crypto-success/90 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors duration-300">
            Start Investing Now
          </Link>
        </section>
      </div>
    </div>
  )
}