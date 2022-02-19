import React from 'react'

// import CardRow from '../../../components/CardRow'
import ClaimAll from '../../../components/ClaimAll'
import Card from '../../../components/Card'
// import BigNumber from 'bignumber.js'
import useTranslation from '../../../hooks/useTranslation'

type Props = { totalUSDBalance: string; balanceLoading: boolean }

const InvestmentDetailOverview: React.FC<Props> = ({
	totalUSDBalance,
	balanceLoading,
}) => {
	const translate = useTranslation()
	return (
		<Card title={translate('Account Overview')} icon="yaxis">
			<ClaimAll />
			{/* <CardRow
				main={
					<Tooltip
						title={
							<>
								<Row style={{ marginBottom: '5px' }}>
									Annual Percentage Rate
								</Row>
								<TooltipRow
									main={'Curve LP APY:'}
									value={lpApyPercent.toNumber()}
								/>
								<TooltipRow
									main={'CRV APY:'}
									value={threeCrvApyPercent.toNumber()}
								/>
								<TooltipRow
									main={'YAXIS rewards APR:'}
									value={yaxisAprPercent.toNumber()}
								/>
							</>
						}
					>
						<Text type="secondary">Average APR </Text>
						<StyledInfoIcon alt="YAXIS Supply Rewards" />
					</Tooltip>
				}
				secondary={
					<Value
						value={lpApyPercent
							.plus(threeCrvApyPercent)
							.plus(yaxisAprPercent)
							.toNumber()}
						numberSuffix={'%'}
						decimals={2}
					/>
				}
				rightContent={
					<>
						<Row>
							<Tooltip
								title={
									<>
										<Row style={{ marginBottom: '5px' }}>
											Annual Percentage Yield
										</Row>
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
											suffix={'* daily compound'}
										/>
									</>
								}
							>
								<Text type="secondary">Average APY </Text>
								<StyledInfoIcon alt="YAXIS Supply Rewards" />
							</Tooltip>
						</Row>
						<Row>
							<Value
								value={totalAPY.toNumber()}
								numberSuffix={'%'}
								decimals={2}
							/>
						</Row>
					</>
				}
			/> */}
			{/* <APYCalculator
				APR={totalAPR.toNumber()}
				balance={new BigNumber(totalUSDBalance)}
				loading={balanceLoading}
				page={'metavault'}
				last
			/> */}
		</Card>
	)
}

export default InvestmentDetailOverview
