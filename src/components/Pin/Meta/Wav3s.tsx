/* eslint-disable @next/next/no-img-element */
import { PinstaPublication } from '../../../utils/custom-types';
import { FC } from 'react'
import getAttributeFromTrait from '@utils/functions/getAttributeFromTrait'

interface Props {
    pin: PinstaPublication
}

const Wav3sMeta:FC<Props> = ({pin}) => {
    // @ts-ignore
    const createdIn = getAttributeFromTrait(pin?.metadata?.attributes, 'createdIn')
    // @ts-ignore
    const mirrorReward = getAttributeFromTrait(pin?.metadata?.attributes, 'mirrorReward')
    // @ts-ignore
    const mirrorGoal = getAttributeFromTrait(pin?.metadata?.attributes, 'mirrorGoal')
    // @ts-ignore
    const mirrorMinimumFollowers = getAttributeFromTrait(pin?.metadata?.attributes, 'mirrorMinimumFollowers')
    // @ts-ignore
    const currency = getAttributeFromTrait(pin?.metadata?.attributes, 'currency')
    
    // @ts-ignore
    const progress = pin.stats.totalAmountOfMirrors / mirrorGoal * 100
    return (
        <>
            {createdIn && createdIn === 'wav3s' ? (
                <div className="flex flex-row justify-between text-sm bg-gray-100 rounded-xl py-2 px-4 w-full mt-4 mb-1">
                    <div className="flex items-center flex-col">
                        <span className='font-semibold'>Eligibility</span>
                        <span className='flex items-center space-x-2'>
                            <span>{mirrorMinimumFollowers} followers</span>
                        </span>
                    </div>
                    <div className="flex items-center flex-col">
                        <span className='font-semibold'>Progress</span>
                        <span className='flex space-x-2'>
                            <span>{progress.toFixed(2)}</span>
                        </span>
                    </div>
                    <div className="flex items-center flex-col">
                        <span className='font-semibold'>Reward</span>
                        <span className='flex space-x-2'>
                            <span>{mirrorReward}</span>
                            <span>
                                {currency}
                            </span>
                        </span>
                    </div>
                </div>
            )
                : null
            }
        </>
    )
}

export default Wav3sMeta