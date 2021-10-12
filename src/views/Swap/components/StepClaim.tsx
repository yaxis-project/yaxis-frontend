import { useMemo, useCallback, Dispatch, SetStateAction } from 'react'
import styled from 'styled-components'
import { DetailOverviewCardRow } from '../../../components/DetailOverviewCard'
import { Row } from 'antd'
import Steps from '../../../components/Steps'
import Button from '../../../components/Button'
import useWeb3Provider from '../../../hooks/useWeb3Provider'
import { currentConfig } from '../../../constants/configs'
import BigNumber from 'bignumber.js'
import useContractWrite from '../../../hooks/useContractWrite'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import useTranslation from '../../../hooks/useTranslation'
const { Step } = Steps

interface StepProps {
	step: number
	current: number
	setCurrent: Dispatch<SetStateAction<number>>
	complete: boolean
}

interface StepClaimProps extends StepProps {
	earnings: any
	pendingYax: any
	stakedUniLP: BigNumber
	uniLPBalance: BigNumber
	linkLPBalance: BigNumber
	stakedMvlt: BigNumber
}

const StepClaim: React.FC<StepClaimProps> = ({
	earnings = new BigNumber(0),
	pendingYax = new BigNumber(0),
	stakedUniLP,
	uniLPBalance,
	linkLPBalance,
	stakedMvlt,
}) => {
	const translate = useTranslation()

	const { chainId } = useWeb3Provider()

	const config = useMemo(() => currentConfig(chainId), [chainId])
	const uniYaxEthLP = useMemo(() => config.pools['Uniswap YAX/ETH'], [config])

	const { call: onGetRewards, loading: isClaiming } = useContractWrite({
		contractName: 'internal.yAxisMetaVault',
		method: 'unstake',
		description: `claiming MetaVault rewards`,
	})

	const { call: handleUnstake, loading: loadingUnstakeMVLT } =
		useContractWrite({
			contractName: `internal.yAxisMetaVault`,
			method: 'unstake',
			description: `unstake MVLT`,
		})

	const handleClaimRewards = useCallback(async () => {
		await onGetRewards({ args: ['0'] })
	}, [onGetRewards])

	const mvRewards = useMemo(() => {
		if (stakedMvlt.gt(0))
			return (
				<Step
					title={
						<StyledButton
							onClick={async () => {
								await handleUnstake({
									args: [stakedMvlt.toString()],
								})
							}}
							loading={loadingUnstakeMVLT}
							height={'40px'}
						>
							{translate('Unstake')} MVLT
						</StyledButton>
					}
					description="Withdraw your MVLT from the previous rewards contract."
					status="wait"
					icon={<StyledIcon />}
				/>
			)
		if (pendingYax.gt(0))
			return (
				<Step
					title={
						<StyledButton
							onClick={async () => handleClaimRewards()}
							loading={isClaiming}
							disabled={!pendingYax.toNumber()}
							height={'40px'}
						>
							{translate('Claim')} MetaVault rewards
						</StyledButton>
					}
					description="Gather pending MetaVault rewards"
					icon={<StyledIcon />}
				/>
			)
		return (
			<Step
				title="MetaVault rewards"
				description="Done."
				status="finish"
			/>
		)
	}, [
		translate,
		pendingYax,
		isClaiming,
		handleClaimRewards,
		stakedMvlt,
		handleUnstake,
		loadingUnstakeMVLT,
	])

	const { call: onReward, loading } = useContractWrite({
		contractName: 'internal.yaxisChef',
		method: 'deposit',
		description: `claim rewards`,
	})

	const { call: onUnstake, loading: unstakeLoading } = useContractWrite({
		contractName: 'internal.yaxisChef',
		method: 'withdraw',
		description: `unstake ${uniYaxEthLP?.name}`,
	})

	const uniswapLP = useMemo(() => {
		if (stakedUniLP.gt(0))
			return (
				<Step
					title={
						<StyledButton
							onClick={async () => {
								onUnstake({
									args: [
										uniYaxEthLP?.pid,
										stakedUniLP.toString(),
									],
								})
							}}
							loading={unstakeLoading}
							height={'40px'}
						>
							{translate('Unstake')} Uniswap YAX / ETH
						</StyledButton>
					}
					description="Withdraw your LP token from the previous rewards contract."
					icon={<StyledIcon />}
				/>
			)
		if (earnings.gt(0))
			return (
				<Step
					title={
						<StyledButton
							onClick={async () => {
								await onReward({ args: ['6', '0'] })
							}}
							loading={loading}
							disabled={!earnings.toNumber()}
							height={'40px'}
						>
							Claim Liquidity Pool rewards
						</StyledButton>
					}
					description="Gather pending Uniswap YAX / ETH rewards"
					icon={<StyledIcon />}
				/>
			)
		if (uniLPBalance.gt(0))
			return (
				<Step
					title={
						<StyledButton
							onClick={() =>
								window.open(uniYaxEthLP.lpUrl, '_blank')
							}
							height={'40px'}
						>
							De-fund Uniswap YAX / ETH
						</StyledButton>
					}
					description="Remove liquidity from the old liquidity pool."
					icon={<StyledIcon />}
				/>
			)
		return (
			<Step
				title={'Uniswap YAX / ETH'}
				description="Done."
				status="finish"
			/>
		)
	}, [
		translate,
		uniLPBalance,
		stakedUniLP,
		uniYaxEthLP,
		onUnstake,
		onReward,
		loading,
		earnings,
		unstakeLoading,
	])

	const linkYaxEthLP = useMemo(
		() => config.pools['Linkswap YAX/ETH'],
		[config],
	)

	const linkLP = useMemo(() => {
		if (linkLPBalance.gt(0))
			return (
				<Step
					title={
						<StyledButton
							height={'40px'}
							onClick={() =>
								window.open(linkYaxEthLP.lpUrl, '_blank')
							}
						>
							De-fund Linkswap YAX / ETH
						</StyledButton>
					}
					description="Remove liquidity from the old liquidity pool."
					icon={<StyledIcon />}
				/>
			)
		return (
			<Step
				title={'Linkswap YAX / ETH'}
				description="Done."
				status="finish"
			/>
		)
	}, [linkLPBalance, linkYaxEthLP])

	const message = useMemo(() => {
		if (
			stakedMvlt.gt(0) ||
			earnings.gt(0) ||
			pendingYax.gt(0) ||
			stakedUniLP.gt(0) ||
			uniLPBalance.gt(0) ||
			linkLPBalance.gt(0)
		)
			return 'First, gather up all of your YAX'

		return 'Step complete.'
	}, [
		stakedMvlt,
		earnings,
		pendingYax,
		stakedUniLP,
		uniLPBalance,
		linkLPBalance,
	])

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
	margin-bottom: 10px;
`
const StyledIcon = styled(ExclamationCircleOutlined)`
	font-size: 30px;
	color: gold;
	&:hover {
		transition: color 0.5s;
		color: #e8b923;
	}
`
