import {
	useState,
	useMemo,
	useCallback,
	useEffect,
	Dispatch,
	SetStateAction,
} from 'react'
import styled from 'styled-components'
import { DetailOverviewCardRow } from '../../../components/DetailOverviewCard'
import { Row, Col, notification } from 'antd'
import useWeb3Provider from '../../../hooks/useWeb3Provider'
import { currentConfig } from '../../../yaxis/configs'
import useReward from '../../../hooks/useReward'
import useMetaVault from '../../../hooks/useMetaVault'
import useMetaVaultData from '../../../hooks/useMetaVaultData'
import Value from '../../../components/Value'
import Button from '../../../components/Button'
import { getBalanceNumber } from '../../../utils/formatBalance'
import Tooltip from '../../../components/Tooltip'
import BigNumber from 'bignumber.js'

const BalanceTitle = styled(Row)`
	margin-bottom: 14px;
`

interface StepProps {
	step: number
	current: number
	setCurrent: Dispatch<SetStateAction<number>>
}

interface StepClaimProps extends StepProps {
	earnings: any
	pendingYax: any
}

const StepClaim: React.FC<StepClaimProps> = ({
	step,
	setCurrent,
	earnings = new BigNumber(0),
	pendingYax = new BigNumber(0),
}: any) => {
	const [interacted, setInteracted] = useState(false)
	const { chainId } = useWeb3Provider()

	const config = useMemo(() => currentConfig(chainId), [chainId])
	const uniYaxEthLP = useMemo(
		() => config.pools.find((pool) => pool.name === 'Uniswap YAX/ETH'),
		[config],
	)

	const { loading, error, onReward } = useReward(uniYaxEthLP.pid)

	const { isClaiming, onGetRewards } = useMetaVault()

	const { onFetchMetaVaultData } = useMetaVaultData('V2')

	const handleClaimRewards = useCallback(async () => {
		try {
			await onGetRewards()
			onFetchMetaVaultData()
		} catch (e) {
			console.error(e)
			notification.error({
				message: `Error claiming rewards:`,
				description: e.message,
			})
		}
	}, [onFetchMetaVaultData, onGetRewards])

	useEffect(() => {
		if (interacted && !earnings.toNumber() && !pendingYax.toNumber())
			setCurrent(step + 1)
	}, [earnings, pendingYax, setCurrent, step, interacted])

	return (
		<>
			<DetailOverviewCardRow>
				<BalanceTitle>MetaVault rewards</BalanceTitle>
				<Row>
					<Col xs={12} sm={12} md={12}>
						<Value
							value={getBalanceNumber(earnings)}
							numberSuffix=" YAX"
							decimals={2}
						/>
					</Col>
					<Col xs={12} sm={12} md={12}>
						<Tooltip title={error}>
							<Button
								disabled={!earnings.toNumber()}
								onClick={async () => {
									await onReward()
									setInteracted(true)
								}}
								loading={loading}
								height={'40px'}
							>
								Claim
							</Button>
						</Tooltip>
					</Col>
				</Row>
			</DetailOverviewCardRow>
			<DetailOverviewCardRow>
				<BalanceTitle>LP rewards</BalanceTitle>
				<Row>
					<Col xs={12} sm={12} md={12}>
						<Value
							value={getBalanceNumber(pendingYax)}
							numberSuffix=" YAX"
							decimals={2}
						/>
					</Col>
					<Col xs={12} sm={12} md={12}>
						<Tooltip title={error}>
							<Button
								disabled={!pendingYax.toNumber()}
								onClick={async () => {
									await handleClaimRewards()
									setInteracted(true)
								}}
								loading={isClaiming}
								height={'40px'}
							>
								Claim
							</Button>
						</Tooltip>
					</Col>
				</Row>
			</DetailOverviewCardRow>
		</>
	)
}

export default StepClaim
