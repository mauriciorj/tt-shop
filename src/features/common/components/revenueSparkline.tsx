import { Line, LineChart, ResponsiveContainer } from 'recharts'

const RevenueSparkline = ({ data }: { data: number[] }) => {
  const chartData = data.map((value, index) => ({ value, day: index }))

  const firstValue = data[0] || 0
  const lastValue = data[data.length - 1] || 0

  const trend =
    lastValue > firstValue ? 'up' : lastValue < firstValue ? 'down' : 'neutral'

  const color =
    trend === 'up' ? '#22c55e' : trend === 'down' ? '#ef4444' : '#a1a1aa'

  return (
    <div className="w-20 h-8">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default RevenueSparkline
