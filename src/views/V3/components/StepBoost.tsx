import { useMemo, Dispatch, SetStateAction } from 'react'
import { NavLink } from 'react-router-dom'
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
						<StyledButton height={'40px'}>
							<NavLink to={'/governance#lock'}>
								{translate('Boost rewards')}
							</NavLink>
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
				title={translate('Lock up') + ' YAXIS'}
				description={translate('Done.')}
				status="finish"
			/>
		)
	}, [translate, yaxisBalance])

	const message = useMemo(() => {
		if (yaxisBalance.gt(0))
			return (
				<div>
					<div>Deposit in the YAXIS vault to receive emissions!</div>
					<div style={{ textAlign: 'center', marginTop: '5px' }}>
						OR
					</div>
				</div>
			)
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
