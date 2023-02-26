import type { Dict } from 'mixpanel-browser'
import mixpanel from 'mixpanel-browser'
import { IS_MAINNET, MIXPANEL_TOKEN } from '@utils/constants'

export const Analytics = {
    track: (eventName: string, payload?: Dict) => {
        if (MIXPANEL_TOKEN && IS_MAINNET) {
            mixpanel.track(eventName, payload)
        }
    }
}

export const TRACK = {
    DISPATCHER_ENABLED: 'Dispatcher Enabled',
    GET_VERIFIED: 'Get Verified',
    CLICK_CHANNEL_SETTINGS: 'Clicked Channel Settings',
    CLICK_MESSAGE_ATTACHMENT: 'Clicked Message Attachment',
    UPDATE_CHANNEL_INFO: 'Clicked Channel Info',
    CHANGE_CHANNEL_COVER: 'Clicked Channel Cover',
    UPLOADED_BYTE_VIDEO: 'Uploaded Byte Video',
    UPLOADED_TO_IPFS: 'Uploaded to IPFS',
    UPLOADED_TO_ARWEAVE: 'Uploaded to Arweave',
    UPDATED_CHANNEL_INFO: 'Updated Channel Info',
    DEPOSIT_MATIC: 'Deposit Matic',
    FILTER_CATEGORIES: 'Filter Categories',
    AUTH: {
        CLICK_CONNECT_WALLET: 'Clicked Connect Wallet',
        CLICK_SIGN_IN: 'Clicked Sign In',
        SIGN_IN_SUCCESS: 'Successful Sign In',
        SIGN_IN_FAILED: 'Failed Sign In',
        CLICK_SIGN_OUT: 'Clicked Sign Out'
    },
    PROFILE_INTERESTS: {
        ADD: 'Add Profile Interest',
        REMOVE: 'Remove Profile Interest',
        VIEW: 'View Profile Interests'
    },
    POST: {
        NEW: 'New Post',
    },
    NEW_COMMENT: 'New Comment',
    CLICK_VIEW_METADATA: 'Click View Metadata',
    CLICK_VIEW_TOKEN: 'Click View Token',
    CLICK_VIDEO_OPTIONS: 'Click Video Options',
    NOTIFICATIONS: {
        CLICK_NOTIFICATIONS: 'Click Notifications',
        CLICK_MENTIONS: 'Click Mention Notifications',
        CLICK_ALL: 'Click All Notifications',
        CLICK_LIKES: 'Click Likes Notifications',
        CLICK_COMMENTS: 'Click Comment Notifications',
        CLICK_SUBSCRIPTIONS: 'Click Subscribe Notifications'
    },
    CLICK_USER_MENU: 'Click User Menu',
    CLICK_HELP_MENU: {
        OPEN: 'Open Help Menu',
        TWITTER: 'Click Twitter',
        LENSTER: 'Click Lenster',
        DISCORD: 'Click Discord',
        FEEDBACK: 'Click Feedback',
        GITHUB: 'Click Github',
    },
    COLLECT: {
        OPEN: 'Open Collect',
        FREE: 'Collected for Free',
        FEE: 'Collected for Fee',
        COLLECTED: 'Collected',
    },
    COLLECT_MODULE: {
        OPEN: 'Open Collect Module Settings',
        CLOSE: 'Close Collect Module Settings',
        TOGGLE: 'Toggle Collect Module',
        TOGGLE_CHARGE_FOR_COLLECT: 'Toggle Charge for Collect',
        TOGGLE_LIMITED_EDITION_COLLECT: 'Toggle Limited Edition Collect',
        TOGGLE_TIME_LIMIT_COLLECT: 'Toggle Time Limit Collect',
        TOGGLE_FOLLOWERS_ONLY_COLLECT: 'Toggle Followers Only Collect',
    },
    SEARCH_PROFILES: 'Search Profiles',
    SEARCH_BOARDS: 'Search Boards',
    SYSTEM: {
        THEME: {
            DARK: 'Seleted Dark Theme',
            LIGHT: 'Seleted Light Theme'
        },
        MORE_MENU: {
            OPEN: 'Open More Menu',
            GITHUB: 'Click Github',
            DISCORD: 'Click Discord',
            ROADMAP: 'Click Roadmap',
            STATUS: 'Click Status',
            TWITTER: 'Click Twitter'
        }
    },
    PIN: {
        CLICK_PIN: 'Click Pin',
        CLICK_PIN_OPTIONS: 'Click Pin Options',
        CLICK_PIN_SAVE: 'Click Pin Save',
        CLICK_PIN_UNSAVE: 'Click Pin Unsave',
        CLICK_PIN_DELETE: 'Click Pin Delete',
        CLICK_PIN_EDIT: 'Click Pin Edit',
        CLICK_PIN_COPY_LINK: 'Click Pin Copy Link',
        CLICK_PIN_REPORT: 'Click Pin Report',
        CLICK_PIN_SHARE: 'Click Pin Share',
        CLICK_PIN_SAVE_TO_BOARD: 'Click Pin Save to Board',
        CLICK_PIN_SAVE_TO_PROFILE: 'Click Pin Save to Profile',
        CLICK_VIEW_ORIGINAL: 'Click View Original',
        UNSAVE_PIN: 'Unsave Pin',
        SAVE_PIN: 'Save Pin',
        ERROR: {
            SAVE: 'Error Saving Pin',
            UNSAVE: 'Error Unsaving Pin',
        },
        SHARE: {
            OPEN: 'Open Share Pin Modal',
            FACEBOOK: 'Share Pin to Facebook',
            TWITTER: 'Share Pin to Twitter',
            LINKEDIN: 'Share Pin to LinkedIn',
            REDDIT: 'Share Pin to Reddit',
            EMAIL: 'Share Pin to Email',
            COPY_LINK: 'Copy Pin Link',
            COPY_EMBED: 'Copy Pin Embed',
            DOWNLOAD: 'Download Pin',
            WHATSAPP: 'Share Pin to Whatsapp',
        }
    },
    BOARD: {
        SEARCH: 'Search Boards',
        CLICK_BOARD: 'Click Board',
        CLICK_BOARD_OPTIONS: 'Click Board Options',
        CLICK_BOARD_FOLLOW: 'Click Board Follow',
        CLICK_BOARD_UNFOLLOW: 'Click Board Unfollow',
        CREATE_BOARD: 'Create Board',
        MODAL: {
            OPEN: 'Open Board Modal',
            CLOSE: 'Close Board Modal',  
        },
        ERROR: {
            SEARCH: 'Error Searching Boards',
        }
    },
    REPORT: 'Report Publication',
    PAGE_VIEW: {
        HOME: 'Home Page',
        FEED: 'Feed Page',
        LATEST: 'Latest Page',
        EXPLORE: 'Explore Page',
        PROFILE: 'Profile Page',
        BOARD: 'Board Page',
        CREATE_BOARD: 'Create Board Modal',
        EDIT_BOARD: 'Edit Board Modal',
        SAVEDPIN: 'Profile Saved Pins',
        ALLPIN: 'Profile All Pins',
        EXPLORE_TRENDING: 'Trending Page',
        EXPLORE_INTERESTING: 'Interesting Page',
        EXPLORE_POPULAR: 'Popular Page',
        EXPLORE_RECENT: 'Recents Page',
        EXPLORE_CURATED: 'Curated Page',
        THANKS: 'Thanks Page',
        SETTINGS: 'Settings Page',
        PIN: 'Pin Page',
        NOTIFICATIONS: 'Notifications Page',
        UPLOAD: {
            DROPZONE: 'DropZone Page',
            STEPS: 'Upload Steps Page'
        },
    }
}