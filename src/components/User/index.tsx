import MetaTags from '@components/Common/MetaTags'
import PinShimmer from '@components/Shimmers/PinShimmer'
import useAppStore from '@lib/store'
import Custom404 from '@pages/404'
import Custom500 from '@pages/500'
import { APP } from '@utils/constants'
import formatHandle from '@utils/functions/formatHandle'
import { Profile, useProfileQuery } from '@utils/lens/generated'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import React from 'react'
import Info from './Info'

const User: NextPage = () => {
    const { query } = useRouter()
    const username = query.username ?? ''
    const handle = formatHandle(username as string, true);
    const currentProfile = useAppStore((state) => state.currentProfile)

    const { data, loading, error } = useProfileQuery({
        variables: {
        request: { handle },
            who: currentProfile?.id ?? null
        },
        skip: !handle
    })

    if (error) return <Custom500 />
    if (loading || !data) return <PinShimmer />
    if (!data?.profile) return <Custom404 />
    
    const userProfile = data?.profile as Profile

    return (
        <>
            {userProfile?.name ? (
                <MetaTags title={`${userProfile?.name} (@${formatHandle(userProfile?.handle)}) :: ${APP.Name}`} />
            ) : (
                <MetaTags title={`@${formatHandle(userProfile?.handle)} :: ${APP.Name}`} />
            )}
            {!loading && !error && userProfile ? (
                <>
                    <Info profile={userProfile} />
                </>
            ) : null}
        </>
    )
}

export default User

