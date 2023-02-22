import usePersistStore from '@lib/store/persist'
import '../styles/globals.css'
import FullPageLoader from '@components/UI/FullPageLoader'
import { AUTH_ROUTES } from '@utils/data/auth-routes'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import React, { lazy, Suspense, useEffect, useState } from 'react'
import { Hydrate, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import NextNProgress from 'nextjs-progressbar';
import { Analytics } from '@vercel/analytics/react';

const Providers = lazy(() => import('../components/Common/Providers'))
const Layout = lazy(() => import('../components/Common/Layout'))


export default function App({ Component, pageProps }: AppProps) {

  const [queryClient] = React.useState(() => new QueryClient())

  const currentProfileId = usePersistStore((state) => state.currentProfileId)

  const { pathname, replace, asPath } = useRouter()

  useEffect(() => {
    if (!currentProfileId && AUTH_ROUTES.includes(pathname)) {
      replace(`/auth?next=${asPath}`)
    }
  }, [currentProfileId, pathname, asPath, replace])

  return (
    <Suspense fallback={<FullPageLoader />}>
      <Providers>
        <NextNProgress color="#ec4899" showOnShallow={true} />
        <QueryClientProvider client={queryClient}>
          <Hydrate state={pageProps.dehydratedState}>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </Hydrate>
        </QueryClientProvider>
      </Providers>
      <Analytics />
    </Suspense>
  )
}
