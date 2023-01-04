/* eslint-disable @next/next/no-img-element */

import getAttribute from '@utils/functions/getAttribute';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import React, { ReactElement } from 'react'
import { FiTwitter } from 'react-icons/fi';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import { HiHashtag } from 'react-icons/hi2';
import { Tooltip } from '@components/UI/Tooltip';
import { useTheme } from 'next-themes';
import { Profile } from '@utils/lens/generated';
import { BsGlobe } from 'react-icons/bs';

const MetaDetails = ({ profile }: { profile: Profile }) => {
    const { resolvedTheme } = useTheme();
    const router = useRouter();

    const Meta = ({ children, icon }: { children: ReactElement; icon: ReactElement }) => (
        <div className="flex gap-2 items-center">
            {icon}
            <div className="truncate text-md">{children}</div>
        </div>
    );
    return (
        <>
            <div className="flex items-center justify-center space-x-5 dark:bg-gray-700/60 dark:ring-gray-600/80 bg-white/80 ring-2 ring-white/90 bg-clip-padding backdrop-blur-xl backdrop-filter shadow-md px-3 py-1 mr-3 rounded-full mb-3">
                <Meta icon={<HiHashtag className="w-4 h-4" />}>
                    <Tooltip placement='top' content={`#${parseInt(profile?.id)}`}>{profile?.id}</Tooltip>
                </Meta>
                {getAttribute(profile?.attributes, 'location') && (
                    <Meta icon={<HiOutlineLocationMarker className="w-4 h-4" />}>
                    {getAttribute(profile?.attributes, 'location') as any}
                    </Meta>
                )}
                {profile?.onChainIdentity?.ens?.name && (
                    <Meta
                        icon={
                            <img
                                src={`/brands/ens.svg`}
                                className="w-4 h-4"
                                height={16}
                                width={16}
                                alt="ENS Logo"
                            />
                        }
                    >
                        {profile?.onChainIdentity?.ens?.name}
                    </Meta>
                )}
                {getAttribute(profile?.attributes, 'website') && (
                    <Meta
                        icon={
                            <BsGlobe size={14} />
                            // <img
                            //     src={`https://www.google.com/s2/favicons?domain=${getAttribute(
                            //         profile?.attributes,
                            //         'website'
                            //     )
                            //         ?.replace('https://', '')
                            //         .replace('http://', '')}`}
                            //     className="w-4 h-4 rounded-full"
                            //     height={16}
                            //     width={16}
                            //     alt="Website"
                            // />
                        }
                    >
                        <a
                            href={`https://${getAttribute(profile?.attributes, 'website')
                            ?.replace('https://', '')
                            .replace('http://', '')}`}
                            target="_blank"
                            rel="noreferrer noopener me"
                        >
                            {/* {getAttribute(profile?.attributes, 'website')?.replace('https://', '').replace('http://', '')} */}
                            Website
                        </a>
                    </Meta>
                )}
                {getAttribute(profile?.attributes, 'twitter') && (
                    <Meta
                        icon={<FiTwitter className={clsx({
                            'text-white': resolvedTheme === 'dark',
                            'text-gray-900': resolvedTheme === 'light',
                        })} />}
                    >
                        <a
                            href={`https://twitter.com/${getAttribute(profile?.attributes, 'twitter')}`}
                            target="_blank"
                            rel="noreferrer noopener"
                        >
                            {getAttribute(profile?.attributes, 'twitter')?.replace('https://twitter.com/', '')}
                        </a>
                    </Meta>
                )}
            </div>
        </>
    )
}

export default MetaDetails