import { CustomFiltersTypes } from '@utils/lens'
import packageJson from '../../package.json';

export const DEFAULT_SEO = {
  title: "Pinsta",
  description: "Pinsta is a decentralized Image & Video Sharing service, designed to save and collect discovery information using Images, Videos, and Animated Gifs in the form of Pin Boards.",
  canonical: "https://pinsta.xyz",
  openGraph: {
    type: 'website',
    locale: 'en_IE',
    url: 'https://pinsta.xyz',
    siteName: 'Pinsta',
    title: "Pinsta",
    description: "Pinsta is a decentralized Image & Video Sharing service, designed to save and collect discovery information using Images, Videos, and Animated Gifs in the form of Pin Boards.",
    images: [
      {
        url: 'https://pinsta.xyz/meta.png',
        width: 1200,
        height: 630,
        alt: 'Pinsta',
      },
    ],
  },
  twitter: {
    handle: '@PinstaApp',
    site: '@PinstaApp',
    cardType: 'summary_large_image',
    title: "Pinsta",
    description: "Pinsta is a decentralized Image & Video Sharing service, designed to save and collect discovery information using Images, Videos, and Animated Gifs in the form of Pin Boards.",
    images: [
      {
        url: 'https://pinsta.xyz/meta.png',
        width: 1200,
        height: 630,
        alt: 'Pinsta',
      },
    ],
  },
};

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
  },
  Version: packageJson.version
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

// XMTP
export const XMTP_ENV = IS_MAINNET ? 'production' : 'dev';
export const XMTP_PREFIX = 'lens.dev/dm';

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
export const IMAGE_CDN_URL = 'https://ik.imagekit.io/lens/media-snapshot'

// Named transforms for ImageKit
export const AVATAR = 'tr:w-300,h-300'
export const EXPANDED_AVATAR = 'tr:w-1000,h-1000'
export const COVER = 'tr:w-1500,h-500'
export const SQUARE = 'tr:w-600,h-600,c-at_max'
export const THUMBNAIL = 'tr:w-450'
export const THUMBNAIL_SM = 'tr:w-300'
export const THUMBNAIL_LG = 'tr:w-600'

export const SCROLL_ROOT_MARGIN = '40% 0px'

// ipfs
export const IPFS_FREE_UPLOAD_LIMIT = IS_MAINNET ? 1000 : 100
export const IPFS_GATEWAY = 'https://lens.infura-ipfs.io/ipfs/' //'https://gateway.ipfscdn.io/ipfs/'

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
export const GIPHY_TOKEN = 'mztAE0vdQdlfCYsM11E6UaPjUmjpYDHV'
export const LIVEPEER_STUDIO_API_KEY = 'c2bb473c-47af-46be-b991-08648b229b1e'

export const MESSAGE_PAGE_LIMIT = 15;
export const SCROLL_THRESHOLD = 0.5;
export const MIN_WIDTH_DESKTOP = 1024;

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

// App Ids
export const LENSTUBE_APP_ID = 'lenstube'
export const LENSTUBE_BYTES_APP_ID = 'lenstube-bytes'
export const ALLOWED_APP_IDS = ['orb', 'lenstube-bytes']
export const ADMIN_IDS = IS_MAINNET ? ['0x016efc'] : ['0x57a4']

const RESTRICTED_SYMBOLS = '☑️✓✔✅';

export const Regex = {
  url: /(http|https):\/\/([\w+.?])+([\w!#$%&'()*+,./:;=?@\\^~\-]*)?/g,
  mention: /(@[a-z\d-_.]{1,31})/g,
  hashtag: /(#\w*[A-Za-z]\w*)/g,
  ethereumAddress: /^(0x)?[\da-f]{40}$/i,
  handle: /^[\da-z]+$/g,
  allHandles: /([\s+])@(\S+)/g,
  santiizeHandle: /[^\d .A-Za-z]/g,
  profileNameValidator: new RegExp('^[^' + RESTRICTED_SYMBOLS + ']+$'),
  profileNameFilter: new RegExp('[' + RESTRICTED_SYMBOLS + ']', 'gu'),
  gm: /\bgm\b/i
};

export const ENS_RESOLVER_WORKER_URL = IS_MAINNET
  ? 'https://ens-resolver.lenster.xyz'
  : 'http://localhost:8052';