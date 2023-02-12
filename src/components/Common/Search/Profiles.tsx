/* eslint-disable @next/next/no-img-element */
import type { Profile } from '@utils/lens'
import type { FC } from 'react'
import React from 'react'
import UserProfile from '../UserProfile'

interface Props {
    results: Profile[]
    onProfileSelected? : (profile: Profile) => void
    loading: boolean
    linkToProfile?: boolean
    clearSearch: () => void
}

const Profiles: FC<Props> = ({ results, loading, clearSearch, onProfileSelected, linkToProfile }) => {
    return (
        <>
            {results?.map((profile: Profile) => (
                <div
                    onClick={() => {
                        clearSearch()
                        if (onProfileSelected) {
                            onProfileSelected(profile);
                        }
                    }}
                    key={profile.id}
                    className="p-5 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-900"
                    role="button"
                >
                    <UserProfile
                        profile={profile}
                        linkToProfile={linkToProfile}
                        showUserPreview={false}
                    />
                </div>
            ))}
            {!results?.length && !loading && (
                <div className="relative p-5 text-center cursor-default select-none">
                    No results found.
                </div>
            )}
        </>
    )
}

export default Profiles