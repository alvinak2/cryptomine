export default function Home() {
  const plans = [
    { name: 'Basic', min: 100, duration: 15, return: 50 },
    { name: 'Pro', min: 500, duration: 10, return: 50 },
    { name: 'Elite', min: 1000, duration: 5, return: 50 },
  ];

  return (
    <div className="container mx-auto px-4 mt-20 mb-12">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-crypto-bitcoin via-crypto-ethereum to-crypto-solana bg-clip-text text-transparent">
          Mining Investment Platform
        </h1>
        <p className="text-xl text-gray-600">
          Professional cryptocurrency mining investment solutions
        </p>

        <section className="grid md:grid-cols-3 gap-8 mt-12">
          {plans.map((plan) => (
            <article
              key={plan.name}
              aria-labelledby={`plan-${plan.name.toLowerCase()}`}
              className="bg-crypto-primary text-gray-100 p-8 rounded-xl shadow-lg hover:shadow-crypto-accent/20 transition-shadow"
            >
              <h3
                id={`plan-${plan.name.toLowerCase()}`}
                className="text-2xl font-bold mb-4"
              >
                {plan.name}
              </h3>
              <div className="text-3xl font-bold text-blue-600 mb-6">
                ${plan.min}
                <span className="text-sm text-gray-500 font-normal"> minimum</span>
              </div>
              <ul className="space-y-3 text-left mb-8">
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  ${plan.min} minimum investment
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {plan.duration} days duration
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {plan.return}% return rate
                </li>
              </ul>
              <div className="mt-4">
                <button className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-colors">
                  Invest Now
                </button>
              </div>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
