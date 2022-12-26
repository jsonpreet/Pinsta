import Login from '@components/Common/Auth/Login'
import MetaTags from '@components/Common/MetaTags'
import usePersistStore from '@lib/store/persist'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { APP } from '@utils/constants'

const AuthRequiredPage = () => {
    const currentProfileId = usePersistStore((state) => state.currentProfileId)
    const { replace, query } = useRouter()

    useEffect(() => {
        if (currentProfileId && query?.next) {
        replace(query?.next as string)
        }
    }, [currentProfileId, query, replace])

    return (
        <>
            <MetaTags title="Login :: Pinsta" />
            <div className="flex flex-col items-center justify-start h-full mt-10 md:mt-20">
                <img
                    src={`/logo.png`}
                    alt={APP.Name}
                    draggable={false}
                    height={50}
                    width={50}
                />
                <div className="flex flex-col items-center justify-center py-10">
                    <h1 className="mb-4 text-3xl font-bold">Sign In Required</h1>
                    <div className="mb-6 text-center">
                        Connect Wallet & Sign with Lens to continue,
                    </div>
                    <div>
                        <Login />
                    </div>
                </div>
            </div>
        </>
    )
}

export default AuthRequiredPage