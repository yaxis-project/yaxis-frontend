import { useState } from 'react'
import { Typography, Row, Col } from 'antd'
import styled from 'styled-components'
import {
	DetailOverviewCard,
	DetailOverviewCardRow,
} from '../../../components/DetailOverviewCard'
// import useAccountReturns from '../../../hooks/useAccountReturns'
import Value from '../../../components/Value'
import Button from '../../../components/Button'
import RewardAPYTooltip from '../../../components/Tooltip/Tooltips/RewardAPYTooltip'
import Tooltip from '../../../components/Tooltip'
import useLPFarmAPY from '../hooks/useLPFarmAPY'
import useMyLiquidity from '../../../hooks/useMyLiquidity'
import { StakePool } from '../../../yaxis/type'
import useEarnings from '../../../hooks/useEarnings'
import useReward from '../../../hooks/useReward'
import { getBalanceNumber } from '../../../utils/formatBalance'

const { Text } = Typography

interface LiquidityOverviewCardProps {
	pool: StakePool
}

/**
 * Shows details of the liquidity pools locked in the system.
 */
export default function LiquidityOverviewCard(
	props: LiquidityOverviewCardProps,
) {
	const { pool } = props

	const lpFarmAPY = useLPFarmAPY(pool.symbol)
	const { userPoolShare } = useMyLiquidity(pool)
	const earnings = useEarnings(pool.pid)
	const { loading, error, onReward } = useReward(pool.pid)
	const [claimVisible, setClaimVisible] = useState(false)

	return (
		<DetailOverviewCard title="Overview">
			<StyledRow justify="space-between">
				<Col xs={6} sm={10} md={10}>
					<Text>Return</Text>
					<Value
						value={getBalanceNumber(earnings)}
						numberSuffix=" YAXIS"
						decimals={2}
					/>
				</Col>
				<Col xs={12} sm={12} md={12}>
					<Tooltip title={error}>
						<RewardAPYTooltip visible={claimVisible} title="">
							<Button
								disabled={!earnings.toNumber()}
								onClick={() => onReward(setClaimVisible(true))}
								loading={loading}
								height={'40px'}
							>
								Claim
							</Button>
						</RewardAPYTooltip>
					</Tooltip>
				</Col>
			</StyledRow>
			<DetailOverviewCardRow>
				<Text>Share of Pool</Text>
				<Value
					value={userPoolShare.times(100).toNumber()}
					numberSuffix="%"
					decimals={2}
				/>
			</DetailOverviewCardRow>
			<DetailOverviewCardRow>
				{pool.symbol === 'YAX/ETH LINKSWAP LP' ? (
					<Tooltip
						title={
							'Reward emissions have ended. Still gathering fees.'
						}
						visible={true}
						placement={'right'}
					>
						<Text>Average APY</Text>
					</Tooltip>
				) : (
					<Text>Average APY</Text>
				)}

				<Value
					value={lpFarmAPY.toNumber()}
					numberSuffix="%"
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
