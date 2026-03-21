'use client'

import { AlertTriangle, XCircle } from 'lucide-react'
import UseUser from '@/hooks/useUser'

const bannerConfig = {
  past_due: {
    icon: AlertTriangle,
    bg: 'bg-destructive/10 border-destructive/30',
    text: 'text-destructive',
    message:
      'Seu pagamento está pendente e seu acesso foi suspenso. Atualize seu método de pagamento para continuar.',
    cta: 'Atualizar pagamento',
  },
  canceled: {
    icon: XCircle,
    bg: 'bg-orange-500/10 border-orange-500/30',
    text: 'text-orange-500',
    message:
      'Sua assinatura foi cancelada. Renove para continuar acessando o UseShopRadar.',
    cta: 'Renovar assinatura',
  },
  inactive: {
    icon: XCircle,
    bg: 'bg-orange-500/10 border-orange-500/30',
    text: 'text-orange-500',
    message:
      'Sua assinatura está inativa. Ative um plano para continuar acessando.',
    cta: 'Ver planos',
  },
} as const

type BannerStatus = keyof typeof bannerConfig

const PastDueGuard = () => {
  const { userSubscriptionStatus } = UseUser()

  const status = userSubscriptionStatus as BannerStatus | null
  const config = status ? bannerConfig[status] : null

  if (!config) return null

  const Icon = config.icon

  return (
    <div className={`w-full ${config.bg} border-b px-4 py-3`}>
      <div className="max-w-[1400px] mx-auto flex items-center gap-3">
        <Icon className={`h-5 w-5 ${config.text} shrink-0`} />
        <p className={`text-sm ${config.text} font-medium flex-1`}>
          {config.message}
        </p>
        <a
          href="/subscription"
          className={`shrink-0 text-sm font-semibold underline ${config.text} hover:opacity-80 transition-opacity`}
        >
          {config.cta}
        </a>
      </div>
    </div>
  )
}

export default PastDueGuard
