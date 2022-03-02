import { useMemo } from 'react'
import { Row, Col } from 'antd'
import CardRow from '../CardRow'
import Value from '../Value'
import Button from '../Button'
import { useContracts } from '../../contexts/Contracts'
import useContractWrite from '../../hooks/useContractWrite'
import { useSingleCallResultByName } from '../../state/onchain/hooks'
import { useUserGaugeClaimable } from '../../state/wallet/hooks'
import { getBalanceNumber } from '../../utils/formatBalance'
import useWeb3Provider from '../../hooks/useWeb3Provider'
import BigNumber from 'bignumber.js'
import useTranslation from '../../hooks/useTranslation'
import { chunk } from 'lodash'

const ClaimAll: React.FC = () => {
	const translate = useTranslation()

	const { account } = useWeb3Provider()

	const { contracts, loading: loadingContracts } = useContracts()

	/** NOTE: Legacy V2 Rewards Contract **/
	const { call: handleClaimMetaVault, loading: loadingClaimMetaVault } =
		useContractWrite({
			contractName: `rewards.MetaVault`,
			method: 'getReward',
			description: `claim YAXIS MetaVault staking rewards`,
		})

	const { loading: loadingClaimableMetaVault, result: claimableMetaVault } =
		useSingleCallResultByName(`rewards.MetaVault`, 'earned', [account])

	const { call: handleClaimLegacyYAXIS, loading: loadingClaimLegacyYAXIS } =
		useContractWrite({
			contractName: `rewards.Yaxis`,
			method: 'getReward',
			description: `claim YAXIS staking rewards`,
		})

	const {
		loading: loadingClaimableLegacyYAXIS,
		result: claimableLegacyYAXIS,
	} = useSingleCallResultByName(`rewards.Yaxis`, 'earned', [account])

	const legacyClaimable = useMemo(
		() =>
			new BigNumber(claimableMetaVault?.[0]?.toString() || 0).plus(
				claimableLegacyYAXIS?.[0]?.toString() || 0,
			),
		[claimableMetaVault, claimableLegacyYAXIS],
	)
	/***************************************************/

	const [loadingUserGauges, gauges] = useUserGaugeClaimable()

	const { call: handleClaimMany, loading: loadingClaimMany } =
		useContractWrite({
			contractName: `internal.minter`,
			method: 'mint_many',
			description: translate(`claim YAXIS`),
		})

	const claimable = useMemo(
		() =>
			Object.values(gauges).reduce(
				(gauge, acc) => acc.plus(gauge),
				new BigNumber(0),
			),
		[gauges],
	)

	return (
		<CardRow
			main={'Pending Rewards'}
			secondary={
				<Value
					value={getBalanceNumber(legacyClaimable.plus(claimable))}
					numberSuffix=" YAXIS"
					decimals={2}
				/>
			}
			rightContent={
				<Row justify="center">
					<Col xs={14} sm={14} md={14}>
						<Button
							disabled={
								loadingContracts ||
								loadingClaimableMetaVault ||
								loadingClaimableLegacyYAXIS ||
								loadingUserGauges ||
								new BigNumber(claimable?.toString() || 0)
									.plus(legacyClaimable)
									.isZero()
							}
							onClick={() => {
								if (claimable.gt(0)) {
									const gaugeAddresses =
										Object.entries(gauges)
									const chunks = chunk(gaugeAddresses, 8)
									chunks.forEach((chunk) => {
										const addressesToClaim = chunk.reduce(
											(addresses, [name, claimable]) => {
												if (claimable.gt(0))
													addresses.push(
														contracts.vaults[name]
															.gauge.address,
													)
												return addresses
											},
											[],
										)

										const addressesToClaimFilled = [
											...addressesToClaim,
											...Array(
												8 - addressesToClaim.length,
											).fill(
												'0x0000000000000000000000000000000000000000',
											),
										]

										handleClaimMany({
											args: [addressesToClaimFilled],
										})
									})
								}
								if (
									new BigNumber(
										claimableMetaVault?.toString() || 0,
									).gt(0)
								)
									handleClaimMetaVault()

								if (
									new BigNumber(
										claimableLegacyYAXIS?.toString() || 0,
									).gt(0)
								)
									handleClaimLegacyYAXIS()
							}}
							loading={
								loadingClaimLegacyYAXIS ||
								loadingClaimMetaVault ||
								loadingClaimMany
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
