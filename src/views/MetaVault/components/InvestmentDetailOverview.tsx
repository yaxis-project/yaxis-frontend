import React, { useContext, useState, useMemo } from 'react'
import styled from 'styled-components'
import { Row, Col, Typography, Tooltip, notification } from 'antd'
import Value from '../../../components/Value'
// import useAccountReturns from '../../../hooks/useAccountReturns'
import useMetaVault from '../../../hooks/useMetaVault'
import useMetaVaultData from '../../../hooks/useMetaVaultData'
import { LanguageContext } from '../../../contexts/Language'
import phrases from './translations'
import {
	DetailOverviewCard,
	DetailOverviewCardRow,
} from '../../../components/DetailOverviewCard'
import Button from '../../../components/Button'
import RewardAPYTooltip from '../../../components/Tooltip/Tooltips/RewardAPYTooltip'
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

	const { isClaiming, onGetRewards } = useMetaVault()

	const { onFetchMetaVaultData, metaVaultData } = useMetaVaultData('V2')

	const [claimVisible, setClaimVisible] = useState(false)
	const handleClaimRewards = async () => {
		try {
			await onGetRewards(() => setClaimVisible(true))
			onFetchMetaVaultData()
		} catch (e) {
			setClaimVisible(false)
			console.error(e)
			notification.error({
				message: `Error claiming rewards:`,
				description: e.message,
			})
		}
	}

	const pendingYax = useMemo(
		() => parseFloat(metaVaultData?.pendingYax || '0'),
		[metaVaultData?.pendingYax],
	)

	return (
		<DetailOverviewCard title={t('Account Overview')}>
			<StyledRow justify="space-between">
				<Col xs={6} sm={10} md={10}>
					<Text>Return</Text>
					<Value
						// numberPrefix="$"
						// value={yaxReturnsUSD}
						value={pendingYax}
						// numberSuffix={`${yaxReturns} YAX`}
						numberSuffix={` YAXIS`}
						decimals={2}
					/>
				</Col>
				<Col xs={12} sm={12} md={12}>
					<RewardAPYTooltip visible={claimVisible} title="">
						<Button
							disabled={!pendingYax}
							loading={isClaiming}
							onClick={handleClaimRewards}
							height={'40px'}
						>
							Claim
						</Button>
					</RewardAPYTooltip>
				</Col>
			</StyledRow>
			<DetailOverviewCardRow>
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
					<Text>Total APY </Text>
					<img
						style={{ position: 'relative', top: -1 }}
						src={info}
						height="15"
						alt="YAXIS Supply Rewards"
					/>
				</Tooltip>
				<Value
					value={totalAPY.toFixed(2)}
					numberSuffix={'%'}
					decimals={2}
				/>
			</DetailOverviewCardRow>
		</DetailOverviewCard>
	)
}

const StyledRow = styled(Row)`
	font-size: 18px;
	padding: 22px;
	border-top: 1px solid #eceff1;

	.ant-typography {
		font-size: 14px;
		color: #333333;
	}

	&[data-inline='true'] {
		display: flex;
		justify-content: space-between;
		align-items: center;
		> .ant-typography {
			font-size: 18px;
		}
	}
`

export default InvestmentDetailOverview
