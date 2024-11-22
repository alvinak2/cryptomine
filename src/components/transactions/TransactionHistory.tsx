import { Transaction } from '@/types';

export function TransactionHistory({ transactions }: { transactions: Transaction[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-4">Type</th>
            <th className="text-left py-4">Amount</th>
            <th className="text-left py-4">Status</th>
            <th className="text-left py-4">Date</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.id} className="border-b">
              <td className="py-4">{tx.type}</td>
              <td className="py-4">${tx.amount.toFixed(2)}</td>
              <td className="py-4">
                <span className={`px-2 py-1 rounded text-sm ${
                  tx.status === 'completed' ? 'bg-green-100 text-green-800' :
                  tx.status === 'failed' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {tx.status}
                </span>
              </td>
              <td className="py-4">
                {new Date(tx.created_at).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}