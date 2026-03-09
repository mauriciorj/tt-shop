import { TriangleAlert } from 'lucide-react'

export default function CanceledPage() {
  return (
    <main className="flex-1 flex items-center justify-center py-24">
      <div className="container max-w-2xl">
        <div className="glass-card rounded-3xl p-12 text-center animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
              <TriangleAlert className="h-10 w-10 text-primary" />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Sua compra foi <span className="gradient-text">cancelada!</span>
          </h1>

          <p className="text-xl text-muted-foreground mb-2">
            Um email com todos as informações foi enviado para sua caixa de
            entrada.
          </p>
        </div>
      </div>
    </main>
  )
}
