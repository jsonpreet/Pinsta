import Alert from '@components/Shared/Alert'
import CommentsShimmer from '@components/Shimmers/CommentsShimmer'
import { Loader } from '@components/Shared/Loader'
import { NoDataFound } from '@components/Shared/NoDataFound'
import { PublicationMainFocus, useProfileCommentsQuery } from '@utils/lens'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import type { FC } from 'react'
import React from 'react'
import { useInView } from 'react-cool-inview'
import type { PinstaPublication } from '@utils/custom-types'
import { LENS_CUSTOM_FILTERS, SCROLL_ROOT_MARGIN } from '@utils/constants'

// import NewComment from './NewComment'
import QueuedComment from './QueuedComment'
import usePersistStore from '@lib/store/persist'
import useAppStore from '@lib/store'

const Comment = dynamic(() => import('./Comment'))
import { HiOutlineChatAlt2 } from 'react-icons/hi';

type Props = {
    pin: PinstaPublication
}

const Comments: FC<Props> = ({ pin }) => {
    const { query: { id } } = useRouter()
    const currentProfileId = usePersistStore((state) => state.currentProfileId)
    const queuedComments = usePersistStore((state) => state.queuedComments)
    const currentProfile = useAppStore((state) => state.currentProfile)

    const isFollowerOnlyReferenceModule = pin?.referenceModule?.__typename === 'FollowOnlyReferenceModuleSettings'

    const request = {
        limit: 5,
        customFilters: LENS_CUSTOM_FILTERS,
        commentsOf: id,
        metadata: {
        mainContentFocus: [
            PublicationMainFocus.Video,
            PublicationMainFocus.Article,
            PublicationMainFocus.Embed,
            PublicationMainFocus.Link,
            PublicationMainFocus.TextOnly
        ]
        }
    }
    const variables = {
        request,
        reactionRequest: currentProfile
        ? { profileId: currentProfile?.id }
        : null,
        channelId: currentProfile?.id ?? null
    }

    const { data, loading, error, fetchMore } = useProfileCommentsQuery({
        variables,
        skip: !id
    })

    const comments = data?.publications?.items as PinstaPublication[]
    const pageInfo = data?.publications?.pageInfo

    const { observe } = useInView({
        rootMargin: SCROLL_ROOT_MARGIN,
        onEnter: async () => {
            await fetchMore({
                variables: {
                    ...variables,
                    request: {
                        ...request,
                        cursor: pageInfo?.next
                    }
                }
            })
        }
    })

    if (loading) return <CommentsShimmer />

    return (
        <div className="pb-4">
            <div className="flex items-center justify-between">
                <h1 className="flex items-center my-4 space-x-2 text-lg">
                    <HiOutlineChatAlt2 className="w-4 h-4" />
                    <span className="font-semibold">Comments</span>
                    {data?.publications?.pageInfo.totalCount ? (
                        <span className="text-sm">
                        ({data?.publications?.pageInfo.totalCount})
                        </span>
                    ) : null}
                </h1>
                {/* {!currentProfileId && (
                    <span className="text-xs">(Sign in required to comment)</span>
                )} */}
            </div>
            {data?.publications?.items.length === 0 && (
                <NoDataFound text="Be the first to comment." />
            )}
            {pin?.canComment.result ? (
                null // <NewComment pin={pin} />
            ) : currentProfileId ? (
                <Alert variant="warning">
                    <span className="text-sm">
                        {isFollowerOnlyReferenceModule
                        ? 'Only followers can comment on this publication'
                        : `Only followers within ${pin.profile.handle}'s preferred network can comment`}
                    </span>
                </Alert>
            ) : null}
            {!error && !loading && (
                <>
                    <div className="pt-5 space-y-4">
                        {queuedComments?.map(
                            (queuedComment) =>
                            queuedComment?.pubId === pin?.id && (
                                <QueuedComment
                                    key={queuedComment?.pubId}
                                    queuedComment={queuedComment}
                                />
                            )
                        )}
                        {comments?.map((comment: PinstaPublication) => (
                            <Comment
                                key={`${comment?.id}_${comment.createdAt}`}
                                comment={comment}
                            />
                        ))}
                    </div>
                    {pageInfo?.next && comments.length !== pageInfo?.totalCount && (
                        <span ref={observe} className="flex justify-center p-10">
                            <Loader />
                        </span>
                    )}
                </>
            )}
        </div>
    )
}

export default Comments