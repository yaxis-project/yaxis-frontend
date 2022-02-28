import { useMemo, Dispatch, SetStateAction } from 'react'
import BigNumber from 'bignumber.js'
import { Grid, Row } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import styled from 'styled-components'
import { DetailOverviewCardRow } from '../../../components/DetailOverviewCard'
import Steps from '../../../components/Steps'
import Button from '../../../components/Button'
import {
	useApprovals,
	useAllTokenBalances,
	useAllBalances,
} from '../../../state/wallet/hooks'
import { useContracts } from '../../../contexts/Contracts'
import useContractWrite from '../../../hooks/useContractWrite'
import { MAX_UINT } from '../../../utils/number'
import { ethers } from 'ethers'
import { EthereumContracts } from '../../../constants/contracts'

const { Step } = Steps
const { useBreakpoint } = Grid

interface StepProps {
	step: number
	current: number
	setCurrent: Dispatch<SetStateAction<number>>
	complete: boolean
}

interface StepStakeProps extends StepProps {
	yaxisBalance: BigNumber
	mvltBalance: BigNumber
}

const StepStake: React.FC<StepStakeProps> = ({ yaxisBalance, mvltBalance }) => {
	const { xl } = useBreakpoint()
	const [{ eth }] = useAllBalances()
	const contracts = useContracts().contracts as EthereumContracts | null
	const {
		metavault: { staking: allowance },
		uniYaxisEth: { staking: allowanceLP },
	} = useApprovals()

	const { call: onApprove, loading: loadingApproveMVLT } = useContractWrite({
		contractName: `internal.yAxisMetaVault`,
		method: 'approve',
		description: `approve MVLT`,
	})

	const { call: handleStake, loading: loadingStakeMVLT } = useContractWrite({
		contractName: `rewards.MetaVault`,
		method: 'stake',
		description: `stake MVLT`,
	})

	const mvlt = useMemo(() => {
		if (mvltBalance.gt(0)) {
			if (allowance.isLessThan(MAX_UINT))
				return (
					<Step
						title={
							<StyledButton
								onClick={() =>
									onApprove({
										args: [
											contracts?.rewards.MetaVault
												.address,
											ethers.constants.MaxUint256,
										],
									})
								}
								loading={loadingApproveMVLT}
								height={'40px'}
							>
								Approve MVLT
							</StyledButton>
						}
						description="Approve the new rewards contract to use your MVLT."
						icon={<StyledIcon />}
						status="wait"
					/>
				)
			return (
				<Step
					title={
						<StyledButton
							loading={loadingStakeMVLT}
							onClick={() =>
								handleStake({
									args: [
										mvltBalance
											.multipliedBy(10 ** 18)
											.toString(),
									],
								})
							}
							height={'40px'}
						>
							Stake MVLT
						</StyledButton>
					}
					description="Deposit your MVLT into the new rewards contract."
					icon={<StyledIcon />}
				/>
			)
		}
		return <Step title="Stake MVLT" description="Done." status="finish" />
	}, [
		mvltBalance,
		allowance,
		handleStake,
		loadingApproveMVLT,
		loadingStakeMVLT,
		onApprove,
		contracts,
	])

	const uniYaxisEthLP = useMemo(
		() => contracts?.pools['Uniswap YAXIS/ETH'],
		[contracts],
	)

	const [{ YAXIS_ETH_UNISWAP_LP }] = useAllTokenBalances()

	const { call: handleStakeYaxisEthLP, loading: loadingStakeYaxisEthLP } =
		useContractWrite({
			contractName: `rewards.Uniswap YAXIS/ETH`,
			method: 'stake',
			description: `stake Uniswap YAXIS ETH LP token`,
		})

	const { call: onApproveLP, loading: loadingApproveLP } = useContractWrite({
		contractName: `pools.Uniswap YAXIS/ETH.lpContract`,
		method: 'approve',
		description: `approve Uniswap YAXIS/ETH LP token`,
	})

	const { call: onEnter, loading: loadingStakeYAXIS } = useContractWrite({
		contractName: 'currencies.ERC677.yaxis.contract',
		method: 'transferAndCall',
		description: `stake Yaxis`,
	})

	const uniLP = useMemo(() => {
		if (eth?.amount.eq(0))
			return (
				<Step
					title={'Provide Liquidity'}
					description={'Obtain some ETH to fund the new LP'}
					status="wait"
				/>
			)
		if (YAXIS_ETH_UNISWAP_LP?.amount.gt(0)) {
			if (allowanceLP.isLessThan(MAX_UINT))
				return (
					<Step
						title={
							<StyledButton
								height={'40px'}
								onClick={() =>
									onApproveLP({
										args: [
											contracts?.rewards[
												'Uniswap YAXIS/ETH'
											].address,
											ethers.constants.MaxUint256,
										],
									})
								}
								loading={loadingApproveLP}
							>
								Approve YAXIS ETH LP token
							</StyledButton>
						}
						description={
							'Approve the new rewards contract to use your LP tokens.'
						}
						icon={
							<div style={{ position: 'relative' }}>
								<StyledIcon />
								<div
									style={{
										position: 'absolute',
										bottom: xl ? '-42px' : '-32px',
										fontWeight: 700,
									}}
								>
									OR
								</div>
							</div>
						}
					/>
				)
			return (
				<Step
					title={
						<StyledButton
							height={'40px'}
							onClick={() =>
								handleStakeYaxisEthLP({
									args: [
										YAXIS_ETH_UNISWAP_LP?.value.toString(),
									],
								})
							}
							loading={loadingStakeYaxisEthLP}
						>
							Stake YAXIS ETH LP token
						</StyledButton>
					}
					description={'Stake your LP token to receive emissions.'}
					icon={
						<div style={{ position: 'relative' }}>
							<StyledIcon />
							<div
								style={{
									position: 'absolute',
									bottom: xl ? '-42px' : '-32px',
									fontWeight: 700,
								}}
							>
								OR
							</div>
						</div>
					}
				/>
			)
		}

		return (
			<Step
				title={
					<StyledButton
						height={'40px'}
						onClick={() =>
							window.open(uniYaxisEthLP.lpUrl, '_blank')
						}
					>
						Provide Liquidity
					</StyledButton>
				}
				description={'Fund the new YAXIS ETH LP for more rewards.'}
				icon={
					<div style={{ position: 'relative' }}>
						<StyledIcon />

						<div
							style={{
								position: 'absolute',
								bottom: xl ? '-42px' : '-32px',
								fontWeight: 700,
							}}
						>
							OR
						</div>
					</div>
				}
			/>
		)
	}, [
		eth,
		YAXIS_ETH_UNISWAP_LP,
		handleStakeYaxisEthLP,
		loadingStakeYaxisEthLP,
		xl,
		uniYaxisEthLP,
		allowanceLP,
		onApproveLP,
		loadingApproveLP,
		contracts,
	])

	const yaxis = useMemo(() => {
		if (yaxisBalance.gt(0))
			return (
				<>
					{uniLP}
					<Step
						title={
							<StyledButton
								onClick={async () => {
									const amount = yaxisBalance
										.multipliedBy(10 ** 18)
										.toString()
									onEnter({
										args: [
											contracts?.rewards.Yaxis.address,
											amount,
											contracts?.rewards.Yaxis.interface.encodeFunctionData(
												'stake',
												[amount],
											),
										],
									})
								}}
								loading={loadingStakeYAXIS}
								height={'40px'}
							>
								Stake YAXIS
							</StyledButton>
						}
						description="Lock up your YAXIS for extra APY and voting power."
						icon={<StyledIcon />}
					/>
				</>
			)
		return (
			<Step title={'Stake YAXIS'} description="Done." status="finish" />
		)
	}, [
		yaxisBalance,
		loadingStakeYAXIS,
		onEnter,
		uniLP,
		contracts?.rewards.Yaxis,
	])

	const message = useMemo(() => {
		if (mvltBalance.gt(0) || yaxisBalance.gt(0))
			return 'Stake your tokens to receive emissions!'

		return 'Step complete.'
	}, [yaxisBalance, mvltBalance])

	return (
		<>
			<DetailOverviewCardRow>
				<Description>{message}</Description>
				<Steps direction="vertical">
					{mvlt}
					{yaxis}
				</Steps>
			</DetailOverviewCardRow>
		</>
	)
}

export default StepStake

const Description = styled(Row)`
	font-size: 16px;
	padding: 0 10px 20px 10px;
`

const StyledIcon = styled(ExclamationCircleOutlined)`
	font-size: 30px;
	color: gold;
	&:hover {
		transition: color 0.5s;
		color: #e8b923;
	}
`
const StyledButton = styled(Button)`
	border: none;
	margin-bottom: 10px;
`
