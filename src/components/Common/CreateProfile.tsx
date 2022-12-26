import { Button } from '@components/UI/Button'
import { Input } from '@components/UI/Input'
import Modal from '@components/UI/Modal'
import { zodResolver } from '@hookform/resolvers/zod'
import usePendingTxn from '@utils/hooks/usePendingTxn'
import useAppStore from '@lib/store'
import { useCreateProfileMutation } from '@utils/lens'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { IS_MAINNET } from '@utils/constants'
import getLensHandle from '@utils/functions/getLensHandle'
import { getRandomProfilePicture } from '@utils/functions/getRandomProfilePicture'
import trimify from '@utils/functions/trimify'
import useIsMounted from '@utils/hooks/useIsMounted'
import z from 'zod'
import formatHandle from '@utils/functions/formatHandle'

const formSchema = z.object({
  profileName: z
    .string()
    .min(5, { message: 'Name should be atleast 5 characters' })
    .max(30, { message: 'Name should not exceed 30 characters' })
    .regex(/^[a-z0-9]+$/, {
      message: 'Name should only contain alphanumeric characters'
    })
})
type FormData = z.infer<typeof formSchema>

export const ClaimHandle = () => (
    <div className="mt-2">
        <span className="text-sm opacity-70">
            Your address does not seem to have Lens handle.
        </span>
        <div className="text-base">
            Visit{' '}
            <Link
                href="https://claim.lens.xyz/"
                target="_blank"
                className="text-indigo-500"
                rel="noreferrer"
            >
                lens claiming site
            </Link>{' '}
            to claim your handle and then check back here.
        </div>
    </div>
)

const CreateProfile = () => {
  const showCreateAccount = useAppStore((state) => state.showCreateAccount)
  const setShowCreateAccount = useAppStore(
    (state) => state.setShowCreateAccount
  )
  const [loading, setLoading] = useState(false)
  const [buttonText, setButtonText] = useState('Create')
  const { mounted } = useIsMounted()
  const router = useRouter()
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(formSchema)
  })

  const onError = () => {
    setLoading(false)
    setButtonText('Create')
  }

  const [createProfile, { data, reset }] = useCreateProfileMutation({
    onCompleted: (data) => {
      setButtonText('Indexing...')
      if (data?.createProfile?.__typename === 'RelayError') {
        setLoading(false)
        setButtonText('Create')
      }
    },
    onError
  })

  const onCancel = () => {
    setShowCreateAccount(false)
    onError()
    reset()
  }

  const { indexed } = usePendingTxn({
    txHash:
      data?.createProfile.__typename === 'RelayerResult'
        ? data?.createProfile?.txHash
        : null
  })

  useEffect(() => {
    if (indexed) {
      setLoading(false)
      setShowCreateAccount(false)
      router.push(`/${formatHandle(getLensHandle(getValues().profileName))}`)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [indexed])

  const onCreate = ({ profileName }: FormData) => {
    const username = trimify(profileName.toLowerCase())
    setLoading(true)
    setButtonText('Creating...')
    createProfile({
      variables: {
        request: {
          handle: username,
          profilePictureUri: getRandomProfilePicture(username)
        }
      }
    })
  }

  return (
    <Modal
      title={IS_MAINNET ? 'Claim Handle' : 'Create Profile'}
      onClose={() => setShowCreateAccount(false)}
      show={mounted && showCreateAccount}
    >
      {IS_MAINNET ? (
        <ClaimHandle />
      ) : (
        <form onSubmit={handleSubmit(onCreate)} className="space-y-4 p-4">
          <div className="mt-2">
            <Input
              {...register('profileName')}
              label="Profile Name"
              type="text"
              placeholder="John Deo"
              autoComplete="off"
              validationError={errors.profileName?.message}
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="flex-wrap w-2/3">
              {data?.createProfile?.__typename === 'RelayError' && (
                <div>
                  <p className="text-xs font-medium text-red-500">
                    {data?.createProfile?.reason === 'HANDLE_TAKEN'
                      ? 'Profile already exists, try unique.'
                      : data?.createProfile?.reason}
                  </p>
                </div>
              )}
            </span>
            <span className="flex items-center">
              <Button
                type="button"
                disabled={loading}
                onClick={() => onCancel()}
                variant="secondary"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading} loading={loading}>
                {buttonText}
              </Button>
            </span>
          </div>
        </form>
      )}
    </Modal>
  )
}

export default CreateProfile