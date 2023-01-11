import axios from 'axios'
import type { PublicationMetadataV2Input } from '@utils/lens'
import toast from 'react-hot-toast'

import type { ProfileMetadata } from '../custom-types'
import { PINSTA_API_URL } from '@utils/constants'

const uploadToAr = async (
  data: PublicationMetadataV2Input | ProfileMetadata
): Promise<{ url: string | null }> => {
    try {
        const response = await axios.post(
            `${PINSTA_API_URL}/metadata/upload`,
            data
        )
        const { url } = response.data
        return { url }
    } catch (error) {
        console.log('[Error AR Data Upload]', error)
        toast.error('Failed to upload metadata!')
        return { url: null }
    }
}

export default uploadToAr