import { PublicationMainFocus } from './lens/generated';
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
export type PinstaPublication = Post & Comment & Mirror

export type IPFSUploadResult = {
  url: string
  type: string
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

export type PinstaFollowModule = FeeFollowModuleSettings &
  ProfileFollowModuleSettings &
  RevertFollowModuleSettings;

export type BoardType = {
  id?: string;
  name: string;
  description?: string;
  slug: string;
  handle?: string;
  user_id: string;
  pfp?: string;
  cover?: string;
  is_private: boolean;
  category?: string;
  tags?: any;
  created_at?: Date;
  updated_at?: Date;
};

export type BoardsType = BoardType[];

export type BoardPinsType = {
  user_id: string;
  post_id: string;
  board_id?: string;
  created_at?: Date;
  updated_at?: Date;
};

export type CreatePin = {
  title: string
  description: string
  category: { tag: string; name: string }
  isSensitiveContent: boolean
  board: BoardType
  buttonText: string
  collectModule: CollectModuleType
  referenceModule: ReferenceModuleType
  isNSFW: boolean
  isNSFWThumbnail: boolean
}

export type QueuedCommentType = {
  comment: string
  pubId: string
  txnId?: string
  txnHash?: string
}

export type QueuedPublicationType = {
  publication: CreatePin
  txnId?: string
  txnHash?: string
}

export interface PinstaAttachment {
  item: string;
  type: string;
  altTag: string;
}

export interface NewPinstaAttachment extends Omit<PinstaAttachment, 'item'> {
  id: string;
  item?: string;
  previewItem?: string;
}


export const PinstaMainContentFocus = [PublicationMainFocus.Image] //PublicationMainFocus.Video, PublicationMainFocus.Audio, PublicationMainFocus.Text