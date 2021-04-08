import { useState, useMemo, useEffect } from 'react'
import styled from 'styled-components'
import {
	DetailOverviewCard,
	DetailOverviewCardRow,
} from '../../../components/DetailOverviewCard'
import { Affix, Row, Col } from 'antd'
import useGlobal from '../../../hooks/useGlobal'
import useApprove from '../../../hooks/useApprove'
import useYAXStaking from '../../../hooks/useYAXStaking'
import useContractWrite from '../../../hooks/useContractWrite'
import Button from '../../../components/Button'
import { ArrowRightOutlined, ArrowDownOutlined } from '@ant-design/icons'
import { formatBN } from '../../../yaxis/utils'
import { useWeb3React } from '@web3-react/core'
import { ethers } from 'ethers'

export default function SwapCard() {
	const [allowance, setAllownace] = useState('0')
	const { account } = useWeb3React()
	const { yaxis } = useGlobal()
	const {
		balances: { stakedBalance, yaxBalance },
	} = useYAXStaking()

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
			setAllownace(a)
		}
		if (account && yaxis?.contracts) {
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

	return (
		<Affix offsetTop={100}>
			<DetailOverviewCard title={'Swap'}>
				{yaxBalance && (
					<DetailOverviewCardRow>
						<BalanceTitle>Account Balance</BalanceTitle>
						<Row justify={'space-around'}>
							<Col span={longWalletBalance ? 24 : 8}>
								<Row justify="center">
									{formatBN(yaxBalance)}
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
								<Row justify="center">
									{formatBN(yaxBalance)}
								</Row>
								<Row justify="center">YAXIS</Row>
							</Col>
						</Row>
					</DetailOverviewCardRow>
				)}
				{stakedBalance && (
					<DetailOverviewCardRow>
						<BalanceTitle>Staked Balance</BalanceTitle>
						<Row justify={'space-around'}>
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
						</Row>
					</DetailOverviewCardRow>
				)}

				<DetailOverviewCardRow>
					{ethers.constants.MaxUint256.eq(allowance) ? (
						<Button
							loading={loadingSwap}
							disabled={totalYAX.eq(0)}
							onClick={() => call()}
						>
							Swap
						</Button>
					) : (
						<Button
							loading={loadingApprove}
							disabled={totalYAX.eq(0)}
							onClick={() => onApprove()}
						>
							Approve
						</Button>
					)}
				</DetailOverviewCardRow>
			</DetailOverviewCard>
		</Affix>
	)
}

const BalanceTitle = styled(Row)`
	margin-bottom: 14px;
`
