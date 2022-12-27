import { FC } from 'react'

const BetaNotification: FC = () => {
    return (
        <div className='mt-2 flex items-center justify-center'>
            <div className="border text-center border-blue-400 rounded-xl bg-blue-100 px-4 py-3 text-blue-700">
                <p><span className='font-bold'>NOTE:</span> This is a alpha version of the site. Please report any bugs or issues you find.</p>
            </div>
        </div>
    )
}

export default BetaNotification