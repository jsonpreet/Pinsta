import type {
  Attribute,
  Comment,
  FeeCollectModuleSettings,
  FreeCollectModuleSettings,
  LimitedFeeCollectModuleSettings,
  LimitedTimedFeeCollectModuleSettings,
  Mirror,
  Post,
  ProfileFollowModuleSettings,
  RevertCollectModuleSettings,
  RevertFollowModuleSettings,
  FeeFollowModuleSettings,
  TimedFeeCollectModuleSettings
} from '@utils/lens'

export type FileReaderStreamType = NodeJS.ReadableStream & {
  name: string
  size: number
  type: string
  lastModified: string
}

export type CollectModuleType = {
  isTimedFeeCollect?: boolean
  isFreeCollect?: boolean
  isFeeCollect?: boolean
  isRevertCollect?: boolean
  isLimitedFeeCollect?: boolean
  isLimitedTimeFeeCollect?: boolean
  amount?: { currency?: string; value: string }
  referralFee?: number
  collectLimit?: string
  followerOnlyCollect?: boolean
  recipient?: string
}

export type ReferenceModuleType = {
  followerOnlyReferenceModule: boolean
  degreesOfSeparationReferenceModule?: {
    commentsRestricted: boolean
    mirrorsRestricted: boolean
    degreesOfSeparation: number
  } | null
}

//export type PinstaPublication = Post & Comment & Mirror
export type PinstaPublication = Post

export type IPFSUploadResult = {
  url: string
  type: string
}

export type VideoUploadForm = {
  videoThumbnail: IPFSUploadResult | null
  videoSource: string | null
  playbackId: string | null
  title: string
  description: string
  adultContent: boolean
}

export type StreamData = {
  streamKey: string
  hostUrl: string
  playbackId: string
  streamId: string
}

export type ProfileMetadata = {
  version: string
  metadata_id: string
  name: string | null
  bio: string | null
  cover_picture: string | null
  attributes: Attribute[]
}

export type PinstaCollectModule = FreeCollectModuleSettings &
  FeeCollectModuleSettings &
  RevertCollectModuleSettings &
  TimedFeeCollectModuleSettings &
  LimitedFeeCollectModuleSettings &
  LimitedTimedFeeCollectModuleSettings

export interface CustomErrorWithData extends Error {
  data?: {
    message: string
  }
}

export interface ProfileInterest {
  category: { label: string; id: string }
  subCategories: Array<{ label: string; id: string }>
}

export type QueuedCommentType = {
  comment: string
  pubId: string
  txnId?: string
  txnHash?: string
}

export type PinstaFollowModule = FeeFollowModuleSettings &
  ProfileFollowModuleSettings &
  RevertFollowModuleSettings;

export type Board = {
  name: string | null;
  description?: string | null;
  user: string | null;
  pfp?: string | null;
  cover?: string | null;
  is_private: boolean | null;
  category?: string | null;
  tags?: any;
  created_at?: Date | null;
  updated_at?: Date | null;
};

export type Boards = Board[];

export type BoardPins = {
  user: string | null;
  pin: string | null;
  board: string | null;
  created_at?: Date | null;
  updated_at?: Date | null;
};