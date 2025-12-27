import Link from "next/link";
import { Mail, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-12">
      <div className="container px-6 md:px-12 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-xl font-bold text-slate-900">StoreHub</span>
            </Link>
            <p className="text-muted-foreground">
              Ache os melhores produtos para Tiktok shop.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Sobre Nós
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Data</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/analytics"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Lojas
                </Link>
              </li>
              <li>
                <Link
                  href="/analytics"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Produtos
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contato</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-5 w-5 flex-shrink-0" />
                <span>info@storehub.com</span>
              </li>
              {/* <li>
                <Link
                  href="/contact"
                  className="text-primary hover:underline transition-colors"
                >
                  Envie-nos uma mensagem →
                </Link>
              </li> */}
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200 mt-10 pt-2 text-center text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} StoreHub. Todos os direitos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};
