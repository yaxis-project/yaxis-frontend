import { useState, useMemo, Dispatch, SetStateAction } from 'react'
import styled from 'styled-components'
import { currentConfig } from '../../../yaxis/configs'
import { DetailOverviewCardRow } from '../../../components/DetailOverviewCard'
import Tooltip from '../../../components/Tooltip'
import { Steps, Button } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import useWeb3Provider from '../../../hooks/useWeb3Provider'
import useEnter from '../../../hooks/useEnter'
import useUnstake from '../../../hooks/useUnstake'
import useGlobal from '../../../hooks/useGlobal'
import useAllowance from '../../../hooks/useAllowance'
import useApprove from '../../../hooks/useApprove'
import useContractWrite from '../../../hooks/useContractWrite'
import { NavLink } from 'react-router-dom'
import { ethers } from 'ethers'
import BigNumber from 'bignumber.js'
const { Step } = Steps

interface StepProps {
	step: number
	current: number
	setCurrent: Dispatch<SetStateAction<number>>
}

interface StepStakeProps extends StepProps {
	yaxisBalance: BigNumber
	stakedUniLP: BigNumber
	uniLPBalance: BigNumber
	linkLPBalance: BigNumber
	mvltBalance: BigNumber
	stakedMvlt: BigNumber
}

const StepStake: React.FC<StepStakeProps> = ({
	yaxisBalance,
	stakedUniLP,
	uniLPBalance,
	linkLPBalance,
	mvltBalance,
	stakedMvlt,
}) => {
	const { chainId } = useWeb3Provider()
	const { yaxis: global } = useGlobal()

	const config = useMemo(() => currentConfig(chainId), [chainId])
	const uniYaxisEthLP = useMemo(
		() => config.pools.find((pool) => pool.name === 'Uniswap YAXIS/ETH'),
		[config],
	)
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
				<Step
					title={'Stake YAXIS'}
					description="Lock up your YAXIS for extra APY and voting power!"
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
			)
		return (
			<Step title={'YAXIS'} description="All complete." status="finish" />
		)
	}, [yaxisBalance, loadingStakeYAXIS, onEnter])

	const [loadingUnstakeUni, setLoadingUnstakeUni] = useState(false)
	const uniYaxEthLP = useMemo(
		() => config.pools.find((pool) => pool.name === 'Uniswap YAX/ETH'),
		[config],
	)
	const { onUnstake } = useUnstake(uniYaxEthLP?.pid, uniYaxEthLP?.name)
	const [unstakedUni, setUnstakedUni] = useState(false)

	const uniswapLP = useMemo(() => {
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
									onClick={() => {
										window.open(uniYaxEthLP.lpUrl, '_blank')
										setUnstakedUni(true)
									}}
								/>
							}
						/>
					}
				/>
			)
		return (
			<Step
				title={
					<Tooltip
						title={
							<StyledLink
								to={`/liquidity${
									uniYaxisEthLP
										? `/${uniYaxisEthLP.lpAddress}`
										: ''
								}`}
							>
								Fund the new YAXIS / ETH <br /> liquidity pool
								for more rewards!
							</StyledLink>
						}
						visible={unstakedUni}
						placement="right"
						color="#FFD700"
					>
						Uniswap YAX / ETH
					</Tooltip>
				}
				description="All complete."
				status="finish"
			/>
		)
	}, [
		uniLPBalance,
		stakedUniLP,
		unstakedUni,
		uniYaxisEthLP,
		loadingUnstakeUni,
		uniYaxEthLP,
		onUnstake,
	])

	const linkYaxEthLP = useMemo(
		() => config.pools.find((pool) => pool.name === 'Linkswap YAX/ETH'),
		[config],
	)
	const [unstakedLink, setUnstakedLink] = useState(false)

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
									onClick={() => {
										window.open(
											linkYaxEthLP.lpUrl,
											'_blank',
										)
										setUnstakedLink(true)
									}}
								/>
							}
						/>
					}
				/>
			)
		return (
			<Step
				title={
					<Tooltip
						title={
							<StyledLink
								to={`/liquidity${
									uniYaxisEthLP
										? `/${uniYaxisEthLP.lpAddress}`
										: ''
								}`}
							>
								Fund the new YAXIS / ETH <br /> liquidity pool
								for more rewards!
							</StyledLink>
						}
						visible={unstakedLink}
						placement="right"
						color="#FFD700"
					>
						Linkswap YAX / ETH
					</Tooltip>
				}
				description="All complete."
				status="finish"
			/>
		)
	}, [linkLPBalance, unstakedLink, uniYaxisEthLP, linkYaxEthLP])

	return (
		<>
			<DetailOverviewCardRow>
				<Steps direction="vertical">
					{mvlt}
					{yaxis}
					{uniswapLP}
					{linkLP}
				</Steps>
			</DetailOverviewCardRow>
		</>
	)
}

export default StepStake

const StyledIcon = styled(ExclamationCircleOutlined)`
	font-size: 30px;
`
const StyledButton = styled(Button)`
	border: none;
`
const StyledLink = styled(NavLink)`
	color: black;
`
