import { useContext } from 'react'
import { Col } from 'antd'
import { LanguageContext } from '../../../contexts/Language'
import phrases from './translations'

import useTVL from '../../../hooks/useComputeTVL'
import useTotalSupply from '../../../hooks/useTotalSupply'
import BigNumber from 'bignumber.js'
import Value from '../../../components/Value'
import { getBalanceNumber } from '../../../utils/formatBalance'
import info from '../../../assets/img/info.svg'
import {
	ExpandableSidePanel,
	CardRow,
} from '../../../components/ExpandableSidePanel'
import { Tooltip } from 'antd'
import useMetaVaultData from '../../../hooks/useMetaVaultData'
import { formatBN } from '../../../yaxis/utils'
import Button from '../../../components/Button'

interface TooltipRowProps {
	main: string
	value: any
}

const TooltipRow = ({ main, value }: TooltipRowProps) => (
	<>
		<div
			style={{ textDecoration: 'underline', textUnderlineOffset: '4px' }}
		>
			{main}
		</div>
		<div>{value}</div>
	</>
)

/**
 * Generates an expandable side panel that shows basic overview data for the home page.
 */
export default function HomeExpandableOverview() {
	const languages = useContext(LanguageContext)
	const language = languages.state.selected

	const { tvl, stakingTvl, metavaultTvl, liquidityTvl, yaxisPrice } = useTVL()
	const totalSupply = useTotalSupply()
	const { metaVaultData } = useMetaVaultData('v1')

	const hrPrice = yaxisPrice ? new BigNumber(yaxisPrice).toNumber() : 0

	return (
		<>
			<ExpandableSidePanel
				header={phrases['yAxis Overview'][language]}
				key="1"
			>
				<CardRow
					main={
						<Tooltip
							title={
								<>
									<TooltipRow
										main="Total MetaVault 2.0 value"
										value={'$' + formatBN(metavaultTvl)}
									/>
									<TooltipRow
										main="Total YAXIS Staking value"
										value={'$' + formatBN(stakingTvl)}
									/>
									<TooltipRow
										main="Total Liquidity Pool value"
										value={'$' + formatBN(liquidityTvl)}
									/>
								</>
							}
						>
							Total Value Locked{' '}
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
							value={tvl.toNumber()}
							numberPrefix="$"
							decimals={2}
						/>
					}
				/>
				<CardRow
					main="Price of YAXIS"
					secondary={
						<Value value={hrPrice} numberPrefix="$" decimals={2} />
					}
					rightContent={
						<Col lg={18} md={12} sm={12} xs={12}>
							<Button
								type="primary"
								href="https://app.uniswap.org/#/swap?outputCurrency=0xb1dc9124c395c1e97773ab855d66e879f053a289"
								target="_blank"
								height="40px"
								style={{ paddingTop: '5px' }}
							>
								Get YAXIS
							</Button>
						</Col>
					}
				/>

				<CardRow
					main={
						<Tooltip
							title={
								<>
									<TooltipRow
										main="New rewards per block"
										value={`${metaVaultData?.rewardPerBlock} YAXIS`}
									/>
								</>
							}
						>
							Yax Supply{' '}
							<img
								src={info}
								height="15"
								alt="YAXIS Supply Rewards"
							/>
						</Tooltip>
					}
					secondary={
						<Value
							value={
								totalSupply ? getBalanceNumber(totalSupply) : ''
							}
							decimals={2}
						/>
					}
				/>
			</ExpandableSidePanel>
		</>
	)
}
