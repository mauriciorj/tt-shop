import Pricing from '@/components/homepage/pricing'
import Features from '@/components/homepage/features'
import CallToAction from '@/components/homepage/callToAction'
import Stats from '@/components/homepage/stats'
import Hero from '@/components/homepage/hero'

const Page = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex flex-col justify-center items-center">
        <Hero />

        <Stats />

        <Features />

        <Pricing />

        <CallToAction />
      </main>
    </div>
  )
}

export default Page
