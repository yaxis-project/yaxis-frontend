import styled from 'styled-components'
import { Row, Col } from 'antd'
import { useContracts } from '../../../contexts/Contracts'
import { useTVL } from '../../../state/internal/hooks'
import { useYaxisSupply } from '../../../state/internal/hooks'
import { usePrices } from '../../../state/prices/hooks'
import Value from '../../../components/Value'
import { getBalanceNumber } from '../../../utils/formatBalance'
import { InfoCircleOutlined } from '@ant-design/icons'
import { ExpandableSidePanel } from '../../../components/ExpandableSidePanel'
import { Tooltip } from 'antd'
import Button from '../../../components/Button'
import CardRow from '../../../components/CardRow'
import Divider from '../../../components/Divider'
import Typography from '../../../components/Typography'
import useTranslation from '../../../hooks/useTranslation'

const { SecondaryText } = Typography

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
		<div>
			<Value
				value={value}
				numberPrefix="$"
				decimals={2}
				color={'white'}
			/>
		</div>
	</>
)

/**
 * Generates an expandable side panel that shows basic overview data for the home page.
 */
export default function HomeExpandableOverview() {
	const translate = useTranslation()

	const { contracts } = useContracts()
	const { prices } = usePrices()

	const {
		tvl,
		stakingTvl,
		vaultsTvl,
		liquidityTvl,
		governanceTvl,
		metavaultTvl,
	} = useTVL()
	const { circulating, total } = useYaxisSupply()

	return (
		<ExpandableSidePanel header={translate('yAxis Overview')} icon="lineup">
			<CardRow
				main={
					<Tooltip
						title={
							<>
								<TooltipRow
									main={translate('Total Vaults value')}
									value={vaultsTvl.toNumber()}
								/>
								<TooltipRow
									main={translate(
										'Total Liquidity Pool value',
									)}
									value={liquidityTvl.toNumber()}
								/>
								<TooltipRow
									main={'Total Governance locked'}
									value={governanceTvl.toNumber()}
								/>

								<Divider style={{ margin: '5px 0' }} />

								<TooltipRow
									main={'Total MetaVault value (LEGACY)'}
									value={metavaultTvl.toNumber()}
								/>
								<TooltipRow
									main={'Total YAXIS Staking value (LEGACY)'}
									value={stakingTvl.toNumber()}
								/>
							</>
						}
					>
						<SecondaryText>
							{translate('Total Value Locked')}
						</SecondaryText>
						<StyledInfoIcon />
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
				main={
					<SecondaryText>{translate('Price of YAXIS')}</SecondaryText>
				}
				secondary={
					<Value value={prices.yaxis} numberPrefix="$" decimals={2} />
				}
				rightContent={
					<Col lg={18} md={12} sm={12} xs={12}>
						<a
							href={`https://app.uniswap.org/#/swap?outputCurrency=${contracts?.currencies.ERC677.yaxis?.contract.address}`}
							target="_blank"
							rel="noopener noreferrer"
						>
							<Button height={'40px'}>
								{translate('Get YAXIS')}
							</Button>
						</a>
					</Col>
				}
			/>

			<CardRow
				main={
					<SecondaryText>{translate('YAXIS Supply')}</SecondaryText>
				}
				secondary={
					<Row gutter={3}>
						<Col>
							{/*  TODO */}
							<Value
								value={circulating
									.dividedBy(10 ** 18)
									.toNumber()}
								decimals={0}
							/>
						</Col>
						<Col>{' / '}</Col>
						<Col>
							<Value
								value={total.dividedBy(10 ** 18).toNumber()}
								decimals={0}
							/>
						</Col>
					</Row>
				}
				last
			/>
		</ExpandableSidePanel>
	)
}

const StyledInfoIcon = styled(InfoCircleOutlined)`
	margin-left: 5px;
	svg {
		fill: ${(props) => props.theme.secondary.font};
	}
`
