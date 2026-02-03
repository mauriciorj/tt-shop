'use client'

import * as React from 'react'
import { ConvexReactClient } from 'convex/react'
import { ConvexQueryClient } from '@convex-dev/react-query'
import {
  QueryClient,
  QueryClientProvider,
  isServer,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ReactQueryStreamedHydration } from '@tanstack/react-query-next-experimental'
import ConvexClientProvider from '@/providers/convex'
import ClerkProviderWrapper from '@/providers/clerk'
import { Toaster } from '@/components/ui/sonner'

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

const convexQueryClient = new ConvexQueryClient(convex)

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryKeyHashFn: convexQueryClient.hashFn(),
      queryFn: convexQueryClient.queryFn(),
    },
  },
})
convexQueryClient.connect(queryClient)

// function makeQueryClient() {
//   return new QueryClient({
//     defaultOptions: {
//       queries: {
//         staleTime: 60 * 1000,
//       },
//     },
//   });
// }

let browserQueryClient: QueryClient | undefined = undefined

function getQueryClient() {
  if (isServer) {
    return queryClient
  } else {
    if (!browserQueryClient) browserQueryClient = queryClient
    return browserQueryClient
  }
}

export function Providers(props: { children: React.ReactNode }) {
  const getQueryClientFunction = getQueryClient()

  return (
    <ClerkProviderWrapper>
      <ConvexClientProvider client={convex}>
        <QueryClientProvider client={getQueryClientFunction}>
          <ReactQueryStreamedHydration>
            {props.children}
          </ReactQueryStreamedHydration>
          <ReactQueryDevtools initialIsOpen={false} />
          <Toaster />
        </QueryClientProvider>
      </ConvexClientProvider>
    </ClerkProviderWrapper>
  )
}
