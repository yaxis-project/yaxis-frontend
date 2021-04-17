import { useState, useMemo, useEffect, Dispatch, SetStateAction } from 'react'
import styled from 'styled-components'
import { DetailOverviewCardRow } from '../../../components/DetailOverviewCard'
import { Row, Col } from 'antd'
import useGlobal from '../../../hooks/useGlobal'
import useApprove from '../../../hooks/useApprove'
import useContractWrite from '../../../hooks/useContractWrite'
import Button from '../../../components/Button'
import { ArrowRightOutlined, ArrowDownOutlined } from '@ant-design/icons'
import { formatBN } from '../../../yaxis/utils'
import useWeb3Provider from '../../../hooks/useWeb3Provider'
import { ethers } from 'ethers'
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
	const { account } = useWeb3Provider()
	const { yaxis } = useGlobal()

	const [allowanceYAX, setAllowanceYAX] = useState('0')
	const [loadingAllowanceYAX, setLoadingAllowanceYAX] = useState(true)
	const { onApprove: onApproveYAX, loading: loadingApproveYAX } = useApprove(
		yaxis?.contracts?.yax,
		yaxis?.contracts?.swap.options.address,
		'YAX',
	)

	const [allowanceSYAX, setAllowanceSYAX] = useState('0')
	const [loadingAllowanceSYAX, setLoadingAllowanceSYAX] = useState(true)
	const {
		onApprove: onApproveSYAX,
		loading: loadingApproveSYAX,
	} = useApprove(
		yaxis?.contracts?.xYaxStaking,
		yaxis?.contracts?.swap.options.address,
		'sYAX',
	)

	const { call, loading: loadingSwap } = useContractWrite({
		contractName: 'swap',
		method: 'swap',
		description: 'Token Swap',
	})

	const totalYAX = useMemo(() => stakedBalance.plus(yaxBalance), [
		stakedBalance,
		yaxBalance,
	])

	useEffect(() => {
		const checkAllowance = async () => {
			try {
				const aYax = await yaxis?.contracts?.yax.methods
					.allowance(account, yaxis?.contracts?.swap.options.address)
					.call()
				setAllowanceYAX(aYax)
				const aSYax = await yaxis?.contracts?.yax.methods
					.allowance(
						account,
						yaxis?.contracts?.xYaxStaking.options.address,
					)
					.call()
				setAllowanceSYAX(aSYax)
				setLoadingAllowanceYAX(false)
				setLoadingAllowanceSYAX(false)
			} catch (err) {
				console.log('Error checking YAX and sYAX allowance: ', err)
			}
		}
		if (account && yaxis?.contracts) {
			setLoadingAllowanceYAX(true)
			setLoadingAllowanceSYAX(true)
			checkAllowance()
		}
	}, [account, yaxis?.contracts, loadingApproveSYAX, loadingApproveYAX])

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

		if (ethers.constants.MaxUint256.gt(allowanceSYAX))
			return (
				<Button
					loading={loadingApproveSYAX}
					disabled={totalYAX.eq(0)}
					onClick={() => onApproveSYAX()}
				>
					Approve sYAX
				</Button>
			)

		if (ethers.constants.MaxUint256.gt(allowanceYAX))
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
							You will recieve{' '}
							{formatBN(stakedBalance.plus(yaxBalance))} YAXIS
						</Col>
					</BalanceTitle>
				) : (
					<Row style={{ padding: '30px' }} justify="center">
						All complete.
					</Row>
				)}
				{button}
			</DetailOverviewCardRow>
		</>
	)
}

export default StepSwap
