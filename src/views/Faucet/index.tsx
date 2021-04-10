import React, { useMemo } from 'react'
import styled from 'styled-components'
import Page from '../../components/Page/Page'
import { Row, Col, Card } from 'antd'
import useWeb3Provider from '../../hooks/useWeb3Provider'
import { Redirect } from 'react-router-dom'
import { DetailOverviewCard } from '../../components/DetailOverviewCard'
import Button from '../../components/Button'
import * as currencies from '../../utils/currencies'
import useGlobal from '../../hooks/useGlobal'
import BN from 'bignumber.js'
import icon from '../../assets/img/faucet.svg'

const StyledCol = styled(Col)`
	@media only screen and (max-width: 991px) {
		margin-top: 16px;
	}
`

const Faucet: React.FC = () => {
	const { account, chainId } = useWeb3Provider()
	const { yaxis } = useGlobal()

	const body = useMemo(() => {
		if (!chainId)
			return (
				<div>
					<Page>
						<Row gutter={16}>Connect to a wallet</Row>
					</Page>
				</div>
			)

		if (chainId !== 42) return <Redirect to="/" />

		return (
			<div style={{ padding: '20px' }}>
				<Row gutter={16}>
					<Col xs={24} sm={24} md={24} lg={8}>
						<Card
							title={
								<Row
									justify="space-between"
									style={{
										width: '100%',
									}}
								>
									<Col>
										<Row>
											<img
												src={currencies.ETH.icon}
												height="36"
												alt="logo"
											/>
											<div
												style={{ paddingLeft: '14px' }}
											>
												Kovan Ethereum
											</div>
										</Row>
									</Col>
									<Col>
										<Button block={false}>
											<a
												href="https://faucet.kovan.network/"
												target="_blank"
												rel="noreferrer"
											>
												<img
													src={icon}
													height="36"
													alt="logo"
												/>
											</a>
										</Button>
									</Col>
								</Row>
							}
							bordered={false}
						>
							<Row justify="center">
								(GitHub sign in required)
							</Row>
						</Card>
					</Col>
					<StyledCol xs={24} sm={24} md={24} lg={8}>
						<Card
							title={
								<Row
									justify="space-between"
									style={{
										width: '100%',
									}}
								>
									<Col>
										<Row>
											<img
												src={currencies.YAX.icon}
												height="36"
												alt="logo"
											/>
											<div
												style={{ paddingLeft: '14px' }}
											>
												YAX
											</div>
										</Row>
									</Col>
									<Col>
										<Button
											block={false}
											onClick={async () =>
												await yaxis.contracts.yax.methods
													.faucet(
														new BN(1).multipliedBy(
															10 **
																currencies.YAX
																	.decimals,
														),
													)
													.send({ from: account })
											}
										>
											<img
												src={icon}
												height="36"
												alt="logo"
											/>
										</Button>
									</Col>
								</Row>
							}
							bordered={false}
						/>
					</StyledCol>
					<StyledCol xs={24} sm={24} md={24} lg={8}>
						<Card
							title={
								<Row
									justify="space-between"
									style={{
										width: '100%',
									}}
								>
									<Col>
										<Row>
											<img
												src={currencies.DAI.icon}
												height="36"
												alt="logo"
											/>
											<div
												style={{ paddingLeft: '14px' }}
											>
												DAI
											</div>
										</Row>
									</Col>
									<Col>
										<Button
											block={false}
											onClick={async () =>
												await yaxis.contracts.vault.dai.methods
													.faucet(
														new BN(1).multipliedBy(
															10 **
																currencies.DAI
																	.decimals,
														),
													)
													.send({ from: account })
											}
										>
											<img
												src={icon}
												height="36"
												alt="logo"
											/>
										</Button>
									</Col>
								</Row>
							}
							bordered={false}
						/>
					</StyledCol>
				</Row>
				<Row gutter={16}>
					<StyledCol xs={24} sm={24} md={24} lg={8}>
						<Card
							title={
								<Row
									justify="space-between"
									style={{
										width: '100%',
									}}
								>
									<Col>
										<Row>
											<img
												src={currencies.CRV3.icon}
												height="36"
												alt="logo"
											/>
											<div
												style={{ paddingLeft: '14px' }}
											>
												3CRV
											</div>
										</Row>
									</Col>
									<Col>
										<Button
											block={false}
											onClick={async () =>
												await yaxis.contracts.vault.threeCrv.methods
													.faucet(
														new BN(1).multipliedBy(
															10 **
																currencies.CRV3
																	.decimals,
														),
													)
													.send({ from: account })
											}
										>
											<img
												src={icon}
												height="36"
												alt="logo"
											/>
										</Button>
									</Col>
								</Row>
							}
							bordered={false}
						/>
					</StyledCol>
					<StyledCol xs={24} sm={24} md={24} lg={8}>
						<Card
							title={
								<Row
									justify="space-between"
									style={{
										width: '100%',
									}}
								>
									<Col>
										<Row>
											<img
												src={currencies.USDC.icon}
												height="36"
												alt="logo"
											/>
											<div
												style={{ paddingLeft: '14px' }}
											>
												USDC
											</div>
										</Row>
									</Col>
									<Col>
										<Button
											block={false}
											onClick={async () =>
												await yaxis.contracts.vault.usdc.methods
													.faucet(
														new BN(1).multipliedBy(
															10 **
																currencies.USDC
																	.decimals,
														),
													)
													.send({ from: account })
											}
										>
											<img
												src={icon}
												height="36"
												alt="logo"
											/>
										</Button>
									</Col>
								</Row>
							}
							bordered={false}
						/>
					</StyledCol>
					<StyledCol xs={24} sm={24} md={24} lg={8}>
						<Card
							title={
								<Row
									justify="space-between"
									style={{
										width: '100%',
									}}
								>
									<Col>
										<Row>
											<img
												src={currencies.USDT.icon}
												height="36"
												alt="logo"
											/>
											<div
												style={{ paddingLeft: '14px' }}
											>
												USDT
											</div>
										</Row>
									</Col>
									<Col>
										<Button
											block={false}
											onClick={async () =>
												await yaxis.contracts.vault.usdt.methods
													.faucet(
														new BN(1).multipliedBy(
															10 **
																currencies.USDT
																	.decimals,
														),
													)
													.send({ from: account })
											}
										>
											<img
												src={icon}
												height="36"
												alt="logo"
											/>
										</Button>
									</Col>
								</Row>
							}
							bordered={false}
						/>
					</StyledCol>
				</Row>
				<Row gutter={16}>
					{yaxis?.contracts.pools.map((pool) => {
						console.log(pool)
						return (
							<StyledCol xs={24} sm={24} md={24} lg={8}>
								<Card
									title={
										<Row
											justify="space-between"
											style={{
												width: '100%',
											}}
										>
											<Col>
												<Row>
													<img
														src={
															currencies[
																`${pool.type.toUpperCase()}_LP`
															].icon
														}
														height="36"
														alt="logo"
													/>
													<div
														style={{
															paddingLeft: '14px',
														}}
													>
														{pool.name}
													</div>
												</Row>
											</Col>
											<Col>
												<Button
													block={false}
													onClick={async () =>
														pool.lpContract.methods
															.addLiquidity(
																0,
																0,
																new BN(
																	1,
																).multipliedBy(
																	10 ** 18,
																),
															)
															.send({
																from: account,
															})
													}
												>
													<img
														src={icon}
														height="36"
														alt="logo"
													/>
												</Button>
											</Col>
										</Row>
									}
									bordered={false}
								/>
							</StyledCol>
						)
					})}
				</Row>
			</div>
		)
	}, [yaxis?.contracts, chainId, account])

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
