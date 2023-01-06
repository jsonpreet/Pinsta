/* eslint-disable @next/next/no-img-element */
import MetaTags from '@components/Common/MetaTags'
import PinShimmer from '@components/Shimmers/PinShimmer'
import useAppStore from '@lib/store'
import usePersistStore from '@lib/store/persist'
import Custom404 from '@pages/404'
import Custom500 from '@pages/500'
import { APP } from '@utils/constants'
import { BoardPinsType, BoardType, PinstaPublication } from '@utils/custom-types'
import { usePublicationDetailsQuery } from '@utils/lens'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { BsArrowLeft, BsArrowLeftCircle, BsArrowLeftCircleFill, BsArrowLeftShort } from 'react-icons/bs';
import { BrowserView, MobileView, isBrowser, isMobile } from 'react-device-detect';
import imageCdn from '@utils/functions/imageCdn'
import getThumbnailUrl from '@utils/functions/getThumbnailUrl'
import { useEffect, useRef, useState } from 'react'
import InterweaveContent from '@components/Common/InterweaveContent'
import User from './User'
import Share from './Share'
import Meta from './Meta'
import { Loader } from '@components/UI/Loader';
import Comments from './Comments'
import clsx from 'clsx'
import RelatedPins from './Related'
import { directCheckSavedPin, getBoard } from '@lib/db/api'
import Link from 'next/link'
import { Analytics } from '@utils/analytics'

const Pin: NextPage = () => {
    const router = useRouter()
    const { id } = router.query
    const rootRef = useRef();
    const [readMore, setReadMore] = useState(false)
    const [isLoading, setLoading] = useState(true)
    const currentProfileId = usePersistStore((state) => state.currentProfileId)
    const currentProfile = useAppStore((state) => state.currentProfile)
    const [pinSaved, setPinSaved] = useState(false)
    const [savedTo, setSavedTo] = useState<BoardPinsType[]>([])
    const [savedToBoards, setSavedToBoards] = useState<BoardType[]>([])

    const { data, error, loading } = usePublicationDetailsQuery({
        variables: {
            request: { publicationId: id },
            reactionRequest: currentProfile
                ? { profileId: currentProfile?.id }
                : null,
            profileId: currentProfile?.id ?? null
        },
        skip: !id
    })

    const pin = data?.publication as PinstaPublication
    const publicationType = pin?.__typename

    useEffect(() => {
        if (pin) {
            (pin?.metadata?.content?.length > 300 ) ? setReadMore(true) : setReadMore(false)
        }
    }, [pin])

    useEffect(() => {
        if (pin) {
            checkSaved()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pin])

    const checkSaved = async () => {
        const savedPin = await directCheckSavedPin({ pinId: pin.id, user: currentProfileId })
        console.log('savedPin', savedPin)
        if (savedPin?.length > 0) {
            const boards:BoardType[] = []
            savedPin.forEach(async (pin: any) => {
                if (!pin.board) {
                    boards.push(pin)
                    return
                }
                const boardData = await getBoard(pin.board)
                boards.push(boardData)
            })
            setSavedToBoards(boards)
            setSavedTo(savedPin)
        }
        setPinSaved(savedPin.length > 0 ? true : false)
    }

    const canGet =
        pin &&
        publicationType &&
        ['Post', 'Comment'].includes(publicationType) &&
        !pin?.hidden
    
    if (error) return <Custom500 />
    if (loading || !data) return <PinShimmer />
    if (!canGet) return <Custom404 />
    
    return (
        <>
            <MetaTags title={pin?.profile ? `Pin by @${pin.profile.handle}` : APP.Name}/>
            {!loading && !error && pin ? (
                <>
                    <div className='md:mt-10 mt-0 flex-none'>
                        <BrowserView>
                            <div className='flex flex-col items-center relative justify-center'>
                                <button
                                    className='absolute top-0 left-0 z-10 hover:text-white hover:bg-red-600 dark:hover:bg-red-700 dark:bg-gray-800 dark:text-white bg-gray-100 text-gray-800  duration-75 delay-75 rounded-full w-12 h-12 text-center items-center justify-center flex'
                                    onClick={() => router.back()}
                                >
                                    <BsArrowLeftShort size={26} />
                                </button>
                            </div>
                        </BrowserView>
                        <div className='w-full max-w-[1024px] shadow-[rgba(13,_38,_76,_0.10)_0px_9px_15px] dark:bg-gray-800 bg-white rounded-3xl mx-auto'>
                            <div className='flex flex-col lg:flex-row overflow-visible'>
                                <div className='relative flex-none w-full lg:w-2/4'>
                                    <div className={clsx(
                                        'w-full h-full relative md:min-h-[500px] flex flex-col items-center rounded-xl sm:rounded-bl-3xl sm:rounded-tl-3xl p-4',
                                            // pin.stats.totalAmountOfComments > 3 ? 'justify-center' : 'justify-start'
                                        )}
                                    >
                                        <div className='sticky top-2'>
                                            <img 
                                                className='rounded-xl object-cover' 
                                                alt={`Pin by @${pin.profile.handle}`} 
                                                src={imageCdn(getThumbnailUrl(pin), 'thumbnail_lg')} 
                                                onLoad={() => setLoading(false)}
                                            />
                                            {!isLoading ?
                                                <Link 
                                                    href={getThumbnailUrl(pin)}
                                                    target='_blank'
                                                    onClick={() => {
                                                        Analytics.track(`clicked_on_view_original_from_pin_${pin.id}`);
                                                    }}
                                                    rel='noopener noreferrer'
                                                    className='absolute bottom-2 z-30 left-2 bg-black/60 py-1 px-2 rounded-md text-white shadow font-semibold text-sm'
                                                >
                                                    View Original
                                                </Link>
                                            : null
                                            }
                                        </div>
                                        {isLoading ?
                                            <span className='absolute bg-gray-100 dark:bg-gray-800 top-0 left-0 right-0 bottom-0 h-full w-full flex items-center rounded-bl-3xl rounded-tl-3xl justify-center'>
                                                <Loader/>
                                            </span>
                                            : null
                                        }
                                    </div>
                                </div>  
                                <div className='content flex flex-col items-start w-full lg:w-2/4 py-6 px-6 border-l dark:border-gray-900/30 border-gray-50'>
                                    <Share pin={pin} pinSaved={pinSaved} savedToBoards={savedToBoards}  savedTo={savedTo} />
                                    <User pin={pin} />
                                    <div className='mt-4 whitespace-pre-wrap break-words leading-md linkify text-md'>
                                        <InterweaveContent content={!readMore ? pin?.metadata?.content : `${pin?.metadata?.content?.substring(0, 300)}...`}/>
                                            
                                        {readMore &&
                                            <button 
                                                className='ml-1 font-semibold hover:underline' 
                                                onClick={() => {
                                                    setReadMore(false)
                                                    Analytics.track(`clicked_on_read_less_from_pin_${pin.id}`);
                                                }}
                                            >
                                                Read More
                                            </button>
                                        }
                                    </div>
                                    <Meta isComment={false} pin={pin} />
                                    <Comments pin={pin}/>
                                </div> 
                            </div>
                        </div>
                    </div>
                    <div className='md:mt-10 mt-0 flex-none'>
                        <RelatedPins pin={pin} />
                    </div>
                </>
            ) : null}
        </>
    )
}

export default Pin