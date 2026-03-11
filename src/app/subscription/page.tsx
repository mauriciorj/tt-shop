'use client'

import { useState } from 'react'
import { Check, Crown, Rocket, X, AlertTriangle } from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Header from '@/components/header'
import Footer from '@/components/footer'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'

const plans = [
  {
    id: 'monthly',
    name: 'Mensal',
    price: 39,
    interval: 'mês',
    features: [
      'Produtos lucrativos',
      'Análise de vídeos',
      'Ranking de lojas',
      'Atualizações constantes',
    ],
  },
  {
    id: 'yearly',
    name: 'Anual',
    price: 29,
    interval: 'mês',
    billed: 'R$348/ano',
    savings: 'Economize 25%',
    features: [
      'Produtos lucrativos',
      'Análise de vídeos',
      'Ranking de lojas',
      'Atualizações constantes',
      'Suporte prioritário',
      'Acesso antecipado a novidades',
    ],
  },
]

const mockSubscription = {
  planId: 'monthly',
  status: 'active' as const,
  currentPeriodEnd: '2026-04-11',
  startedAt: '2026-03-11',
}

const Subscription = () => {
  const [currentPlan] = useState(mockSubscription)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false)

  const activePlan = plans.find((p) => p.id === currentPlan.planId)!
  const upgradePlan = plans.find((p) => p.id !== currentPlan.planId)!

  const handleCancel = () => {
    setShowCancelDialog(false)
    toast.success('Sua assinatura será encerrada ao fim do período atual.')
  }

  const handleUpgrade = () => {
    setShowUpgradeDialog(false)
    toast.success(`Você agora está no plano ${upgradePlan.name}.`)
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="container max-w-4xl py-16 md:py-24 px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Minha Assinatura
          </h1>
          <p className="text-muted-foreground">
            Gerencie seu plano e faturamento
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* Current Plan Card */}
          <Card className="border-primary/30 bg-card">
            <CardHeader>
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Crown className="h-5 w-5 text-primary" />
                  Plano {activePlan.name}
                </CardTitle>
                <Badge className="bg-primary/20 text-primary border-primary/30 hover:bg-primary/20">
                  Ativo
                </Badge>
              </div>
              <CardDescription>Seu plano atual</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold">
                  R${activePlan.price}
                </span>
                <span className="text-muted-foreground">
                  / {activePlan.interval}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3 text-sm">
                <div className="p-3 rounded-lg bg-secondary/50">
                  <p className="text-muted-foreground mb-1">Início</p>
                  <p className="font-medium">
                    {new Date(currentPlan.startedAt).toLocaleDateString(
                      'pt-BR'
                    )}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-secondary/50">
                  <p className="text-muted-foreground mb-1">Próxima cobrança</p>
                  <p className="font-medium">
                    {new Date(currentPlan.currentPeriodEnd).toLocaleDateString(
                      'pt-BR'
                    )}
                  </p>
                </div>
              </div>

              <ul className="space-y-2">
                {activePlan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Upgrade Card */}
          {currentPlan.planId === 'monthly' && (
            <Card className="border-accent/30 bg-card relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-bl-lg">
                Recomendado
              </div>
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Rocket className="h-5 w-5 text-accent" />
                  Plano {upgradePlan.name}
                </CardTitle>
                <CardDescription>
                  {upgradePlan.savings} — cobrado como {upgradePlan.billed}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold">
                    R${upgradePlan.price}
                  </span>
                  <span className="text-muted-foreground">
                    / {upgradePlan.interval}
                  </span>
                </div>

                <ul className="space-y-2">
                  {upgradePlan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-accent shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => setShowUpgradeDialog(true)}
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-semibold"
                  size="lg"
                >
                  <Rocket className="h-4 w-4 mr-2" />
                  Fazer Upgrade
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Cancel Section */}
        <div className="border border-border rounded-lg p-6 text-center">
          <p className="text-muted-foreground text-sm mb-4">
            Deseja cancelar sua assinatura? Você ainda terá acesso até o fim do
            período atual.
          </p>
          <Button
            variant="outline"
            onClick={() => setShowCancelDialog(true)}
            className="border-destructive/50 text-destructive hover:bg-destructive/10"
          >
            <X className="h-4 w-4 mr-2" />
            Cancelar Assinatura
          </Button>
        </div>
      </main>

      <Footer />

      {/* Cancel Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Cancelar assinatura?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Você perderá o acesso a todos os recursos ao fim do período atual
              (
              {new Date(currentPlan.currentPeriodEnd).toLocaleDateString(
                'pt-BR'
              )}
              ). Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Manter plano</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancel}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Confirmar cancelamento
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Upgrade Dialog */}
      <AlertDialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Rocket className="h-5 w-5 text-accent" />
              Confirmar upgrade?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Você será migrado para o plano {upgradePlan.name} por R$
              {upgradePlan.price}/{upgradePlan.interval}
              {upgradePlan.billed
                ? ` (cobrado como ${upgradePlan.billed})`
                : ''}
              . A diferença será calculada proporcionalmente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Voltar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleUpgrade}
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              Confirmar upgrade
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default Subscription
