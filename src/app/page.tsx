export default function Home() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Welcome to Mining Investment</h1>
      <div className="grid md:grid-cols-3 gap-8">
        {['Basic', 'Pro', 'Elite'].map((plan) => (
          <div key={plan} className="border p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">{plan}</h2>
            <ul className="space-y-2">
              <li>✓ {plan === 'Basic' ? '$100' : plan === 'Pro' ? '$500' : '$1000'} minimum</li>
              <li>✓ {plan === 'Basic' ? '30' : plan === 'Pro' ? '20' : '10'} days duration</li>
              <li>✓ 50% return rate</li>
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}