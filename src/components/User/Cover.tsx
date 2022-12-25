import { COVER } from '@utils/constants';
import type { FC } from 'react';
import sanitizeIpfsUrl from '@utils/functions/sanitizeIpfsUrl';
import imageCdn from '@utils/functions/imageCdn';

interface Props {
  cover: string;
}

const Cover: FC<Props> = ({ cover }) => {
    return (
        <div
            className="h-52 flex max-w-7xl w-full rounded-xl sm:h-80"
            style={{
                backgroundImage: `url(${
                    cover ? imageCdn(sanitizeIpfsUrl(cover), COVER) : `/patterns/9.png`
                })`,
                backgroundColor: '#8b5cf6',
                backgroundSize: cover ? 'cover' : '30%',
                backgroundPosition: 'center center',
                backgroundRepeat: cover ? 'no-repeat' : 'repeat'
            }}
        />
    );
};

export default Cover;