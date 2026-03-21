'use client'

import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
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
import UseUser from '@/hooks/useUser'
import plansInfos from '@/payment/plansInfos'
import PricingCard from '@/payment/components/pricingCard'

const Subscription = () => {
  const { isFreeUser, userSubscriptionPlan } = UseUser()

  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [showCancelEmailDialog, setShowCancelEmailDialog] = useState(false)

  return (
    <div className="min-h-screen flex flex-col">
      <main className="lex-1 container py-8 px-10 mx-auto max-w-[1400px]">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Minha Assinatura
          </h1>
          <p className="text-muted-foreground">
            Gerencie seu plano e faturamento
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-10">
          <PricingCard
            {...plansInfos.free}
            setShowCancelDialog={setShowCancelDialog}
            isAuthFlow
            isCurrentPlan={isFreeUser}
            isMostPopular={false}
          />
          <PricingCard
            {...plansInfos.pro}
            isAuthFlow
            isCurrentPlan={!isFreeUser}
            isMostPopular={false}
          />
        </div>
      </main>

      {/* Cancel Dialog */}
      <AlertDialog
        open={showCancelDialog}
        onOpenChange={() => setShowCancelDialog(!showCancelDialog)}
      >
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Cancelar assinatura?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Você perderá o acesso a TODOS os recursos ao fim do período atual.
              Esta ação não pode ser desfeita!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="">Manter plano</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setShowCancelDialog(false)
                setShowCancelEmailDialog(true)
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Confirmar cancelamento
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog
        open={showCancelEmailDialog}
        onOpenChange={() => setShowCancelEmailDialog(!showCancelEmailDialog)}
      >
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Desculpe pelo transtorno
            </AlertDialogTitle>
            <AlertDialogDescription>
              Para cancelar você precisa enviar um e-mail para:{' '}
              <span className="font-semibold text-primary">
                contact@useshopradar.com
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="">
              Fechar essa mensagem
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default Subscription
