import { useState } from 'react'
import { Row, Col, Collapse, Typography } from 'antd'
import { DetailOverviewCard } from '../../../components/DetailOverviewCard'
import styled from 'styled-components'
const { Panel } = Collapse
const { Title, Paragraph } = Typography

const StyledCollapse = styled(Collapse)<any>`
	${(props) =>
		props.active
			? `
			border: 1px solid ${props.theme.color.primary.main};
	.ant-collapse-item {
		color: white;
		background: ${props.theme.color.primary.main};
		transition: background 0.5s;
	}
	.ant-collapse-header.ant-collapse-header {
		color: white;
	}
	`
			: ``}
`

export default function SwapInfo() {
	const [active, setActive] = useState(['0'])
	return (
		<DetailOverviewCard title={'Details'}>
			<BodyMain>
				<Title level={4}>What is this?</Title>
				<Paragraph>
					I love cheese, especially bocconcini cheese and wine. Fondue
					cheese strings port-salut monterey jack babybel cheeseburger
					brie cheesy feet. Smelly cheese chalk and cheese cow hard
					cheese cottage cheese cheese strings cheddar bavarian
					bergkase. Port-salut cheese and wine swiss cheese strings
					fondue dolcelatte fondue smelly cheese. Cheesy grin stinking
					bishop.
				</Paragraph>
				<Row style={{ padding: '10px' }}>
					<Col span={20} push={2}>
						<Title level={4}>Frequently Asked Questions</Title>
						<StyledCollapse
							activeKey={active}
							expandIconPosition="right"
							onChange={(key) =>
								setActive(key.includes('0') ? ['0'] : [])
							}
							active={active.includes('0')}
						>
							<Panel header={'Who'} key="0">
								<Body>
									Swiss emmental who moved my cheese cheesy
									feet cheesy feet chalk and cheese swiss
									macaroni cheese. Cauliflower cheese bavarian
									bergkase who moved my cheese ricotta boursin
									pepper jack paneer cheesy grin. Cauliflower
									cheese cheddar cheese strings fromage frais
									bavarian bergkase camembert de normandie.
								</Body>
							</Panel>
						</StyledCollapse>
						<StyledCollapse
							activeKey={active}
							expandIconPosition="right"
							onChange={(key) =>
								setActive(key.includes('1') ? ['1'] : [])
							}
							active={active.includes('1')}
						>
							<Panel header={'Why'} key="1">
								<Body>
									I love cheese, especially fromage frais
									bavarian bergkase. Swiss emmental who moved
									my cheese cheesy feet cheesy feet chalk and
									cheese swiss macaroni cheese. Cauliflower
									cheese bavarian bergkase who moved my cheese
									ricotta boursin pepper jack paneer cheesy
									grin. Cauliflower cheese cheddar cheese
									strings fromage frais bavarian bergkase
									camembert de normandie.
								</Body>
							</Panel>
						</StyledCollapse>
						<StyledCollapse
							activeKey={active}
							expandIconPosition="right"
							onChange={(key) =>
								setActive(key.includes('2') ? ['2'] : [])
							}
							active={active.includes('2')}
						>
							<Panel header={'How'} key="2">
								<Body>
									I love cheese, especially fromage frais
									bavarian bergkase. Swiss emmental who moved
									my cheese cheesy feet cheesy feet chalk and
									cheese swiss macaroni cheese. Cauliflower
									cheese bavarian bergkase who moved my cheese
									ricotta boursin pepper jack paneer cheesy
									grin. Cauliflower cheese cheddar cheese
									strings fromage frais bavarian bergkase
									camembert de normandie.
								</Body>
							</Panel>
						</StyledCollapse>
					</Col>
				</Row>
			</BodyMain>
		</DetailOverviewCard>
	)
}

const BodyMain = styled.div`
	margin: 5%;
`

const Body = styled.div`
	margin: 5% 10%;
`
