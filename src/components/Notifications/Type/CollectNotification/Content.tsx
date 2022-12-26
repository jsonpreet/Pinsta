import InterweaveContent from '@components/Common/InterweaveContent';
import type { NewCollectNotification } from '@utils/lens';
import Link from 'next/link';
import type { FC } from 'react';

interface Props {
    notification: NewCollectNotification;
}

const CollectedContent: FC<Props> = ({ notification }) => {
    return (
        <Link
            href={`/posts/${notification?.collectedPublication?.id}`}
            className="linkify lt-text-gray-500 line-clamp-2 mt-2"
        >
            <InterweaveContent content={notification?.collectedPublication?.metadata?.content} />
        </Link>
    );
};

export default CollectedContent;