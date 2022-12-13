import type { Profile } from '@utils/lens'

import { getRandomProfilePicture } from './getRandomProfilePicture'
import sanitizeIpfsUrl from './sanitizeIpfsUrl'

const getProfilePicture = (
  channel: Profile,
  type: 'avatar' | 'avatar_lg' | 'thumbnail' = 'avatar'
): string => {
  const url =
    channel.picture && channel.picture.__typename === 'MediaSet'
      ? channel?.picture?.original?.url
      : channel.picture?.__typename === 'NftImage'
      ? channel?.picture?.uri
      : getRandomProfilePicture(channel?.handle)
  const sanitized = sanitizeIpfsUrl(url)
  return sanitized
}

export default getProfilePicture