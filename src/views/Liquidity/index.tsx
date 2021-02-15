import React from 'react'
import Page from '../../components/Page/Page'
import { Row, Col } from 'antd'
import './index.less'
import useFarms from '../../hooks/useFarms'

const Liqudity: React.FC = () => {
    const { farms, stakedValues } = useFarms()
    const activePools = farms.filter(pool => pool.active)

    return (
        <div className="liquidity-view">
            <Page
                loading={false}
                mainTitle="YAX+ETH LINKSWAP LP"
                secondaryText="Provide Liquidity"
                value={`0 LPT`}
                valueInfo="Your Position"
            >
                <Row gutter={16}>
                    {activePools.map(pool => pool.name)}
                </Row>
            </Page>
        </div>
    )
}

export default Liqudity
