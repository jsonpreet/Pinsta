import axios from 'axios'
import toast from 'react-hot-toast'

import { PINSTA_API_URL } from '@utils/constants'

type Wav3sMirrorData = {
    appId: string,
    pubIdPointed: string,
    profileId: string,
}

const wav3sMirror = async (data: Wav3sMirrorData) => {
    try {
        const response = await axios.post(
            `${PINSTA_API_URL}/wav3s/mirror`,
            data
        )
        const res = response.data
        return res
    } catch (error) {
        console.log('[Error update Mirror on Wav3s]', error)
        toast.error('Failed to update Mirror on Wav3s!')
    }
}

export default wav3sMirror