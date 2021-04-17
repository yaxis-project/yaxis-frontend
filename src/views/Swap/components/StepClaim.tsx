import { useState, useMemo, useCallback, Dispatch, SetStateAction } from 'react'
import styled from 'styled-components'
import { DetailOverviewCardRow } from '../../../components/DetailOverviewCard'
import { Row, notification, Steps, Button } from 'antd'
import useWeb3Provider from '../../../hooks/useWeb3Provider'
import { currentConfig } from '../../../yaxis/configs'
import useReward from '../../../hooks/useReward'
import useMetaVault from '../../../hooks/useMetaVault'
import useMetaVaultData from '../../../hooks/useMetaVaultData'
import BigNumber from 'bignumber.js'
import useUnstake from '../../../hooks/useUnstake'
import { ExclamationCircleOutlined } from '@ant-design/icons'
const { Step } = Steps

interface StepProps {
	step: number
	current: number
	setCurrent: Dispatch<SetStateAction<number>>
}

interface StepClaimProps extends StepProps {
	earnings: any
	pendingYax: any
	stakedUniLP: BigNumber
	uniLPBalance: BigNumber
	linkLPBalance: BigNumber
}

const StepClaim: React.FC<StepClaimProps> = ({
	earnings = new BigNumber(0),
	pendingYax = new BigNumber(0),
	stakedUniLP,
	uniLPBalance,
	linkLPBalance,
}) => {
	const { chainId } = useWeb3Provider()

	const config = useMemo(() => currentConfig(chainId), [chainId])
	const uniYaxEthLP = useMemo(
		() => config.pools.find((pool) => pool.name === 'Uniswap YAX/ETH'),
		[config],
	)

	const { loading, onReward } = useReward(uniYaxEthLP.pid)

	const mvRewards = useMemo(() => {
		if (earnings.gt(0))
			return (
				<Step
					title="Claim MetaVault rewards"
					description="Gather pending MetaVault rewards"
					icon={
						<StyledButton
							icon={
								<StyledIcon
									onClick={async () => {
										await onReward()
									}}
								/>
							}
							loading={loading}
							disabled={!earnings.toNumber()}
						/>
					}
				/>
			)
		return (
			<Step
				title="MetaVault rewards"
				description="All complete."
				status="finish"
			/>
		)
	}, [earnings, loading, onReward])

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

	const [loadingUnstakeUni, setLoadingUnstakeUni] = useState(false)

	const { onUnstake } = useUnstake(uniYaxEthLP?.pid, uniYaxEthLP?.name)

	const uniswapLP = useMemo(() => {
		if (pendingYax.gt(0))
			return (
				<Step
					title="Claim Liquidity Pool rewards"
					description="Gather pending Uniswap YAX / ETH rewards"
					icon={
						<StyledButton
							icon={
								<StyledIcon
									onClick={async () => {
										await handleClaimRewards()
									}}
								/>
							}
							loading={isClaiming}
							disabled={!pendingYax.toNumber()}
						/>
					}
				/>
			)
		if (stakedUniLP.gt(0))
			return (
				<Step
					title="Unstake Uniswap YAX / ETH"
					description="Withdraw your LP token from the previous rewards contract."
					icon={
						<StyledButton
							icon={
								<StyledIcon
									onClick={async () => {
										try {
											setLoadingUnstakeUni(true)
											await onUnstake(
												stakedUniLP.toString(),
											)
											setLoadingUnstakeUni(false)
										} catch {
											setLoadingUnstakeUni(false)
										}
									}}
								/>
							}
							loading={loadingUnstakeUni}
						/>
					}
				/>
			)
		if (uniLPBalance.gt(0))
			return (
				<Step
					title="De-fund Uniswap YAX / ETH"
					description="Remove liquidity from the old liquidity pool."
					icon={
						<StyledButton
							icon={
								<StyledIcon
									onClick={() =>
										window.open(uniYaxEthLP.lpUrl, '_blank')
									}
								/>
							}
						/>
					}
				/>
			)
		return (
			<Step
				title={'Uniswap YAX / ETH'}
				description="All complete."
				status="finish"
			/>
		)
	}, [
		uniLPBalance,
		stakedUniLP,
		loadingUnstakeUni,
		uniYaxEthLP,
		onUnstake,
		handleClaimRewards,
		isClaiming,
		pendingYax,
	])

	const linkYaxEthLP = useMemo(
		() => config.pools.find((pool) => pool.name === 'Linkswap YAX/ETH'),
		[config],
	)

	const linkLP = useMemo(() => {
		if (linkLPBalance.gt(0))
			return (
				<Step
					title="De-fund Linkswap YAX / ETH"
					description="Remove liquidity from the old liquidity pool."
					icon={
						<StyledButton
							icon={
								<StyledIcon
									onClick={() =>
										window.open(
											linkYaxEthLP.lpUrl,
											'_blank',
										)
									}
								/>
							}
						/>
					}
				/>
			)
		return (
			<Step
				title={'Linkswap YAX / ETH'}
				description="All complete."
				status="finish"
			/>
		)
	}, [linkLPBalance, linkYaxEthLP])

	const message = useMemo(() => {
		if (
			earnings.gt(0) ||
			pendingYax.gt(0) ||
			stakedUniLP.gt(0) ||
			uniLPBalance.gt(0) ||
			linkLPBalance.gt(0)
		)
			return 'First, gather up all of your YAX'

		return 'All complete.'
	}, [earnings, pendingYax, stakedUniLP, uniLPBalance, linkLPBalance])

	return (
		<>
			<DetailOverviewCardRow>
				<Description>{message}</Description>
				<Steps direction="vertical">
					{mvRewards}
					{uniswapLP}
					{linkLP}
				</Steps>
			</DetailOverviewCardRow>
		</>
	)
}

export default StepClaim

const Description = styled(Row)`
	font-size: 16px;
	padding: 0 10px 20px 10px;
`
const StyledButton = styled(Button)`
	border: none;
`
const StyledIcon = styled(ExclamationCircleOutlined)`
	font-size: 30px;
	color: gold;
	&:hover {
		transition: color 0.5s;
		color: #e8b923;
	}
`
