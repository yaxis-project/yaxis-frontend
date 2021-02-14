import BigNumber from 'bignumber.js'
import React, { useEffect, useState } from 'react'
import Countdown, { CountdownRenderProps } from 'react-countdown'
import NumberFormat from 'react-number-format'
import styled, { keyframes } from 'styled-components'
import { useWallet } from 'use-wallet'
import Button from '../../../components/Button'
import Card from '../../../components/Card'
import CardContent from '../../../components/CardContent'
import Spacer from '../../../components/Spacer'
import useFarms from '../../../hooks/useFarms'
import useYaxis from '../../../hooks/useYaxis'
import {
	Farm,
	getEarned,
	getYaxisChefContract,
	getYaxisPrice,
} from '../../../yaxis/utils'
import { bnToDec } from '../../../utils'
import useRewardPerBlock from '../../../hooks/useRewardPerBlock'
import { Checkbox, PageHeader, Row, Divider } from 'antd'
import { CheckboxChangeEvent } from 'antd/es/checkbox'
import { getApy } from '../../../utils/number'
import { StakedValue } from '../../../contexts/Farms/types'

interface FarmWithStakedValue extends Farm, StakedValue {
	apy: BigNumber
}

function displayRow(rows: FarmWithStakedValue[][]) {
	return (
		<>
			{!!rows[0].length &&
				rows.map((farmRow, i) => (
					<StyledRow key={i}>
						{farmRow.map((farm, j) => (
							<React.Fragment key={j}>
								<FarmCard farm={farm} />
								{(j === 0 || j === 1) && <StyledSpacer />}
							</React.Fragment>
						))}
					</StyledRow>
				))}
		</>
	)
}

const FarmCards: React.FC = () => {
	const { farms, stakedValues } = useFarms()
	const yaxisPrice = getYaxisPrice(stakedValues, farms)
	const [showInactiveFarms, setShowInactiveFarms] = useState(false)
	const rewardPerBlock = useRewardPerBlock()
	const convertFarms = (items: Farm[]) => {
		return items.reduce<FarmWithStakedValue[][]>(
			(farmRows, farm, i) => {
				let stakedValue = stakedValues.find(
					(value) => value.pid == farm.pid,
				)
				let poolWeight = stakedValue?.poolWeight?.toNumber() ?? 0
				let farmApy = getApy(
					stakedValue?.tvl,
					yaxisPrice.toNumber(),
					rewardPerBlock,
					poolWeight,
				)
				const farmWithStakedValue = {
					...farm,
					...stakedValue,
					apy: new BigNumber(farmApy),
				}
				const newFarmRows = [...farmRows]
				if (newFarmRows[newFarmRows.length - 1].length === 3) {
					newFarmRows.push([farmWithStakedValue])
				} else {
					newFarmRows[newFarmRows.length - 1].push(
						farmWithStakedValue,
					)
				}
				return newFarmRows
			},
			[[]],
		)
	}
	const activeRows = convertFarms(
		farms.filter((value) => value.active === true),
	)
	const inactiveRows = convertFarms(
		farms.filter((value) => value.active === false),
	)
	const onShowInactiveFarmsChange = (e: CheckboxChangeEvent) => {
		setShowInactiveFarms(e.target.checked)
	}

	return (
		<StyledCards
			title={'Farms'}
			extra={[
				<Checkbox
					key="show_inactive_farms"
					onChange={onShowInactiveFarmsChange}
				>
					Show Inactive Farms
				</Checkbox>,
			]}
		>
			<Row justify={'center'}>{displayRow(activeRows)}</Row>
			{showInactiveFarms && (
				<>
					<Divider>Inactive</Divider>
					<Row>{displayRow(inactiveRows)}</Row>
				</>
			)}
		</StyledCards>
	)
}

interface FarmCardProps {
	farm: FarmWithStakedValue
}

