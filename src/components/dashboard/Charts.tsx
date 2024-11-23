// src/components/dashboard/Charts.tsx
'use client'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Line, Doughnut } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

interface LineChartProps {
  data: {
    labels: string[]
    datasets: Array<{
      label: string
      data: number[]
      borderColor: string
      tension?: number
    }>
  }
  title: string
}

interface DoughnutChartProps {
  data: {
    labels: string[]
    datasets: Array<{
      data: number[]
      backgroundColor: string[]
    }>
  }
  title: string
}

export function LineChart({ data, title }: LineChartProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="w-full h-[300px] sm:h-[400px]">
        <Line 
          data={data}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'top' as const,
              }
            },
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }}
        />
      </div>
    </div>
  )
}

export function DoughnutChart({ data, title }: DoughnutChartProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="w-full h-[300px] sm:h-[400px]">
        <Doughnut
          data={data}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'top' as const,
              }
            }
          }}
        />
      </div>
    </div>
  )
}