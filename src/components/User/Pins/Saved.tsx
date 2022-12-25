import { NoDataFound } from '@components/UI/NoDataFound';
import { Profile  } from '@utils/lens/generated'
import {FC} from 'react'
import { useInView } from 'react-cool-inview';

interface Props {
    profile: Profile
}

const Saved: FC<Props> = ({ profile }) => {

    return <NoDataFound isCenter withImage text="No pins found" />
}

export default Saved