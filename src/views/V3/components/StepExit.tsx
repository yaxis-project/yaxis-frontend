import { useMemo, Dispatch, SetStateAction } from 'react'
import styled from 'styled-components'
import { DetailOverviewCardRow } from '../../../components/DetailOverviewCard'
import { Row } from 'antd'
import Steps from '../../../components/Steps'
import Button from '../../../components/Button'
import BigNumber from 'bignumber.js'
import useContractWrite from '../../../hooks/useContractWrite'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import useTranslation from '../../../hooks/useTranslation'

const { Step } = Steps

interface StepProps {
	step: number
	current: number
	setCurrent: Dispatch<SetStateAction<number>>
	complete: boolean
}

interface StepExitProps extends StepProps {
	stakedMVLT: BigNumber
	walletMVLT: BigNumber
}

const StepExit: React.FC<StepExitProps> = ({ stakedMVLT, walletMVLT }) => {
	const translate = useTranslation()

	const { call: handleUnstake, loading: loadingUnstake } = useContractWrite({
		contractName: `rewards.MetaVault`,
		method: 'withdraw',
		description: `unstake MVLT`,
	})

	const { call: handleWithdrawAll, loading: loadingWithdrawAll } =
		useContractWrite({
			contractName: 'internal.yAxisMetaVault',
			method: 'withdrawAll',
			description: `MetaVault withdraw`,
		})

	const unstakeMetaVault = useMemo(() => {
		if (stakedMVLT.gt(0))
			return (
				<Step
					title={
						<StyledButton
							onClick={async () =>
								handleUnstake({
									args: [
										stakedMVLT
											.multipliedBy(10 ** 18)
											.toString(),
									],
								})
							}
							loading={loadingUnstake}
							height={'40px'}
						>
							{translate('Unstake')} MetaVault
						</StyledButton>
					}
					description={'Unstake MVLT from the Rewards contract'}
					icon={<StyledIcon />}
				/>
			)

		if (walletMVLT.gt(0))
			return (
				<Step
					title={
						<StyledButton
							onClick={async () => handleWithdrawAll()}
							loading={loadingWithdrawAll}
							height={'40px'}
						>
							{translate('Withdraw')} MetaVault
						</StyledButton>
					}
					description={'Withdraw from MetaVault'}
					icon={<StyledIcon />}
				/>
			)

		return (
			<Step
				title={translate('Exit MetaVault')}
				description={translate('Done.')}
				status="finish"
			/>
		)
	}, [
		translate,
		stakedMVLT,
		walletMVLT,
		handleUnstake,
		loadingUnstake,
		handleWithdrawAll,
		loadingWithdrawAll,
	])

	const message = useMemo(() => {
		if (stakedMVLT.gt(0) || walletMVLT.gt(0))
			return translate('First, exit the previous contracts')

		return translate('Step complete.')
	}, [translate, stakedMVLT, walletMVLT])

	return (
		<>
			<DetailOverviewCardRow>
				<Description>{message}</Description>
				<Steps direction="vertical">{unstakeMetaVault}</Steps>
			</DetailOverviewCardRow>
		</>
	)
}

export default StepExit

const Description = styled(Row)`
	font-size: 16px;
	padding: 0 10px 20px 10px;
	color: ${(props) => props.theme.primary.font};
`
const StyledButton = styled(Button)`
	border: none;
	margin-bottom: 10px;
`
const StyledIcon = styled(ExclamationCircleOutlined)`
	font-size: 30px;
	color: gold;
	&:hover {
		transition: color 0.5s;
		color: #e8b923;
	}
`
