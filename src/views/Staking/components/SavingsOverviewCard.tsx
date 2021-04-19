import { useContext } from 'react'
import { Typography, Tooltip, Row } from 'antd'
import { LanguageContext } from '../../../contexts/Language'
import Value from '../../../components/Value'
import useAPY from '../../../hooks/useAPY'
import phrases from './translations'
import { DetailOverviewCard } from '../../../components/DetailOverviewCard'
import Claim from '../../../components/Claim'
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
		data: { threeCrvApyPercent, yaxisAprPercent, lpApyPercent, totalAPR },
		loading,
	} = useAPY('Yaxis', 0.2)

	return (
		<DetailOverviewCard title={t('Account Overview')}>
			<Claim rewardsContract="Yaxis" />
			<CardRow
				main={
					<Tooltip
						title={
							<>
								<Row>Curve LP APY (20%):</Row>
								<Row>{lpApyPercent?.toFixed(2)}%</Row>
								<Row>CRV APY (20%):</Row>
								<Row>{threeCrvApyPercent?.toFixed(2)}%</Row>
								<Row>YAXIS rewards APY:</Row>
								<Row>
									{yaxisAprPercent
										?.div(100)
										.dividedBy(12)
										.plus(1)
										.pow(12)
										.minus(1)
										.multipliedBy(100)
										.toFixed(2)}
									%
								</Row>
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
					<Value
						value={lpApyPercent
							.plus(threeCrvApyPercent)
							.plus(
								yaxisAprPercent
									?.div(100)
									.dividedBy(12)
									.plus(1)
									.pow(12)
									.minus(1)
									.multipliedBy(100),
							)
							.toFixed(2)}
						numberSuffix="%"
					/>
				}
			/>
			<APYCalculator
				APY={totalAPR.toNumber()}
				balance={totalUSDBalance}
				loading={balanceLoading || loading}
			/>
		</DetailOverviewCard>
	)
}
export default SavingsOverviewCard
