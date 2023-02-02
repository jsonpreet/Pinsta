import type { Profile } from '@utils/lens'

import { getRandomProfilePicture } from './getRandomProfilePicture'
import imageCdn from './imageCdn'
import sanitizeIpfsUrl from './sanitizeIpfsUrl'

const getProfilePicture = (
  profile: Profile,
  type: 'avatar_sm' | 'avatar' | 'avatar_lg' | 'thumbnail' = 'avatar_sm'
): string => {
  const url =
    profile.picture && profile.picture.__typename === 'MediaSet'
      ? imageCdn(sanitizeIpfsUrl(profile?.picture?.original?.url), type)
      : profile.picture?.__typename === 'NftImage'
      ? imageCdn(sanitizeIpfsUrl(profile?.picture?.uri), type)
      : getRandomProfilePicture(profile?.handle)
  const sanitized = imageCdn(sanitizeIpfsUrl(url), type)
  return url
}

export default getProfilePicture