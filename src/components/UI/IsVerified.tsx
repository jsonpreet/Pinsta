import clsx from 'clsx'
import type { FC } from 'react'
import { VERIFIED_CHANNELS } from '@utils/data/verified'
import { BsFillPatchCheckFill } from "react-icons/bs";

type Props = {
  id: string
  size?: 'xs' | 'sm' | 'lg'
  color?: string
}

const IsVerified: FC<Props> = ({ id, size = 'sm', color = 'text-red-500' }) => {
    if (!VERIFIED_CHANNELS.includes(id)) return null
    return (
        <div>
            <BsFillPatchCheckFill
                className={clsx(
                    'ml-0.5',
                    {
                        'w-3 h-3': size === 'xs',
                        'w-4 h-4': size === 'sm',
                        'w-5 h-5': size === 'lg'
                    },
                    color
                    )}
            />
        </div>
    )
}

export default IsVerified