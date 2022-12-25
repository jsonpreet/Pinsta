import { Interweave } from 'interweave'
import { EmailMatcher } from 'interweave-autolink'
import type { FC, MouseEvent } from 'react';

import { HashtagMatcher } from './matchers/HashtagMatcher'
import { MentionMatcher } from './matchers/MentionMatcher'
import { UrlMatcher } from './matchers/UrlMatcher'
import { MDLinkMatcher } from './matchers/markdown/MDLinkMatcher';
import { MDBoldMatcher } from './matchers/markdown/MDBoldMatcher';
import { MDItalicMatcher } from './matchers/markdown/MDItalicMatcher';
import { MDStrikeMatcher } from './matchers/markdown/MDStrikeMatcher';
import { MDQuoteMatcher } from './matchers/markdown/MDQuoteMatcher';
import { MDCodeMatcher } from './matchers/markdown/MDCodeMatcher';
import trimify from '@utils/functions/trimify'

const InterweaveContent = ({ content }: { content: string }) => {
    const matchers = [
        new MDCodeMatcher('mdCode'),
        new MentionMatcher('mention'),
        new MDLinkMatcher('mdLink'),
        new UrlMatcher('url'),
        new HashtagMatcher('hashtag'),
        new MDBoldMatcher('mdBold'),
        new MDItalicMatcher('mdItalic'),
        new MDStrikeMatcher('mdStrike'),
        new MDQuoteMatcher('mdQuote')
    ]
    return (
        <span className="interweave-content">
            <Interweave
                content={trimify(content)}
                newWindow
                escapeHtml
                allowList={['b', 'i', 'a', 'br', 'code', 'span']}
                onClick={(event: MouseEvent<HTMLDivElement>) => event.stopPropagation()}
                matchers={matchers}
            />
        </span>
    )
}

export default InterweaveContent