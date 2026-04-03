'use client'

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { IStoreWithCategory } from '@/stores/types'

const LineChart = ({ store }: { store: IStoreWithCategory }) => {
  if (!store) return null
  const chartData = store?.revenue_history?.map((value: number, i: number) => ({
    day: i + 1,
    revenue: value,
  }))
  const chartConfig = {
    revenue: {
      label: 'Revenue',
      color:
        store?.revenue_growth_rate >= 0
          ? 'hsl(142, 71%, 45%)'
          : store?.revenue_growth_rate < 0
            ? 'hsl(0, 84%, 60%)'
            : 'hsl(var(--muted-foreground))',
    },
  }
  return (
    <div>
      <Card
        className="glass-card border-white/5 animate-slide-up mb-6"
        style={{ animationDelay: '200ms' }}
      >
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground">
            Revenue History (Last 30 Days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient
                  id="revenueGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="var(--color-revenue)"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-revenue)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-border/30"
              />
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                className="text-xs"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                className="text-xs"
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value) => `$${Number(value).toLocaleString()}`}
                  />
                }
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="var(--color-revenue)"
                strokeWidth={2}
                fill="url(#revenueGradient)"
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}

export default LineChart
