import MetaTags from '@components/Common/MetaTags'
import PinShimmer from '@components/Shimmers/PinShimmer'
import useAppStore from '@lib/store'
import usePersistStore from '@lib/store/persist'
import Custom404 from '@pages/404'
import Custom500 from '@pages/500'
import { APP } from '@utils/constants'
import { PinstaPublication } from '@utils/custom-types'
import { usePublicationDetailsQuery } from '@utils/lens'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import Layout from '@components/Common/Layout'
import { BsArrowLeftCircle, BsArrowLeftCircleFill } from 'react-icons/bs';
import { BrowserView, MobileView, isBrowser, isMobile } from 'react-device-detect';
import imageCdn from '@utils/functions/imageCdn'
import getThumbnailUrl from '@utils/functions/getThumbnailUrl'

const Pin: NextPage = () => {
    const router = useRouter()
    const { id } = router.query
    const currentProfileId = usePersistStore((state) => state.currentProfileId)
    const currentProfile = useAppStore((state) => state.currentProfile)

    const { data, error, loading } = usePublicationDetailsQuery({
        variables: {
            request: { publicationId: id },
            reactionRequest: currentProfile
                ? { profileId: currentProfile?.id }
                : null,
            channelId: currentProfile?.id ?? null
        },
        skip: !id
    })

    const pin = data?.publication as PinstaPublication
    const publicationType = pin?.__typename

    const canGet =
        pin &&
        publicationType &&
        ['Post', 'Comment'].includes(publicationType) &&
        !pin?.hidden
    
    if (error) return <Custom500 />
    if (loading || !data) return <PinShimmer />
    if (!canGet) return <Custom404 />
    console.log(pin)
    return (
        <>
            <MetaTags title={pin?.profile ? `Pin by @${pin.profile.handle}` : APP.Name}/>
            {!loading && !error && pin ? (
                <div className='mt-20 sm:mt-0 flex-none'>
                    <div className='w-full'>
                        <div className='flex flex-col lg:flex-row overflow-visible'>
                            <div className='relative top-0 left-0 z-10 flex-none w-full lg:w-2/4'>
                                <div className='w-full'>
                                    <img className='rounded-xl shadow-[rgba(13,_38,_76,_0.19)_0px_9px_20px] object-cover' alt={`Pin by @${pin.profile.handle}`} src={imageCdn(getThumbnailUrl(pin), 'thumbnail_sm')} />
                                </div>
                            </div>  
                            {/* <div className='content flex flex-col w-full lg:w-2/4 pt-8 pb-4 px-8'>
                                <ShareCard rootRef={rootRef} post={post} />
                                <UserCard user={user} profile={post.ProfileEntryResponse} follows={follows} />
                                <div className='mt-4 break-words body'>
                                    <Linkify options={LinkifyOptions}>
                                        {!readMore ? post.Body : `${post.Body.substring(0, 300)}...`}
                                    </Linkify>
                                    {readMore &&
                                        <button className='ml-1 font-semibold hover:underline' onClick={() => setReadMore(false)}>
                                            Read More
                                        </button>
                                    }
                                </div>
                                <MetaCard post={post} />
                                <Comments post={post}/>
                            </div> */}
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    )
}

export default Pin