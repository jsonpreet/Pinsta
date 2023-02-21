import type { ThemeConfig } from '@livepeer/react'
import { createReactClient, studioProvider } from '@livepeer/react'
import { LIVEPEER_STUDIO_API_KEY } from '@utils/constants'

export const getLivepeerClient = () => {
    return createReactClient({
        provider: studioProvider({
            apiKey: LIVEPEER_STUDIO_API_KEY
        })
    })
}

export const videoPlayerTheme: ThemeConfig = {
    colors: {
        accent: '#fff',
        progressLeft: '#ec4899',
        loading: '#ec4899'
    },
    fonts: {
        display: 'Matter'
    },
    fontSizes: {
        timeFontSize: '12px'
    },
    space: {
        timeMarginX: '22px',
        controlsBottomMarginX: '10px',
        controlsBottomMarginY: '10px'
    },
    sizes: {
        iconButtonSize: '35px',
        loading: '30px',
        thumb: '7px',
        thumbActive: '7px',
        trackActive: '3px',
        trackInactive: '3px'
    },
    radii: {
        containerBorderRadius: '0px'
    }
}