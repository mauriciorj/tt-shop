const plansInfos = {
  free: {
    cta: 'Test Grátis',
    description: 'Perfeito para começar',
    featuresAvailables: ['Top 10 lojas', 'Top 10 produtos', 'Top 10 vídeos'],
    featuresNotAvailables: ['Transcrição de vídeos'],
    price: '$0',
    title: 'Grátis',
  },
  pro: {
    cta: 'Comece Agora',
    description: 'Tudo que você precisa',
    featuresAvailables: [
      'Top lojas',
      'Top produtos',
      'Top vídeos',
      'Transcrição de vídeos',
      'Filtros avançados',
    ],
    featuresNotAvailables: null,
    isMostPopular: true,
    isPaid: true,
    title: 'Pro',
    price: '$47',
  },
}

export default plansInfos
