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
    UPDATE_CHANNEL_INFO: 'Clicked Channel Info',
    CHANGE_CHANNEL_COVER: 'Clicked Channel Cover',
    UPLOADED_BYTE_VIDEO: 'Uploaded Byte Video',
    UPLOADED_TO_IPFS: 'Uploaded to IPFS',
    UPLOADED_TO_ARWEAVE: 'Uploaded to Arweave',
    UPDATED_CHANNEL_INFO: 'Updated Channel Info',
    DEPOSIT_MATIC: 'Deposit Matic',
    FILTER_CATEGORIES: 'Filter Categories',
    PROFILE_INTERESTS: {
        ADD: 'Add Profile Interest',
        REMOVE: 'Remove Profile Interest',
        VIEW: 'View Profile Interests'
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
    },
    COLLECT: {
        OPEN: 'Open Collect',
        FREE: 'Collected for Free',
        FEE: 'Collected for Fee'
    },
    SEARCH_PROFILES: 'Search Profiles',
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
    REPORT: 'Report Publication',
    PAGE_VIEW: {
        HOME: 'Home Page',
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
        NOTIFICATIONS: 'Notifications Page'
    }
}