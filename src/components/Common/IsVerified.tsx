import clsx from 'clsx'
import type { FC } from 'react'
import { VERIFIED_CHANNELS } from '@data/verified'
import { BsFillPatchCheckFill } from "react-icons/bs";

type Props = {
  id: string
  size?: 'xs' | 'sm' | 'lg'
  color?: string
}

const IsVerified: FC<Props> = ({ id, size = 'sm', color }) => {
    if (!VERIFIED_CHANNELS.includes(id)) return null
    return (
        <div>
            <BsFillPatchCheckFill
                className={clsx(
                'ml-0.5',
                {
                    'w-2.5 h-2.5': size === 'xs',
                    'w-3 h-3': size === 'sm',
                    'w-4 h-4': size === 'lg'
                },
                color
                )}
            />
        </div>
    )
}

export default IsVerified