import React, { useState, useMemo, useEffect } from 'react'
import styled from 'styled-components'
import { Row, Col } from 'antd'
import Typography from '../../../components/Typography'
import Button from '../../../components/Button'
import Divider from '../../../components/Divider'
import Input from '../../../components/Input'
import Card from '../../../components/Card'
import { useContracts } from '../../../contexts/Contracts'
import useContractWrite from '../../../hooks/useContractWrite'
import { useAllTokenBalances } from '../../../state/wallet/hooks'
import ApprovalCover from '../../../components/ApprovalCover'
import BigNumber from 'bignumber.js'
import useTranslation from '../../../hooks/useTranslation'

const { Text } = Typography

const Deposit: React.FC = () => {
	const { contracts } = useContracts()
	const translate = useTranslation()
	const [balances, loadingBalances] = useAllTokenBalances()
	const { call, loading } = useContractWrite({
		contractName: 'internal.alchemist',
		method: 'deposit',
		description: `deposit`,
	})

	const [amount, setAmount] = useState('0')

	return (
		<Card title="Deposit Collateral">
			<div style={{ margin: '20px' }}>
				<Row>
					<StyledText>
						Deposit MIMcrv in order to lock your collateral. Your
						collateral earns yield that pays down your loan,
						allowing you to borrow USDY stablecoins against future
						yield.
					</StyledText>
				</Row>
			</div>

			<Divider style={{ margin: 0, padding: 0 }} />

			<ApprovalCover
				contractName={`currencies.ERC20.mim3crv.contract`}
				approvee={contracts?.internal.alchemist.address}
			>
				<StyledDiv>
					<Row style={{ marginBottom: '20px' }}>
						<Col span={8}>
							<StyledText>{translate('Amount')}</StyledText>
						</Col>
						<Col span={16}>
							<Row>
								<StyledSmallText>
									{translate('Wallet Balance')}
									{': '}
									<span style={{ fontWeight: 600 }}>
										{balances?.mim3crv?.amount
											? balances?.mim3crv?.amount.toNumber()
											: '-'}{' '}
										MIMcrv
									</span>
								</StyledSmallText>
							</Row>
							<Row>
								<Input
									onChange={(e) => {
										!isNaN(Number(e.target.value)) &&
											setAmount(e.target.value)
									}}
									value={amount}
									min={'0'}
									placeholder="0"
									disabled={
										balances?.mim3crv?.amount
											? balances?.mim3crv?.amount.isZero()
											: true
									}
									suffix={'MIMcrv'}
									onClickMax={() =>
										setAmount(
											balances?.mim3crv?.amount.toString(),
										)
									}
								/>
							</Row>
						</Col>
					</Row>

					<Button
						style={{ width: '100%', marginTop: '14px' }}
						disabled={
							loadingBalances ||
							balances?.mim3crv?.amount?.isZero() ||
							new BigNumber(amount).isZero() ||
							new BigNumber(amount).isNaN()
						}
						loading={loading}
						onClick={() =>
							call({
								args: [
									new BigNumber(amount)
										.multipliedBy(10 ** 18)
										.toString(),
								],
							})
						}
					>
						{translate('Deposit')}
					</Button>
				</StyledDiv>
			</ApprovalCover>
		</Card>
	)
}

export { Deposit }

const StyledDiv = styled.div`
	padding: 30px;
	width: 100%;
`

const StyledText = styled(Text)`
	font-size: 20px;
`

const StyledSmallText = styled(Text)`
	font-size: 16px;
`
