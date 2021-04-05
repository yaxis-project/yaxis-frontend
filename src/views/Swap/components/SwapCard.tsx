import { useMemo } from 'react'
import styled from 'styled-components'
import {
	DetailOverviewCard,
	DetailOverviewCardRow,
} from '../../../components/DetailOverviewCard'
import { Affix, Row, Col } from 'antd'
import useYAXStaking from '../../../hooks/useYAXISStaking'
import useContractWrite from '../../../hooks/useContractWrite'
import Button from '../../../components/Button'
import { ArrowRightOutlined, ArrowDownOutlined } from '@ant-design/icons'
import { formatBN } from '../../../yaxis/utils'

export default function VaultStatsCard() {
	const {
		balances: { stakedBalance, walletBalance },
	} = useYAXStaking()

	const { call } = useContractWrite({
		contractName: 'swap',
		method: 'swap',
		description: 'Token Swap',
	})

	const totalYAX = useMemo(() => stakedBalance.plus(walletBalance), [
		stakedBalance,
		walletBalance,
	])

	const longWalletBalance = useMemo(
		() => walletBalance.toFixed(2).length > 8,

		[walletBalance],
	)

	const longStakedBalance = useMemo(
		() => stakedBalance.toFixed(2).length > 8,
		[stakedBalance],
	)

	return (
		<Affix offsetTop={100}>
			<DetailOverviewCard title={'Swap'}>
				{walletBalance && (
					<DetailOverviewCardRow>
						<BalanceTitle>Account Balance</BalanceTitle>
						<Row justify={'space-around'}>
							<Col span={longWalletBalance ? 24 : 8}>
								<Row justify="center">
									{formatBN(walletBalance)}
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
									{formatBN(walletBalance)}
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
					<Button disabled={totalYAX.eq(0)} onClick={() => call()}>
						Swap
					</Button>
				</DetailOverviewCardRow>
			</DetailOverviewCard>
		</Affix>
	)
}

const BalanceTitle = styled(Row)`
	margin-bottom: 14px;
`
