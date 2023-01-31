import React from 'react'

import CommentItemShimmer from './CommentItemShimmer'

const CommentsShimmer = () => {
    return (
        <div className='w-full' >
            <CommentItemShimmer />
            <CommentItemShimmer />
            <CommentItemShimmer />
        </div>
    )
}

export default CommentsShimmer