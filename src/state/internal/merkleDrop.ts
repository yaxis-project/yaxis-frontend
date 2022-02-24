import { useEffect, useMemo, useState } from 'react'
import useWeb3Provider from '../../hooks/useWeb3Provider'
import { useContracts } from '../../contexts/Contracts'
import { useSingleCallResult } from '../onchain/hooks'
import { BigNumber } from 'bignumber.js'
import claims from './claims'

interface UserClaimData {
	index: number
	amount: string
	proof: string[]
	flags?: {
		isSOCKS: boolean
		isLP: boolean
		isUser: boolean
	}
}

const CLAIM_PROMISES: { [key: string]: Promise<UserClaimData | null> } = {}

// returns the claim for the given address, or null if not valid
function fetchClaim(
	account: string,
	chainId: number,
): Promise<UserClaimData | null> {
	const key = `${account}`
	return (CLAIM_PROMISES[key] =
		CLAIM_PROMISES[key] ??
		new Promise((resolve) => {
			const claim = claims[key]
			if (claim) resolve({ ok: true, json: () => claim })
			resolve({ ok: false })
		})
			.then((res: any) =>
				res.ok
					? res.json()
					: console.log(
							`No claim for account ${account} on chain ID ${chainId}`,
					  ),
			)
			.catch((error) => console.error('Failed to get claim data', error)))
}

// parse distributorContract blob and detect if user has claim data
// null means we know it does not
export function useUserClaimData(
	account: string | null | undefined,
): UserClaimData | null | undefined {
	const { chainId } = useWeb3Provider()

	const key = `${chainId}:${account}`
	const [claimInfo, setClaimInfo] = useState<{
		[key: string]: UserClaimData | null
	}>({})

	useEffect(() => {
		if (!account || !chainId) return
		fetchClaim(account, chainId).then((accountClaimInfo) => {
			return setClaimInfo((claimInfo) => {
				return {
					...claimInfo,
					[key]: accountClaimInfo,
				}
			})
		})
	}, [account, chainId, key])

	return account && chainId ? claimInfo[key] : undefined
}

// check if user is in blob and has not yet claimed
export function useUserHasAvailableClaim(
	account: string | null | undefined,
): boolean {
	const userClaimData = useUserClaimData(account)
	const { contracts } = useContracts()

	const isClaimedResult = useSingleCallResult(
		contracts?.internal && 'merkleDistributor' in contracts?.internal
			? contracts?.internal?.merkleDistributor
			: null,
		'isClaimed',
		[userClaimData?.index],
	)
	// user is in blob and contract marks as unclaimed
	return Boolean(
		userClaimData &&
			!isClaimedResult.loading &&
			isClaimedResult.result?.[0] === false,
	)
}

interface UseUserUnclaimedAmountResponse extends UserClaimData {
	amountBN: BigNumber
}
export function useUserUnclaimedAmount(
	account: string | null | undefined,
): false | UseUserUnclaimedAmountResponse {
	const userClaimData = useUserClaimData(account)
	const canClaim = useUserHasAvailableClaim(account)

	return useMemo(() => {
		if (!canClaim || !userClaimData) return false

		return {
			...userClaimData,
			amountBN: new BigNumber(userClaimData.amount),
		}
	}, [userClaimData, canClaim])
}
