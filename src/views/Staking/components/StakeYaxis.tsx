import BigNumber from 'bignumber.js'
import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import Button from '../../../components/Button'
import Card from '../../../components/Card'
import CardContent from '../../../components/CardContent'
import Label from '../../../components/Label'
import Value from '../../../components/Value'
import useModal from '../../../hooks/useModal'
import useTokenBalance from '../../../hooks/useTokenBalance'
import { getBalanceNumber } from '../../../utils/formatBalance'
import DepositModal from './DepositModal'
import useEnter from '../../../hooks/useEnter'
import useLeave from '../../../hooks/useLeave'
import useAllowanceStaking from '../../../hooks/useAllowanceStaking'
import useApproveStaking from '../../../hooks/useApproveStaking'
import { currentConfig } from '../../../yaxis/configs'
import Countdown, { CountdownRenderProps } from 'react-countdown'

interface StakeProps {}

const StakeYaxis: React.FC<StakeProps> = ({}) => {
	const tokenName = 'YAX'
	const [requestedApproval, setRequestedApproval] = useState(false)

	const allowance = useAllowanceStaking()
	const { onApprove } = useApproveStaking()

	const tokenBalance = useTokenBalance(currentConfig.contractAddresses.yaxis)

	const { onEnter } = useEnter()
	const { onLeave } = useLeave()
	const [onPresentDeposit] = useModal(
		<DepositModal
			max={tokenBalance}
			onConfirm={onEnter}
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

	const renderer = (countdownProps: CountdownRenderProps) => {
		const { hours, minutes, seconds } = countdownProps
		const paddedSeconds = seconds < 10 ? `0${seconds}` : seconds
		const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes
		const paddedHours = hours < 10 ? `0${hours}` : hours
		return (
			<span style={{ width: '100%', fontSize: '.85rem' }}>
				Stake after {paddedHours}:{paddedMinutes}:{paddedSeconds}
			</span>
		)
	}

	return (
		<Card>
			<CardContent>
				<StyledCardContentInner>
					<StyledCardHeader>
						<Value value={getBalanceNumber(tokenBalance)} />
						<Label text={`YAX unstaked`} />
					</StyledCardHeader>
					<StyledCardActions>
						{new Date().getTime() <
						currentConfig.staking.openTime ? (
							<Button disabled>
								<Countdown
									date={
										new Date(currentConfig.staking.openTime)
									}
									renderer={renderer}
								/>
							</Button>
						) : !allowance.toNumber() ? (
							<Button
								disabled={requestedApproval}
								onClick={handleApprove}
								text={
									requestedApproval
										? 'Approving YAX'
										: 'Approve YAX'
								}
							/>
						) : (
							<>
								<Button
									disabled={tokenBalance.eq(new BigNumber(0))}
									text="Stake"
									onClick={onPresentDeposit}
								/>
							</>
						)}
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

const StyledActionSpacer = styled.div`
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

export default StakeYaxis
