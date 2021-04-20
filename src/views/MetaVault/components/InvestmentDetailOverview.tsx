import React, { useContext } from 'react'
import useAPY from '../../../hooks/useAPY'
import { LanguageContext } from '../../../contexts/Language'
import phrases from './translations'
import { Typography, Tooltip } from 'antd'
import APYCalculator from '../../../components/APYCalculator'
import { DetailOverviewCard } from '../../../components/DetailOverviewCard'
import Value from '../../../components/Value'
import { CardRow } from '../../../components/ExpandableSidePanel'
import Claim from '../../../components/Claim'
import info from '../../../assets/img/info.svg'
import BigNumber from 'bignumber.js'

const { Text } = Typography

interface TooltipRowProps {
	main: string
	value: any
}

const TooltipRow = ({ main, value }: TooltipRowProps) => (
	<>
		<div
			style={{ textDecoration: 'underline', textUnderlineOffset: '4px' }}
		>
			{main}
		</div>
		<div>
			<Value value={value} numberPrefix="$" decimals={2} />
		</div>
	</>
)

type Props = { totalUSDBalance: string; balanceLoading: boolean }

const InvestmentDetailOverview: React.FC<Props> = ({
	totalUSDBalance,
	balanceLoading,
}) => {
	const languages = useContext(LanguageContext)
	const language = languages.state.selected

	const t = (s: string) => phrases[s][language]

	const {
		data: { threeCrvApyPercent, yaxisApyPercent, lpApyPercent, totalAPY },
		loading,
	} = useAPY('MetaVault')

	return (
		<DetailOverviewCard title={t('Account Overview')}>
			<Claim rewardsContract="MetaVault" />
			<CardRow
				main={
					<Tooltip
						title={
							<>
								<TooltipRow
									main={'Curve LP APY:'}
									value={lpApyPercent.toNumber()}
								/>
								<TooltipRow
									main={'CRV APY:'}
									value={threeCrvApyPercent.toNumber()}
								/>
								<TooltipRow
									main={'YAXIS rewards APY:'}
									value={yaxisApyPercent.toNumber()}
								/>
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
						value={totalAPY.toNumber()}
						numberSuffix={'%'}
						decimals={2}
					/>
				}
			/>
			<APYCalculator
				APY={totalAPY.toNumber()}
				balance={new BigNumber(totalUSDBalance)}
				loading={loading || balanceLoading}
			/>
		</DetailOverviewCard>
	)
}

export default InvestmentDetailOverview
