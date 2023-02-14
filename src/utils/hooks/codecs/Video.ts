import { ContentTypeId, EncodedContent } from "@xmtp/xmtp-js"

export const ContentTypeVideoKey = new ContentTypeId({
    authorityId: "xmtp.org",
    typeId: "media-video-url",
    versionMajor: 1,
    versionMinor: 0,
})

export class VideoCodec {
    get contentType() {
        return ContentTypeVideoKey
    }

    encode(content: string): EncodedContent {
        return {
            type: ContentTypeVideoKey,
            parameters: {},
            content: new TextEncoder().encode(content),
        }
    }

    decode(content: EncodedContent) : string {
        // console.log(content.content.toString())
        const uint8Array = content.content
        const key = new TextDecoder().decode(uint8Array)
        return key
    }
}