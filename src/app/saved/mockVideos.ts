const VIDEO_TITLES = [
  'Ultimate Skincare Routine 2024',
  'Top 10 Gadgets You Need',
  'How I Made $10K in a Week',
  'Viral Kitchen Hack You Must Try',
  'Best Budget Fashion Haul',
  'Unboxing the New iPhone 16',
  '5-Minute Makeup Tutorial',
  'Home Office Setup Tour',
  'Healthy Meal Prep Ideas',
  'Travel Essentials Under $50',
  'DIY Room Makeover on a Budget',
  'Fitness Routine That Changed My Life',
  'Honest Review: Dyson Airwrap',
  "Amazon Finds You Didn't Know Existed",
  'How to Start Dropshipping',
  'Street Food Tour in Bangkok',
  'Affordable Sneaker Collection',
  'My Morning Routine 2024',
  'Best Wireless Earbuds Compared',
  'Cooking Challenge: $1 vs $100',
  'Minimalist Wardrobe Essentials',
  'Smart Home Tour 2024',
  'Beginner Yoga Flow',
  'Grocery Haul Under $30',
  'Top Trending Products This Month',
  'Summer Outfit Ideas',
  'Best Laptop for Students',
  '3-Ingredient Recipes',
  'Pet Products Worth Buying',
  'Productivity Tips That Work',
  'Night Skincare Routine',
  'Tech Accessories Under $20',
  'Car Organization Hacks',
  'Plant-Based Cooking Guide',
  'Back to School Essentials',
  'Gaming Setup Upgrade',
]

const CATEGORIES = [
  'Beauty',
  'Fashion',
  'Electronics',
  'Home',
  'Food',
  'Fitness',
  'Tech',
  'Lifestyle',
]

const TRANSCRIPTIONS = [
  "Hey everyone! Today I'm going to show you my complete skincare routine that has completely transformed my skin over the past few months. First, we start with a gentle cleanser — I've been using this one from CeraVe and it's absolutely amazing. Then we move on to the toner, which helps balance your skin's pH levels. After that, I apply a vitamin C serum for brightening, followed by a hyaluronic acid for hydration. Finally, we seal everything in with a good moisturizer and SPF. Trust me, consistency is key!",
  "What's up guys! In this video I'm breaking down the top 10 gadgets that are absolutely game-changers. Number one on my list is this portable projector — it's tiny but projects a massive 100-inch screen. Number two is a magnetic phone mount that works with any case. I've been testing all of these for at least a month before recommending them. Each product link is in the description below. Let me know in the comments which one is your favorite!",
  "So many of you asked how I generated $10K in just one week, and I'm going to break it all down transparently. It wasn't overnight success — I spent months building my audience and testing different products. The key was finding a trending niche, creating authentic content, and leveraging TikTok Shop's affiliate program. I'll walk you through my exact strategy, the tools I used, and the mistakes I made along the way.",
  "This kitchen hack went viral for a reason — it actually works! I'm going to show you how to perfectly dice an onion in under 10 seconds using this simple technique. All you need is a sharp knife and a cutting board. The secret is in the angle of your cuts. I learned this from a professional chef and it has saved me so much time in the kitchen. Stay tuned for more cooking hacks!",
  "Welcome back to my channel! Today's video is a massive fashion haul and everything is under $30. I found some incredible pieces that look way more expensive than they are. From blazers to basics, I've got you covered for every season. I'll try on each piece so you can see how they fit and style them for different occasions.",
]

function generateTranscription(): string {
  return TRANSCRIPTIONS[Math.floor(Math.random() * TRANSCRIPTIONS.length)]
}

export interface Video {
  id: number
  title: string
  thumbnail: string
  category: string
  sales: number
  views: number
  revenue: number
  duration: string
  transcription: string
  creator: string
  date: string
}

function randomDuration(): string {
  const mins = Math.floor(Math.random() * 10) + 1
  const secs = Math.floor(Math.random() * 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export const mockVideos: Video[] = VIDEO_TITLES.map((title, i) => ({
  id: i + 1,
  title,
  thumbnail: `https://picsum.photos/seed/video${i + 1}/400/225`,
  category: CATEGORIES[i % CATEGORIES.length],
  sales: Math.floor(Math.random() * 50000) + 500,
  views: Math.floor(Math.random() * 5000000) + 10000,
  revenue: Math.floor(Math.random() * 100000) + 1000,
  duration: randomDuration(),
  transcription: generateTranscription(),
  creator: `Creator_${i + 1}`,
  date: new Date(Date.now() - Math.floor(Math.random() * 30) * 86400000)
    .toISOString()
    .split('T')[0],
}))
