import React, { useState, useMemo, useEffect } from 'react'
import styled from 'styled-components'
import { Row, Col } from 'antd'
import Typography from '../../../components/Typography'
import Button from '../../../components/Button'
import Divider from '../../../components/Divider'
import Input from '../../../components/Input'
import Card from '../../../components/Card'
import useContractWrite from '../../../hooks/useContractWrite'
import { useAlchemist } from '../../../state/wallet/hooks'
import BigNumber from 'bignumber.js'
import useTranslation from '../../../hooks/useTranslation'

const { Text } = Typography

const Repay: React.FC = () => {
	const translate = useTranslation()
	const alchemist = useAlchemist()
	const { call, loading } = useContractWrite({
		contractName: 'internal.alchemist',
		method: 'repay',
		description: `repay`,
	})

	const [amount, setAmount] = useState('0')

	return (
		<Card title="Repay Loan (Early Repayment)">
			<div style={{ margin: '20px' }}>
				<Row>
					<StyledText>
						Pay off a portion of your loan early, using your
						collateral. Any collateral remaining after early
						repayment can be unlocked and withdrawn.
					</StyledText>
				</Row>
			</div>

			<Divider style={{ margin: 0, padding: 0 }} />

			<StyledDiv>
				<Row style={{ marginBottom: '20px' }}>
					<Col span={8}>
						<StyledText>{translate('Amount')}</StyledText>
					</Col>
					<Col span={16}>
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
									alchemist.debt
										? alchemist.debt.isZero()
										: true
								}
								suffix={'YUSD'}
								onClickMax={() =>
									setAmount(alchemist.debt.toString())
								}
							/>
						</Row>
					</Col>
				</Row>

				<Button
					style={{ width: '100%', marginTop: '14px' }}
					disabled={
						alchemist.loading ||
						alchemist.debt?.isZero() ||
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
					Repay
				</Button>
			</StyledDiv>
		</Card>
	)
}

export { Repay }

const StyledDiv = styled.div`
	padding: 30px;
	width: 100%;
`

const StyledText = styled(Text)`
	font-size: 20px;
`
