/* eslint-disable @next/next/no-img-element */

import { formatNumber } from '@utils/functions/formatNumber';
import getTokenImage from '@utils/functions/getTokenImage';
import type { NewCollectNotification } from '@utils/lens';
import type { FC } from 'react';
import { HiOutlineCurrencyDollar } from 'react-icons/hi2';

interface Props {
    notification: NewCollectNotification;
}

const CollectedAmount: FC<Props> = ({ notification }) => {
    const collectModule: any = notification?.collectedPublication?.collectModule;

    return (
        <div className="flex items-center mt-2 space-x-1">
            <HiOutlineCurrencyDollar className="text-green-500 h-[15px]" />
            {!collectModule || collectModule.__typename === 'FreeCollectModuleSettings' ? (
                <div className="text-[12px]">Collected for free</div>
            ) : (
                <>
                    <div className="text-[12px]">
                        Collected for {formatNumber(collectModule?.amount?.value)} {collectModule?.amount?.asset?.symbol}
                    </div>
                    <img
                        className="w-5 h-5"
                        height={20}
                        width={20}
                        src={getTokenImage(collectModule?.amount?.asset?.symbol)}
                        alt={collectModule?.amount?.asset?.symbol}
                    />
                </>
            )}
        </div>
    );
};

export default CollectedAmount;