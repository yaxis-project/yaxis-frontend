import BigNumber from 'bignumber.js'
import React, { useCallback, useMemo, useState } from 'react'
import { Button } from 'antd'
import styled from 'styled-components'
import Modal, { ModalProps } from '../../../components/Modal'
import ModalActions from '../../../components/ModalActions'
import ModalTitle from '../../../components/ModalTitle'
import TokenInput from '../../../components/TokenInput'
import { getFullDisplayBalance } from '../../../utils/formatBalance'

interface DepositModalProps extends ModalProps {
    max: BigNumber
    onConfirm: (amount: string) => void
    tokenName?: string
}

const DepositModal: React.FC<DepositModalProps> = ({
    max,
    onConfirm,
    onDismiss,
    tokenName = '',
}) => {
    const [val, setVal] = useState('')
    const [pendingTx, setPendingTx] = useState(false)

    const fullBalance = useMemo(() => {
        return getFullDisplayBalance(max)
    }, [max])

    const handleChange = useCallback(
        (e: React.FormEvent<HTMLInputElement>) => {
            setVal(e.currentTarget.value)
        },
        [setVal],
    )

    const handleSelectMax = useCallback(() => {
        setVal(fullBalance)
    }, [fullBalance, setVal])

    return (
        <Modal>
            <ModalTitle text={`Deposit LP Tokens`} />
            <TokenInput
                value={val}
                onSelectMax={handleSelectMax}
                onChange={handleChange}
                max={fullBalance}
                symbol={tokenName}
            />
            <ModalActions>
                <StyledButton
                    onClick={onDismiss}
                    block
                    type="primary"
                >
                    Cancel
                </StyledButton>
                <StyledButton
                    block
                    type="primary"
                    disabled={val === '' || new BigNumber(val).toNumber() === 0 || new BigNumber(val).gt(fullBalance) || pendingTx}
                    onClick={async () => {
                        setPendingTx(true)
                        await onConfirm(val)
                        setPendingTx(false)
                        onDismiss()
                    }}
                >
                    {pendingTx ? 'Pending Confirmation' : 'Confirm'}
                </StyledButton>
            </ModalActions>
        </Modal>
    )
}

const StyledButton = styled(Button)`
    background: #016eac;
    border: none;
    height: 60px;
    color: white;
    margin-bottom: 26px;
    &:hover {
        background-color: #0186d3;
    }
    &[disabled] {
        color: #8c8c8c;
        background-color: #f0f0f0;
        border: none;
    }
`

export default DepositModal