const FarmCard: React.FC<FarmCardProps> = ({ farm }) => {
	const [startTime] = useState(0)
	const [, setHarvestable] = useState(0)

	const { account } = useWallet()
	const { lpTokenAddress, pid } = farm

	let type = farm.type || 'uni'
	const isBalancerPool = type == 'balancer'
	const yaxis = useYaxis()

	const renderer = (countdownProps: CountdownRenderProps) => {
		const { hours, minutes, seconds } = countdownProps
		const paddedSeconds = seconds < 10 ? `0${seconds}` : seconds
		const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes
		const paddedHours = hours < 10 ? `0${hours}` : hours
		return (
			<span style={{ width: '100%' }}>
				{paddedHours}:{paddedMinutes}:{paddedSeconds}
			</span>
		)
	}

	useEffect(() => {
		async function fetchEarned() {
			if (yaxis) return
			const earned = await getEarned(
				getYaxisChefContract(yaxis),
				pid,
				account,
			)
			setHarvestable(bnToDec(earned))
		}

		if (yaxis && account) {
			fetchEarned()
		}
	}, [yaxis, lpTokenAddress, account, setHarvestable])

	const poolActive = true // startTime * 1000 - Date.now() <= 0
	return (
		<StyledCardWrapper>
			{/* {farm.tokenSymbol === 'YAX' && <StyledCardAccent />} */}
			<Card>
				<CardContent>
					<StyledContent>
						<StyledTitle>{farm.name}</StyledTitle>
						<StyledDetails>
							<StyledDeposit>
								Deposit {farm.lpToken.toUpperCase()}
							</StyledDeposit>
							<StyledInsight>
								<span>APY</span>
								<span>
									{farm.apy
										? `${farm.apy.toFormat(1)}%`
										: 'Loading ...'}
								</span>
								{/*<span>*/}
								{/*  {farm.tokenAmount*/}
								{/*    ? (farm.tokenAmount.toNumber() || 0).toLocaleString('en-US')*/}
								{/*    : '-'}{' '}*/}
								{/*  {farm.tokenSymbol}*/}
								{/*</span>*/}
								{/*<span>*/}
								{/*  {farm.wethAmount*/}
								{/*    ? (farm.wethAmount.toNumber() || 0).toLocaleString('en-US')*/}
								{/*    : '-'}{' '}*/}
								{/*  ETH*/}
								{/*</span>*/}
							</StyledInsight>
							<StyledInsight>
								<span>TVL:</span>
								<span>
									{farm.tvl ? (
										<NumberFormat
											value={farm.tvl}
											displayType={'text'}
											thousandSeparator={true}
											decimalScale={0}
											prefix={'$'}
										/>
									) : (
										'0'
									)}
								</span>
							</StyledInsight>
						</StyledDetails>
						<Spacer />
					</StyledContent>
					<StyledButtons>
						<Button
							disabled={!poolActive}
							text={poolActive ? 'Select' : undefined}
							to={`/lp/${farm.id}`}
						>
							{!poolActive && (
								<Countdown
									date={new Date(startTime * 1000)}
									renderer={renderer}
								/>
							)}
						</Button>
						<Spacer></Spacer>
						<Button
							text="Get Pair"
							href={
								isBalancerPool
									? `https://pools.balancer.exchange/#/pool/${lpTokenAddress}`
									: `https://uniswap.info/pair/${lpTokenAddress}`
							}
						></Button>
					</StyledButtons>
				</CardContent>
			</Card>
		</StyledCardWrapper>
	)
}
const StyledTabButton = styled.span`
	display: flex;
	margin: 20px;
	width: 200px;
`
const StyledTabs = styled.div`
	display: flex;
	justify-content: center;
`
const StyledButtons = styled.div`
	display: flex;
	justify-content: space-between;
`
const RainbowLight = keyframes`

	0% {
		background-position: 0% 50%;
	}
	50% {
		background-position: 100% 50%;
	}
	100% {
		background-position: 0% 50%;
	}
`

const StyledCards = styled(PageHeader)`
	padding: 0;
	@media (max-width: 768px) {
		width: 100%;
	}
`

const StyledRow = styled.div`
	display: flex;
	margin-bottom: ${(props) => props.theme.spacing[4]}px;
	flex-flow: row wrap;
	justify-content: center;
	@media (max-width: 768px) {
		width: 100%;
		flex-flow: column nowrap;
		align-items: center;
	}
`

const StyledCardWrapper = styled.div`
	display: flex;
	width: calc((900px - ${(props) => props.theme.spacing[4]}px * 2) / 3);
	position: relative;
`

const StyledTitle = styled.h4`
	color: ${({ theme }) => theme.color.primary.main};
	font-size: 16px;
	font-weight: 700;
	margin: ${(props) => props.theme.spacing[2]}px 0 0;
	padding: 0;
`

const StyledContent = styled.div`
	align-items: center;
	display: flex;
	flex-direction: column;
`

const StyledSpacer = styled.div`
	height: ${(props) => props.theme.spacing[4]}px;
	width: ${(props) => props.theme.spacing[4]}px;
`

const StyledDetails = styled.div`
	margin-top: ${(props) => props.theme.spacing[2]}px;
	text-align: center;
`
const StyledDeposit = styled.div`
	color: ${(props) => props.theme.color.grey[100]};
	margin-top: 10px;
	height: 40px;
	text-align: center;
	font-size: 13px;
`
const StyledDetail = styled.div`
	color: ${(props) => props.theme.color.grey[100]};
	margin-top: 10px;
	text-align: center;
	font-size: 14px;
`

const StyledInsight = styled.div`
	max-width: 480px;
	display: flex;
	justify-content: space-between;
	box-sizing: border-box;
	border-radius: 8px;
	color: #ffffff;
	width: 100%;
	margin-top: 12px;
	margin-bottom: 12px;
	line-height: 32px;
	font-size: 12px;
	text-align: center;
	padding: 0 12px;
`

export default FarmCards
