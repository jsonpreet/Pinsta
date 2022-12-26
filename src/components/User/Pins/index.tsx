import { Profile } from '@utils/lens/generated'
import clsx from 'clsx'
import { FC, useState } from 'react'
import Created from './Created'
import Saved from './Saved'

interface Props {
    profile: Profile
}

const Pins: FC<Props> = ({profile}) => {
    const [activeTab, setActiveTab] = useState('created')
    return (
        <>
            <div className="flex flex-col items-center w-full h-full">
                <div className="flex dropdown-shadow bg-white dark:bg-gray-900 bg-gradient-to-r from-[#df3f95] to-[#ec1e25] rounded-full py-2 px-2 space-x-4 items-center">
                    <button
                        onClick={() => setActiveTab('created')}
                        className={clsx(
                            'text-sm p-2 rounded-full', 
                            activeTab === 'created' ? 'bg-white text-gray-800' : 'text-white'
                        )}
                    >
                        Created
                    </button>
                    <button
                        onClick={() => setActiveTab('saved')}
                        className={clsx(
                            'text-sm p-2 rounded-full', 
                            activeTab === 'saved' ? 'bg-white text-gray-800' : 'text-white'
                        )}
                    >
                        Saved
                    </button>
                </div>
                <div className='flex-1 w-full mt-10 md:min-h-[500px]'>
                    {activeTab === 'created' && (
                        <Created profile={profile} />
                    )}
                    {activeTab === 'saved' && (
                        <Saved profile={profile} />
                    )}
                </div>
            </div>
        </>
    )
}

export default Pins