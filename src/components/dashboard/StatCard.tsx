// src/components/dashboard/StatCard.tsx
interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
}

export function StatCard({ title, value, icon }: StatCardProps) {
  return (
    <div className="bg-crypto-secondary text-gray-300 rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <span className="text-2xl">{icon}</span>
        </div>
        <div className="ml-4">
          <p className="text-sm">{title}</p>
          <p className="text-xl font-semibold">{value}</p>
        </div>
      </div>
    </div>
  )
}