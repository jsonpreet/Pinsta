import Pin from '@components/Pin'
import { PinstaPublication } from '@utils/custom-types'
import getApolloClient from '@utils/functions/getApolloClient'
import { PublicationDetailsDocument } from '@utils/lens/generated'
import { GetServerSideProps } from 'next'

export default Pin

const apolloClient = getApolloClient()

interface Props {
    pin: PinstaPublication
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
    const publicationId = context.query.id as string
    // const splitted = publicationId.split('-')
    // if (splitted.length !== 2) {
    //     return { notFound: true }
    // }
    // context.res.setHeader('Cache-Control', 'public, s-maxage=86400')
    const { data, error } = await apolloClient.query({
        query: PublicationDetailsDocument,
        variables: {
            request: { publicationId }
        }
    })
    if (!data.publication || error) {
        return { notFound: true }
    }
    return {
        props: { pin: data.publication, error: false, loading: false }
    }
}