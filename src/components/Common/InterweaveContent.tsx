import { Interweave } from 'interweave'
import { EmailMatcher, UrlMatcher } from 'interweave-autolink'
import React from 'react'

import { HashtagMatcher } from './matchers/HashtagMatcher'
import { MentionMatcher } from './matchers/MentionMatcher'

const InterweaveContent = ({ content }: { content: string }) => {
    const matchers = [
        new HashtagMatcher('hashtag'),
        new EmailMatcher('email'),
        new MentionMatcher('mention'),
        new UrlMatcher('url', { validateTLD: false })
    ]
    return (
        <span className="interweave-content">
            <Interweave content={content} newWindow escapeHtml matchers={matchers} />
        </span>
    )
}

export default InterweaveContent