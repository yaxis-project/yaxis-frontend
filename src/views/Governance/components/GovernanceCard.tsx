import { useContext } from 'react'
import { Currency, YAX, PICKLE } from '../../../utils/currencies'

import theme from '../../../theme'
import { LanguageContext } from '../../../contexts/Language'
import phrases from './translations'

import { CheckOutlined } from '@ant-design/icons'

import { Row, Col, Typography, Card, Button, Divider, Radio } from 'antd'

const { Text } = Typography

const TableHeader = (props: any) => (
	<Col span={props.span}>
		<Text type="secondary">{props.value}</Text>
	</Col>
)

interface StrategyRowProps {
	strategy: Currency
	current: boolean
	gutter: number
}

const StrategyRow = (props: StrategyRowProps) => {
	const { strategy, gutter } = props
	const languages = useContext(LanguageContext)
	const language = languages.state.selected
	return (
		<>
			<Row gutter={gutter} style={{ paddingTop: 25, paddingBottom: 25 }}>
				<Col span={6}>
					<img
						src={strategy.icon}
						height="32"
						style={{ marginTop: -4 }}
						alt="logo"
					/>
					<Text>{strategy.name}</Text>
				</Col>
				<Col span={6}>
					<Text strong style={{ marginRight: 10 }}>
						+{' '}
					</Text>
					<img
						src={YAX.icon}
						height="32"
						style={{ marginTop: -4 }}
						alt="logo"
					/>
					<Text>{phrases['YAX Rewards'][language]}</Text>
				</Col>
				<Col span={6}>
					<Row>
						<CheckOutlined
							style={{ marginLeft: 40, marginTop: 5 }}
						/>
					</Row>
				</Col>
				<Col span={6}>
					<Row>
						<Radio style={{ marginLeft: 30 }} />
					</Row>
				</Col>
			</Row>
			<Divider plain style={{ margin: 0 }} />
		</>
	)
}

const voteButtonStyle = {
	background: theme.color.primary.main,
	borderColor: theme.color.primary.main,
}

export default function GovernanceCard() {
	const languages = useContext(LanguageContext)
	const language = languages.state.selected
	const gutter = 5
	return (
		<Card bodyStyle={{ padding: 12 }}>
			<Row gutter={gutter}>
				<TableHeader value={phrases['Strategy'][language]} span={12} />
				<TableHeader
					value={phrases['Current Strategy'][language]}
					span={6}
				/>
				<TableHeader
					value={phrases['Select Vote'][language]}
					span={6}
				/>
			</Row>
			<Divider plain style={{ margin: 0 }} />

			<StrategyRow gutter={gutter} strategy={PICKLE} current />

			<Row gutter={gutter} style={{ marginTop: 10 }}>
				<Col offset={16} span={8}>
					<Button style={voteButtonStyle} block type="primary">
						{phrases['Confirm Vote'][language]}
					</Button>
				</Col>
			</Row>
		</Card>
	)
}
