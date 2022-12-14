import Head from 'next/head'
import { useRouter } from 'next/router'
import type { FC } from 'react'
import React from 'react'
import { APP } from '@utils/constants'

type Props = {
  title?: string
  description?: string
  image?: string
}

const MetaTags: FC<Props> = (props) => {
    const { description, title, image } = props
    const router = useRouter()

    const meta = {
        title: title ?? APP.Name,
        description: description ?? APP.Description,
        image: image ?? `${APP.URL}${APP.Meta.image}`,
        type: 'website'
    }

    return (
        <Head>
            <title>{meta.title}</title>
            <meta name="robots" content="follow, index" />
            <meta content={meta.description} name="description" />
            <meta
                name="viewport"
                content="width=device-width, initial-scale=1, maximum-scale=5"
            />
            <link rel="canonical" href={`${APP.URL}${router.asPath}`} />
            <meta
                property="og:url"
                content={`${APP.URL}${router.asPath}`}
            />
            <meta property="og:type" content={meta.type} />
            <meta property="og:site_name" content={`${APP.Name}`} />
            <meta property="og:description" content={meta.description} />
            <meta property="og:title" content={meta.title} />
            <meta property="og:image" content={meta.image} />
            <meta property="og:image:width" content="400" />
            <meta property="og:image:height" content="400" />
            <meta name="twitter:card" content="summary" />
            <meta property="twitter:image:width" content="400" />
            <meta property="twitter:image:height" content="400" />
            <meta name="twitter:site" content={`${APP.Name}`} />
            <meta name="twitter:title" content={meta.title} />
            <meta name="twitter:description" content={meta.description} />
            <meta property="twitter:image:src" content={meta.image} />
            <meta property="twitter:creator" content={APP.Twitter} />
        </Head>
    )
}

export default MetaTags