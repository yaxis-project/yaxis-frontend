import { useMemo, Dispatch, SetStateAction } from 'react'
import styled from 'styled-components'
import { DetailOverviewCardRow } from '../../../components/DetailOverviewCard'
import { Row, Col } from 'antd'
import { useContracts } from '../../../contexts/Contracts'
import { useSwapApprovals } from '../../../state/wallet/hooks'
import useContractWrite from '../../../hooks/useContractWrite'
import Button from '../../../components/Button'
import Typography from '../../../components/Typography'
import { ArrowRightOutlined, ArrowDownOutlined } from '@ant-design/icons'
import { formatBN, MAX_UINT } from '../../../utils/number'
import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import { EthereumContracts } from '../../../constants/contracts'

const { Text } = Typography

const BalanceTitle = styled(Row)`
	font-size: 18px;
	margin-bottom: 10px;
`

const BalanceRow = styled(Row)`
	font-size: 16px;
`

interface StepProps {
	step: number
	current: number
	setCurrent: Dispatch<SetStateAction<number>>
	complete: boolean
}

interface StepSwapProps extends StepProps {
	balances: {
		stakedBalance: BigNumber
		yaxBalance: BigNumber
	}
}

const StepSwap: React.FC<StepSwapProps> = ({
	balances: { stakedBalance, yaxBalance },
}) => {
	const contracts = useContracts().contracts as EthereumContracts | null

	const {
		YAX: allowanceYAX,
		loadingYAX: loadingAllowanceYAX,
		SYAX: allowanceSYAX,
		loadingSYAX: loadingAllowanceSYAX,
	} = useSwapApprovals()

	const { call: onApproveYAX, loading: loadingApproveYAX } = useContractWrite(
		{
			contractName: `currencies.ERC20.yax.contract`,
			method: 'approve',
			description: `approve YAX`,
		},
	)

	const { call: onApproveSYAX, loading: loadingApproveSYAX } =
		useContractWrite({
			contractName: `internal.xYaxStaking`,
			method: 'approve',
			description: `approve sYAX`,
		})

	const { call, loading: loadingSwap } = useContractWrite({
		contractName: 'internal.swap',
		method: 'swap',
		description: 'Token Swap',
	})

	const totalYAX = useMemo(
		() => stakedBalance.plus(yaxBalance),
		[stakedBalance, yaxBalance],
	)

	const longWalletBalance = useMemo(
		() => yaxBalance.toFixed(2).length > 8,

		[yaxBalance],
	)

	const longStakedBalance = useMemo(
		() => stakedBalance.toFixed(2).length > 8,
		[stakedBalance],
	)

	const button = useMemo(() => {
		if (loadingAllowanceYAX || loadingAllowanceSYAX)
			return <Button loading={true} disabled={true} />
		if (stakedBalance.gt(0) && allowanceSYAX.lt(MAX_UINT))
			return (
				<Button
					loading={loadingApproveSYAX}
					disabled={totalYAX.eq(0)}
					onClick={() =>
						onApproveSYAX({
							args: [
								contracts?.internal.swap.address,
								ethers.constants.MaxUint256,
							],
						})
					}
				>
					Approve sYAX
				</Button>
			)

		if (yaxBalance.gt(0) && allowanceYAX.lt(MAX_UINT))
			return (
				<Button
					loading={loadingApproveYAX}
					disabled={totalYAX.eq(0)}
					onClick={() =>
						onApproveYAX({
							args: [
								contracts?.internal.swap.address,
								ethers.constants.MaxUint256,
							],
						})
					}
				>
					Approve YAX
				</Button>
			)

		return (
			<Button
				loading={loadingSwap}
				disabled={totalYAX.eq(0)}
				onClick={async () => await call()}
				style={{ width: '100%' }}
			>
				Swap
			</Button>
		)
	}, [
		loadingAllowanceYAX,
		allowanceYAX,
		onApproveYAX,
		loadingApproveYAX,
		allowanceSYAX,
		loadingAllowanceSYAX,
		loadingApproveSYAX,
		onApproveSYAX,
		loadingSwap,
		call,
		totalYAX,
		stakedBalance,
		yaxBalance,
		contracts,
	])

	return (
		<>
			{yaxBalance.gt(0) && (
				<DetailOverviewCardRow>
					<BalanceTitle>
						<Text>Account Balance</Text>
					</BalanceTitle>
					<BalanceRow justify={'space-around'}>
						<Col span={longWalletBalance ? 24 : 8}>
							<Row justify="center">
								<Text>
									{formatBN(yaxBalance, { showDust: true })}
								</Text>
							</Row>
							<Row justify="center">
								<Text>YAX</Text>
							</Row>
						</Col>
						<Col span={longWalletBalance ? 24 : 2}>
							<Row justify="center">
								{longWalletBalance ? (
									<ArrowDownOutlined
										style={{ fontSize: '30px' }}
									/>
								) : (
									<ArrowRightOutlined
										style={{ fontSize: '30px' }}
									/>
								)}
							</Row>
						</Col>
						<Col span={longWalletBalance ? 24 : 8}>
							<Row justify="center">
								<Text>{formatBN(yaxBalance)}</Text>
							</Row>
							<Row justify="center">
								<Text>YAXIS</Text>
							</Row>
						</Col>
					</BalanceRow>
				</DetailOverviewCardRow>
			)}
			{stakedBalance.gt(0) && (
				<DetailOverviewCardRow>
					<BalanceTitle>
						<Text>Staked Balance</Text>
					</BalanceTitle>
					<BalanceRow justify={'space-around'}>
						<Col span={longStakedBalance ? 24 : 8}>
							<Row justify="center">
								<Text>{formatBN(stakedBalance)}</Text>
							</Row>
							<Row justify="center">
								<Text>YAX</Text>
							</Row>
						</Col>
						<Col span={longStakedBalance ? 24 : 2}>
							<Row justify="center">
								{longStakedBalance ? (
									<ArrowDownOutlined
										style={{ fontSize: '30px' }}
									/>
								) : (
									<ArrowRightOutlined
										style={{ fontSize: '30px' }}
									/>
								)}
							</Row>
						</Col>
						<Col span={longStakedBalance ? 24 : 8}>
							<Row justify="center">
								<Text>{formatBN(stakedBalance)}</Text>
							</Row>
							<Row justify="center">
								<Text>YAXIS</Text>
							</Row>
						</Col>
					</BalanceRow>
				</DetailOverviewCardRow>
			)}
			<DetailOverviewCardRow>
				{stakedBalance.plus(yaxBalance).gt(0) ? (
					<BalanceTitle justify="center">
						<Col>
							<Text>
								You will receive{' '}
								{formatBN(stakedBalance.plus(yaxBalance))} YAXIS
							</Text>
						</Col>
					</BalanceTitle>
				) : (
					<Row style={{ padding: '30px' }} justify="center">
						<Text>Step complete.</Text>
					</Row>
				)}
				<Row justify="center">{button}</Row>
			</DetailOverviewCardRow>
		</>
	)
}

export default StepSwap
