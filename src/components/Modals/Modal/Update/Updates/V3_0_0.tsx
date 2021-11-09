import React from 'react'
import { Row, Col, Typography, Carousel } from 'antd'
import Button from '../../../../Button'
import useTranslation from '../../../../../hooks/useTranslation'
import { useHistory } from 'react-router-dom'
import { setLastSeenUpdate } from '../util'

const { Title: AntTitle } = Typography

export const Title = 'Welcome to yAxis 3.0'

export const Body: React.FC = () => {
	const translate = useTranslation()

	const history = useHistory()

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
								style={contentStyle}
							>
								<Col>
									{/* TODO: Add image */}
									<h3>Multi token canonical vaults</h3>
								</Col>
							</Row>
						</div>

						<div>
							<Row
								justify="center"
								align="middle"
								style={contentStyle}
							>
								<Col>
									{/* TODO: Add image */}
									<h3>Boost rewards by locking YAXIS</h3>
								</Col>
							</Row>
						</div>

						<div>
							<Row
								justify="center"
								align="middle"
								style={contentStyle}
							>
								<Col>
									{/* TODO: Add image */}
									<h3>
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
								style={contentStyle}
							>
								<Col>
									{/* TODO: Add image */}
									<h3>Dark mode and language support</h3>
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
							history.push(`/V3`)
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
	lineHeight: '160px',
	background: '#364d79',
}
