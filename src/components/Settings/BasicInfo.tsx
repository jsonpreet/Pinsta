/* eslint-disable @next/next/no-img-element */
import { LensPeriphery } from '@utils/abis/LensPeriphery'
import useAppStore from '@lib/store'
import { utils } from 'ethers'
import type {
  CreatePublicSetProfileMetadataUriRequest,
  MediaSet,
  Profile
} from '@utils/lens'
import {
  PublicationMetadataDisplayTypes,
  useBroadcastMutation,
  useCreateSetProfileMetadataTypedDataMutation,
  useCreateSetProfileMetadataViaDispatcherMutation
} from '@utils/lens'
import type { ChangeEvent } from 'react'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import type { CustomErrorWithData, IPFSUploadResult } from '@utils/custom-types'
import {
  APP,
  ERROR_MESSAGE,
  LENS_PERIPHERY_ADDRESS,
  RELAYER_ENABLED
} from '@utils/constants'
import getChannelCoverPicture from '@utils/functions/getCoverPicture'
import { getValueFromKeyInAttributes } from '@utils/functions/getFromAttributes'
import imageCdn from '@utils/functions/imageCdn'
import omit from '@utils/functions/omit'
import sanitizeIpfsUrl from '@utils/functions/sanitizeIpfsUrl'
import trimify from '@utils/functions/trimify'
import uploadToAr from '@utils/functions/uploadToAr'
import uploadToIPFS from '@utils/functions/uploadToIPFS'
import { v4 as uuidv4 } from 'uuid'
import { useContractWrite, useSignTypedData } from 'wagmi'
import { z } from 'zod'
import { Analytics, TRACK } from '@utils/analytics'
import { Loader } from '@components/UI/Loader'
import { Input } from '@components/UI/Input'
import { TextArea } from '@components/UI/TextArea'
import { Button } from '@components/UI/Button'
import { Form, useZodForm } from '@components/UI/Form'
import getCoverPicture from '@utils/functions/getCoverPicture'

type Props = {
  profile: Profile & {
    coverPicture: MediaSet
  }
}
const formSchema = z.object({
  displayName: z.union([
    z
      .string()
      .min(4, { message: 'Name should be atleast 5 characters' })
      .max(100, { message: 'Name should not exceed 100 characters' }),
    z.string().max(0)
  ]),
  description: z.union([
    z
      .string()
      .max(260, { message: 'Description should not exceed 260 characters' }),
    z.string().max(0)
  ]),
  twitter: z.string(),
  location: z.string(),
  website: z.union([
    z
      .string()
      .url({ message: 'Enter valid website URL (eg. https://pinsta.xyz)' }),
    z.string().max(0)
  ])
})
type FormData = z.infer<typeof formSchema> & { coverImage?: string }

