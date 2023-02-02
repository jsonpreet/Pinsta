import MetaTags from '@components/Common/MetaTags'
import type { NextPage } from 'next'
import useAppStore from '@lib/store'
import { Analytics, TRACK } from '@utils/analytics'
import { useEffect } from 'react'
import usePersistStore from '@lib/store/persist'
import Explore from './Explore'
import Feed from './Feed'

const Home: NextPage = () => {
    const currentProfile = useAppStore((state) => state.currentProfile)
    const currentProfileId = usePersistStore((state) => state.currentProfileId)

    useEffect(() => {
        Analytics.track(TRACK.PAGE_VIEW.HOME)
    }, [])

    return (
        <>
            <MetaTags />
            {!currentProfile && !currentProfileId ? (
                    <Explore/>
                )
                : <Feed />
            }
        </>
    )
}

export default Home