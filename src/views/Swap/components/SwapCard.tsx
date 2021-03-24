import {
    DetailOverviewCard,
    DetailOverviewCardRow,
} from '../../../components/DetailOverviewCard'
import { Affix, Row, Col } from "antd"
import Button from "../../../components/Button"

export default function VaultStatsCard() {
    return (
        <Affix offsetTop={50}>
            <DetailOverviewCard title={'Swap'}>
                <DetailOverviewCardRow>
                    <Row>

                        <Col span={8}>10 YAX</Col>
                        <Col span={8}>{"==>"}</Col>
                        <Col span={8}>10 YAXIS</Col>
                    </Row>
                </DetailOverviewCardRow>
                <div style={{ margin: "10px" }}>
                    <Button>Swap</Button>
                </div>
            </DetailOverviewCard>
        </Affix>
    )
}
