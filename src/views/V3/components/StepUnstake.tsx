import { useMemo, Dispatch, SetStateAction } from 'react'
import BigNumber from 'bignumber.js'
import { Steps, Row } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import styled from 'styled-components'
import { DetailOverviewCardRow } from '../../../components/DetailOverviewCard'
import Button from '../../../components/Button'
import useContractWrite from '../../../hooks/useContractWrite'
import { MAX_UINT } from '../../../utils/number'
import { ethers } from 'ethers'

const { Step } = Steps

interface StepProps {
	step: number
	current: number
	setCurrent: Dispatch<SetStateAction<number>>
	complete: boolean
}

interface StepUnstakeProps extends StepProps {
	stakedYAXIS: BigNumber
}

const StepUnstake: React.FC<StepUnstakeProps> = ({ stakedYAXIS }) => {
	const { call: handleUnstake, loading: loadingStakeMVLT } = useContractWrite(
		{
			contractName: `rewards.MetaVault`,
			method: 'stake',
			description: `stake MVLT`,
		},
	)

	const yaxis = useMemo(() => {
		if (stakedYAXIS.gt(0))
			return (
				<Step
					title={
						<StyledButton
							onClick={() =>
								handleUnstake({
									args: [],
								})
							}
							loading={loadingStakeMVLT}
							height={'40px'}
						>
							Approve MVLT
						</StyledButton>
					}
					description="Approve the new rewards contract to use your MVLT."
					icon={<StyledIcon />}
					status="wait"
				/>
			)
		return <Step title="Stake MVLT" description="Done." status="finish" />
	}, [stakedYAXIS, handleUnstake, loadingStakeMVLT])

	const message = useMemo(() => {
		if (stakedYAXIS.gt(0)) return 'Stake your tokens to receive emissions!'

		return 'Step complete.'
	}, [stakedYAXIS])

	return (
		<>
			<DetailOverviewCardRow>
				<Description>{message}</Description>
				<Steps direction="vertical">{yaxis}</Steps>
			</DetailOverviewCardRow>
		</>
	)
}

export default StepUnstake

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
