import TimelineShimmmer from './TimelineShimmer'

export const ProfileCoverShimmer = () => {
    return (
        <div className="flex items-center justify-center px-4 md:px-0">
            <div className='relative flex flex-col max-w-7xl w-full rounded-xl h-36 sm:h-96'>
                <div className="h-36 w-full border bg-gray-300 dark:bg-gray-700 animate-pulse rounded-xl sm:h-96"/>
            </div>
        </div> 
    )
}

export const ProfileTimelineShimmer = () => {
    return (
        <div>
            <div className='mt-10 flex flex-col space-y-4'>
                <div className='w-96 h-14 mx-auto rounded-full bg-gray-300 dark:bg-gray-700 animate-pulse' />
                <TimelineShimmmer />
            </div>
        </div> 
    )
}

export const ProfileDetailsShimmer = () => {
    return (
        <div className="md:mb-10 flex-1 space-y-5 flex flex-col w-full items-center justify-center">
            <div className="relative -mt-10 w-32 h-32 sm:-mt-24 sm:w-44 sm:h-44">
                <div className="w-32 h-32 dark:bg-gray-700/40 dark:ring-gray-700/60 bg-gray-300/70 ring-2 ring-white/70 bg-clip-padding backdrop-blur-xl backdrop-filter p-3 rounded-full sm:w-44 sm:h-44 animate-pulse"/>
            </div>
            <div className="space-y-1 flex flex-col items-center justify-center">
                <div className="flex items-center">
                    <div className="w-28 h-4 bg-gray-300 dark:bg-gray-700 animate-pulse rounded-full"/>
                </div>
                <div className="flex flex-col justify-center items-center space-y-2">
                    <div className="w-24 h-4 bg-gray-300 dark:bg-gray-700 animate-pulse rounded-full"/>
                </div>
            </div>
            <div className='w-full max-w-2xl items-center mx-auto flex flex-col space-y-2'>
                <div className='bg-gray-300 rounded-xl dark:bg-gray-700 animate-pulse h-4 w-full'/>
                <div className='bg-gray-300 rounded-xl dark:bg-gray-700 animate-pulse h-4 w-1/2'/>
            </div>
            <div className="flex space-x-4 w-full items-center justify-center max-w-2xl mx-auto">
                <div className='bg-gray-300 rounded-xl dark:bg-gray-700 animate-pulse h-6 w-1/3' />
                <div className='bg-gray-300 rounded-xl dark:bg-gray-700 animate-pulse h-6 w-1/3' />
            </div>
        </div>
    )
}

const ProfileShimmer = () => {
    return (
        <>
            <div className="flex flex-col">
                <ProfileCoverShimmer/>
                <div className="flex flex-col flex-none justify-center mx-auto w-full">
                    <ProfileDetailsShimmer/>
                </div>
                <ProfileTimelineShimmer/>
            </div>
        </>
    )
}

export default ProfileShimmer