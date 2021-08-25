import React, { useMemo } from 'react'
import Page from '../../components/Page/Page'
import { Row, Col } from 'antd'
import Card from '../../components/Card'
import useWeb3Provider from '../../hooks/useWeb3Provider'
import { Redirect } from 'react-router-dom'
import { DetailOverviewCard } from '../../components/DetailOverviewCard'
import Button from '../../components/Button'
import Typography from '../../components/Typography'
import { Currencies } from '../../constants/currencies'
import { useContracts } from '../../contexts/Contracts'
import icon from '../../assets/img/faucet.svg'
import CurrencyFaucet from './components/CurrencyFaucet'

const Faucet: React.FC = () => {
	const { chainId } = useWeb3Provider()
	const { contracts } = useContracts()

	const body = useMemo(() => {
		if (!chainId) return <Row gutter={16}>Connect to a wallet</Row>

		if (chainId !== 42) return <Redirect to="/" />

		if (!contracts) return null

		return (
			<Row style={{ padding: '20px' }} gutter={[0, 20]} justify="center">
				{Object.keys(contracts.currencies.ERC20)
					.filter((name) => name !== 'mvlt') // MVLT has no facuet
					.map((name) => (
						<Col xs={24} sm={24} md={24} lg={8}>
							<Row justify="center">
								<CurrencyFaucet
									currency={name}
									contractName={`currencies.ERC20.${name}.contract`}
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
								<Typography.Text>
									( GitHub sign in required )
								</Typography.Text>
							</div>
						</Col>
					</Row>
				</Col>
			</Row>
		)
	}, [contracts, chainId])

	return (
		<div className="savings-view">
			<Page>
				<DetailOverviewCard title={'Faucets'}>
					{body}
				</DetailOverviewCard>
			</Page>
		</div>
	)
}

export default Faucet
