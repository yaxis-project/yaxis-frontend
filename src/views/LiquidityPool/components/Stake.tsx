import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import { Contract } from 'web3-eth-contract'
import { Row, Col, Card, Button, Divider } from 'antd'
import Label from '../../../components/Label'
import Value from '../../../components/Value'
import useAllowance from '../../../hooks/useAllowance'
import useApprove from '../../../hooks/useApprove'
import useModal from '../../../hooks/useModal'
import useStake from '../../../hooks/useStake'
import useStakedBalance from '../../../hooks/useStakedBalance'
import useTokenBalance from '../../../hooks/useTokenBalance'
import useUnstake from '../../../hooks/useUnstake'
import { getBalanceNumber } from '../../../utils/formatBalance'
import DepositModal from './DepositModal'
import WithdrawModal from './WithdrawModal'
import { useWeb3React } from '@web3-react/core'
import BigNumber from "bignumber.js";

interface StakeProps {
    lpContract: Contract
    pid: number
    tokenName: string
}

const Stake: React.FC<StakeProps> = ({ lpContract, pid, tokenName }) => {
    const { account } = useWeb3React()

    const [requestedApproval, setRequestedApproval] = useState(false)

    const allowance = useAllowance(lpContract)
    const { onApprove } = useApprove(lpContract)

    const tokenBalance = useTokenBalance(lpContract.options.address)
    const stakedBalance = useStakedBalance(pid)

    const { onStake } = useStake(pid)
    const { onUnstake } = useUnstake(pid)

    const [onPresentDeposit] = useModal(
        <DepositModal
            max={tokenBalance}
            onConfirm={onStake}
            tokenName={tokenName}
        />,
    )

    const [onPresentWithdraw] = useModal(
        <WithdrawModal
            max={stakedBalance}
            onConfirm={onUnstake}
            tokenName={tokenName}
        />,
    )

    const handleApprove = useCallback(async () => {
        try {
            setRequestedApproval(true)
            const txHash = await onApprove()
            // user rejected tx or didn't go thru
            if (!txHash) {
                setRequestedApproval(false)
            }
        } catch (e) {
            console.log(e)
        }
    }, [onApprove, setRequestedApproval])

    return (
        <Card
            className="liquidity-card"
            title={<strong>Staking</strong>}
        >
            <Row>
                <CardContents>
                    <Value value={getBalanceNumber(stakedBalance)} />
                    <Label text={`${tokenName} Tokens Staked`} />
                    <Divider />
                    {!allowance.toNumber() ? (
                        <Col span={12}>
                            <Button
                                className="staking-btn"
                                block
                                type="primary"
                                disabled={!account || requestedApproval}
                                onClick={handleApprove}
                            >
                                Approve {tokenName}
                            </Button>
                        </Col>
                    ) : (
                        <Row gutter={18} style={{ width: "100%", justifyContent: "space-between", padding: 0 }}>
                            <Col span={12}>
                                <Button
                                    className="staking-btn"
                                    disabled={tokenBalance.eq(new BigNumber(0))}
                                    onClick={onPresentDeposit}
                                    block
                                >
                                    Stake
                                    </Button>
                            </Col>
                            <Col span={12}>
                                <Button
                                    className="staking-btn"
                                    disabled={stakedBalance.eq(new BigNumber(0))}
                                    onClick={onPresentWithdraw}
                                    block
                                >
                                    Unstake
                                    </Button>
                            </Col>
                        </Row>
                    )}
                </CardContents>
            </Row>
        </Card>
    )
}

const CardContents = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
`

export default Stake
