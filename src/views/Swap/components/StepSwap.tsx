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
	step,
	current,
	setCurrent,
	balances: { stakedBalance, yaxBalance },
}) => {
	const [interacted, setInteracted] = useState(false)
	const [loadingAllowance, setLoadingAllowance] = useState(true)
	const [allowance, setAllowance] = useState('0')
	const { account } = useWeb3Provider()
	const { yaxis } = useGlobal()

	const { onApprove, loading: loadingApprove } = useApprove(
		yaxis?.contracts?.yax,
		yaxis?.contracts?.swap.options.address,
		'YAX',
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
			const a = await yaxis?.contracts?.yax.methods
				.allowance(account, yaxis?.contracts?.swap.options.address)
				.call()
			setAllowance(a)
			setLoadingAllowance(false)
		}
		if (account && yaxis?.contracts) {
			setLoadingAllowance(true)
			checkAllowance()
		}
	}, [account, yaxis?.contracts, loadingApprove])

	const longWalletBalance = useMemo(
		() => yaxBalance.toFixed(2).length > 8,

		[yaxBalance],
	)

	const longStakedBalance = useMemo(
		() => stakedBalance.toFixed(2).length > 8,
		[stakedBalance],
	)

	useEffect(() => {
		if (interacted && totalYAX.eq(0)) setCurrent(step + 1)
	}, [totalYAX, setCurrent, step, interacted])

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
				{loadingAllowance ? (
					<Button
						loading={loadingAllowance}
						disabled={loadingAllowance}
					></Button>
				) : ethers.constants.MaxUint256.eq(allowance) ? (
					<Button
						loading={loadingSwap}
						disabled={totalYAX.eq(0)}
						onClick={async () => {
							setInteracted(true)
							await call()
						}}
					>
						Swap
					</Button>
				) : (
					<Button
						loading={loadingApprove}
						disabled={totalYAX.eq(0)}
						onClick={() => {
							setInteracted(true)
							onApprove()
						}}
					>
						Approve
					</Button>
				)}
			</DetailOverviewCardRow>
		</>
	)
}

export default StepSwap
