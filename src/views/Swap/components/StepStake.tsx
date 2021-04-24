import { useState, useMemo, Dispatch, SetStateAction } from 'react'
import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import { Steps, Grid, Row } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import styled from 'styled-components'
import { currentConfig } from '../../../yaxis/configs'
import { DetailOverviewCardRow } from '../../../components/DetailOverviewCard'
import Button from '../../../components/Button'
import useEnter from '../../../hooks/useEnter'
import useGlobal from '../../../hooks/useGlobal'
import useAllowance from '../../../hooks/useAllowance'
import useTokenBalance from '../../../hooks/useTokenBalance'
import useApprove from '../../../hooks/useApprove'
import useContractWrite from '../../../hooks/useContractWrite'
import useWeb3Provider from '../../../hooks/useWeb3Provider'
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
	const { yaxis: global, balance } = useGlobal()
	const { chainId } = useWeb3Provider()
	const { xl } = useBreakpoint()

	const allowance = useAllowance(
		global?.contracts.yaxisMetaVault,
		global?.contracts?.rewards.MetaVault.options.address,
	)
	const { onApprove, loading: loadingApproveMVLT } = useApprove(
		global?.contracts.yaxisMetaVault,
		global?.contracts?.rewards.MetaVault.options.address,
		'MVLT',
	)

	const { call: handleStake, loading: loadingStakeMVLT } = useContractWrite({
		contractName: `rewards.MetaVault`,
		method: 'stake',
		description: `stake MVLT`,
	})

	const mvlt = useMemo(() => {
		if (mvltBalance.gt(0)) {
			if (allowance.isLessThan(2 ** 256 - 1))
				return (
					<Step
						title={
							<StyledButton
								onClick={() => onApprove()}
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
									amount: mvltBalance.toString(),
									args: [mvltBalance.toString()],
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
	])

	const config = useMemo(() => currentConfig(chainId), [chainId])

	const uniYaxisEthLP = useMemo(
		() => config?.pools.find((pool) => pool.name === 'Uniswap YAXIS/ETH'),
		[config],
	)

	const { balance: yaxisEthLPBalance } = useTokenBalance(
		uniYaxisEthLP.lpAddress,
	)

	const {
		call: handleStakeYaxisEthLP,
		loading: loadingStakeYaxisEthLP,
	} = useContractWrite({
		contractName: `rewards.YaxisEth`,
		method: 'stake',
		description: `stake Uniswap YAXIS ETH LP token`,
	})

	const allowanceLP = useAllowance(
		uniYaxisEthLP.lpContract,
		global?.contracts?.rewards.YaxisEth.options.address,
	)

	const { onApprove: onApproveLP, loading: loadingApproveLP } = useApprove(
		uniYaxisEthLP.lpContract,
		global?.contracts?.rewards.YaxisEth.options.address,
		'Uniswap YAXIS/ETH LP token',
	)

	const [loadingStakeYAXIS, setLoadingStakeYAXIS] = useState(false)
	const { onEnter } = useEnter()

	const uniLP = useMemo(() => {
		if (balance.eq(0))
			return (
				<Step
					title={'Provide Liquidity'}
					description={'Obtain some ETH to fund the new LP'}
					status="wait"
				/>
			)
		if (yaxisEthLPBalance.gt(0)) {
			if (allowanceLP.isLessThan(ethers.constants.MaxUint256.toString()))
				return (
					<Step
						title={
							<StyledButton
								height={'40px'}
								onClick={() => onApproveLP()}
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
									amount: yaxisEthLPBalance.toString(),
									args: [yaxisEthLPBalance.toString()],
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
		balance,
		yaxisEthLPBalance,
		handleStakeYaxisEthLP,
		loadingStakeYaxisEthLP,
		xl,
		uniYaxisEthLP,
		allowanceLP,
		onApproveLP,
		loadingApproveLP,
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
									try {
										setLoadingStakeYAXIS(true)
										await onEnter(
											yaxisBalance
												.div(10 ** 18)
												.toString(),
										)
										setLoadingStakeYAXIS(false)
									} catch {
										setLoadingStakeYAXIS(false)
									}
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
	}, [yaxisBalance, loadingStakeYAXIS, onEnter, uniLP])

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
