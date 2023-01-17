import { APP } from '../constants'
import type { PinstaPublication } from '../custom-types'
import sanitizeIpfsUrl from './sanitizeIpfsUrl'

const getThumbnailUrl = (pin: PinstaPublication): string => {
  const url =
    pin.metadata?.media[0]?.original.url ||
    pin.metadata?.image ||
    `${APP.URL}/fallbackThumbnail.png`
  return sanitizeIpfsUrl(url)
}

export default getThumbnailUrl