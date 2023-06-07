import { IMAGE_CDN_URL, IPFS_GATEWAY } from '../constants'

const imageCdn = ( url: string, name?: string ): string => {
    if (!url) {
        return '';
    }

    if (url.includes(IMAGE_CDN_URL)) {
        const splitedUrl = url.split('/');
        const path = splitedUrl[splitedUrl.length - 1];

        return name ? `${IMAGE_CDN_URL}/${name}/${path}` : url;
    }

    

    return url;
}

export default imageCdn