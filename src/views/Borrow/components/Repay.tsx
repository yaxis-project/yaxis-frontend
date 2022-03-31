import React, { useState, useMemo, useEffect } from 'react'
import styled from 'styled-components'
import { Row, Col } from 'antd'
import BigNumber from 'bignumber.js'
import Typography from '../../../components/Typography'
import Button from '../../../components/Button'
import Divider from '../../../components/Divider'
import Input from '../../../components/Input'
import Card from '../../../components/Card'
import ApprovalCover from '../../../components/ApprovalCover'
import { useAlchemist } from '../../../state/wallet/hooks'
import useContractWrite from '../../../hooks/useContractWrite'
import useTranslation from '../../../hooks/useTranslation'
import { useContracts } from '../../../contexts/Contracts'

const { Text } = Typography

const Repay: React.FC = () => {
	const { contracts } = useContracts()
	const translate = useTranslation()
	const { debt } = useAlchemist()
	const { call, loading } = useContractWrite({
		contractName: 'internal.alchemist',
		method: 'repay',
		description: `repay`,
	})

	const [mimAmount, setMimAmount] = useState('0')
	const [usdyAmount, setUsdyAmount] = useState('0')

	return (
		<Card title="Repay Loan (Early Repayment)">
			<div style={{ margin: '20px' }}>
				<Row>
					<StyledText>
						Pay off a portion of your loan early. Any collateral
						remaining after early repayment can be unlocked and
						withdrawn.
					</StyledText>
				</Row>
			</div>

			<Divider style={{ margin: 0, padding: 0 }} />

			<ApprovalCover
				contractName={`currencies.ERC20.usdy.contract`}
				approvee={contracts?.internal.alchemist.address}
			>
				<StyledDiv>
					<Row style={{ marginBottom: '20px' }}>
						<Col span={8}>
							<StyledText>
								MIMcrv {translate('Amount')}
							</StyledText>
						</Col>
						<Col span={16}>
							<Row>
								<Input
									onChange={(e) => {
										!isNaN(Number(e.target.value)) &&
											setMimAmount(e.target.value)
									}}
									value={mimAmount}
									min={'0'}
									placeholder="0"
									disabled={debt?.isZero()}
									suffix={'USDY'}
									onClickMax={() =>
										setMimAmount(debt?.toString())
									}
								/>
							</Row>
						</Col>
					</Row>

					<Row style={{ marginBottom: '20px' }}>
						<Col span={8}>
							<StyledText>USDY {translate('Amount')}</StyledText>
						</Col>
						<Col span={16}>
							<Row>
								<Input
									onChange={(e) => {
										!isNaN(Number(e.target.value)) &&
											setUsdyAmount(e.target.value)
									}}
									value={usdyAmount}
									min={'0'}
									placeholder="0"
									disabled={debt?.isZero()}
									suffix={'USDY'}
									onClickMax={() =>
										setUsdyAmount(debt?.toString())
									}
								/>
							</Row>
						</Col>
					</Row>

					<Button
						style={{ width: '100%', marginTop: '14px' }}
						disabled={
							debt?.isZero() ||
							(new BigNumber(mimAmount).isZero() &&
								new BigNumber(usdyAmount).isZero())
						}
						loading={loading}
						onClick={() =>
							call({
								args: [
									new BigNumber(mimAmount || '0')
										.multipliedBy(10 ** 18)
										.toString(),
									new BigNumber(usdyAmount || '0')
										.multipliedBy(10 ** 18)
										.toString(),
								],
							})
						}
					>
						Repay
					</Button>
				</StyledDiv>
			</ApprovalCover>
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
