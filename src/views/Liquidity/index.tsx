import React from 'react';
import Page from '../../components/Page/Page';
import YaxisPriceGraph from '../../components/YaxisPriceGraph';
import { Row, Col } from 'antd';
import LiquidityCard from './components/LiquidityCard';
import LiquidityOverviewCard from './components/LiquidityOverviewCard';
import PairStatsCard from './components/PairStatsCard';
import './index.less';
import { UNI_ETH_YAX_LP } from '../../utils/currencies'
import useMyLiquidity from '../../hooks/useMyLiquidity'
import useLPContractData from '../../hooks/useLPContractData';
import { numberToFloat } from "../../yaxis/utils";

const Liqudity: React.FC = () => {
  const farmId = 'YAX';

  // should use this method to get 'stakedBalance' rather than 'userBalance' below
  // as it's hooked up to block updates & other internal data
  const { stakedBalance } = useLPContractData(
    farmId,
    UNI_ETH_YAX_LP
  );
  
  return (<div className="liquidity-view">
      <Page
        loading={false}
        mainTitle="YAX+ETH LINKSWAP LP"
        secondaryText="Provide Liquidity"
        value={`${numberToFloat(stakedBalance)} LPT`}
        valueInfo="Your Position"
      >
        <Row gutter={16}>
          <Col span={16}>
            <YaxisPriceGraph />
            <LiquidityCard />
          </Col>
          <Col span={8}>
            <Row>
              <LiquidityOverviewCard farmID={farmId} />
              <PairStatsCard />
            </Row>
          </Col>
        </Row>
      </Page>
  </div>);
}

export default Liqudity;