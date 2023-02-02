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
import React, { useEffect } from 'react'
import Info from './Info'
import Pins from './Pins'
import { Analytics, TRACK } from '@utils/analytics'
import ProfileShimmer from '@components/Shimmers/ProfileShimmer'
import getProfilePicture from '@utils/functions/getProfilePicture'

const Profile: NextPage = () => {
    const { query } = useRouter()
    const username = query.username ?? ''
    const handle = formatHandle(username as string, true);
    const currentProfile = useAppStore((state) => state.currentProfile)

    useEffect(() => {
        Analytics.track(TRACK.PAGE_VIEW.PROFILE)
    }, [])

    const { data, loading, error } = useProfileQuery({
        variables: {
        request: { handle },
            who: currentProfile?.id ?? null
        },
        skip: !handle
    })

    if (error) return <Custom500 />
    if (loading || !data) return <ProfileShimmer />
    if (!data?.profile) return <Custom404 />
    
    const userProfile = data?.profile as Profile

    const metaTitle = userProfile?.name ? `${userProfile?.name} (@${formatHandle(userProfile?.handle)}) :: ${APP.Name}` : `@${formatHandle(userProfile?.handle)} :: ${APP.Name}`

    return (
        <>
            <MetaTags
                title={metaTitle}
                image={getProfilePicture(userProfile, 'avatar_lg')}
                description={userProfile?.bio}
            />
            {!loading && !error && userProfile ? (
                <>
                    <Info profile={userProfile} />
                    <Pins profile={userProfile} />
                </>
            ) : <ProfileShimmer/>}
        </>
    )
}

export default Profile

