import React from 'react'
import { Row, Col, Carousel } from 'antd'
import Typography from '../../../../Typography'
import avalanche from '../../../../../assets/img/avalanche.png'
import bridge from '../../../../../assets/img/bridge.png'
import avalancheVaults from '../../../../../assets/img/avalanche-vaults.png'

export const Title = 'yAxis version 3.1.0'

const { Title: TypographyTitle } = Typography

export const Body: React.FC = () => {
	return (
		<>
			<Row justify="center">
				<TypographyTitle>⛓️ Multi-chain ⛓️</TypographyTitle>
			</Row>
			<Row justify="center">
				<Col>
					<Carousel autoplay speed={1000}>
						<div>
							<Row
								justify="center"
								align="top"
								style={{
									...contentStyle,
									position: 'relative',
								}}
							>
								<img
									src={avalanche}
									width={230}
									style={{
										position: 'absolute',
										top: '40px',
									}}
									alt="Canonical Vaults"
								/>
								<Col>
									<h3
										style={{
											fontSize: '20px',
											marginTop: '5px',
											fontWeight: 900,
										}}
									>
										Blockchain network dropdown selector.
									</h3>
								</Col>
							</Row>
						</div>

						<div>
							<Row
								align="top"
								justify="center"
								style={{
									...contentStyle,
									position: 'relative',
								}}
							>
								<img
									src={bridge}
									width={420}
									style={{
										position: 'absolute',
										top: '40px',
										left: '24px',
									}}
									alt="Lock YAXIS"
								/>
								<Col>
									<h3
										style={{
											fontSize: '20px',
											marginTop: '5px',
											fontWeight: 900,
										}}
									>
										Bridge YAXIS tokens to other chains.
									</h3>
								</Col>
							</Row>
						</div>

						<div>
							<Row
								align="top"
								justify="center"
								style={{
									...contentStyle,
									position: 'relative',
								}}
							>
								<img
									src={avalancheVaults}
									width={420}
									style={{
										position: 'absolute',
										top: '40px',
										left: '24px',
									}}
									alt="Lock YAXIS"
								/>
								<Col>
									<h3
										style={{
											fontSize: '20px',
											marginTop: '5px',
											fontWeight: 900,
										}}
									>
										Avalanche vaults. Low gas fees, high
										APY.
									</h3>
								</Col>
							</Row>
						</div>
					</Carousel>
				</Col>
			</Row>
		</>
	)
}

const contentStyle = {
	width: '500px',
	height: '300px',
	color: '#fff',
	background: 'black',
}
