import { useContext } from 'react'
import { Typography, Tooltip, Row } from 'antd'
import { LanguageContext } from '../../../contexts/Language'
import Value from '../../../components/Value'
import useYaxisStaking from '../../../hooks/useYAXISStaking'
import useStakingAPY from '../../../hooks/useStakingAPY'
import phrases from './translations'
import { DetailOverviewCard } from '../../../components/DetailOverviewCard'
import { CardRow } from '../../../components/ExpandableSidePanel'
import info from '../../../assets/img/info.svg'
import APYCalculator from '../../../components/APYCalculator'
import BigNumber from 'bignumber.js'

const { Text } = Typography
type Props = { totalUSDBalance: BigNumber; balanceLoading: boolean }

const SavingsOverviewCard: React.FC<Props> = ({
	totalUSDBalance,
	balanceLoading,
}) => {
	const languages = useContext(LanguageContext)
	const language = languages.state.selected

	const t = (s: string) => phrases[s][language]

	const {
		balances: { stakedBalance },
		loading,
	} = useYaxisStaking()

	const { yaxAPY, metavaultAPY, totalApy } = useStakingAPY()

	return (
		<DetailOverviewCard title={t('Account Overview')}>
			<CardRow
				main={t('YAXIS Staked')}
				secondary={
					<Value
						value={stakedBalance.toFixed(3)}
						numberSuffix=" YAXIS"
					/>
				}
			/>
			<CardRow
				main={
					<Tooltip
						title={
							<>
								<Row>YAXIS APY:</Row>
								<Row>{yaxAPY?.toFixed(2)}%</Row>
								<Row>CRV APY (20%):</Row>
								<Row>{metavaultAPY?.toFixed(2)}%</Row>
							</>
						}
					>
						<Text type="secondary">Total APY </Text>
						<img
							style={{ position: 'relative', top: -1 }}
							src={info}
							height="15"
							alt="YAXIS Supply Rewards"
						/>
					</Tooltip>
				}
				secondary={
					<Value value={totalApy.toFixed(2)} numberSuffix="%" />
				}
			/>
			<APYCalculator
				APY={totalApy.toNumber()}
				balance={totalUSDBalance}
				loading={loading || balanceLoading}
			/>
		</DetailOverviewCard>
	)
}
export default SavingsOverviewCard
