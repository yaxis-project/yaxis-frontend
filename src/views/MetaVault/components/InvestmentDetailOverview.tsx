import React, { useContext } from 'react'
import { Row, Typography, Tooltip } from 'antd'
import Value from '../../../components/Value'
// import useAccountReturns from '../../../hooks/useAccountReturns'
import { LanguageContext } from '../../../contexts/Language'
import phrases from './translations'
import { DetailOverviewCard } from '../../../components/DetailOverviewCard'
import { CardRow } from '../../../components/ExpandableSidePanel'
import Claim from './Claim'
import info from '../../../assets/img/info.svg'

import useComputeAPYs from '../hooks/useComputeAPYs'

const { Text } = Typography

const InvestmentDetailOverview: React.FC = () => {
	const languages = useContext(LanguageContext)
	const language = languages.state.selected

	const t = (s: string) => phrases[s][language]

	// const { yaxReturns, yaxReturnsUSD } = useAccountReturns()
	const {
		threeCrvApyPercent,
		yaxApyPercent,
		lpApyPercent,
		totalAPY,
	} = useComputeAPYs()

	return (
		<DetailOverviewCard title={t('Account Overview')}>
			<Claim />
			<CardRow
				main={
					<Tooltip
						title={
							<>
								<Row>YAXIS APY:</Row>
								<Row>{yaxApyPercent?.toFixed(2)}%</Row>
								<Row>Curve LP APY:</Row>
								<Row>{lpApyPercent?.toFixed(2)}%</Row>
								<Row>CRV APY (80%):</Row>
								<Row>{threeCrvApyPercent?.toFixed(2)}%</Row>
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
		</DetailOverviewCard>
	)
}

export default InvestmentDetailOverview
