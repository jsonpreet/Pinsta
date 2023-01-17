import type { Profile } from '@utils/lens'

const getCoverPicture = (profile: Profile): string => {
  return profile.coverPicture && profile.coverPicture.__typename === 'MediaSet'
    ? profile?.coverPicture?.original?.url
    : `/patterns/9.png`
}

export default getCoverPicture