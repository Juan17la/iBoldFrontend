import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { DailyUsageItem } from '../../types/api'

interface UsageHistoryChartProps {
  data: DailyUsageItem[]
}

export const UsageHistoryChart = ({ data }: UsageHistoryChartProps) => {
  const chartData = data.map((item) => ({
    ...item,
    day: item.date.slice(5),
  }))

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer>
        <BarChart data={chartData}>
          <XAxis dataKey="day" stroke="#64748b" tickLine={false} axisLine={false} />
          <YAxis stroke="#64748b" tickLine={false} axisLine={false} />
          <Tooltip
            cursor={{ fill: 'rgba(224, 242, 254, 0.6)' }}
            contentStyle={{
              borderRadius: 0,
              border: '1px solid #bae6fd',
              boxShadow: '0 12px 30px -20px rgba(2, 132, 199, 0.65)',
            }}
          />
          <Bar dataKey="usedTokens" fill="#0284c7" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
