import React, { useContext } from 'react'
import styled from 'styled-components'
import {
	useUserBoost,
	useVaultsAPRWithBoost,
} from '../../../state/wallet/hooks'
import useTranslation from '../../../hooks/useTranslation'
import { Tooltip, Row } from 'antd'
import APYCalculator from '../../../components/APYCalculator'
import Typography from '../../../components/Typography'
import Card from '../../../components/Card'
import Value from '../../../components/Value'
import CardRow from '../../../components/CardRow'
import Claim from '../../../components/Claim'
import { InfoCircleOutlined } from '@ant-design/icons'
import BigNumber from 'bignumber.js'
import { TVaults } from '../../../constants/type'

const { Text } = Typography

interface TooltipRowProps {
	main: string
	value: any
	suffix?: string
}

const TooltipRow = ({ main, value, suffix }: TooltipRowProps) => (
	<>
		<div
			style={{ textDecoration: 'underline', textUnderlineOffset: '4px' }}
		>
			{main}
		</div>
		<Row>
			<Value
				value={value}
				numberSuffix="%"
				decimals={2}
				color={'white'}
			/>
			<span style={{ fontSize: '10px' }}>{suffix}</span>
		</Row>
	</>
)

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

	const { loading, boost } = useUserBoost(vault)

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
								value={apr[vault]?.yaxisAPR
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

			{/* <APYCalculator
				APR={0}
				balance={new BigNumber(totalUSDBalance)}
				loading={balanceLoading}
				page={'metavault'}
				last
			/> */}
		</Card>
	)
}

export default InvestmentDetailOverview

const StyledInfoIcon = styled(InfoCircleOutlined)`
	margin-left: 5px;
	color: ${(props) => props.theme.secondary.font};
	font-size: 15px;
`
