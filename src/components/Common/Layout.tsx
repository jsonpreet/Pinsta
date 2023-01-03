import useAppStore from '@lib/store'
import usePersistStore from '@lib/store/persist'
import clsx from 'clsx'
import type { Profile } from '@utils/lens'
import { useUserProfilesQuery } from '@utils/lens'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useTheme } from 'next-themes'
import type { FC, ReactNode } from 'react'
import React, { useEffect } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { POLYGON_CHAIN_ID } from '@utils/constants'
import { CustomErrorWithData } from '@utils/custom-types'
import clearLocalStorage from '@utils/functions/clearLocalStorage'
import { getIsAuthTokensAvailable } from '@utils/functions/getIsAuthTokensAvailable'
import { getToastOptions } from '@utils/functions/getToastOptions'
import useIsMounted from '@hooks/useIsMounted'
import { useAccount, useDisconnect, useNetwork } from 'wagmi'

import FullPageLoader from '../UI/FullPageLoader'
import Header from './Header'
import CategoriesList from './CategoriesList'
import BetaNotification from './BetaNotification'
import CreateProfile from './Modals/CreateProfile'
import TrendingTags from './TrendingTags';

interface Props {
  children: ReactNode
}

const Layout: FC<Props> = ({ children }) => {
    const setUserSigNonce = useAppStore((state) => state.setUserSigNonce)
    const setCurrentProfile = useAppStore((state) => state.setCurrentProfile)
    const currentProfile = useAppStore((state) => state.currentProfile)
    const sidebarCollapsed = usePersistStore((state) => state.sidebarCollapsed)
    const setProfiles = useAppStore((state) => state.setProfiles)
    const currentProfileId = usePersistStore((state) => state.currentProfileId)
    const setCurrentProfileId = usePersistStore(
        (state) => state.setCurrentProfileId
    )

    const { chain } = useNetwork()
    const { resolvedTheme } = useTheme()
    const { disconnect } = useDisconnect({
        onError(error: CustomErrorWithData) {
            toast.error(error?.data?.message ?? error?.message)
        }
    })
    const { mounted } = useIsMounted()
    const { address } = useAccount()
    const { pathname, replace, asPath } = useRouter()
    const showFilter = pathname === '/' || pathname === '/explore' || pathname === '/latest'
    //const showFilter = false

    const resetAuthState = () => {
        setCurrentProfile(null)
        setCurrentProfileId(null)
    }

    const setUserProfiles = (profiles: Profile[]) => {
        setProfiles(profiles)
        const currentProfile = profiles.find(
            (profile) => profile.id === currentProfileId
        )
        setCurrentProfile(currentProfile ?? profiles[0])
        setCurrentProfileId(currentProfile?.id)
    }

    const { loading } = useUserProfilesQuery({
        variables: {
            request: { ownedBy: [address] }
        },
        skip: !currentProfileId,
        onCompleted: (data) => {
            const profiles = data?.profiles?.items as Profile[]
            if (!profiles.length) return resetAuthState()
            setUserProfiles(profiles)
            setUserSigNonce(data?.userSigNonces?.lensHubOnChainSigNonce)
        },
        onError: () => {
            setCurrentProfileId(null)
        }
    })

    const validateAuthentication = () => {
        // if (
        //     !currentProfile &&
        //     !currentProfileId &&
        //     AUTH_ROUTES.includes(pathname)
        // ) {
        //     replace(`/auth?next=${asPath}`) // redirect to signin page
        // }
        const logout = () => {
            resetAuthState()
            clearLocalStorage()
            disconnect?.()
        }
        const ownerAddress = currentProfile?.ownedBy
        const isWrongNetworkChain = chain?.id !== POLYGON_CHAIN_ID
        const isSwitchedAccount =
        ownerAddress !== undefined && ownerAddress !== address
        const shouldLogout =
        !getIsAuthTokensAvailable() || isWrongNetworkChain || isSwitchedAccount

        if (shouldLogout && currentProfileId) {
            logout()
        }
    }

    useEffect(() => {
        validateAuthentication()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [address, chain, disconnect, currentProfileId])

    if (loading || !mounted) return <FullPageLoader />

    return (
        <>
            <Head>
                <meta
                    name="theme-color"
                    content={resolvedTheme === 'dark' ? '#000000' : '#ffffff'}
                />
            </Head>
            <Toaster
                position="top-center"
                toastOptions={getToastOptions(resolvedTheme)}
            />
            <div className='relative'>
                <Header />
                <div className='pb-8'>
                    {showFilter && 
                        <div className='pt-3 md:px-6'>
                            <TrendingTags />
                        </div>
                    }
                    <div className='overflow-hidden md:px-6'>
                        <BetaNotification/>
                    </div>
                    <CreateProfile />
                    <div className='py-4 ultrawide:max-w-[110rem] mx-auto md:px-8 ultrawide:px-0'>
                        {children}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Layout