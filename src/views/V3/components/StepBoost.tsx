import { useMemo, Dispatch, SetStateAction } from 'react'
import BigNumber from 'bignumber.js'
import { Row } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import styled from 'styled-components'
import { DetailOverviewCardRow } from '../../../components/DetailOverviewCard'
import Steps from '../../../components/Steps'
import Button from '../../../components/Button'
import useTranslation from '../../../hooks/useTranslation'

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
	const translate = useTranslation()

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
							{translate('Stake')} YAXIS
						</StyledButton>
					}
					description={translate(
						'Lock up your YAXIS for extra APY and voting power.',
					)}
					icon={<StyledIcon />}
				/>
			)
		return (
			<Step
				title={translate('Stake') + ' YAXIS'}
				description={translate('Done.')}
				status="finish"
			/>
		)
	}, [translate, yaxisBalance])

	const message = useMemo(() => {
		if (yaxisBalance.gt(0))
			return translate('Stake your tokens to receive emissions!')
		return translate('Step complete.')
	}, [translate, yaxisBalance])

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
	color: ${(props) => props.theme.primary.font};
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
