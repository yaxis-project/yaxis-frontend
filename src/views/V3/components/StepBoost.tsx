import { useMemo, Dispatch, SetStateAction } from 'react'
import BigNumber from 'bignumber.js'
import { Steps, Row } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import styled from 'styled-components'
import { DetailOverviewCardRow } from '../../../components/DetailOverviewCard'
import Button from '../../../components/Button'

const { Step } = Steps

interface StepProps {
	step: number
	current: number
	setCurrent: Dispatch<SetStateAction<number>>
	complete: boolean
}

interface StepBoostProps extends StepProps {
	yaxisBalance: BigNumber
}

const StepBoost: React.FC<StepBoostProps> = ({ yaxisBalance }) => {
	const yaxis = useMemo(() => {
		if (yaxisBalance.gt(0))
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
	}, [yaxisBalance])

	const message = useMemo(() => {
		if (yaxisBalance.gt(0)) return 'Stake your tokens to receive emissions!'
		return 'Step complete.'
	}, [yaxisBalance])

	return (
		<>
			<DetailOverviewCardRow>
				<Description>{message}</Description>
				<Steps direction="vertical">{yaxis}</Steps>
			</DetailOverviewCardRow>
		</>
	)
}

export default StepBoost

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
