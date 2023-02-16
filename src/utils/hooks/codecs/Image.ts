import { ContentTypeId, EncodedContent } from "@xmtp/xmtp-js"

export const ContentTypeImageKey = new ContentTypeId({
    authorityId: "xmtp.org",
    typeId: "media-image-url",
    versionMajor: 1,
    versionMinor: 0,
})

export class ImageCodec {
    get contentType() {
        return ContentTypeImageKey
    }

    encode(content: string): EncodedContent {
        return {
            type: ContentTypeImageKey,
            parameters: {},
            content: new TextEncoder().encode(content),
        }
    }

    decode(content: EncodedContent): string {
        // console.log(content.content.toString())
        const uint8Array = content.content
        const key = new TextDecoder().decode(uint8Array)
        return key
    }
}