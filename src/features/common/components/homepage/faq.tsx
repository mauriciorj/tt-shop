import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const faqList = [
  {
    question: 'O que é o ShopRadar?',
    answer:
      'ShopRadar é uma plataforma de inteligência de mercado para afiliados do TikTok Shop. Nossa ferramenta analisa milhares de produtos, lojas e vídeos para mostrar quais estão vendendo mais, quais nichos estão em alta e quais produtos você deve promover para maximizar suas comissões.',
  },
  {
    question: 'Como recebo o meu acesso?',
    answer:
      'Para o plano gratuito basta criar uma conta. Para o plano Pro caso você ainda não tenha uma conta, todas as instruções serão enviadas para o seu e-mail.',
  },
  {
    question: 'Preciso ter conta no TikTok Shop para usar?',
    answer:
      'Não! Você pode explorar todos os produtos e dados do ShopRadar sem ter uma conta no TikTok Shop. No entanto, para começar a vender e ganhar comissões, você precisará se cadastrar como afiliado na plataforma do TikTok.',
  },
  {
    question: 'O ShopRadar é pago?',
    answer:
      'Oferecemos um plano gratuito com acesso limitado aos produtos e dados. Para acesso ilimitado, dados em tempo real, filtros avançados e relatórios exclusivos, temos o plano Pro por R$ 39/mês com 14 dias de teste grátis.',
  },
  {
    question: 'Qual é a garantia ?',
    answer:
      'Ao assinar o plano Pro, você tem 7 dias completos para testar todas as funcionalidades sem compromisso. Se não gostar, cancele antes do período acabar e será reembolsado em 100%. ',
  },
  {
    question: 'Existe limite de uso ?',
    answer:
      'Não! O plano Pro oferece acesso ilimitado a todas as funcionalidades da plataforma.',
  },
  {
    question: 'Consigo acessar do meu celular ou tablet ?',
    answer:
      'Sim! O ShopRadar é uma plataforma web e pode ser acessada de qualquer dispositivo com acesso à internet.',
  },
  {
    question: 'Tem suporte se eu tiver dúvidas?',
    answer:
      'Sim! Oferecemos suporte por email para todos os usuários. Em breve teremos atendimento via Whatsapp e também estamos desenvolvendo tutoriais e vídeos explicativos na nossa central de ajuda.',
  },
]

const Faq = () => {
  return (
    <section className="w-full relative flex items-center justify-center flex-col py-20 md:py-24 bg-secondary/30 px-4">
      <div className="container">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Perguntas <span className="gradient-text">Frequentes</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Tire suas dúvidas sobre o ShopRadar e comece a vender mais no TikTok
            Shop
          </p>
        </div>
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqList.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="glass-card rounded-xl px-6 border-none animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <AccordionTrigger className="text-left hover:no-underline py-5">
                  <span className="font-medium text-foreground">
                    {faq.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}

export default Faq
