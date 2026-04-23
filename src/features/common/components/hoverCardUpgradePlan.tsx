'use client'

import React from 'react'
import Link from 'next/link'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'

const HoverCardUpgradePlan = ({
  children,
  isToShowTheHoverCard,
}: {
  children: React.ReactNode
  isToShowTheHoverCard: boolean
}) => {
  if (!isToShowTheHoverCard) return children

  return (
    <HoverCard
      openDelay={10}
      closeDelay={100}
      data-testid="hover-card-upgrade-plan"
    >
      <HoverCardTrigger asChild data-testid="hover-card-upgrade-plan-trigger">
        {children}
      </HoverCardTrigger>
      <HoverCardContent
        className="flex w-64 flex-col gap-0.5"
        data-testid="hover-card-upgrade-plan-content"
      >
        <div
          className="text-sm"
          data-testid="hover-card-upgrade-plan-content-text"
        >
          Mude seu plano
          <Link href="/subscription">
            {' '}
            <span className="text-primary underline">aqui</span>
          </Link>{' '}
          para usar essa função
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}

export default HoverCardUpgradePlan
