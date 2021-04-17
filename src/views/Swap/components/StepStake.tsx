import { useState, useMemo, Dispatch, SetStateAction } from 'react'
import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import { Steps, Button, Grid, Row } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import styled from 'styled-components'
import { currentConfig } from '../../../yaxis/configs'
import { DetailOverviewCardRow } from '../../../components/DetailOverviewCard'
import useEnter from '../../../hooks/useEnter'
import useGlobal from '../../../hooks/useGlobal'
import useAllowance from '../../../hooks/useAllowance'
import useApprove from '../../../hooks/useApprove'
import useContractWrite from '../../../hooks/useContractWrite'
import useWeb3Provider from '../../../hooks/useWeb3Provider'
import { NavLink } from 'react-router-dom'
const { Step } = Steps
const { useBreakpoint } = Grid

interface StepProps {
	step: number
	current: number
	setCurrent: Dispatch<SetStateAction<number>>
}

interface StepStakeProps extends StepProps {
	yaxisBalance: BigNumber
	mvltBalance: BigNumber
	stakedMvlt: BigNumber
}

const StepStake: React.FC<StepStakeProps> = ({
	yaxisBalance,
	mvltBalance,
	stakedMvlt,
}) => {
	const { yaxis: global, balance } = useGlobal()
	const { chainId } = useWeb3Provider()
	const { xl } = useBreakpoint()

	const {
		call: handleUnstake,
		loading: loadingUnstakeMVLT,
	} = useContractWrite({
		contractName: `yaxisMetaVault`,
		method: 'unstake',
		description: `unstake MVLT`,
	})
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

	const config = useMemo(() => currentConfig(chainId), [chainId])

	const uniYaxisEthLP = useMemo(
		() => config?.pools.find((pool) => pool.name === 'Uniswap YAXIS/ETH'),
		[config],
	)

	const mvlt = useMemo(() => {
		if (stakedMvlt.gt(0))
			return (
				<Step
					title="MVLT Unstake"
					description="Withdraw your MVLT from the previous rewards contract."
					status="wait"
					icon={
						<StyledButton
							icon={
								<StyledIcon
									onClick={async () => {
										await handleUnstake({
											args: [stakedMvlt],
										})
									}}
								/>
							}
							loading={loadingUnstakeMVLT}
						/>
					}
				/>
			)
		if (mvltBalance.gt(0)) {
			if (allowance.isLessThan(ethers.constants.MaxUint256.toString()))
				return (
					<Step
						title="Stake MVLT"
						description="Approve the new rewards contract to use your MVLT."
						icon={
							<StyledButton
								icon={
									<StyledIcon
										onClick={() => {
											onApprove()
										}}
									/>
								}
								loading={loadingApproveMVLT}
							/>
						}
					/>
				)
			return (
				<Step
					title="Stake MVLT"
					description="Deposit your MVLT into the new rewards contract."
					icon={
						<StyledButton
							icon={
								<StyledIcon
									onClick={() => {
										handleStake({
											amount: mvltBalance,
											args: [mvltBalance],
										})
									}}
								/>
							}
							loading={loadingStakeMVLT}
						/>
					}
				/>
			)
		}
		return <Step title="MVLT" description="All complete." status="finish" />
	}, [
		stakedMvlt,
		mvltBalance,
		handleUnstake,
		loadingUnstakeMVLT,
		allowance,
		handleStake,
		loadingApproveMVLT,
		loadingStakeMVLT,
		onApprove,
	])

	const [loadingStakeYAXIS, setLoadingStakeYAXIS] = useState(false)
	const { onEnter } = useEnter()

	const yaxis = useMemo(() => {
		if (yaxisBalance.gt(0))
			return (
				<>
					{balance.gt(0) ? (
						<Step
							title={'Provide Liquidity'}
							description={'Obtain some ETH to fund the new LP'}
							status="wait"
						/>
					) : (
						<Step
							title={'Provide Liquidity'}
							description={
								'Fund the new YAXIS ETH LP for more rewards.'
							}
							icon={
								<div style={{ position: 'relative' }}>
									<NavLink
										to={`/liquidity${
											uniYaxisEthLP
												? `/${uniYaxisEthLP.lpAddress}`
												: ''
										}`}
									>
										<StyledButton icon={<StyledIcon />} />
									</NavLink>
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
					)}
					<Step
						title={'Stake YAXIS'}
						description="Lock up your YAXIS for extra APY and voting power."
						icon={
							<StyledButton
								icon={
									<StyledIcon
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
									/>
								}
								loading={loadingStakeYAXIS}
							/>
						}
					/>
				</>
			)
		return (
			<Step title={'YAXIS'} description="All complete." status="finish" />
		)
	}, [yaxisBalance, loadingStakeYAXIS, onEnter, uniYaxisEthLP, xl, balance])

	const message = useMemo(() => {
		if (stakedMvlt.gt(0) || mvltBalance.gt(0) || yaxisBalance.gt(0))
			return 'Stake your tokens to recieve emissions!'

		return 'All complete.'
	}, [yaxisBalance, stakedMvlt, mvltBalance])

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
`
