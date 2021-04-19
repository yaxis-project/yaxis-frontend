import React, { useContext } from 'react'
import useAPY from '../../../hooks/useAPY'
import { LanguageContext } from '../../../contexts/Language'
import phrases from './translations'
import { Row, Typography, Tooltip } from 'antd'
import APYCalculator from '../../../components/APYCalculator'
import { DetailOverviewCard } from '../../../components/DetailOverviewCard'
import Value from '../../../components/Value'
import { CardRow } from '../../../components/ExpandableSidePanel'
import Claim from '../../../components/Claim'
import info from '../../../assets/img/info.svg'
import BigNumber from 'bignumber.js'

const { Text } = Typography

type Props = { totalUSDBalance: string; balanceLoading: boolean }

const InvestmentDetailOverview: React.FC<Props> = ({
	totalUSDBalance,
	balanceLoading,
}) => {
	const languages = useContext(LanguageContext)
	const language = languages.state.selected

	const t = (s: string) => phrases[s][language]

	const {
		data: {
			threeCrvApyPercent,
			yaxisApyPercent,
			lpApyPercent,
			totalAPY,
			totalAPR,
		},
		loading,
	} = useAPY('MetaVault', 0.8)

	return (
		<DetailOverviewCard title={t('Account Overview')}>
			<Claim rewardsContract="MetaVault" />
			<CardRow
				main={
					<Tooltip
						title={
							<>
								<Row>Curve LP APY:</Row>
								<Row>{lpApyPercent?.toFixed(2)}%</Row>
								<Row>CRV APY (80%):</Row>
								<Row>{threeCrvApyPercent?.toFixed(2)}%</Row>
								<Row>YAXIS rewards APY:</Row>
								<Row>{yaxisApyPercent?.toFixed(2)}%</Row>
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
						value={totalAPY.toFixed(2)}
						numberSuffix={'%'}
						decimals={2}
					/>
				}
			/>
			<APYCalculator
				APY={totalAPR.toNumber()}
				balance={new BigNumber(totalUSDBalance)}
				loading={loading || balanceLoading}
			/>
		</DetailOverviewCard>
	)
}

export default InvestmentDetailOverview
