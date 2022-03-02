import { useMemo } from 'react'
import Banner from '..'
import useSwapData from '../../../hooks/useSwapData'
import BigNumber from 'bignumber.js'
import useTranslation from '../../../hooks/useTranslation'

const SwapBanner: React.FC = () => {
	const translate = useTranslation()

	const data = useSwapData()

	const visible = useMemo(() => {
		const {
			earnings,
			mvEarnings,
			balances,
			stakedUniLP,
			uniLPBalance,
			linkLPBalance,
			stakedMvlt,
		} = data

		const step1 =
			earnings.gt(0) ||
			new BigNumber(mvEarnings).gt(0) ||
			stakedUniLP.gt(0) ||
			uniLPBalance.gt(0) ||
			linkLPBalance.gt(0) ||
			stakedMvlt.gt(0)

		const step2 =
			balances?.stakedBalance.gt(0) || balances?.yaxBalance.gt(0)

		return step1 || step2
	}, [data])

	return (
		<Banner
			to={'/swap'}
			visible={visible}
			text={translate(
				'YIP-08 Token Swap is now live! Click here to learn more.',
			)}
		/>
	)
}

export default SwapBanner
