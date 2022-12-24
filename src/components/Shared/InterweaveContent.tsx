import { Interweave } from 'interweave'
import { EmailMatcher } from 'interweave-autolink'
import type { FC, MouseEvent } from 'react';

import { HashtagMatcher } from '../Common/matchers/HashtagMatcher'
import { MentionMatcher } from '../Common/matchers/MentionMatcher'
import { UrlMatcher } from '../Common/matchers/UrlMatcher'
import { MDLinkMatcher } from '../Common/matchers/markdown/MDLinkMatcher';
import { MDBoldMatcher } from '../Common/matchers/markdown/MDBoldMatcher';
import { MDItalicMatcher } from '../Common/matchers/markdown/MDItalicMatcher';
import { MDStrikeMatcher } from '../Common/matchers/markdown/MDStrikeMatcher';
import { MDQuoteMatcher } from '../Common/matchers/markdown/MDQuoteMatcher';
import { MDCodeMatcher } from '../Common/matchers/markdown/MDCodeMatcher';
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