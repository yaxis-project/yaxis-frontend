import { useMemo } from 'react'
import { Row, Col } from 'antd'
import { CardRow } from '../ExpandableSidePanel'
import Value from '../Value'
import Button from '../Button'
import useContractWrite from '../../hooks/useContractWrite'
import { useSingleCallResultByName } from '../../state/onchain/hooks'
import { getBalanceNumber } from '../../utils/formatBalance'
import useWeb3Provider from '../../hooks/useWeb3Provider'
import BigNumber from 'bignumber.js'
import { currentConfig } from '../../constants/configs'
import useTranslation from '../../hooks/useTranslation'

const ClaimAll: React.FC = () => {
	const translate = useTranslation()

	const { account, chainId } = useWeb3Provider()

	const vaults = useMemo(() => currentConfig(chainId).vaults, [chainId])

	/** NOTE: Legacy V2 Rewards Contract **/
	const { call: handleClaimMetaVault, loading: loadingClaimMetaVault } =
		useContractWrite({
			contractName: `rewards.MetaVault`,
			method: 'getReward',
			description: `claim YAXIS`,
		})

	const { loading: loadingClaimableMetaVault, result: claimableMetaVault } =
		useSingleCallResultByName(`rewards.MetaVault`, 'earned', [account])

	/***************************************************/

	const { call: handleClaimWBTC, loading: loadingClaimWBTC } =
		useContractWrite({
			contractName: `vaults.wbtc`,
			method: 'claim_rewards',
			description: `claim YAXIS`,
		})

	const { loading: loadingClaimableWBTC, result: claimableWBTC } =
		useSingleCallResultByName(`vaults.wbtc`, 'claimable_reward', [
			account,
			vaults.wbtc.vault,
		])

	const { call: handleClaim3CRV, loading: loadingClaim3CRV } =
		useContractWrite({
			contractName: `vaults.3crv`,
			method: 'claim_rewards',
			description: `claim YAXIS`,
		})

	const { loading: loadingClaimable3CRV, result: claimable3CRV } =
		useSingleCallResultByName(`vaults.3crv`, 'claimable_reward', [
			account,
			vaults.wbtc.vault,
		])

	const { call: handleClaimWETH, loading: loadingClaimWETH } =
		useContractWrite({
			contractName: `vaults.weth`,
			method: 'claim_rewards',
			description: `claim YAXIS`,
		})

	const { loading: loadingClaimableWETH, result: claimableWETH } =
		useSingleCallResultByName(`vaults.weth`, 'claimable_reward', [
			account,
			vaults.wbtc.vault,
		])

	const { call: handleClaimLINK, loading: loadingClaimLINK } =
		useContractWrite({
			contractName: `vaults.link`,
			method: 'claim_rewards',
			description: `claim YAXIS`,
		})

	const { loading: loadingClaimableLINK, result: claimableLINK } =
		useSingleCallResultByName(`vaults.link`, 'claimable_reward', [
			account,
			vaults.wbtc.vault,
		])

	const claimable = useMemo(
		() =>
			new BigNumber(claimableMetaVault?.toString() || 0)
				.plus(claimableWBTC?.toString() || 0)
				.plus(claimableWETH?.toString() || 0)
				.plus(claimable3CRV?.toString() || 0)
				.plus(claimableLINK?.toString() || 0),
		[
			claimableMetaVault,
			claimableWBTC,
			claimableWETH,
			claimableLINK,
			claimable3CRV,
		],
	)

	return (
		<CardRow
			main={translate('Rewards')}
			secondary={
				<Value
					value={getBalanceNumber(
						new BigNumber(claimable?.toString() || 0),
					)}
					numberSuffix=" YAXIS"
					decimals={2}
				/>
			}
			rightContent={
				<Row justify="center">
					<Col xs={14} sm={14} md={14}>
						<Button
							disabled={
								loadingClaimableMetaVault ||
								loadingClaimableLINK ||
								loadingClaimableWETH ||
								loadingClaimable3CRV ||
								loadingClaimableWBTC ||
								new BigNumber(
									claimable?.toString() || 0,
								).isZero()
							}
							onClick={() => {
								if (
									new BigNumber(
										claimableMetaVault?.toString() || 0,
									).gt(0)
								)
									handleClaimMetaVault()
								if (
									new BigNumber(
										claimableWBTC?.toString() || 0,
									).gt(0)
								)
									handleClaimWBTC()
								if (
									new BigNumber(
										claimableWETH?.toString() || 0,
									).gt(0)
								)
									handleClaimWETH()
								if (
									new BigNumber(
										claimableLINK?.toString() || 0,
									).gt(0)
								)
									handleClaimLINK()
								if (
									new BigNumber(
										claimableLINK?.toString() || 0,
									).gt(0)
								)
									handleClaimLINK()
							}}
							loading={
								loadingClaimMetaVault ||
								loadingClaimWBTC ||
								loadingClaimWETH ||
								loadingClaim3CRV ||
								loadingClaimLINK
							}
							height={'40px'}
						>
							{translate('Claim All')}
						</Button>
					</Col>
				</Row>
			}
		/>
	)
}

export default ClaimAll
