import { useApolloClient } from '@apollo/client'
import useAppStore from '@lib/store'
import clsx from 'clsx'
import {
  useAddProfileInterestMutation,
  useProfileInterestsQuery,
  useRemoveProfileInterestMutation
} from '@utils/lens'
import sanitizeProfileInterests from '@utils/functions/sanitizeProfileInterests'
import { Loader } from '@components/UI/Loader'
import { Button } from '@components/UI/Button'
import { BsCheckCircleFill, BsPlusCircle } from 'react-icons/bs'

const MAX_TOPICS_ALLOWED = 12

const Topics = () => {
    const currentProfile = useAppStore((state) => state.currentProfile)

    const { cache } = useApolloClient()
    const { data, loading } = useProfileInterestsQuery()
    const [addProfileInterests] = useAddProfileInterestMutation()
    const [removeProfileInterests] = useRemoveProfileInterestMutation()

    const updateCache = (interests: string[]) => {
        cache.modify({
            id: `Profile:${currentProfile?.id}`,
            fields: { interests: () => interests }
        })
    }

    const interestsData = (data?.profileInterests as string[]) || []
    const selectedTopics = currentProfile?.interests ?? []

    const onSelectTopic = (topic: string) => {
        try {
            const variables = {
                request: {
                profileId: currentProfile?.id,
                interests: [topic]
                }
            }
            if (!selectedTopics.includes(topic)) {
                const interests = [...selectedTopics, topic]
                updateCache(interests)
                return addProfileInterests({ variables })
            }
            const topics = [...selectedTopics]
            topics.splice(topics.indexOf(topic), 1)
            updateCache(topics)
            removeProfileInterests({ variables })
        } catch {}
    }

    return (
        <div className="flex flex-col space-y-3">
            {loading && <Loader className="my-10" />}
            {sanitizeProfileInterests(interestsData)?.map(
                ({ category, subCategories }) => (
                    <div className="w-full space-y-2" key={category.id}>
                        <h2 className="capitalize font-medium text-sm">{category.label}</h2>
                        <div className="flex flex-wrap items-center gap-2">
                            {subCategories?.map((subCategory) => (
                                <Button
                                    key={subCategory.id}
                                    variant={selectedTopics.includes(subCategory.id) ? 'primary' : 'outline'}
                                    size="sm"
                                    className="font-medium capitalize"
                                    disabled={
                                    !selectedTopics.includes(subCategory.id) && selectedTopics.length === MAX_TOPICS_ALLOWED
                                    }
                                    icon={
                                    selectedTopics.includes(subCategory.id) ? (
                                        <BsCheckCircleFill className="h-4 w-4 text-brand" />
                                    ) : (
                                        <BsPlusCircle className="h-4 w-4" />
                                    )
                                    }
                                    onClick={() => onSelectTopic(subCategory.id)}
                                    outline
                                >
                                    <div>{subCategory.label}</div>
                                </Button>
                            ))}
                            {!subCategories.length && (
                                <Button
                                    key={category.id}
                                    variant={selectedTopics.includes(category.id) ? 'primary' : 'outline'}
                                    size="sm"
                                    className="font-medium capitalize"
                                    disabled={
                                    !selectedTopics.includes(category.id) && selectedTopics.length === MAX_TOPICS_ALLOWED
                                    }
                                    icon={
                                    selectedTopics.includes(category.id) ? (
                                        <BsCheckCircleFill className="h-4 w-4 text-brand" />
                                    ) : (
                                        <BsPlusCircle className="h-4 w-4" />
                                    )
                                    }
                                    onClick={() => onSelectTopic(category.id)}
                                    outline
                                >
                                    <div>{category.label}</div>
                                </Button>
                            )}
                        </div>
                    </div>
                )
            )}
        </div>
    )
}

export default Topics