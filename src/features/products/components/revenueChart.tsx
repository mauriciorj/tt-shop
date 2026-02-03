'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
} from 'recharts'

export function RevenueChart({ productId }: { productId: string }) {
  const data = [
    { date: 'Jan 1', revenue: 4000, orders: 240 },
    { date: 'Jan 8', revenue: 3000, orders: 221 },
    { date: 'Jan 15', revenue: 2000, orders: 229 },
    { date: 'Jan 22', revenue: 2780, orders: 200 },
    { date: 'Jan 29', revenue: 1890, orders: 229 },
    { date: 'Feb 5', revenue: 2390, orders: 200 },
    { date: 'Feb 12', revenue: 3490, orders: 221 },
  ]

  return (
    <div>
      <Card className="w-full">
        <CardHeader>
          <div className="flex flex-row justify-between">
            <div>
              <CardTitle>Receita</CardTitle>
              <CardDescription>Performance nos últimos 30 dias</CardDescription>
            </div>
            <div>
              <CardTitle className="text-lg">Estatísticas Rápidas</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-row">
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="date" stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#2563eb"
                strokeWidth={2}
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
          <div className="w-[200px] ml-10 text-end">
            <div className="border-b pb-4 border-slate-200">
              <p className="text-sm text-muted-foreground mb-1">
                Total Receita
              </p>
              <p className="text-2xl font-bold">$403.8k</p>
            </div>
            <div className="border-b pb-4 border-slate-200">
              <p className="text-sm text-muted-foreground mb-1">
                Total Pedidos
              </p>
              <p className="text-2xl font-bold">58.6k</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Taxa de Conversão
              </p>
              <p className="text-2xl font-bold">3.24%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
