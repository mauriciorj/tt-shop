'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { useConvexAuth } from 'convex/react'
import {
  CircleDollarSign,
  HandCoins,
  Heart,
  Menu,
  Store,
  PackageSearch,
  TrendingUp,
  Video,
} from 'lucide-react'
import {
  SignedIn,
  SignUpButton,
  SignInButton,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet'

const Header = () => {
  const pathname = usePathname()

  const { isAuthenticated } = useConvexAuth()

  const [open, setOpen] = useState(false)

  const navLinks = [
    { path: '/stores', label: 'Lojas', icon: Store },
    { path: '/products', label: 'Produtos', icon: PackageSearch },
    { path: '/videos', label: 'Vídeos', icon: Video },
    { path: '/saved', label: 'Salvos', icon: Heart },
  ]

  return (
    <header className="flex sticky top-0 z-50 w-full items-center justify-center border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 px-4 items-center justify-between mx-auto max-w-[1400px]">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary glow-effect">
            <TrendingUp className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="sm:text md:text-xl font-bold">
            Use<span className="gradient-text">Shop</span>Radar
          </span>
        </Link>

        {isAuthenticated && (
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon
              const isActive = pathname === link.path
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              )
            })}
          </nav>
        )}

        <div className="flex items-center gap-2 md:gap-4">
          <SignedOut>
            <SignInButton forceRedirectUrl="/stores">
              <button className="cursor-pointer sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/80 transition-colors">
                Entrar
              </button>
            </SignInButton>
            {!isAuthenticated && (
              <SignUpButton forceRedirectUrl="/stores">
                <button className="cursor-pointer hidden md:block px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity glow-effect">
                  Comece Agora
                </button>
              </SignUpButton>
            )}
            {!isAuthenticated && (
              <SignUpButton forceRedirectUrl="/stores">
                <button className="cursor-pointer block md:hidden px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity glow-effect">
                  Começar
                </button>
              </SignUpButton>
            )}
          </SignedOut>
          <SignedIn>
            <UserButton>
              <UserButton.MenuItems>
                <UserButton.Link
                  label="Assinatura"
                  labelIcon={<HandCoins className="h-4 w-4" />}
                  href="/subscription"
                />
              </UserButton.MenuItems>
              <UserButton.MenuItems>
                <UserButton.Link
                  label="Faturamento"
                  labelIcon={<CircleDollarSign className="h-4 w-4" />}
                  href="/billing"
                />
              </UserButton.MenuItems>
            </UserButton>
          </SignedIn>
          {isAuthenticated && (
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <button className="md:hidden flex items-center justify-center h-9 w-9 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors">
                  <Menu className="h-5 w-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] bg-background">
                <SheetTitle className="sr-only">Navigation</SheetTitle>
                <nav className="flex flex-col gap-2 mt-8">
                  {navLinks.map((link) => {
                    const Icon = link.icon
                    const isActive = pathname === link.path
                    return (
                      <Link
                        key={link.path}
                        href={link.path}
                        onClick={() => setOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                          isActive
                            ? 'bg-primary text-primary-foreground'
                            : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        {link.label}
                      </Link>
                    )
                  })}
                </nav>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
