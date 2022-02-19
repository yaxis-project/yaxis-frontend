import React, { useMemo } from 'react'
import styled from 'styled-components'
import Page from '../../components/Page/Page'
import { Row, Col } from 'antd'
import LiquidityCard from './components/LiquidityCard'
import LiquidityOverviewCard from './components/LiquidityOverviewCard'
import PairStatsCard from './components/PairStatsCard'
import './index.less'
import { useAccountLP } from '../../state/wallet/hooks'
import { usePrices } from '../../state/prices/hooks'
import { LiquidityPool } from '../../constants/type/ethereum'
import Stake from './components/Stake'
import LegacyStake from './components/LegacyStake'
import { red } from '../../theme/colors'
import BigNumber from 'bignumber.js'
import { useLP } from '../../state/external/hooks'
import { formatBN } from '../../utils/number'
import useTranslation from '../../hooks/useTranslation'

type Props = {
	pool: LiquidityPool
}

const StyledCol = styled(Col)`
	@media only screen and (max-width: 991px) {
		margin-top: 16px;
	}
`

const Liquidity: React.FC<Props> = ({ pool }) => {
	const translate = useTranslation()

	const { stakedBalance, walletBalance } = useAccountLP(pool)
	const { reserves, totalSupply } = useLP(pool.name)

	const {
		prices: { yaxis, eth },
	} = usePrices()

	const balanceUSD = useMemo(() => {
		if (!reserves || !eth || !yaxis || !totalSupply || !stakedBalance)
			return new BigNumber(0)
		const share = totalSupply.isZero()
			? new BigNumber(0)
			: new BigNumber(stakedBalance?.value || 0)
					.plus(new BigNumber(walletBalance?.value || 0))
					.div(totalSupply.toString())
		const shareT0 = new BigNumber(reserves?.['_reserve0']?.toString() || 0)
			.multipliedBy(share)
			.dividedBy(10 ** 18)
		const shareT1 = new BigNumber(reserves?.['_reserve1']?.toString() || 0)
			.multipliedBy(share)
			.dividedBy(10 ** 18)
		return shareT0.multipliedBy(yaxis).plus(shareT1.multipliedBy(eth))
	}, [yaxis, eth, reserves, totalSupply, stakedBalance, walletBalance])

	return (
		<div className="liquidity-view">
			<Page
				loading={false}
				mainTitle={pool.name}
				secondaryText={translate(
					pool?.legacy ? 'Legacy Liquidity Pool' : 'Liquidity Pool',
				)}
				value={
					pool?.legacy
						? translate('No longer supported.')
						: '$' + formatBN(balanceUSD)
				}
				valueInfo={translate(
					pool?.legacy
						? 'Please unstake, remove funds, and move to a new LP.'
						: 'Your Position',
				)}
				background={pool?.legacy ? red[100] : undefined}
				backNavigate="/liquidity"
			>
				<Row gutter={16}>
					<Col xs={24} sm={24} md={24} lg={16}>
						<LiquidityCard pool={pool} />
						{pool?.legacy ? (
							<LegacyStake
								pid={pool.pid}
								tokenName={pool.symbol.toUpperCase()}
							/>
						) : (
							<Stake pool={pool} />
						)}
					</Col>
					<StyledCol xs={24} sm={24} md={24} lg={8}>
						<Row>
							<LiquidityOverviewCard
								pool={pool}
								totalUSDBalance={balanceUSD}
							/>
							<PairStatsCard pool={pool} />
						</Row>
					</StyledCol>
				</Row>
			</Page>
		</div>
	)
}

export default Liquidity
