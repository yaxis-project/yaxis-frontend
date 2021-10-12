import { useMemo, Dispatch, SetStateAction } from 'react'
import styled from 'styled-components'
import { DetailOverviewCardRow } from '../../../components/DetailOverviewCard'
import { Row } from 'antd'
import Steps from '../../../components/Steps'
import Button from '../../../components/Button'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import BigNumber from 'bignumber.js'
import useTranslation from '../../../hooks/useTranslation'

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
	const translate = useTranslation()

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
	}, [translate, usdcBalance, usdtBalance, daiBalance])

	const message = useMemo(() => {
		if (usdtBalance.gt(0) || daiBalance.gt(0) || usdcBalance.gt(0))
			return translate('Stake your tokens to receive emissions!')
		return translate('Step complete.')
	}, [translate, usdcBalance, usdtBalance, daiBalance])

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
