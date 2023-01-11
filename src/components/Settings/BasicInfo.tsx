import { Profile } from '@utils/lens/generated'
import { FC } from 'react'

interface Props {
  profile: Profile
}

const BasicInfo:FC<Props> = ({ profile }) => {
  return (
    <>BasicInfo</>
  )
}

export default BasicInfo