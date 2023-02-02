import { COVER } from '@utils/constants';
import type { FC } from 'react';
import sanitizeIpfsUrl from '@utils/functions/sanitizeIpfsUrl';
import imageCdn from '@utils/functions/imageCdn';
import { Profile } from '@utils/lens/generated';
import {LeftMetaDetails, RightMetaDetails} from './MetaDetails';

interface Props {
    cover: string;
    profile: Profile;
}

const Cover: FC<Props> = ({ cover, profile }) => {
    return (
        <>
            <div className='relative flex flex-col max-w-7xl w-full rounded-xl h-36 sm:h-96'>
                <div
                    className="h-36 w-full border border-gray-100 dark:border-gray-700 rounded-xl sm:h-96"
                    style={{
                        backgroundImage: `url(${
                            cover ? imageCdn(sanitizeIpfsUrl(cover), COVER) : `/patterns/9.png`
                        })`,
                        backgroundColor: '#8b5cf6',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center center',
                        backgroundRepeat: cover ? 'no-repeat' : 'repeat'
                    }}
                />
                <div className='absolute md:block hidden bottom-0 left-0'>
                    <LeftMetaDetails profile={profile} />
                </div>
                <div className='absolute md:block hidden bottom-0 right-0'>
                    <RightMetaDetails profile={profile} />
                </div>
            </div>
        </>
    );
};

export default Cover;