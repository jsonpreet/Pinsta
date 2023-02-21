import { ApolloProvider } from '@apollo/client'
import apolloClient from '@lib/apollo'
import {
  connectorsForWallets,
  darkTheme,
  lightTheme,
  RainbowKitProvider
} from '@rainbow-me/rainbowkit'
import type { ThemeOptions } from '@rainbow-me/rainbowkit/dist/themes/baseTheme'
import {
  coinbaseWallet,
  injectedWallet,
  metaMaskWallet,
  rainbowWallet,
  walletConnectWallet
} from '@rainbow-me/rainbowkit/wallets'
import { ThemeProvider, useTheme } from 'next-themes'
import { ReactNode, useState } from 'react'
import React from 'react'
import { IS_MAINNET, APP, POLYGON_RPC_URL } from '@utils/constants'
import { configureChains, createClient, WagmiConfig } from 'wagmi'
import { polygon, polygonMumbai } from 'wagmi/chains'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { publicProvider } from 'wagmi/providers/public'

import ErrorBoundary from './ErrorBoundary'
import { getLivepeerClient, videoPlayerTheme } from '@utils/functions/getLivePeer'
import { LivepeerConfig } from '@livepeer/react'

const { chains, provider } = configureChains(
    [IS_MAINNET ? polygon : polygonMumbai],
    [
      jsonRpcProvider({
        rpc: () => ({
          http: POLYGON_RPC_URL
        })
      }),
      publicProvider()
    ],
    { targetQuorum: 1 }
)

const connectors = connectorsForWallets([
    {
        groupName: 'Recommended',
        wallets: [
            injectedWallet({ chains, shimDisconnect: true }),
            metaMaskWallet({ chains, shimDisconnect: true }),
            rainbowWallet({ chains }),
            coinbaseWallet({ appName: APP.Name, chains }),
            walletConnectWallet({ chains })
        ]
    }
])

const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider
})

// Enables usage of theme in RainbowKitProvider
const RainbowKitProviderWrapper = ({ children }: { children: ReactNode }) => {
    const { theme } = useTheme()
    const themeOptions: ThemeOptions = {
        fontStack: 'system',
        overlayBlur: 'small',
        accentColor: '#ec1e25'
    }
    return (
        <RainbowKitProvider
            modalSize="compact"
            chains={chains}
            theme={
                theme === 'dark' ? darkTheme(themeOptions) : lightTheme(themeOptions)
            }
        >
            {children}
        </RainbowKitProvider>
    )
}

const Providers = ({ children }: { children: ReactNode }) => {
    return (
        <ErrorBoundary>
            <LivepeerConfig client={getLivepeerClient()} theme={videoPlayerTheme}>
                <WagmiConfig client={wagmiClient}>
                    <ThemeProvider defaultTheme="light" attribute="class">
                        <RainbowKitProviderWrapper>
                            <ApolloProvider client={apolloClient}>
                                {children}
                            </ApolloProvider>
                        </RainbowKitProviderWrapper>
                    </ThemeProvider>
                </WagmiConfig>
            </LivepeerConfig>   
        </ErrorBoundary>
    )
}

export default Providers