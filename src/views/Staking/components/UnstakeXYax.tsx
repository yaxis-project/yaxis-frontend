import React, {useState} from 'react'
import styled from 'styled-components'
import Button from '../../../components/Button'
import Card from '../../../components/Card'
import CardContent from '../../../components/CardContent'
import CardIcon from '../../../components/CardIcon'
import Label from '../../../components/Label'
import Value from '../../../components/Value'
import {getBalanceNumber} from '../../../utils/formatBalance'
import useTokenBalance from "../../../hooks/useTokenBalance";
import {Contract} from "web3-eth-contract";
import useModal from "../../../hooks/useModal";
import WithdrawModal from "./WithdrawModal";
import useLeave from "../../../hooks/useLeave";
import BigNumber from "bignumber.js";

interface HarvestProps {
  lpContract: Contract,
  tokenPrice: number,
  rate: BigNumber
}

const UnstakeXYax: React.FC<HarvestProps> = ({rate, lpContract, tokenPrice}) => {

  const sYaxBalance = useTokenBalance(lpContract.options.address)
  const [pendingTx, setPendingTx] = useState(false)
  const yaxStaked = new BigNumber(sYaxBalance.multipliedBy(rate).toFixed(0, 1))

  const {onLeave} = useLeave()

  const tokenName = "YAX"

  const [onPresentLeave] = useModal(
    <WithdrawModal
      max={yaxStaked}
      rate={rate}
      sYax={sYaxBalance}
      onConfirm={onLeave}
      tokenName={tokenName}
    />,
  )

  return (
    <Card>
      <CardContent>
        <StyledCardContentInner>
          <StyledCardHeader>
            <Value value={getBalanceNumber(yaxStaked)}/>
            <Label text="YAX staked"/>
            {tokenPrice && sYaxBalance.gt(0) ? (
              <span>(${getBalanceNumber(sYaxBalance.multipliedBy(tokenPrice)).toFixed(2)})</span>
            ) : null}
          </StyledCardHeader>
          <StyledCardActions>
            <Button
              disabled={!sYaxBalance.toNumber() || pendingTx}
              text={pendingTx ? 'Unstaking' : 'Unstake'}
              onClick={async () => {
                setPendingTx(true)
                await onPresentLeave()
                setPendingTx(false)
              }}
            />
          </StyledCardActions>
        </StyledCardContentInner>
      </CardContent>
    </Card>
  )
}

const StyledCardHeader = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
`
const StyledCardActions = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${(props) => props.theme.spacing[6]}px;
  width: 100%;
`

const StyledSpacer = styled.div`
  height: ${(props) => props.theme.spacing[4]}px;
  width: ${(props) => props.theme.spacing[4]}px;
`

const StyledCardContentInner = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
`

export default UnstakeXYax
