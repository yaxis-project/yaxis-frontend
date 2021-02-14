import BigNumber from 'bignumber.js'
import { provider } from 'web3-core'
import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { useWallet } from 'use-wallet'
import Card from '../../../components/Card'
import CardContent from '../../../components/CardContent'
import Label from '../../../components/Label'
import Value from '../../../components/Value'
import useAllEarnings from '../../../hooks/useAllEarnings'
import useFarms from '../../../hooks/useFarms'
import useTokenBalance from '../../../hooks/useTokenBalance'
import useYaxis from '../../../hooks/useYaxis'
import { getTotalStaking, getYaxisAddress } from '../../../yaxis/utils'
import { getBalanceNumber } from '../../../utils/formatBalance'
import useRewardPerBlock from '../../../hooks/useRewardPerBlock'
import { Row, Col } from 'antd'
import usePriceMap from '../../../hooks/usePriceMap'
import useTotalSupply from '../../../hooks/useTotalSupply'
import useMetaVaultData from '../../../hooks/useMetaVaultData'

const Balances: React.FC = () => {
	const totalSupply = useTotalSupply()
	const yaxis = useYaxis()
	const yaxisBalance = useTokenBalance(getYaxisAddress(yaxis))
	const { account } = useWallet<provider>()
	const { farms, stakedValues } = useFarms()
	const { YAX: yaxisPrice } = usePriceMap()
	const { totalAmount } = useAllEarnings()

	const rewardPerBlock = useRewardPerBlock()
	const { metaVaultData } = useMetaVaultData('v1')

	const [stakingSupply, setStakingSupply] = useState<BigNumber>(
		new BigNumber(0),
	)
	const [pricePerFullShare, setPricePerFullShare] = useState<BigNumber>(
		new BigNumber(0),
	)

	useEffect(() => {
		async function fetchStakingTotalSupply() {
			const supply = await getTotalStaking(yaxis)
			setStakingSupply(supply)
		}
		async function fetchPricePerFullShare() {
			try {
				const value = await yaxis.contracts.xYaxStaking.methods
					.getPricePerFullShare()
					.call()
				setPricePerFullShare(new BigNumber(value).div(1e18))
			} catch (e) {}
		}

		if (yaxis && yaxis.web3) {
			fetchStakingTotalSupply()
			fetchPricePerFullShare()
		}
	}, [yaxis, setStakingSupply])

	const stakingTvl = useMemo((): number => {
		return (
			new BigNumber(stakingSupply)
				.div(1e18)
				.times(pricePerFullShare)
				.times(yaxisPrice)
				.toNumber() || 0
		)
	}, [stakingSupply, pricePerFullShare, yaxisPrice])

	let tvl = new BigNumber(0)
	if (stakedValues && stakedValues.length) {
		const t = farms.reduce(
			(c, { active }, i) => c + (active ? stakedValues[i].tvl || 0 : 0),
			0,
		)
		tvl = tvl.plus(t)
	}
	if (metaVaultData?.tvl) {
		tvl = tvl.plus(metaVaultData?.tvl)
	}
	if (stakingTvl) {
		tvl = tvl.plus(stakingTvl)
	}

	return (
		<>
			<StyledWrapper gutter={[24, 24]}>
				<Col xs={24} md={12}>
					<Card>
						<CardContent>
							<StyledBalances>
								<StyledBalance>
									{/*<YaxisIcon/>*/}
									{/*<Spacer/>*/}
									<div style={{ flex: 1 }}>
										<Label text="Total Value Locked ($)" />
										<Value
											value={
												!!account
													? tvl.toNumber()
													: 'Locked'
											}
										/>
									</div>
								</StyledBalance>
							</StyledBalances>
						</CardContent>
					</Card>
				</Col>
				<Col xs={24} md={12}>
					<Card>
						<CardContent>
							<Label text="yAxis Price ($)" />
							<Value
								value={
									yaxisPrice
										? new BigNumber(yaxisPrice).toFixed(2)
										: 'Locked'
								}
							/>
						</CardContent>
					</Card>
				</Col>
			</StyledWrapper>
			<StyledWrapper gutter={[24, 24]}>
				<Col xs={24} md={12}>
					<Card>
						<CardContent>
							<StyledBalances>
								<StyledBalance>
									{/*<YaxisIcon/>*/}
									{/*<Spacer/>*/}
									<div style={{ flex: 1 }}>
										<Label text="Your YAX Balance" />
										<Value
											value={
												!!account
													? getBalanceNumber(
															yaxisBalance,
													  )
													: 'Locked'
											}
										/>
									</div>
								</StyledBalance>
							</StyledBalances>
						</CardContent>
						<Footnote>
							Pending harvest
							<FootnoteValue>
								<Value
									fontSize="12px"
									inline={true}
									value={
										!!totalAmount
											? getBalanceNumber(totalAmount)
											: 'Locked'
									}
								/>{' '}
								YAX
							</FootnoteValue>
						</Footnote>
					</Card>
				</Col>
				<Col xs={24} md={12}>
					<Card>
						<CardContent>
							<Label text="YAX Supply" />
							<Value
								value={
									totalSupply
										? getBalanceNumber(totalSupply)
										: 'Locked'
								}
							/>
						</CardContent>
						<Footnote>
							New rewards per block
							<FootnoteValue>{rewardPerBlock}</FootnoteValue>
						</Footnote>
					</Card>
				</Col>
			</StyledWrapper>
		</>
	)
}

const Footnote = styled.div`
	font-size: 14px;
	padding: 6px 8px; // 6px 20px;
	color: ${(props) => props.theme.color.grey[400]};
	border-top: solid 1px ${(props) => props.theme.color.grey[300]};
`
const FootnoteValue = styled.div`
	font-family: 'Roboto Mono', monospace;
	float: right;
`
const StyledWrapper = styled(Row)`
	margin-bottom: 24px;
`

const StyledBalances = styled.div`
	display: flex;
`

const StyledBalance = styled.div`
	align-items: center;
	display: flex;
	flex: 1;
`

export default Balances
