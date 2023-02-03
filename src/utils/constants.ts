import { CustomFiltersTypes } from '@utils/lens'

export const APP = {
  ID: 'pinsta',
  Name: 'Pinsta',
  URLName: 'Pinsta.xyz',
  URL: 'https://pinsta.xyz',
  Description: 'Pinsta is a decentralized Image & Video Sharing service, designed to save and collect discovery information using Images, Videos, and Animated Gifs in the form of Pin Boards.',
  Twitter: 'PinstaApp',
  Meta: {
    image: `/meta.png`,
    type: 'website',
  }
}

export const LENS_ENV = process.env.NEXT_PUBLIC_ENVIRONMENT
export const IS_MAINNET = LENS_ENV === 'mainnet'
export const RELAYER_ENABLED = true

export const MIXPANEL_TOKEN = process.env.NEXT_PUBLIC_MIX_PANEL_ID
export const MIXPANEL_API_HOST = '/collect'

export const PINSTA_API_URL = 'https://api.pinsta.xyz'

export const PINSTA_SERVER_URL = IS_MAINNET ? 'https://server.pinsta.xyz' : 'https://testnet-server.pinsta.xyz'

export const NEXT_PUBLIC_EVER_BUCKET_NAME = 'pinsta'
export const EVER_ENDPOINT = 'https://endpoint.4everland.co'
export const EVER_REGION = 'us-west-2'

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

export const API_URL = IS_MAINNET ? MAINNET_API_URL : TESTNET_API_URL

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
export const IMAGE_CDN_URL = 'https://ik.imagekit.io/gzmagoxn0r'

export const SCROLL_ROOT_MARGIN = '40% 0px'

// ipfs
export const IPFS_FREE_UPLOAD_LIMIT = IS_MAINNET ? 1000 : 100
export const IPFS_GATEWAY = 'https://gateway.ipfscdn.io/ipfs/'

// Messages
export const ERROR_MESSAGE = 'Oops, something went wrong!'
export const SIGN_IN_REQUIRED_MESSAGE = 'Sign in required'
export const WRONG_NETWORK = IS_MAINNET
  ? 'Please change network to Polygon mainnet.'
  : 'Please change network to Polygon Mumbai testnet.'
export const SIGN_ERROR = 'Failed to sign data'

// lens
export const LENS_CUSTOM_FILTERS = [CustomFiltersTypes.Gardeners]

// Media
export const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/mpeg', 'video/ogg', 'video/webm', 'video/quicktime'];
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
export const ALLOWED_MEDIA_TYPES = [...ALLOWED_VIDEO_TYPES, ...ALLOWED_IMAGE_TYPES];

export const DEFAULT_COLLECT_TOKEN = '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270'

// Named transforms
export const AVATAR = 'avatar';
export const COVER = 'cover';
export const ATTACHMENT = 'attachment';

// External Apps
export const LENSTER_URL = 'https://lenster.xyz'

export const LENSPROTOCOL_HANDLE = 'lensprotocol';
export const HANDLE_SUFFIX = IS_MAINNET ? '.lens' : '.test';

// Regex
export const URL_REGEX =
  /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[\da-z]+([.\-][\da-z]+)*\.[a-z]{2,63}(:\d{1,5})?(\/.*)?$/;
export const ADDRESS_REGEX = /^(0x)?[\da-f]{40}$/i;
export const HANDLE_REGEX = /^[\da-z]+$/;
export const ALL_HANDLES_REGEX = /([\s+])@(\S+)/g;
export const HANDLE_SANITIZE_REGEX = /[^\d .A-Za-z]/g;