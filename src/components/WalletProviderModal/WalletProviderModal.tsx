import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useWallet } from 'use-wallet'

import metamaskLogo from '../../assets/img/metamask-fox.svg'
import walletConnectLogo from '../../assets/img/wallet-connect.svg'

import Button from '../Button'
import Modal, { ModalProps } from '../Modal'
import ModalActions from '../ModalActions'
import ModalContent from '../ModalContent'
import ModalTitle from '../ModalTitle'

import WalletCard from './components/WalletCard'
import { Col, Row } from 'antd'


import { injected } from "../../connectors"

const WalletProviderModal: React.FC<ModalProps> = ({ onDismiss }) => {
	const { account, connect, error } = useWallet()

	const [walletError, setWalletError] = useState("")

	useEffect(() => {
		if (account) {
			onDismiss()
		}
	}, [account, onDismiss])

	return (
		<Modal>
			<ModalTitle text="Select a wallet provider." />
			<ErrorText>{walletError}</ErrorText>
			<ErrorText>{error?.message}</ErrorText>
			<ModalContent>
				<StyledWalletsWrapper
					gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
				>
					<StyledWalletCard className="gutter-row" span={12}>
						<WalletCard
							icon={
								<img
									src={metamaskLogo}
									style={{ height: 32 }}
									alt="MetaMask fox logo"
								/>
							}
							onConnect={async () => {
								localStorage.removeItem('signOut')
								try {
									const con = await injected.activate()
									console.log(111, con)
								} catch {
									return true
								}
								await connect('injected')
								return false
							}}
							title="Metamask"
							setError={setWalletError}
						/>
					</StyledWalletCard>
					<StyledWalletCard className="gutter-row" span={12}>
						<WalletCard
							icon={
								<img
									src={walletConnectLogo}
									style={{ height: 24 }}
									alt="Wallet Connect logo"
								/>
							}
							onConnect={async () => {
								localStorage.removeItem('signOut')
								await connect('walletconnect')
								return false
							}}
							title="WalletConnect"
							setError={setWalletError}
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

const StyledWalletsWrapper = styled(Row)``

const StyledWalletCard = styled(Col)``

const ErrorText = styled.div`
color: red;
font-weight: 600;
text-align: center;
`


export default WalletProviderModal
