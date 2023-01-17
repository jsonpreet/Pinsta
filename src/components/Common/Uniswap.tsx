import type { PinstaCollectModule, PinstaFollowModule } from '@utils/custom-types';
import getUniswapURL from '@utils/functions/getUniswapURL';
import type { FC } from 'react';

interface Props {
  module: PinstaCollectModule | PinstaFollowModule;
}

const Uniswap: FC<Props> = ({ module }) => {
    return (
        <div className="space-y-1">
            <div className="text-sm">
                You don't have enough <b>{module?.amount?.asset?.symbol}</b>
            </div>
            <a
                href={getUniswapURL(parseFloat(module?.amount?.value), module?.amount?.asset?.address)}
                className="flex items-center space-x-1.5 text-xs font-bold text-pink-500"
                target="_blank"
                rel="noreferrer noopener"
            >
                <img
                    src={`/brands/uniswap.png`}
                    className="w-5 h-5"
                    height={20}
                    width={20}
                    alt="Uniswap"
                />
                <div>Swap in Uniswap</div>
            </a>
        </div>
    );
};

export default Uniswap;