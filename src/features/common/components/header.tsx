"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/App Name - Left Side */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-xl font-bold text-slate-900">StoreHub</span>
          </Link>

          {/* Desktop Navigation - Right Side */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/login">Login</Link>
            <Link href="/create-account">
              <Button
                size="sm"
                className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white"
              >
                Crie uma conta grátis
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="w-6 h-6 text-slate-600" />
            ) : (
              <Menu className="w-6 h-6 text-slate-600" />
            )}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <nav className="md:hidden mt-4 space-y-3 pb-4 border-t border-slate-200 pt-4">
            <Link
              href="/create-account"
              className="block px-2 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg font-medium transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Login
            </Link>
            <Link href="/login" onClick={() => setIsOpen(false)}>
              <Button className="cursor-pointer w-full bg-blue-600 hover:bg-blue-700 text-white">
                Crie uma conta grátis
              </Button>
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
