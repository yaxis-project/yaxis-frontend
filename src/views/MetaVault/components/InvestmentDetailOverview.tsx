import React, { useContext, useState, useMemo } from 'react'
import styled from 'styled-components'
import { Row, Col, Typography, Tooltip, notification } from 'antd'
import Value from '../../../components/Value'
// import useAccountReturns from '../../../hooks/useAccountReturns'
import useMetaVault from '../../../hooks/useMetaVault'
import useMetaVaultData from '../../../hooks/useMetaVaultData'
import { LanguageContext } from '../../../contexts/Language'
import phrases from './translations'
import { DetailOverviewCard } from '../../../components/DetailOverviewCard'
import { CardRow } from '../../../components/ExpandableSidePanel'

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
			<CardRow
				main={t('Return')}
				secondary={
					<Value
						value={pendingYax}
						numberSuffix={` YAXIS`}
						decimals={2}
					/>
				}
				rightContent={
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
				}
			/>
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
