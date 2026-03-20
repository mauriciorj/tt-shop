import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

const NotFoundStore = () => {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 flex justify-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Store Not Found
          </h1>
          <p className="text-muted-foreground mb-6">
            The store youre looking for doesnt exist.
          </p>
          <Button onClick={() => router.push('/stores')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para lojas
          </Button>
        </div>
      </main>
    </div>
  )
}

export default NotFoundStore
