import React from 'react'
import { Row, Col, Carousel } from 'antd'
import Button from '../../../../Button'
import Typography from '../../../../Typography'
import useTranslation from '../../../../../hooks/useTranslation'
import { useNavigate } from 'react-router-dom'
import { setLastSeenUpdate } from '../util'
import distribute from '../../../../../assets/img/distribute.gif'
import lightdark from '../../../../../assets/img/light-dark.gif'
import lock from '../../../../../assets/img/lock.gif'
import vaults from '../../../../../assets/img/vaults.png'

const { Title: AntTitle } = Typography

export const Title = 'Welcome to yAxis 3.0'

export const Body: React.FC = () => {
	const translate = useTranslation()

	const navigate = useNavigate()

	return (
		<>
			<Row justify="center" style={{ marginBottom: '10px' }}>
				<Col>
					<AntTitle level={5}>
						{translate("What's new") + ':'}
					</AntTitle>
				</Col>
			</Row>
			<Row justify="center">
				<Col>
					<Carousel autoplay>
						<div>
							<Row
								justify="center"
								align="middle"
								style={{
									...contentStyle,
									position: 'relative',
								}}
							>
								<img
									src={vaults}
									width={500}
									style={{
										position: 'absolute',
										top: '0',
									}}
									alt="Canonical Vaults"
								/>
								<Col>
									<h3
										style={{
											marginTop: '50px',
											fontSize: '20px',
											fontWeight: 900,
										}}
									>
										Multi token canonical vaults
									</h3>
								</Col>
							</Row>
						</div>

						<div>
							<Row
								justify="center"
								align="middle"
								style={{
									...contentStyle,
									position: 'relative',
								}}
							>
								<img
									src={lock}
									width={240}
									style={{
										position: 'absolute',
										top: '0',
									}}
									alt="Lock YAXIS"
								/>
								<Col>
									<h3
										style={{
											fontSize: '15px',
											marginTop: '20px',
											fontWeight: 900,
											color: 'black',
										}}
									>
										Boost rewards by locking YAXIS
									</h3>
								</Col>
							</Row>
						</div>

						<div>
							<Row
								justify="center"
								align="middle"
								style={{
									...contentStyle,
									backgroundImage: `url(${distribute})`,
								}}
							>
								<Col>
									<h3
										style={{
											marginTop: '40px',
											fontSize: '16px',
											fontWeight: 900,
										}}
									>
										{' '}
										Vote to get more rewards for your
										favorite token
									</h3>
								</Col>
							</Row>
						</div>

						<div>
							<Row
								justify="center"
								align="middle"
								style={{
									...contentStyle,
									backgroundImage: `url(${lightdark})`,
								}}
							>
								<Col>
									<h3
										style={{
											marginTop: '40px',
											fontSize: '20px',
											fontWeight: 900,
										}}
									>
										Dark mode and language support
									</h3>
								</Col>
							</Row>
						</div>
					</Carousel>
				</Col>
			</Row>
			<Row justify="center" style={{ margin: '40px 20px 20px 20px' }}>
				<Col span={16}>
					<Button
						style={{ width: '100%' }}
						onClick={() => {
							setLastSeenUpdate('V3_0_0')
							navigate('/V3')
						}}
					>
						{translate('Migrate over')}
					</Button>
				</Col>
			</Row>
		</>
	)
}

const contentStyle = {
	width: '500px',
	height: '240px',
	color: '#fff',
	background: 'black',
}
