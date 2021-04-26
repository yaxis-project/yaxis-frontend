import { useMemo, Dispatch, SetStateAction } from 'react'
import styled from 'styled-components'
import { DetailOverviewCardRow } from '../../../components/DetailOverviewCard'
import { Row, Col } from 'antd'
import { useContracts } from '../../../contexts/Contracts'
import { useSwapApprovals } from '../../../state/wallet/hooks'
import useApprove from '../../../hooks/useApprove'
import useContractWrite from '../../../hooks/useContractWrite'
import Button from '../../../components/Button'
import { ArrowRightOutlined, ArrowDownOutlined } from '@ant-design/icons'
import { formatBN, MAX_UINT } from '../../../utils/number'
import BigNumber from 'bignumber.js'

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
	const { contracts } = useContracts()

	const {
		YAX: allowanceYAX,
		loadingYAX: loadingAllowanceYAX,
		SYAX: allowanceSYAX,
		loadingSYAX: loadingAllowanceSYAX,
	} = useSwapApprovals()

	const { onApprove: onApproveYAX, loading: loadingApproveYAX } = useApprove(
		contracts?.currencies.ERC20.yax.contract,
		contracts?.internal.swap.address,
		'YAX',
	)

	const {
		onApprove: onApproveSYAX,
		loading: loadingApproveSYAX,
	} = useApprove(
		contracts?.internal.xYaxStaking,
		contracts?.internal.swap.address,
		'sYAX',
	)

	const { call, loading: loadingSwap } = useContractWrite({
		contractName: 'internal.swap',
		method: 'swap',
		description: 'Token Swap',
	})

	const totalYAX = useMemo(() => stakedBalance.plus(yaxBalance), [
		stakedBalance,
		yaxBalance,
	])

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
					onClick={() => onApproveSYAX()}
				>
					Approve sYAX
				</Button>
			)

		if (yaxBalance.gt(0) && allowanceYAX.lt(MAX_UINT))
			return (
				<Button
					loading={loadingApproveYAX}
					disabled={totalYAX.eq(0)}
					onClick={() => onApproveYAX()}
				>
					Approve YAX
				</Button>
			)

		return (
			<Button
				loading={loadingSwap}
				disabled={totalYAX.eq(0)}
				onClick={async () => await call()}
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
	])

	return (
		<>
			{yaxBalance.gt(0) && (
				<DetailOverviewCardRow>
					<BalanceTitle>Account Balance</BalanceTitle>
					<BalanceRow justify={'space-around'}>
						<Col span={longWalletBalance ? 24 : 8}>
							<Row justify="center">
								{formatBN(yaxBalance, { showDust: true })}
							</Row>
							<Row justify="center">YAX</Row>
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
							<Row justify="center">{formatBN(yaxBalance)}</Row>
							<Row justify="center">YAXIS</Row>
						</Col>
					</BalanceRow>
				</DetailOverviewCardRow>
			)}
			{stakedBalance.gt(0) && (
				<DetailOverviewCardRow>
					<BalanceTitle>Staked Balance</BalanceTitle>
					<BalanceRow justify={'space-around'}>
						<Col span={longStakedBalance ? 24 : 8}>
							<Row justify="center">
								{formatBN(stakedBalance)}
							</Row>
							<Row justify="center">YAX</Row>
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
								{formatBN(stakedBalance)}
							</Row>
							<Row justify="center">YAXIS</Row>
						</Col>
					</BalanceRow>
				</DetailOverviewCardRow>
			)}
			<DetailOverviewCardRow>
				{stakedBalance.plus(yaxBalance).gt(0) ? (
					<BalanceTitle justify="center">
						<Col>
							You will receive{' '}
							{formatBN(stakedBalance.plus(yaxBalance))} YAXIS
						</Col>
					</BalanceTitle>
				) : (
					<Row style={{ padding: '30px' }} justify="center">
						Step complete.
					</Row>
				)}
				{button}
			</DetailOverviewCardRow>
		</>
	)
}

export default StepSwap
