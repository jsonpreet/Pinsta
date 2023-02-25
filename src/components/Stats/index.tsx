import MetaTags from '@components/Common/MetaTags'
import { Loader } from '@components/UI/Loader'
import useIsMounted from '@hooks/useIsMounted'
import { FetchTotalBoards, FetchTotalPins } from '@lib/db/actions'
import useAppStore from '@lib/store'
import { ADMIN_IDS, APP } from '@utils/constants'
import type { GlobalProtocolStats } from '@utils/lens'
import { useGlobalProtocolStatsQuery } from '@utils/lens'
import dynamic from 'next/dynamic'
import React from 'react'
import { BsPin, BsPinAngle } from 'react-icons/bs'
import { HiHeart, HiOutlineChatAlt2 } from 'react-icons/hi'
import { MdOutlineSpaceDashboard } from 'react-icons/md'
import { RiArrowLeftRightFill, RiShoppingBag3Fill } from 'react-icons/ri'

const StatCard = dynamic(() => import('./StatCard'))
const Custom404 = dynamic(() => import('../../pages/404'))

const Stats = () => {
    const { mounted } = useIsMounted()
    const currentProfile = useAppStore((state) => state.currentProfile)

    const { data, loading } = useGlobalProtocolStatsQuery({
        variables: {
        request: {
            sources: [APP.ID]
        }
        }
    })

    const { data: boards } = FetchTotalBoards()
    const { data: pins } = FetchTotalPins()

    if (!ADMIN_IDS.includes(currentProfile?.id)) {
        return <Custom404 />
    }

    const stats = data?.globalProtocolStats as GlobalProtocolStats

    return (
        <>
            <MetaTags title="Pinsta Stats" />
            {loading && !mounted ?
                (
                    <Loader />
                ) : (
                    <>
                        <div className='max-w-5xl mx-auto px-4 md:px-0'>
                            <div className="flex items-center justify-center mb-7">
                                <h1 className="text-2xl font-black uppercase brandGradientText tracking-widest pb-4 relative">
                                    <span>Pinsta Stats</span>
                                    <span className="absolute w-1/2 right-0 mx-auto bottom-0 left-0 h-1 bg-gradient-to-r from-[#df3f95] to-[#ec1e25]" />
                                </h1>    
                            </div>    
                            <div className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-5">
                                <StatCard
                                    icon={<BsPin size={26} />}
                                    count={stats?.totalPosts}
                                    text="Total Pins"
                                />
                                <StatCard
                                    icon={<HiOutlineChatAlt2 size={26} />}
                                    count={stats?.totalComments}
                                    text="Total Comments"
                                />
                                <StatCard
                                    icon={<RiArrowLeftRightFill size={26} />}
                                    count={stats?.totalMirrors}
                                    text="Total Mirrors"
                                />
                                {/* <StatCard
                                    icon={<FcLikePlaceholder />}
                                    count={stats?.totalFollows}
                                    text="Total Follows"
                                /> */}
                                {/* <StatCard
                                    icon={<RiShoppingBag3Fill size={26} />}
                                    count={stats?.totalCollects}
                                    text="Total Collects"
                                /> */}
                                <StatCard
                                    icon={<MdOutlineSpaceDashboard size={26} />}
                                    count={boards?.data}
                                    text="Total Boards"
                                />
                                <StatCard
                                    icon={<BsPinAngle size={26} />}
                                    count={pins?.data}
                                    text="Total Saved Pins"
                                />
                            </div>
                        </div>
                    </>
                )
            }
        </>
    )
}

export default Stats