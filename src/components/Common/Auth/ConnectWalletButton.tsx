import { Button } from '@components/UI/Button'
import useAppStore from '@lib/store'
import usePersistStore from '@lib/store/persist'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import React from 'react'
import toast from 'react-hot-toast'
import type { CustomErrorWithData } from '@utils/custom-types'
import { POLYGON_CHAIN_ID } from '@utils/constants'
import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi'

import UserMenu from '../Menu/UserMenu'

type Props = {
  handleSign: () => void
  signing?: boolean
}

const ConnectWalletButton = ({ handleSign, signing }: Props) => {
  const currentProfileId = usePersistStore((state) => state.currentProfileId)
  const currentProfile = useAppStore((state) => state.currentProfile)

  const { connector, isConnected } = useAccount()
  const { switchNetwork } = useSwitchNetwork({
    onError(error: CustomErrorWithData) {
      toast.error(error?.data?.message ?? error?.message)
    }
  })
  const { chain } = useNetwork()

  const { openConnectModal } = useConnectModal()

  return connector?.id && isConnected ? (
    chain?.id === POLYGON_CHAIN_ID ? (
      currentProfileId && currentProfile ? (
        <UserMenu />
      ) : (
        <Button
          loading={signing}
          onClick={() => handleSign()}
          disabled={signing}
        >
          Sign In
          <span className="hidden ml-1 md:inline-block">with Lens</span>
        </Button>
      )
    ) : (
      <Button
        onClick={() => switchNetwork && switchNetwork(POLYGON_CHAIN_ID)}
        variant="danger"
      >
        <span className="text-white">Switch network</span>
      </Button>
    )
  ) : (
    <Button onClick={openConnectModal}>
      Connect
      <span className="hidden ml-1 md:inline-block">Wallet</span>
    </Button>
  )
}

export default ConnectWalletButton