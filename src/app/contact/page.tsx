'use client'

import Breadcrumb from '@/components/breadcrumb'
import ContactOptions from '@/contact/components/contactOptions'

const Contact = () => {
  return (
    <div className="min-h-screen bg-background">
      <main className="flex-1 flex flex-col justify-center items-center py-8 px-10 mx-auto max-w-[1400px]">
        <Breadcrumb
          title="Entre em contato"
          description="Tem uma pergunta ou feedback? Nós adoramos ouvir de você."
        />
        <ContactOptions />
      </main>
    </div>
  )
}

export default Contact
