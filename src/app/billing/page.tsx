import React from 'react'
import {
  CheckCircle,
  XCircle,
  RotateCcw,
  Download,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import Header from '@/components/header'
import Footer from '@/components/footer'

type BillStatus = 'paid' | 'cancelled' | 'refunded'

interface Bill {
  id: string
  date: string
  description: string
  amount: number
  status: BillStatus
  invoiceNumber: string
}

const mockBills: Bill[] = [
  {
    id: '1',
    date: '2026-03-11',
    description: 'Plano Mensal',
    amount: 39,
    status: 'paid',
    invoiceNumber: 'INV-2026-012',
  },
  {
    id: '2',
    date: '2026-02-11',
    description: 'Plano Mensal',
    amount: 39,
    status: 'paid',
    invoiceNumber: 'INV-2026-011',
  },
  {
    id: '3',
    date: '2026-01-11',
    description: 'Plano Mensal',
    amount: 39,
    status: 'refunded',
    invoiceNumber: 'INV-2026-010',
  },
  {
    id: '4',
    date: '2025-12-11',
    description: 'Plano Mensal',
    amount: 39,
    status: 'paid',
    invoiceNumber: 'INV-2025-009',
  },
  {
    id: '5',
    date: '2025-11-11',
    description: 'Plano Mensal',
    amount: 39,
    status: 'cancelled',
    invoiceNumber: 'INV-2025-008',
  },
  {
    id: '6',
    date: '2025-10-11',
    description: 'Plano Mensal',
    amount: 39,
    status: 'paid',
    invoiceNumber: 'INV-2025-007',
  },
  {
    id: '7',
    date: '2025-09-11',
    description: 'Plano Anual',
    amount: 348,
    status: 'refunded',
    invoiceNumber: 'INV-2025-006',
  },
  {
    id: '8',
    date: '2025-08-11',
    description: 'Plano Mensal',
    amount: 39,
    status: 'paid',
    invoiceNumber: 'INV-2025-005',
  },
]

const statusConfig: Record<
  BillStatus,
  {
    label: string
    variant: 'default' | 'secondary' | 'destructive' | 'outline'
    icon: React.ElementType
  }
> = {
  paid: { label: 'Pago', variant: 'default', icon: CheckCircle },
  cancelled: { label: 'Cancelado', variant: 'destructive', icon: XCircle },
  refunded: { label: 'Reembolsado', variant: 'secondary', icon: RotateCcw },
}

const BillingHistory = () => {
  const totals = {
    paid: mockBills
      .filter((b) => b.status === 'paid')
      .reduce((sum, b) => sum + b.amount, 0),
    refunded: mockBills
      .filter((b) => b.status === 'refunded')
      .reduce((sum, b) => sum + b.amount, 0),
    cancelled: mockBills.filter((b) => b.status === 'cancelled').length,
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="container max-w-5xl py-16 md:py-24 px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Histórico de Cobranças
          </h1>
          <p className="text-muted-foreground">
            Visualize todas as suas faturas e pagamentos
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <div className="p-4 rounded-lg border border-border bg-card text-center">
            <p className="text-muted-foreground text-sm mb-1">Total Pago</p>
            <p className="text-2xl font-bold text-primary">R${totals.paid}</p>
          </div>
          <div className="p-4 rounded-lg border border-border bg-card text-center">
            <p className="text-muted-foreground text-sm mb-1">
              Total Reembolsado
            </p>
            <p className="text-2xl font-bold text-muted-foreground">
              R${totals.refunded}
            </p>
          </div>
          <div className="p-4 rounded-lg border border-border bg-card text-center">
            <p className="text-muted-foreground text-sm mb-1">Cancelados</p>
            <p className="text-2xl font-bold text-destructive">
              {totals.cancelled}
            </p>
          </div>
        </div>

        {/* Bills Table */}
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Fatura</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockBills.map((bill) => {
                const config = statusConfig[bill.status]
                const Icon = config.icon
                return (
                  <TableRow key={bill.id}>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {bill.invoiceNumber}
                    </TableCell>
                    <TableCell>
                      {new Date(bill.date).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>{bill.description}</TableCell>
                    <TableCell className="text-right font-medium">
                      R${bill.amount.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={config.variant} className="gap-1">
                        <Icon className="h-3 w-3" />
                        {config.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {bill.status === 'paid' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default BillingHistory
