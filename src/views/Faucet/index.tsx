import React, { useMemo } from 'react'
import Page from '../../components/Page/Page'
import { Row, Col } from 'antd'
import useWeb3Provider from '../../hooks/useWeb3Provider'
import { Navigate } from 'react-router-dom'
import { DetailOverviewCard } from '../../components/DetailOverviewCard'
import Button from '../../components/Button'
import Typography from '../../components/Typography'
import Divider from '../../components/Divider'
import { Currencies } from '../../constants/currencies'
import { useContracts } from '../../contexts/Contracts'
import CurrencyFaucet from './components/CurrencyFaucet'

const { Text } = Typography

const Faucet: React.FC = () => {
	const { chainId } = useWeb3Provider()
	const { contracts } = useContracts()

	const body = useMemo(() => {
		if (!chainId) return <Row gutter={16}>Connect to a wallet</Row>

		if (chainId !== 42) return <Navigate to="/" />

		if (!contracts) return null

		return (
			<Row style={{ padding: '20px' }} gutter={[0, 20]} justify="center">
				<Col span={24}>
					<Row justify="center" style={{ fontSize: '18px' }}>
						<Text>
							To get YAXIS, faucet YAX and send through the swap
							contract.
						</Text>
					</Row>
				</Col>
				<Divider />
				{Object.keys(contracts.currencies.ERC20)
					.filter((name) => name !== 'mvlt') // MVLT has no facuet
					.map((name) => (
						<Col key={name} xs={24} sm={24} md={24} lg={8}>
							<Row justify="center">
								<CurrencyFaucet
									currency={name}
									contractName={`currencies.ERC20.${name}.contract`}
								/>
							</Row>
						</Col>
					))}
				{Object.entries(contracts.vaults)
					.filter(([name]) => name !== 'yaxis')
					.map(([name, vault]) => (
						<Col key={name} xs={24} sm={24} md={24} lg={8}>
							<Row justify="center">
								<CurrencyFaucet
									currency={vault.token.tokenId}
									contractName={`vaults.${name}.token.contract`}
								/>
							</Row>
						</Col>
					))}
				<Col xs={24} sm={24} md={24} lg={8}>
					<Row justify="center">
						<Col>
							<Row gutter={10} justify="center" align="middle">
								<Button block={false}>
									<a
										href="https://faucet.kovan.network/"
										target="_blank"
										rel="noopener noreferrer"
									>
										<Row gutter={10} align="middle">
											<Col>
												<img
													src={Currencies.ETH.icon}
													height="36"
													alt="logo"
												/>
											</Col>
											<Col>ETH</Col>
										</Row>
									</a>
								</Button>
							</Row>
							<div>
								<Text>( GitHub sign in required )</Text>
							</div>
						</Col>
					</Row>
				</Col>
			</Row>
		)
	}, [contracts, chainId])

	return (
		<Page>
			<DetailOverviewCard title={'Faucets'}>{body}</DetailOverviewCard>
		</Page>
	)
}

export default Faucet
