import { CustomFiltersTypes } from '@utils/lens'

export const APP = {
  Name: 'Pinsta',
  URL: 'https://testnet.pinsta.xyz',
  Description: 'Pinsta is a decentralized Image & Video Sharing service, designed to save and collect discovery information using Images, Videos, and Animated Gifs in the form of Pin Boards.',
  Twitter: 'PinstaApp',
  PublicKeyBase58Check: 'BC1YLiHYuaqQc1r5UFvJ3G8eMYawk693wVGiTHmBQtr9DK8NQXt14oJ',
  Meta: {
    image: `/meta.png`,
    type: 'website',
  }
}

export const LENS_ENV = process.env.NEXT_PUBLIC_ENVIRONMENT
export const IS_MAINNET = LENS_ENV === 'mainnet'
export const RELAYER_ENABLED = true

// lens
export const MAINNET_API_URL = 'https://api.lens.dev'
export const TESTNET_API_URL = 'https://api-mumbai.lens.dev'
export const STAGING_MAINNET_API_URL =
  'https://staging-api-social-polygon.lens.crtlkey.com'
export const STAGING_TESTNET_API_URL =
  'https://staging-api-social-mumbai.lens.crtlkey.com'
export const STAGING_API_URL = IS_MAINNET
  ? STAGING_MAINNET_API_URL
  : STAGING_TESTNET_API_URL

//export const API_URL = IS_MAINNET ? MAINNET_API_URL : TESTNET_API_URL
export const API_URL = MAINNET_API_URL
export const LENSHUB_PROXY_ADDRESS = IS_MAINNET
  ? '0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d'
  : '0x60Ae865ee4C725cd04353b5AAb364553f56ceF82'
export const LENS_PERIPHERY_ADDRESS = IS_MAINNET
  ? '0xeff187b4190E551FC25a7fA4dFC6cf7fDeF7194f'
  : '0xD5037d72877808cdE7F669563e9389930AF404E8'
export const WMATIC_TOKEN_ADDRESS = IS_MAINNET
  ? '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270'
  : '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889'
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

// polygon
export const POLYGON_RPC_URL = IS_MAINNET
  ? 'https://rpc.ankr.com/polygon'
  : 'https://rpc.ankr.com/polygon_mumbai'

export const POLYGONSCAN_URL = IS_MAINNET
  ? 'https://polygonscan.com'
  : 'https://mumbai.polygonscan.com'
export const POLYGON_CHAIN_ID = IS_MAINNET ? 137 : 80001

// cdn
export const IMAGE_CDN_URL = 'https://img.lenstube.xyz'
export const VIDEO_CDN_URL = 'https://cdn.livepeer.com'

export const SCROLL_ROOT_MARGIN = '1000px 0px'

// ipfs
export const IPFS_FREE_UPLOAD_LIMIT = IS_MAINNET ? 1000 : 100
export const IPFS_GATEWAY = 'https://lens.infura-ipfs.io/ipfs/'

// livepeer
export const LIVEPEER_API_KEY = process.env.LIVEPEER_API_KEY as string

// error messages
export const ERROR_MESSAGE = 'Oops, something went wrong!'
export const SIGN_IN_REQUIRED_MESSAGE = 'Sign in required'

// lens
export const LENS_CUSTOM_FILTERS = [CustomFiltersTypes.Gardeners]
export const ALLOWED_VIDEO_TYPES = [
  'video/mp4',
  'video/mpeg',
  'video/ogg',
  'video/webm',
  'video/quicktime',
  'video/mov'
]
export const ALLOWED_PLAYBACK_VIDEO_TYPES = [
  'video/mp4',
  'video/quicktime',
  'video/mov',
  'video/webm'
]