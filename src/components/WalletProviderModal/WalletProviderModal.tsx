import React, { useEffect } from 'react'
import styled from 'styled-components'
import { useWallet } from 'use-wallet'

import metamaskLogo from '../../assets/img/metamask-fox.svg'
import walletConnectLogo from '../../assets/img/wallet-connect.svg'

import Button from '../Button'
import Modal, { ModalProps } from '../Modal'
import ModalActions from '../ModalActions'
import ModalContent from '../ModalContent'
import ModalTitle from '../ModalTitle'
import Spacer from '../Spacer'

import WalletCard from './components/WalletCard'
import {Col, Row} from "antd";

const WalletProviderModal: React.FC<ModalProps> = ({ onDismiss }) => {
  const { account, connect } = useWallet()

  useEffect(() => {
    if (account) {
      onDismiss()
    }
  }, [account, onDismiss])

  return (
    <Modal>
      <ModalTitle text="Select a wallet provider." />
      <ModalContent>
        <StyledWalletsWrapper gutter={{xs: 8, sm: 16, md: 24, lg: 32}}>
          <StyledWalletCard className="gutter-row"  span={12}>
            <WalletCard
              icon={<img src={metamaskLogo} style={{ height: 32 }} />}
              onConnect={() =>{
                localStorage.removeItem("signOut")
                return connect('injected')
              }}
              title="Metamask"
            />
          </StyledWalletCard >
          <StyledWalletCard className="gutter-row"  span={12}>
            <WalletCard
              icon={<img src={walletConnectLogo} style={{ height: 24 }} />}
              onConnect={() => {
                localStorage.removeItem("signOut")
                return connect('walletconnect')
              }}
              title="WalletConnect"
            />
          </StyledWalletCard>
        </StyledWalletsWrapper>
      </ModalContent>

      <ModalActions>
        <Button text="Cancel" variant="secondary" onClick={onDismiss} />
      </ModalActions>
    </Modal>
  )
}

const StyledWalletsWrapper = styled(Row)`
`

const StyledWalletCard = styled(Col)`
`

export default WalletProviderModal
