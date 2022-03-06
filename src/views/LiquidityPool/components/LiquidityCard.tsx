import React, { useMemo } from 'react'
import Card from '../../../components/Card'
import Typography from '../../../components/Typography'
import Divider from '../../../components/Divider'
import { Row, Col } from 'antd'
import Button from '../../../components/Button'
import Value from '../../../components/Value'
import { LiquidityPool } from '../../../constants/type'
import { PlusOutlined, MinusOutlined } from '@ant-design/icons'
import { Currencies } from '../../../constants/currencies'
import { getFullDisplayBalance } from '../../../utils/formatBalance'
import { useWalletLP } from '../../../state/wallet/hooks'
import { useLiquidityPool } from '../../../state/external/hooks'
import useTranslation from '../../../hooks/useTranslation'

const { Text } = Typography

const TableHeader = (props: any) => (
	<Col span={props.span} style={{ padding: '15px 22px' }}>
		<Text type="secondary">{props.value}</Text>
	</Col>
)

interface LiquidityRowProps {
	icon: string
	name: string
	balance: string
	symbol: string
}

/**
 * Generate a styled liquidity row.
 * @param props LiquidityRowProps
 */
const LiquidityRow = (props: LiquidityRowProps) => {
	const { icon, name, balance, symbol } = props
	return (
		<Row
			style={{
				padding: '28px 22px',
				fontSize: '18px',
			}}
		>
			<Col span={9}>
				<img src={icon} height="36" width="36" alt="logo" />
				<Text>{name}</Text>
			</Col>
			<Col span={15}>
				<Row style={{ borderBottom: 'none' }}>
					<Col style={{ marginRight: '10px' }}>
						<Value value={Number(balance)} decimals={2} secondary />
					</Col>
					<Col>
						<Text>{symbol}</Text>
					</Col>
				</Row>
			</Col>
		</Row>
	)
}

/**
 * Controls and views for user interactions with metavault liquidity pools.
 */

type Props = {
	pool: LiquidityPool
}

const LiquidityCard: React.FC<Props> = ({ pool }) => {
	const translate = useTranslation()

	const { lpUrl, reserves } = useLiquidityPool(pool.name)
	const { walletBalance, poolShare, stakedBalance } = useWalletLP(pool.name)

	const accountBalances = useMemo(
		() =>
			Object.values(reserves).map((reserves) =>
				poolShare.multipliedBy(reserves),
			),
		[reserves, poolShare],
	)

	const currency = useMemo(() => Currencies[pool.tokenSymbol], [pool])

	return (
		<Card
			className="liquidity-card"
			title={
				<Text>
					<strong>{translate('Your Liquidity')}</strong>
				</Text>
			}
		>
			<Row>
				<TableHeader value={translate('Asset')} span={9} />
				<TableHeader value={translate('Balance')} span={15} />
			</Row>
			<Divider style={{ margin: '0' }} />

			<LiquidityRow
				icon={currency?.icon}
				name={translate('Pool Tokens')}
				balance={getFullDisplayBalance(
					walletBalance.value.plus(stakedBalance?.value),
				)}
				symbol={pool.symbol}
			/>
			<Divider style={{ margin: '0' }}>
				<Text>{translate('REPRESENTING')}:</Text>
			</Divider>
			{pool.lpTokens.map(({ tokenId }, i) => (
				<>
					<LiquidityRow
						key={`LiquidityRow-${tokenId}-${i}`}
						icon={Currencies[tokenId.toUpperCase()]?.icon}
						name={tokenId.toUpperCase()}
						balance={accountBalances[i].toString()}
						// balance={userBalances[i]}
						symbol={tokenId.toUpperCase()}
					/>
					<Divider style={{ margin: '0' }} />
				</>
			))}

			<Row gutter={18} justify="center" style={{ padding: '20px' }}>
				<Col span={12}>
					<Button
						style={{ width: '100%' }}
						disabled={!lpUrl || !walletBalance.amount.toNumber()}
						icon={<MinusOutlined />}
						onClick={() =>
							window.open(
								lpUrl.replace('add', 'remove'),
								'_blank',
							)
						}
					>
						{translate('Remove')}
					</Button>
				</Col>
				{!pool?.legacy && (
					<Col span={12}>
						<Button
							style={{ width: '100%' }}
							disabled={!lpUrl}
							icon={<PlusOutlined />}
							onClick={() => window.open(lpUrl, '_blank')}
						>
							{translate('Add')}
						</Button>
					</Col>
				)}
			</Row>
		</Card>
	)
}

export default LiquidityCard
