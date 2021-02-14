import BigNumber from 'bignumber.js'
import React, { useCallback, useMemo, useState } from 'react'
import Button from '../../../components/Button'
import Modal, { ModalProps } from '../../../components/Modal'
import ModalActions from '../../../components/ModalActions'
import ModalTitle from '../../../components/ModalTitle'
import TokenInput from '../../../components/TokenInput'
import {
	getFullDisplayBalance,
	mulPowNumber,
} from '../../../utils/formatBalance'

interface WithdrawModalProps extends ModalProps {
	max: BigNumber
	sYax: BigNumber
	rate: BigNumber
	onConfirm: (amount: string) => void
	tokenName?: string
}

const WithdrawModal: React.FC<WithdrawModalProps> = ({
	onConfirm,
	onDismiss,
	max,
	sYax,
	rate,
	tokenName = '',
}) => {
	const [val, setVal] = useState('')
	const [sYaxVal, setsYaxVal] = useState('')
	const [pendingTx, setPendingTx] = useState(false)

	const fullBalance = useMemo(() => {
		return getFullDisplayBalance(max)
	}, [max])

	const handleChange = useCallback(
		(e: React.FormEvent<HTMLInputElement>) => {
			setVal(e.currentTarget.value)
			setsYaxVal(
				getFullDisplayBalance(
					new BigNumber(
						mulPowNumber(new BigNumber(e.currentTarget.value)),
					)
						.dividedBy(rate)
						.toFixed(0, 1),
				),
			)
		},
		[setVal],
	)

	const handleSelectMax = useCallback(() => {
		setVal(fullBalance)
		setsYaxVal(getFullDisplayBalance(sYax))
	}, [fullBalance, setVal])
	return (
		<Modal>
			<ModalTitle text={`Withdraw ${tokenName}`} />
			<TokenInput
				onSelectMax={handleSelectMax}
				onChange={handleChange}
				value={val}
				max={fullBalance}
				symbol={tokenName}
			/>
			<ModalActions>
				<Button text="Cancel" variant="secondary" onClick={onDismiss} />
				<Button
					disabled={pendingTx}
					text={pendingTx ? 'Pending Confirmation' : 'Confirm'}
					onClick={async () => {
						try {
							setPendingTx(true)
							await onConfirm(sYaxVal)
							setPendingTx(false)
							onDismiss()
						} catch (e) {
							setPendingTx(false)
						}
					}}
				/>
			</ModalActions>
		</Modal>
	)
}

export default WithdrawModal
