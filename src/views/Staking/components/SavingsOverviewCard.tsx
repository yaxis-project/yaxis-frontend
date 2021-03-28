import { useState, useContext, useMemo, useEffect } from 'react'
import { Typography, Tooltip, Row } from 'antd'
import { LanguageContext } from '../../../contexts/Language'
import Value from '../../../components/Value'
import useYaxisStaking from '../../../hooks/useYaxisStaking'
import phrases from './translations'
import {
	DetailOverviewCard,
	DetailOverviewCardRow,
} from '../../../components/DetailOverviewCard'
import useYAxisAPY from '../../../hooks/useYAxisAPY'
import useMetaVaultData from '../../../hooks/useMetaVaultData'
import useStaking from '../../../hooks/useStaking'
import usePriceMap from '../../../hooks/usePriceMap'
import useYaxis from '../../../hooks/useYaxis'
import useBlock from '../../../hooks/useBlock'
import BigNumber from 'bignumber.js'
import { getTotalStaking } from '../../../yaxis/utils';
import info from '../../../assets/img/info.svg'

const { Text } = Typography

export default function SavingsOverviewCard() {
	// const [loading, setLoading] = useState(true)
	// setTimeout(() => setLoading(false), 1000)
	const languages = useContext(LanguageContext)
	const language = languages.state.selected

	const t = (s: string) => phrases[s][language]

	// const { yaxReturns, yaxReturnsUSD } = useAccountReturns()
	const { balances: { stakedBalance } } = useYaxisStaking()
	const { yAxisAPY } = useYAxisAPY()

	const [totalSupply, setTotalStaking] = useState<BigNumber>(new BigNumber(0))
	const [pricePerFullShare, setPricePerFullShare] = useState<BigNumber>(new BigNumber(0))
	const { stakingData } = useStaking()
	const yaxis = useYaxis()
	const block = useBlock()
	useEffect(() => {
		async function fetchTotalStakinga() {
			const totalStaking = await getTotalStaking(yaxis)
			setTotalStaking(totalStaking)
		}
		async function fetchPricePerFullShare() {
			try {
				const value = await yaxis.contracts.xYaxStaking.methods.getPricePerFullShare().call()
				setPricePerFullShare(new BigNumber(value).div(1e18))
			} catch (e) {
			}
		}


		if (yaxis) {
			fetchTotalStakinga()
			fetchPricePerFullShare()
		}
	}, [yaxis, setTotalStaking, block])
	const { metaVaultData } = useMetaVaultData('v1')
	const threeCrvApyPercent = useMemo(
		() => new BigNumber((yAxisAPY && yAxisAPY['3crv']) || 0),
		[yAxisAPY],
	)
	const priceMap = usePriceMap()
	const totalValueLocked = new BigNumber(totalSupply).div(1e18).times(priceMap?.YAX).toNumber() || 0
	const sumApy = new BigNumber(threeCrvApyPercent).div(100).multipliedBy(0.2)
	const annualProfits = sumApy
		.div(365)
		.plus(1)
		.pow(365)
		.minus(1)
		.times(metaVaultData?.tvl || 0)
	// const rate = pricePerFullShare.toNumber()
	let metavaultAPY = new BigNumber(annualProfits).dividedBy(totalValueLocked || 1).multipliedBy(100)
	let yaxAPY = stakingData?.incentiveApy ? new BigNumber(stakingData?.incentiveApy)
		.div(pricePerFullShare)
		.div(100) : new BigNumber(0)
	const totalApy = yaxAPY.plus(metavaultAPY)

	return (
		<DetailOverviewCard title={t('Account Overview')}>
			{/* <DetailOverviewCardRow>
				<Text>Returns</Text>
				<Value
					// numberPrefix="$"
					value={"TBD"}
					// extra={`${yaxReturns} YAX`}
					decimals={2}
				/>
			</DetailOverviewCardRow> */}
			<DetailOverviewCardRow>
				<Text>YAX Staked</Text>
				<Value value={stakedBalance.toFixed(3)} numberSuffix=" YAX" />
			</DetailOverviewCardRow>
			<DetailOverviewCardRow>
				<Tooltip
					title={
						<>
							<Row>YAX APY:</Row>
							<Row>{yaxAPY?.toFixed(2)}%</Row>
							<Row>CRV APY (20%):</Row>
							<Row>{metavaultAPY?.toFixed(2)}%</Row>
						</>
					}
				>
					<Text>Total APY{' '}</Text>
					<img
						style={{ position: 'relative', top: -1 }}
						src={info}
						height="15"
						alt="YAX Supply Rewards"
					/>
				</Tooltip>
				<Value value={totalApy.toFixed(2)} numberSuffix="%" />
			</DetailOverviewCardRow>
		</DetailOverviewCard>
	)
}
