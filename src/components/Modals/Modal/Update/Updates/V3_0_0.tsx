import React from 'react'
import { Row, Col, Carousel } from 'antd'
import Button from '../../../../Button'
import useTranslation from '../../../../../hooks/useTranslation'
import { useNavigate } from 'react-router-dom'
import { setLastSeenUpdate } from '../util'
import { useCloseModal } from '../../../../../state/application/hooks'
import distribute from '../../../../../assets/img/distribute.gif'
import lightdark from '../../../../../assets/img/light-dark.gif'
import lock from '../../../../../assets/img/lock.gif'
import vaults from '../../../../../assets/img/vaults.png'

export const Title = 'Welcome to yAxis 3.0'

export const Body: React.FC = () => {
	const translate = useTranslation()

	const navigate = useNavigate()

	const closeModal = useCloseModal()

	return (
		<>
			<Row justify="center">
				<Col>
					<Carousel autoplay>
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
									src={vaults}
									width={500}
									style={{
										position: 'absolute',
										top: '40px',
									}}
									alt="Canonical Vaults"
								/>
								<Col>
									<h3
										style={{
											marginTop: '5px',
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
								align="top"
								justify="center"
								style={{
									...contentStyle,
									position: 'relative',
								}}
							>
								<img
									src={lock}
									width={220}
									style={{
										position: 'absolute',
										top: '40px',
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
										Boost rewards by locking YAXIS
									</h3>
								</Col>
							</Row>
						</div>

						<div>
							<Row
								justify="center"
								align="top"
								style={contentStyle}
							>
								<img
									src={distribute}
									width={400}
									style={{
										position: 'absolute',
										top: '40px',
										marginRight: '26px',
									}}
									alt="Distribute emissions"
								/>
								<Col>
									<h3
										style={{
											marginTop: '5px',
											fontSize: '18px',
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
								align="top"
								style={{
									...contentStyle,
									backgroundImage: `url(${lightdark})`,
								}}
							>
								<Col>
									<h3
										style={{
											marginTop: '5px',
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
							closeModal()
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
