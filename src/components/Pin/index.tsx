/* eslint-disable @next/next/no-img-element */
import MetaTags from '@components/Common/MetaTags'
import PinShimmer from '@components/Shimmers/PinShimmer'
import useAppStore from '@lib/store'
import usePersistStore from '@lib/store/persist'
import Custom404 from '@pages/404'
import Custom500 from '@pages/500'
import { BoardPinsType, BoardType, PinstaPublication } from '@utils/custom-types'
import { useRouter } from 'next/router'
import { BsArrowLeftShort } from 'react-icons/bs';
import { FC, useEffect, useRef, useState } from 'react'
import InterweaveContent from '@components/Common/InterweaveContent'
import User from './User'
import Share from './Share'
import Meta from './Meta'
import Comments from './Comments'
import RelatedPins from './Related'
import { directCheckSavedPin, getBoard } from '@lib/db/api'
import { Analytics, TRACK } from '@utils/analytics'
import Attachments from './Attachments'
import getAppName from '@utils/functions/getAppName'
import Wav3sMeta from './Meta/Wav3s'
import sanitizeIpfsUrl from '@utils/functions/sanitizeIpfsUrl'
import getAttributeFromTrait from '@utils/functions/getAttributeFromTrait'
import imageCdn from '@utils/functions/imageCdn'
import truncate from '@utils/functions/truncate'
import { NextSeo } from 'next-seo'
import { APP } from '@utils/constants'

type Props = {
    pin: PinstaPublication
    error?: string 
    loading?: boolean
}

const Pin: FC<Props> = ({ pin, error, loading }) => {
    const router = useRouter()
    const [readMore, setReadMore] = useState(false)
    const currentProfileId = usePersistStore((state) => state.currentProfileId)
    const currentProfile = useAppStore((state) => state.currentProfile)
    const [pinSaved, setPinSaved] = useState(false)
    const [savedTo, setSavedTo] = useState<BoardPinsType[]>([])
    const [savedToBoards, setSavedToBoards] = useState<BoardType[]>([])

    const publicationType = pin?.__typename

    useEffect(() => {
        Analytics.track(TRACK.PAGE_VIEW.PIN)
    }, [])

    useEffect(() => {
        if (pin) {
            (pin?.metadata?.content?.length > 300) ? setReadMore(true) : setReadMore(false)
        }
    }, [pin])

    useEffect(() => {
        if (pin && currentProfile) {
            checkSaved()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pin])

    const checkSaved = async () => {
        const savedPin = await directCheckSavedPin({ pinId: pin.id, user: currentProfileId })
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
        ['Post', 'Comment', 'Mirror'].includes(publicationType) &&
        !pin?.hidden

    
    if (error) return <Custom500 />
    if (loading || !pin) return <PinShimmer />
    if (!canGet) return <Custom404 />

    // @ts-ignore
    const pinTitle = pin ? getAttributeFromTrait(pin?.metadata?.attributes, 'title') : '';

    return (
        <>
            <NextSeo
                title={`${truncate(pinTitle ?? `Pin by @${pin?.profile?.handle}`, 60)} :: Pinsta`}
                description={truncate(pin?.metadata?.content as string, 100)}
                canonical={`${APP.URL}${router.asPath}`}
                openGraph={{
                    title: `${truncate(pinTitle ?? `Pin by @${pin?.profile?.handle}`, 60)} :: Pinsta`,
                    description: truncate(pin?.metadata?.content as string, 100),
                    url: `${APP.URL}${router.asPath}`,
                    images: [
                        {
                            url: imageCdn(sanitizeIpfsUrl(pin?.metadata?.media?.[0]?.original?.url), 'thumbnail') as string,
                            alt: `${truncate(pinTitle ?? `Pin by @${pin?.profile?.handle}`, 60)} :: Pinsta`,
                        },
                    ],
                }}
            />
            {!loading && !error && pin ? (
                <>
                    <div className='mt-0 flex-none'>
                        <div className='hidden md:flex flex-col items-center relative justify-center'>
                            <button
                                className='absolute top-0 left-0 z-10 hover:text-white hover:bg-red-600 dark:hover:bg-red-500 dark:bg-gray-800 dark:text-white bg-gray-100 text-gray-800  duration-75 delay-75 rounded-full w-12 h-12 text-center items-center justify-center flex'
                                onClick={() => router.back()}
                            >
                                <BsArrowLeftShort size={26} />
                            </button>
                        </div>
                        <div className='w-full max-w-[1024px] md:shadow-[rgba(13,_38,_76,_0.10)_0px_9px_15px] dark:bg-gray-800 bg-white md:rounded-3xl mx-auto md:mb-0 mb-4'>
                            <div className='flex flex-col lg:flex-row overflow-visible'>
                                <div className='relative flex-none w-full lg:w-2/4'>
                                    <Attachments pin={pin}/>
                                </div>  
                                <div className='content flex flex-col items-start w-full lg:w-2/4 py-6 px-6 border-l dark:border-gray-900/30 border-gray-50'>
                                    <Share pin={pin} pinSaved={pinSaved} savedToBoards={savedToBoards}  savedTo={savedTo} />
                                    <User pin={pin} />
                                    {pinTitle ?
                                        <h2 className='mt-4 font-bold text-xl'>
                                            {pinTitle}
                                        </h2>
                                    : null}
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
                                    {pin?.appId ? 
                                        <div className='pt-3'>
                                            <span className='text-sm'>Posted via {getAppName(pin?.appId)}</span>
                                        </div>
                                        : null}
                                    <Wav3sMeta pin={pin} />
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
            ) : <PinShimmer />}
        </>
    )
}

export default Pin