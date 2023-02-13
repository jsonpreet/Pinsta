import type { FC } from 'react';

import { Loader } from './Loader';

const InfiniteLoader: FC = () => {
    return (
        <span className="flex justify-center p-5">
            <Loader size="sm" />
        </span>
    );
};

export default InfiniteLoader;