import React, {useEffect, useMemo} from 'react'
import {useParams} from 'react-router-dom'
import styled from 'styled-components'
import {useWallet} from 'use-wallet'
import {provider} from 'web3-core'
import Spacer from '../../components/Spacer'
import useFarm from '../../hooks/useFarm'
import {getContract} from '../../utils/erc20'
import Harvest from './components/Harvest'
import Stake from './components/Stake'
import Button from "../../components/Button";
import {PageHeader, Row} from "antd";

const Farm: React.FC = () => {
	const {farmId} = useParams()
	const {
		pid,
		liquidId,
		lpToken,
		lpTokenAddress,
		name,
		type,
	} = useFarm(farmId) || {
		liquidId: 0,
		type: '',
		pid: 0,
		lpToken: '',
		lpTokenAddress: '',
		name: '',
	}

	useEffect(() => {
		window.scrollTo(0, 0)
	}, [])

	const {ethereum} = useWallet()
	const isBalancerPool = type == "balancer"
	const lpContract = useMemo(() => {
		return getContract(ethereum as provider, lpTokenAddress)
	}, [ethereum, lpTokenAddress])
	return (
		<>
			<PageHeader title={name} style={{padding: 0}}/>
			<Spacer size={"lg"}/>
			<StyledFarm>
				<StyledCardsWrapper>
					<StyledCardWrapper>
						<Harvest pid={pid}/>
					</StyledCardWrapper>
					<Spacer/>
					<StyledCardWrapper>
						<Stake
							lpContract={lpContract}
							pid={pid}
							tokenName={lpToken.toUpperCase()}
						/>
					</StyledCardWrapper>
				</StyledCardsWrapper>
				<Spacer size="md"/>
				<StyledInfo>
					<Button
						text="Add Liquidity"
						href={isBalancerPool ? `https://pools.balancer.exchange/#/pool/${liquidId}` : `https://app.uniswap.org/#/add/${liquidId}`}
					>
					</Button>
					<Spacer size={"md"}/>
					<Button
						text="Remove Liquidity"
						href={isBalancerPool ? `https://pools.balancer.exchange/#/pool/${liquidId}` : `https://app.uniswap.org/#/remove/${liquidId}`}
					>
					</Button>
				</StyledInfo>
				<Spacer size="lg"/>
			</StyledFarm>
		</>
	)
}
const StyledFarm = styled(Row)`
  align-items: center;
  display: flex;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 100%;
  }
`

const StyledCardsWrapper = styled.div`
  display: flex;
  width: 600px;
  @media (max-width: 768px) {
    width: 100%;
    flex-flow: column nowrap;
    align-items: center;
  }
`

const StyledCardWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 80%;
  }
`

const StyledInfo = styled.h3`
  color: ${(props) => props.theme.color.grey[400]};
  font-size: 16px;
  font-weight: 400;
  margin: 0;
  padding: 0;
  text-align: center;
`

export default Farm
