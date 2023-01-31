import useAppStore from '@lib/store'
import usePersistStore, { signIn, signOut } from '@lib/store/persist'
import type { Profile } from '@utils/lens'
import {
  useAllProfilesLazyQuery,
  useAuthenticateMutation,
  useChallengeLazyQuery
} from '@utils/lens'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { ERROR_MESSAGE } from '@utils/constants'
import { useAccount, useSignMessage } from 'wagmi'

import ConnectWalletButton from './ConnectWalletButton'
import { Analytics, TRACK } from '@utils/analytics'

const Login = () => {
    const router = useRouter()
    const { address } = useAccount()
    const [loading, setLoading] = useState(false)
    const setShowCreateAccount = useAppStore(
        (state) => state.setShowCreateAccount
    )
    const setProfiles = useAppStore((state) => state.setProfiles)
    const setCurrentProfile = useAppStore((state) => state.setCurrentProfile)
    const setCurrentProfileId = usePersistStore((state) => state.setCurrentProfileId)

    const onError = () => {
        setLoading(false)
    }

    const { signMessageAsync } = useSignMessage({
        onError
    })

    const [loadChallenge, { error: errorChallenge }] = useChallengeLazyQuery({
        fetchPolicy: 'no-cache', // if cache old challenge persist issue (InvalidSignature)
        onError
    })
    const [authenticate, { error: errorAuthenticate }] = useAuthenticateMutation()
    const [getProfiles, { error: errorProfiles }] = useAllProfilesLazyQuery({
        fetchPolicy: 'no-cache'
    })

    useEffect(() => {
        if (
            errorAuthenticate?.message ||
            errorChallenge?.message ||
            errorProfiles?.message
        )
        toast.error(
            errorAuthenticate?.message ||
            errorChallenge?.message ||
            errorProfiles?.message ||
            ERROR_MESSAGE
        )
    }, [errorAuthenticate, errorChallenge, errorProfiles])

    const handleSign = async () => {
        Analytics.track(TRACK.AUTH.CLICK_SIGN_IN)
        try {
            setLoading(true)
            const challenge = await loadChallenge({
                variables: { request: { address } }
            })
            if (!challenge?.data?.challenge?.text) return toast.error(ERROR_MESSAGE)
            const signature = await signMessageAsync({
                message: challenge?.data?.challenge?.text
            })
            const result = await authenticate({
                variables: { request: { address, signature } }
            })
            const accessToken = result.data?.authenticate.accessToken
            const refreshToken = result.data?.authenticate.refreshToken
            localStorage.setItem('accessToken', accessToken)
            localStorage.setItem('refreshToken', refreshToken)
            const { data: profilesData } = await getProfiles({
                variables: {
                request: { ownedBy: [address] }
                }
            })
            if (
                !profilesData?.profiles ||
                profilesData?.profiles?.items.length === 0
            ) {
                setCurrentProfile(null)
                setCurrentProfileId(null)
                setShowCreateAccount(true)
            } else {
                const profiles = profilesData?.profiles?.items as Profile[]
                const defaultProfile = profiles.find((profile) => profile.isDefault)
                setProfiles(profiles)
                setCurrentProfile(defaultProfile ?? profiles[0])
                setCurrentProfileId(defaultProfile?.id ?? profiles[0].id)
                if (router.query?.next) router.push(router.query?.next as string)
            }
            setLoading(false)
            Analytics.track(TRACK.AUTH.SIGN_IN_SUCCESS)
        } catch (error) {
            signOut()
            setCurrentProfile(null)
            setProfiles([])
            setLoading(false)
            toast.error('Sign in failed')
            Analytics.track(TRACK.AUTH.SIGN_IN_FAILED)
            console.error('[Error Sign In]', error)
        }
    }

    return (
        <ConnectWalletButton handleSign={() => handleSign()} signing={loading} />
    )
}

export default Login