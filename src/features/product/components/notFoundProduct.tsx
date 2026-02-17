import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

const NotFoundProduct = () => {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 flex justify-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Product Not Found
          </h1>
          <p className="text-muted-foreground mb-6">
            The product youre looking for doesnt exist.
          </p>
          <Button onClick={() => router.push('/products')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Stores
          </Button>
        </div>
      </main>
    </div>
  )
}

export default NotFoundProduct
