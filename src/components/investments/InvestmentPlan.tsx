// src/components/investments/InvestmentPlans.tsx
'use client'

const INVESTMENT_PLANS = [
  {
    type: 'BASIC',
    minimum: 100,
    days: 30,
    return: 50
  },
  {
    type: 'PRO',
    minimum: 500,
    days: 20,
    return: 50
  },
  {
    type: 'ELITE',
    minimum: 1000,
    days: 10,
    return: 50
  }
]

export default function InvestmentPlans() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
      {INVESTMENT_PLANS.map((plan) => (
        <div key={plan.type} className="border rounded-lg p-6 shadow-lg">
          <h3 className="text-xl font-bold">{plan.type}</h3>
          <ul className="mt-4 space-y-2">
            <li>Minimum: ${plan.minimum}</li>
            <li>Duration: {plan.days} days</li>
            <li>Return: {plan.return}%</li>
          </ul>
          <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
            Invest Now
          </button>
        </div>
      ))}
    </div>
  )
}