import { IS_MAINNET } from '../constants'
import { aaveMembers } from './aave-members'
import { paidMembers } from './paid-members'
import { pinstaMembers } from './pinsta-members'

export const VERIFIED_CHANNELS = IS_MAINNET
  ? [
    ...aaveMembers,
    ...paidMembers,
    ...pinstaMembers,    
  ]
  : [
    '0x5f8e',
    '0x57a4',
    '0x62fa', // Prashant.lens
  ]