import Head from 'next/head'
import { useRouter } from 'next/router'
import type { FC } from 'react'
import React from 'react'
import { APP } from '@utils/constants'
import { NextSeo } from 'next-seo'

type Props = {
  title?: string
  description?: string | null
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
        <NextSeo
            title={meta.title}
            description={meta.description}
            canonical={`${APP.URL}${router.asPath}`}
            openGraph={{
                title: meta.title,
                description: meta.description,
                url: `${APP.URL}${router.asPath}`,
                images: [
                    {
                        url: meta.image,
                        alt: meta.title,
                    },
                ],
            }}
        />
    )
}

export default MetaTags