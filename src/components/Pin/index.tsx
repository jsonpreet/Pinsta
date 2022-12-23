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
import { BsArrowLeftCircle, BsArrowLeftCircleFill } from 'react-icons/bs';
import { BrowserView, MobileView, isBrowser, isMobile } from 'react-device-detect';
import imageCdn from '@utils/functions/imageCdn'
import getThumbnailUrl from '@utils/functions/getThumbnailUrl'
import { useEffect, useRef, useState } from 'react'
import InterweaveContent from '@components/Common/InterweaveContent'
import UserCard from './UserCard'
import ShareCard from './ShareCard'
import MetaCard from './Meta'
import { Loader } from './../Shared/Loader';
import Comments from './Comments'

const Pin: NextPage = () => {
    const router = useRouter()
    const { id } = router.query
    const rootRef = useRef();
    const [readMore, setReadMore] = useState(false)
    const [isLoading, setLoading] = useState(true)
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

    

    useEffect(() => {
        if (pin) {
            checkLength();
        }
    }, [pin])

    const canGet =
        pin &&
        publicationType &&
        ['Post', 'Comment'].includes(publicationType) &&
        !pin?.hidden
    
    if (error) return <Custom500 />
    if (loading || !data) return <PinShimmer />
    if (!canGet) return <Custom404 />

    const checkLength = () => {
        (pin.metadata.content.length > 300 ) ? setReadMore(true) : setReadMore(false)
    }

    return (
        <>
            <MetaTags title={pin?.profile ? `Pin by @${pin.profile.handle}` : APP.Name}/>
            {!loading && !error && pin ? (
                <div className='mt-20 sm:mt-0 flex-none'>
                    <div className='w-full max-w-[1024px] shadow-[rgba(13,_38,_76,_0.19)_0px_9px_20px] rounded-3xl mx-auto'>
                        <div className='flex flex-col lg:flex-row overflow-visible'>
                            <div className='relative flex-none w-full lg:w-2/4'>
                                <div className='w-full border border-white/50 h-full min-h-[500px] flex flex-col justify-center items-center rounded-3xl sm:rounded-bl-3xl sm:rounded-tl-3xl p-4'>
                                    <img 
                                        className='rounded-xl object-cover' 
                                        alt={`Pin by @${pin.profile.handle}`} 
                                        src={imageCdn(getThumbnailUrl(pin), 'thumbnail_lg')} 
                                        onLoad={() => setLoading(false)}
                                    />
                                    {isLoading ?
                                        <span className='absolute bg-gray-100 dark:bg-gray-700 top-0 left-0 right-0 bottom-0 h-full w-full flex items-center justify-center'>
                                            <Loader/>
                                        </span>
                                        : null
                                    }
                                </div>
                            </div>  
                            <div className='content flex flex-col items-start w-full lg:w-2/4 pt-8 pb-4 px-8'>
                                <ShareCard pin={pin} />
                                <UserCard pin={pin} />
                                <div className='mt-4'>
                                    <InterweaveContent content={!readMore ? pin.metadata.content : `${pin.metadata.content.substring(0, 300)}...`}/>
                                        
                                    {readMore &&
                                        <button className='ml-1 font-semibold hover:underline' onClick={() => setReadMore(false)}>
                                            Read More
                                        </button>
                                    }
                                </div>
                                <MetaCard pin={pin} />
                                <Comments pin={pin}/>
                            </div> 
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    )
}

export default Pin