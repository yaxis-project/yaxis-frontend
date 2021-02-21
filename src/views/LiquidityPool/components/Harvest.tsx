import React, { useState } from 'react'
import styled from 'styled-components'
import { Row, Card, Button, Divider } from 'antd'
import Label from '../../../components/Label'
import Value from '../../../components/Value'
import useEarnings from '../../../hooks/useEarnings'
import useReward from '../../../hooks/useReward'
import { getBalanceNumber } from '../../../utils/formatBalance'

interface HarvestProps {
    pid: number
}

const Harvest: React.FC<HarvestProps> = ({ pid }) => {
    const earnings = useEarnings(pid)
    const [pendingTx, setPendingTx] = useState(false)
    const { onReward } = useReward(pid)

    return (
        <Card className="liquidity-card">
            <Row>
                <CardContents>
                    <Value value={getBalanceNumber(earnings)} />
                    <Label text="YAX Earned" />
                    <Divider />
                    <Button
                        className="staking-btn"
                        block
                        type="primary"
                        disabled={!earnings.toNumber() || pendingTx}
                        onClick={async () => {
                            setPendingTx(true)
                            await onReward()
                            setPendingTx(false)
                        }}
                    >
                        {pendingTx ? 'Collecting YAX' : 'Harvest'}
                    </Button>
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

export default Harvest
