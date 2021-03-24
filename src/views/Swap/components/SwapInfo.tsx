import { Row, Col, Collapse, Typography } from 'antd'
import { DetailOverviewCard } from '../../../components/DetailOverviewCard'
import styled from 'styled-components'
const { Panel } = Collapse
const { Title, Paragraph } = Typography

export default function VaultStatsCard() {
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
                        <Collapse
                            className="expandable-overview"
                            defaultActiveKey={['1']}
                            expandIconPosition="right"
                        >
                            <Panel header={'Who'} key="1">
                                <Body>
                                    Swiss emmental who moved
                                    my cheese cheesy feet cheesy feet chalk and
                                    cheese swiss macaroni cheese. Cauliflower
                                    cheese bavarian bergkase who moved my cheese
                                    ricotta boursin pepper jack paneer cheesy
                                    grin. Cauliflower cheese cheddar cheese
                                    strings fromage frais bavarian bergkase
                                    camembert de normandie.
								</Body>
                            </Panel>
                        </Collapse>
                        <Collapse
                            className="expandable-overview"
                            expandIconPosition="right"
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
                        </Collapse>
                        <Collapse
                            className="expandable-overview"
                            expandIconPosition="right"
                        >
                            <Panel header={'How'} key="1">
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
                        </Collapse>
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
