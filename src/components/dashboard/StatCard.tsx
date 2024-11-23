// src/components/dashboard/StatCard.tsx
interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
}

export function StatCard({ title, value, icon }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4 sm:p-6">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <span className="text-xl sm:text-2xl">{icon}</span>
        </div>
        <div className="ml-4">
          <p className="text-xs sm:text-sm text-gray-500">{title}</p>
          <p className="text-lg sm:text-xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  )
}