import React, { useState, useContext, useEffect } from 'react'
import { Currency, YAX, UNI_ETH_YAX_LP } from '../../../utils/currencies'
import useLPContractData from '../../../hooks/useLPContractData'

import theme from '../../../theme'
import { LanguageContext } from '../../../contexts/Language'
import phrases from './translations';
import useStakedBalance from '../../../hooks/useStakedBalance'

import {
  Row, Col, Typography, Card, Button, Divider, Input
} from 'antd';
import useStake from '../../../hooks/useStake'
import useUnstake from '../../../hooks/useUnstake'
import BigNumber from 'bignumber.js'
import useAllowance from '../../../hooks/useAllowance'
import useApprove from '../../../hooks/useApprove'
import useTokenBalance from '../../../hooks/useTokenBalance'
import { getFullDisplayBalance } from '../../../utils/formatBalance'
import useMyLiquidity from '../../../hooks/useMyLiquidity'
import useFarms from '../../../hooks/useFarms'

const { Title, Text } = Typography;

const TableHeader = (props: any) => (<Col span={props.span}>
  <Text type="secondary">{props.value}</Text>
</Col>)

interface LiquidityRowProps {
  icon: string;
  name: string;
  balance: string;
  symbol: string;
  //gutter: number;
}

/**
 * Generate a styled liquidity row.
 * @param props LiquidityRowProps
 */
const LiquidityRow = (props: LiquidityRowProps) => {
  const { icon, name, balance, symbol } = props;
  return (
    <Row className='liquidity-row'>
      <Col span={9}>
        <img
          src={icon}
          height="36"
          alt="logo"
        />
        <Text>{name}</Text>
      </Col>
      <Col span={15}>
         <Text>{balance} {symbol}</Text> 
      </Col>
    </Row>
  )
}

/**
 * Controls and views for user interactions with metavault liquidity pools.
 */
export default function LiquidityCard() {
  const languages = useContext(LanguageContext);
  const language = languages.state.selected;
  const gutter = 10;

  const { farmData: { pid, ...farmDataRest }, currency, stakedBalance, lpContract } = useLPContractData(
    'YAX',
    UNI_ETH_YAX_LP
  );


  const tokenBalance = useTokenBalance(lpContract?.options?.address)

  const { onStake } = useStake(pid)
  const { onUnstake } = useUnstake(pid);
  const allowance = useAllowance(lpContract);
  const { onApprove } = useApprove(lpContract);
  const { userPoolShare } = useMyLiquidity("YAX");
  const { stakedValues } = useFarms();
  const [userBalances, setUserBalances] = useState({ YAX: "0", ETH: "0" })

  useEffect(() => { 
    const stakedValue = stakedValues.find(farm => farm.pid === pid);
    if (stakedValue) {
      setUserBalances(
        {
          YAX: new BigNumber(stakedValue?.reserve[0]).times(userPoolShare).toFixed(2),
          ETH: new BigNumber(stakedValue?.reserve[1]).times(userPoolShare).toFixed(2)
        }
      )
    }
  }, [stakedValues, pid]);

  const onDeposit = async () => {
    await onStake(getFullDisplayBalance(tokenBalance));
  }

  const onWithdraw = async () => {
    await onUnstake(getFullDisplayBalance(stakedBalance));
  };

  const approve = async () => {
    await onApprove();
  };

  return (<Card className="liquidity-card" title={<strong>Your Liquidity</strong>}>
    <Row className='title-row'>
      <TableHeader value={phrases["Asset"][language]} span={9} />
      <TableHeader value={phrases["Balance"][language]} span={15} />
    </Row>
  
    <LiquidityRow
      icon={currency.icon}
      name={'Pool Tokens'}
      balance={stakedBalance.toFixed(2)}
      symbol={'LINKSWAP LP'}
    />

    <LiquidityRow
      icon={currency.icon}
      name={'YAX'}
      balance={userBalances["YAX"]}
      symbol={'YAX'}
    />

    <LiquidityRow
      icon={currency.icon}
      name={'ETH'}
      balance={userBalances["ETH"]}
      symbol={'ETH'}
    />

    <Row gutter={18}>
      <Col span={12}>
        <Button
          className="staking-btn"
            href="https://linkswap.app/#/add/0x514910771af9ca656af840dff83e8264ecf986ca/0xb1dc9124c395c1e97773ab855d66e879f053a289"
            block
            target="_blank"
            type="primary">
            <span style={{fontSize: '24px'}}>-</span>&nbsp;Remove
        </Button>
      </Col>
      <Col span={12}>
          <Button
            className="staking-btn"
            href="https://linkswap.app/#/add/0x514910771af9ca656af840dff83e8264ecf986ca/0xb1dc9124c395c1e97773ab855d66e879f053a289"
            block
            target="_blank"
            type="primary">
              <span style={{fontSize: '24px'}}>+</span>&nbsp;Add
          </Button>
        
      </Col>
    </Row>
  </Card>)
}