import { NextPage } from 'next'
import dynamic from 'next/dynamic'

import BasicInfo from './BasicInfo'
import ProfileInterests from './ProfileInterests'
import SideNav from './SideNav'
import { useRouter } from 'next/router'
import useAppStore from '@lib/store'
import { MediaSet, Profile, useProfileQuery } from '@utils/lens/generated'
import Custom500 from '@pages/500'
import Custom404 from '@pages/404'
import { Loader } from '@components/UI/Loader'
import MetaTags from '@components/Common/MetaTags'
import { SETTINGS, SETTINGS_DANGER_ZONE, SETTINGS_INTERESTS, SETTINGS_PERMISSIONS } from '@utils/paths'

const Settings: NextPage = () => {
    const router = useRouter()
    const currentProfile = useAppStore((state) => state.currentProfile)
    const { data, loading, error } = useProfileQuery({
        variables: {
        request: { handle: currentProfile?.handle }
        },
        skip: !currentProfile?.handle
    })
    if (error) return <Custom500 />
    if (loading || !data) return <Loader />

    if (!data?.profile || (!currentProfile && router.isReady))
        return <Custom404 />

    const profile = data?.profile as Profile & {
        coverPicture: MediaSet
    }
    return (
        <>
            <div className="container max-w-7xl mx-auto">
                <MetaTags title="Account Settings" />
                {!loading && !error && profile ? (
                    <div className="grid gap-4 md:grid-cols-4">
                    <div className="md:col-span-1">
                        <SideNav profile={profile} />
                    </div>
                    <div className="md:col-span-3">
                        {router.pathname === SETTINGS && <BasicInfo profile={profile} />}
                        {/* {router.pathname === SETTINGS_PERMISSIONS && <Permissions />} */}
                        {router.pathname === SETTINGS_INTERESTS && <ProfileInterests />}
                        {/* {router.pathname === SETTINGS_DANGER_ZONE && <DangerZone />} */}
                    </div>
                    </div>
                ) : null}
            </div>
        </>
    )
}

export default Settings