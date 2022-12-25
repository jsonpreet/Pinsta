import usePersistStore from '@lib/store/persist'
import '../styles/globals.scss'
import FullPageLoader from '@components/Common/FullPageLoader'
import { AUTH_ROUTES } from '@utils/data/auth-routes'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import React, { lazy, Suspense, useEffect } from 'react'
import NextNProgress from 'nextjs-progressbar';
const Providers = lazy(() => import('../components/Common/Providers'))
const Layout = lazy(() => import('../components/Common/Layout'))


export default function App({ Component, pageProps }: AppProps) {

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
        <NextNProgress color="#df3f95" showOnShallow={true} />
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </Providers>
    </Suspense>
  )
}
