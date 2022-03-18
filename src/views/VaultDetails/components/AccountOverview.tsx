import React from 'react'
import {
	useUserBoost,
	useVaultsAPRWithBoost,
} from '../../../state/wallet/hooks'
import useTranslation from '../../../hooks/useTranslation'
import { Row } from 'antd'
import Typography from '../../../components/Typography'
import Card from '../../../components/Card'
import Value from '../../../components/Value'
import CardRow from '../../../components/CardRow'
import Claim from '../../../components/Claim'
import { TVaults } from '../../../constants/type'
import APYCalculator from '../../../components/APYCalculator'
import BigNumber from 'bignumber.js'
import { useChainInfo } from '../../../state/user'

const { Text } = Typography

type Props = {
	totalUSDBalance: string
	balanceLoading: boolean
	vault: TVaults
}

const InvestmentDetailOverview: React.FC<Props> = ({
	totalUSDBalance,
	balanceLoading,
	vault,
}) => {
	const t = useTranslation()

	const apr = useVaultsAPRWithBoost()
	const { blockchain } = useChainInfo()
	const { boost } = useUserBoost(vault)

	return (
		<Card title={t('Account Overview')} icon="yaxis">
			<CardRow
				main={
					// <Tooltip
					// 	title={
					// 		<>
					// 			<Row style={{ marginBottom: '5px' }}>
					// 				Annual Percentage Rate
					// 			</Row>
					// 			TODO: description
					// 		</>
					// 	}
					// >
					// 	<StyledInfoIcon alt="Boost more information icon" />
					// </Tooltip>
					<Text type="secondary">Boost</Text>
				}
				secondary={
					<Value
						value={boost?.toFixed(2)}
						numberSuffix={'x'}
						decimals={2}
					/>
				}
				rightContent={
					<>
						<Row>
							{/* <Tooltip
								title={
									<>
										<Row style={{ marginBottom: '5px' }}>
											Annual Percentage Rate
										</Row>
										TODO: description
									</>
								}
							>
								<StyledInfoIcon alt="YAXIS Rewards more information icon" />
							</Tooltip> */}
							<Text type="secondary">Rewards APR </Text>
						</Row>
						<Row>
							<Value
								value={apr[blockchain]?.[vault]?.yaxisAPR
									.multipliedBy(100)
									.toNumber()}
								numberSuffix={'%'}
								decimals={2}
							/>
						</Row>
					</>
				}
			/>
			<Claim vault={vault} last />

			<APYCalculator
				APR={apr[blockchain]?.[vault]?.yaxisAPR
					.multipliedBy(100)
					.toNumber()}
				balance={new BigNumber(totalUSDBalance)}
				loading={balanceLoading}
				page={'metavault'}
				last
			/>
		</Card>
	)
}

export default InvestmentDetailOverview
