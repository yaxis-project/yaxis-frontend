import { useMemo, Dispatch, SetStateAction } from 'react'
import styled from 'styled-components'
import { DetailOverviewCardRow } from '../../../components/DetailOverviewCard'
import { Steps, Row } from 'antd'
import Button from '../../../components/Button'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import BigNumber from 'bignumber.js'

const { Step } = Steps

interface StepProps {
	step: number
	current: number
	setCurrent: Dispatch<SetStateAction<number>>
	complete: boolean
}

interface StepReenterProps extends StepProps {
	usdcBalance: BigNumber
	usdtBalance: BigNumber
	daiBalance: BigNumber
}

const StepReenter: React.FC<StepReenterProps> = ({
	usdcBalance,
	usdtBalance,
	daiBalance,
}) => {
	const yaxis = useMemo(() => {
		if (usdtBalance.gt(0) || daiBalance.gt(0) || usdcBalance.gt(0))
			return (
				<Step
					title={
						<StyledButton
							onClick={async () => {
								// TODO
								//route to lock
							}}
							height={'40px'}
						>
							Stake YAXIS
						</StyledButton>
					}
					description="Lock up your YAXIS for extra APY and voting power."
					icon={<StyledIcon />}
				/>
			)
		return (
			<Step title={'Stake YAXIS'} description="Done." status="finish" />
		)
	}, [usdcBalance, usdtBalance, daiBalance])

	const message = useMemo(() => {
		if (usdtBalance.gt(0) || daiBalance.gt(0) || usdcBalance.gt(0))
			return 'Stake your tokens to receive emissions!'
		return 'Step complete.'
	}, [usdcBalance, usdtBalance, daiBalance])

	return (
		<DetailOverviewCardRow>
			<Description>{message}</Description>

			<Steps direction="vertical">{yaxis}</Steps>
		</DetailOverviewCardRow>
	)
}

export default StepReenter

const Description = styled(Row)`
	font-size: 16px;
	padding: 0 10px 20px 10px;
`
const StyledIcon = styled(ExclamationCircleOutlined)`
	font-size: 30px;
	color: gold;
	&:hover {
		transition: color 0.5s;
		color: #e8b923;
	}
`
const StyledButton = styled(Button)`
	border: none;
	margin-bottom: 10px;
`
