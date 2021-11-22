import { useMemo, Dispatch, SetStateAction } from 'react'
import styled from 'styled-components'
import { DetailOverviewCardRow } from '../../../components/DetailOverviewCard'
import { Row } from 'antd'
import Steps from '../../../components/Steps'
import Button from '../../../components/Button'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import BigNumber from 'bignumber.js'
import useTranslation from '../../../hooks/useTranslation'
import useContractWrite from '../../../hooks/useContractWrite'
import { useV3Approvals } from '../../../state/wallet/hooks'
import { useContracts } from '../../../contexts/Contracts'
import { MAX_UINT } from '../../../utils/number'
import { ethers } from 'ethers'
import { LoadingOutlined } from '@ant-design/icons'

const { Step } = Steps

interface StepProps {
	step: number
	current: number
	setCurrent: Dispatch<SetStateAction<number>>
	complete: boolean
}

interface StepReenterProps extends StepProps {
	balance3crv: BigNumber
	balance3crvmim: BigNumber
	balanceDai: BigNumber
	balanceUSDC: BigNumber
	balanceUSDT: BigNumber
}

const StepReenter: React.FC<StepReenterProps> = ({
	balance3crv,
	balance3crvmim,
	balanceDai,
	balanceUSDC,
	balanceUSDT,
}) => {
	const translate = useTranslation()

	const { contracts } = useContracts()

	const approvals = useV3Approvals()

	const { call: handleApproveVault, loading: loadingApproveVault } =
		useContractWrite({
			contractName: 'vaults.usd.token.contract',
			method: 'approve',
			description: `approve token usage`,
		})

	const { call: handleApproveHelper, loading: loadingApproveHelper } =
		useContractWrite({
			contractName: 'vaults.usd.token.contract',
			method: 'approve',
			description: `approve token usage`,
		})

	const { call: handleDeposit, loading: loadingDeposit } = useContractWrite({
		contractName: 'internal.vaultHelper',
		method: 'depositVault',
		description: `Vault deposit`,
	})

	const exit3crv = useMemo(() => {
		if (balance3crv.gt(0))
			return (
				<Step
					title={
						<StyledButton
							target={'_blank'}
							rel="noopener noreferrer"
							href="https://curve.fi/3pool/withdraw"
							height={'40px'}
						>
							<span style={{ marginTop: '5px' }}>Exit 3CRV</span>
						</StyledButton>
					}
					description={'Remove liquidity from the 3CRV curve pool.'}
					icon={<StyledIcon />}
				/>
			)

		return (
			<Step
				title={'Exit 3CRV'}
				description={translate('Done.')}
				status="finish"
			/>
		)
	}, [translate, balance3crv])

	const mim3crv = useMemo(() => {
		if (balanceDai.gt(0) || balanceUSDC.gt(0) || balanceUSDT.gt(0))
			return (
				<Step
					title={
						<StyledButton
							target={'_blank'}
							rel="noopener noreferrer"
							href="https://curve.fi/mim/deposit"
							height={'40px'}
						>
							<span style={{ marginTop: '5px' }}>
								Get MIM 3CRV LP token
							</span>
						</StyledButton>
					}
					description={'Supply 3CRV as liquidity to the curve pool.'}
					icon={<StyledIcon />}
				/>
			)

		return (
			<Step
				title={'Get MIM3CRV'}
				description={translate('Done.')}
				status="finish"
			/>
		)
	}, [translate, balanceDai, balanceUSDC, balanceUSDT])

	const deposit = useMemo(() => {
		if (approvals.loading)
			return <LoadingOutlined style={{ fontSize: 54 }} spin />

		if (approvals.vault.lt(MAX_UINT))
			return (
				<Step
					title={
						<StyledButton
							onClick={async () => {
								handleApproveVault({
									args: [
										contracts?.vaults['usd'].vault.address,
										ethers.constants.MaxUint256.toString(),
									],
								})
							}}
							loading={loadingApproveVault}
							height={'40px'}
						>
							{translate('Approve')} Vault
						</StyledButton>
					}
					description={'Approve depositing MIM3CRV into the Vault.'}
					icon={<StyledIcon />}
				/>
			)

		if (approvals.helper.lt(MAX_UINT))
			return (
				<Step
					title={
						<StyledButton
							onClick={async () => {
								handleApproveHelper({
									args: [
										contracts?.internal.vaultHelper.address,
										ethers.constants.MaxUint256.toString(),
									],
								})
							}}
							loading={loadingApproveHelper}
							height={'40px'}
						>
							{translate('Approve')} auto-staking
						</StyledButton>
					}
					description={
						'Approve automatically staking your Vault tokens for emissions.'
					}
					icon={<StyledIcon />}
				/>
			)

		if (balance3crvmim.gt(0))
			return (
				<Step
					title={
						<StyledButton
							onClick={async () => {
								handleDeposit({
									args: [
										contracts.vaults['usd'].vault.address,
										balance3crvmim.toString(),
									],
								})
							}}
							loading={loadingDeposit}
							height={'40px'}
						>
							{translate('Deposit') + ' MIM3CRV'}
						</StyledButton>
					}
					description={'Deposit and stake into the Vault.'}
					icon={<StyledIcon />}
				/>
			)
		return (
			<Step
				title={translate('Deposit') + ' MIM3CRV'}
				description={translate('Done.')}
				status="finish"
			/>
		)
	}, [
		contracts,
		translate,
		approvals,
		handleApproveVault,
		loadingApproveVault,
		handleApproveHelper,
		loadingApproveHelper,
		balance3crvmim,
		handleDeposit,
		loadingDeposit,
	])

	const message = useMemo(() => {
		if (balance3crv.gt(0) || balance3crvmim.gt(0))
			return 'Deposit into the new Vault to receive emissions!'
		return translate('Step complete.')
	}, [translate, balance3crv, balance3crvmim])

	return (
		<DetailOverviewCardRow>
			<Description>{message}</Description>

			<Steps direction="vertical">
				{exit3crv}
				{mim3crv}
				{deposit}
			</Steps>
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
