import { Card } from '../ui/Card';

export function DashboardStats({ 
  balance, 
  totalInvested, 
  activeInvestments 
}: { 
  balance: number;
  totalInvested: number;
  activeInvestments: number;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <h3 className="text-gray-500">Balance</h3>
        <p className="text-2xl font-bold">${balance.toFixed(2)}</p>
      </Card>
      <Card>
        <h3 className="text-gray-500">Total Invested</h3>
        <p className="text-2xl font-bold">${totalInvested.toFixed(2)}</p>
      </Card>
      <Card>
        <h3 className="text-gray-500">Active Investments</h3>
        <p className="text-2xl font-bold">{activeInvestments}</p>
      </Card>
    </div>
  );
}