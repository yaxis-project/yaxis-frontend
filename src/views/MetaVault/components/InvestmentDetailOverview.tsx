import React, { useContext } from 'react'
import styled from 'styled-components'
import { Row, Col, Typography, Button, Tooltip } from 'antd'
import Value from '../../../components/Value'
// import useAccountReturns from '../../../hooks/useAccountReturns'
import useMetaVault from '../../../hooks/useMetaVault';
import useMetaVaultData from '../../../hooks/useMetaVaultData';

import { LanguageContext } from '../../../contexts/Language'
import phrases from './translations'
import {
	DetailOverviewCard,
	DetailOverviewCardRow,
} from '../../../components/DetailOverviewCard'
import info from '../../../assets/img/info.svg'

import useComputeAPYs from '../hooks/useComputeAPYs'

const { Text } = Typography

const InvestmentDetailOverview: React.FC = () => {
	const languages = useContext(LanguageContext)
	const language = languages.state.selected

	const t = (s: string) => phrases[s][language]

	// const { yaxReturns, yaxReturnsUSD } = useAccountReturns()
	const { threeCrvApyPercent, yaxApyPercent, lpApyPercent, totalAPY } = useComputeAPYs()

	const { isClaiming, onGetRewards } = useMetaVault()


	const {
		onFetchMetaVaultData,
		metaVaultData
	} = useMetaVaultData('V2');


	const handleClaimRewards = async () => {
		try {
			await onGetRewards()
			onFetchMetaVaultData()
		} catch (e) {
			console.error(e)
		}
	}

	const pendingYax = parseFloat(metaVaultData?.pendingYax || '0')

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
						numberSuffix={` YAX`}
						decimals={2}
					/>
				</Col>
				<Col xs={12} sm={12} md={12}>
					<HarvestButton
						type="primary"
						disabled={!pendingYax}
						block
						loading={isClaiming}
						onClick={handleClaimRewards}
					>
						Claim
					</HarvestButton>
				</Col>
			</StyledRow>
			<DetailOverviewCardRow>
				<Tooltip
					title={
						<>
							<Row>YAX APY:</Row>
							<Row>{yaxApyPercent?.toFixed(2)}%</Row>
							<Row>Curve LP APY:</Row>
							<Row>{lpApyPercent?.toFixed(2)}%</Row>
							<Row>CRV APY (80%):</Row>
							<Row>{threeCrvApyPercent?.toFixed(2)}%</Row>
						</>
					}
				>
					<Text>Total APY{' '}</Text>
					<img
						style={{ position: 'relative', top: -1 }}
						src={info}
						height="15"
						alt="YAX Supply Rewards"
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

const HarvestButton = styled(Button)`
	background: ${props => props.theme.color.green[600]};
	border: none;
	height: 60px;
	font-weight: 600;
	&:hover {
		background-color: ${props => props.theme.color.green[500]};
	}
	&:active {
		background-color: ${props => props.theme.color.green[500]};
	}
	&:focus {
		background-color: ${props => props.theme.color.green[500]};
	}
	&[disabled] {
		color: #8c8c8c;
		background-color: #f0f0f0;
		border: none;
	}
`


export default InvestmentDetailOverview
