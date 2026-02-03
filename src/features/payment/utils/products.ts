export interface Product {
  id: string
  name: string
  description: string
  priceInCents: number
  images?: string[]
}

export const PRODUCTS: Product[] = [
  {
    id: 'basic-plan',
    name: 'Basic Store Package',
    description: 'Perfect for getting started with store management',
    priceInCents: 9999, // $99.99
    images: [
      'https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=400&h=400&fit=crop',
    ],
  },
  {
    id: 'pro-plan',
    name: 'Pro Store Package',
    description: 'Advanced features for growing businesses',
    priceInCents: 29999, // $299.99
    images: [
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=400&fit=crop',
    ],
  },
  {
    id: 'enterprise-plan',
    name: 'Enterprise Store Package',
    description: 'Complete solution for large-scale operations',
    priceInCents: 99999, // $999.99
    images: [
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=400&fit=crop',
    ],
  },
]
