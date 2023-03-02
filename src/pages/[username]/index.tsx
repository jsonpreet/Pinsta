import Profile from '@components/Profile'
import formatHandle from '@utils/functions/formatHandle'
import getApolloClient from '@utils/functions/getApolloClient'
import { Profile as PinstaProfile, ProfileDocument } from '@utils/lens/generated'
import { GetServerSideProps } from 'next'

export default Profile

const apolloClient = getApolloClient()

interface Props {
    profile: PinstaProfile
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
    const username = context.query.username as string
    const handle = formatHandle(username as string, true);
    context.res.setHeader('Cache-Control', 'public, s-maxage=86400')
    const { data, error } = await apolloClient.query({
        query: ProfileDocument,
        variables: {
            request: { handle }
        }
    })
    if (!data.profile || error) {
        return { notFound: true }
    }
    return {
        props: { profile: data.profile }
    }
}