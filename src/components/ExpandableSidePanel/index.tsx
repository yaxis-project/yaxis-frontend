import React from 'react'
import { Typography, Collapse, Divider, Row, Col } from 'antd'
const { Text, Title } = Typography

const { Panel } = Collapse

interface CardRowProps {
	main: string | React.ReactNode
	secondary: string | React.ReactNode
	rightContent?: string | React.ReactNode
}

export const CardRow = (props: CardRowProps) => {
	const { main, secondary, rightContent } = props
	return (
		<Row align={'middle'}>
			<Col span={rightContent ? 12 : 24}>
				<Text
					style={{
						margin: 0,
						marginLeft: 22,
						marginTop: 22,
						display: 'block',
					}}
					type="secondary"
				>
					{main}
				</Text>
				<Title
					style={{ margin: 0, marginLeft: 22, marginBottom: 22 }}
					level={5}
				>
					{secondary}
				</Title>
			</Col>
			{rightContent && <Col span={12}>{rightContent}</Col>}
			<Divider plain style={{ margin: 0 }} />
		</Row>
	)
}

interface ExpandableSidePanelProps {
	children: React.ReactNode
	header: string
}

export const ExpandableSidePanel = (props: ExpandableSidePanelProps) => {
	const { header, children } = props
	return (
		<>
			<Collapse
				className="expandable-overview"
				defaultActiveKey={['1']}
				expandIconPosition="right"
			>
				<Panel header={header} key="1">
					{children}
				</Panel>
			</Collapse>
		</>
	)
}