const BasicInfo = ({ profile }: Props) => {
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [coverImage, setCoverImage] = useState(getCoverPicture(profile))
  const currentProfile = useAppStore((state) => state.currentProfile)

  const form = useZodForm({
    schema: formSchema,
    defaultValues: {
      displayName: profile.name || '',
      description: profile.bio || '',
      location: getValueFromKeyInAttributes(profile?.attributes, 'location'),
      twitter: getValueFromKeyInAttributes(profile?.attributes, 'twitter'),
      website: getValueFromKeyInAttributes(profile?.attributes, 'website')
    }
  });

  const onError = (error: CustomErrorWithData) => {
    toast.error(error?.data?.message ?? error?.message ?? ERROR_MESSAGE)
    setLoading(false)
  }

  const onCompleted = () => {
    toast.success('Profile updated!')
    Analytics.track(TRACK.UPDATED_CHANNEL_INFO)
    setLoading(false)
  }

  const { signTypedDataAsync } = useSignTypedData({
    onError
  })

  const { write: writeMetaData } = useContractWrite({
    address: LENS_PERIPHERY_ADDRESS,
    abi: LensPeriphery,
    functionName: 'setProfileMetadataURIWithSig',
    mode: 'recklesslyUnprepared',
    onError,
    onSuccess: onCompleted
  })

  const [broadcast] = useBroadcastMutation({
    onError,
    onCompleted
  })

  const [createSetProfileMetadataViaDispatcher] =
    useCreateSetProfileMetadataViaDispatcherMutation({
      onError,
      onCompleted
    })

  const [createSetProfileMetadataTypedData] =
    useCreateSetProfileMetadataTypedDataMutation({
      onCompleted: async (data) => {
        const { typedData, id } = data.createSetProfileMetadataTypedData
        try {
          const signature = await signTypedDataAsync({
            domain: omit(typedData?.domain, '__typename'),
            types: omit(typedData?.types, '__typename'),
            value: omit(typedData?.value, '__typename')
          })
          const { profileId, metadata } = typedData?.value
          const { v, r, s } = utils.splitSignature(signature)
          const args = {
            user: profile?.ownedBy,
            profileId,
            metadata,
            sig: { v, r, s, deadline: typedData.value.deadline }
          }
          if (!RELAYER_ENABLED) {
            return writeMetaData?.({ recklesslySetUnpreparedArgs: [args] })
          }
          const { data } = await broadcast({
            variables: { request: { id, signature } }
          })
          if (data?.broadcast?.__typename === 'RelayError')
            writeMetaData?.({ recklesslySetUnpreparedArgs: [args] })
        } catch {
          setLoading(false)
        }
      },
      onError
    })

  const signTypedData = (request: CreatePublicSetProfileMetadataUriRequest) => {
    createSetProfileMetadataTypedData({
      variables: { request }
    })
  }

  const createViaDispatcher = async (
    request: CreatePublicSetProfileMetadataUriRequest
  ) => {
    const { data } = await createSetProfileMetadataViaDispatcher({
      variables: { request }
    })
    if (
      data?.createSetProfileMetadataViaDispatcher.__typename === 'RelayError'
    ) {
      signTypedData(request)
    }
  }

  const otherAttributes =
    profile?.attributes
      ?.filter(
        (attr) => !['website', 'location', 'twitter', 'app'].includes(attr.key)
      )
      .map(({ traitType, key, value }) => ({ traitType, key, value })) ?? []

  const onSaveBasicInfo = async (data: FormData) => {
    Analytics.track(TRACK.UPDATE_CHANNEL_INFO)
    setLoading(true)
    try {
      const { url } = await uploadToAr({
        version: '1.0.0',
        name: data.displayName || null,
        bio: trimify(data.description),
        cover_picture: data.coverImage ?? coverImage,
        attributes: [
          ...otherAttributes,
          {
            displayType: PublicationMetadataDisplayTypes.String,
            traitType: 'website',
            key: 'website',
            value: data.website
          },
          {
            displayType: PublicationMetadataDisplayTypes.String,
            traitType: 'location',
            key: 'location',
            value: data.location
          },
          {
            displayType: PublicationMetadataDisplayTypes.String,
            traitType: 'twitter',
            key: 'twitter',
            value: data.twitter
          },
          {
            displayType: PublicationMetadataDisplayTypes.String,
            traitType: 'app',
            key: 'app',
            value: APP.ID
          }
        ],
        metadata_id: uuidv4()
      })
      const request = {
        profileId: profile?.id,
        metadata: url
      }
      const canUseDispatcher = currentProfile?.dispatcher?.canUseRelay
      if (!canUseDispatcher) {
        return signTypedData(request)
      }
      createViaDispatcher(request)
    } catch {
      setLoading(false)
    }
  }

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setUploading(true)
      const result: IPFSUploadResult = await uploadToIPFS(e.target.files[0])
      setCoverImage(result.url)
      setUploading(false)
      onSaveBasicInfo({ ...form.getValues(), coverImage: result.url })
    }
  }

  return (
    <div className='bg-gray-50 border border-gray-100 p-4 rounded-xl'>
      <Form
        form={form}
        onSubmit={onSaveBasicInfo}
      >
        <div className="relative flex-none w-full">
          {uploading && (
            <div className="absolute rounded-xl bg-black w-full h-full flex items-center justify-center z-10 opacity-40">
              <Loader />
            </div>
          )}
          <img
            src={
              sanitizeIpfsUrl(coverImage) ??
              imageCdn(
                sanitizeIpfsUrl(getCoverPicture(profile)),
                'thumbnail'
              )
            }
            className="object-cover object-center w-full h-48 bg-white rounded-xl md:h-56 dark:bg-gray-900"
            draggable={false}
            alt={`${profile.handle}'s cover`}
          />
          <label
            htmlFor="chooseCover"
            className="absolute p-1 px-3 text-sm bg-white rounded-lg cursor-pointer dark:bg-theme bottom-2 left-2"
          >
            Change
            <input
              id="chooseCover"
              onClick={() => Analytics.track(TRACK.CHANGE_CHANNEL_COVER)}
              type="file"
              accept=".png, .jpg, .jpeg, .svg"
              className="hidden w-full"
              onChange={handleUpload}
            />
          </label>
        </div>
        <div className="mt-6">
          <Input
            label="Name"
            type="text"
            placeholder="Gavin"
            {...form.register('displayName')}
          />
        </div>
        <div className="mt-4">
          <TextArea
            label="Bio"
            placeholder="Tell us something about you!"
            rows={4}
            {...form.register('description')}
          />
        </div>
        <div className="mt-4">
          <Input
            label="Twitter"
            placeholder="johndoe"
            {...form.register('twitter')}
            prefix="https://twitter.com/"
          />
        </div>
        <div className="mt-4">
          <Input
            label="Website"
            placeholder="https://johndoe.xyz"
            {...form.register('website')}
          />
        </div>
        <div className="mt-4">
          <Input
            label="Location"
            placeholder="Metaverse"
            {...form.register('location')}
          />
        </div>
        <div className="flex justify-end mt-4">
          <Button disabled={loading} loading={loading}>
            Save
          </Button>
        </div>
      </Form>
    </div>
  )
}

export default BasicInfo