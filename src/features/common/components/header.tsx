"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useConvexAuth } from "convex/react";
import { House, TrendingUp, Store, PackageSearch } from "lucide-react";
import {
  SignedIn,
  SignUpButton,
  SignInButton,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

const Header = () => {
  const pathname = usePathname();

  const { isAuthenticated } = useConvexAuth();

  const navLinks = [
    { path: "/", label: "Inicio", icon: House },
    { path: "/stores", label: "Lojas", icon: Store },
    { path: "/products", label: "Produtos", icon: PackageSearch },
  ];

  return (
    <header className="flex sticky top-0 z-50 w-full items-center justify-center border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 px-10 items-center justify-between mx-auto max-w-[1400px]">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary glow-effect">
            <TrendingUp className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">
            TikTok<span className="gradient-text">Rank</span>
          </span>
        </Link>

        {isAuthenticated && (
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.path;
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        )}

        <div className="flex items-center gap-4">
          <SignedOut>
            <SignInButton forceRedirectUrl="/stores">
              <button className="cursor-pointer hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/80 transition-colors">
                Entrar
              </button>
            </SignInButton>
            <SignUpButton forceRedirectUrl="/stores">
              <button className="cursor-pointer px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity glow-effect">
                Comece Agora
              </button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </header>
  );
};

export default Header;
