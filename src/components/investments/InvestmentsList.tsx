import { Investment } from '@/types';
import { Card } from '../ui/Card';

export function InvestmentsList({ investments }: { investments: Investment[] }) {
  return (
    <div className="space-y-4">
      {investments.map((investment) => (
        <Card key={investment.id}>
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold">${investment.amount.toFixed(2)}</h3>
              <p className="text-sm text-gray-500">
                Return: ${investment.return_amount.toFixed(2)}
              </p>
            </div>
            <div>
              <span className={`px-2 py-1 rounded text-sm ${
                investment.status === 'active' ? 'bg-green-100 text-green-800' :
                investment.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {investment.status}
              </span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}