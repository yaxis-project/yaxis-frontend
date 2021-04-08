import { useMemo } from 'react'
import Banner from '..'
import useYAXStaking from '../../../hooks/useYAXStaking'

const SwapBanner = () => {
	const {
		balances: { stakedBalance, walletBalance },
	} = useYAXStaking()
	const visible = useMemo(() => stakedBalance.plus(walletBalance).gt(0), [
		stakedBalance,
		walletBalance,
	])
	return (
		<Banner
			visible={visible}
			text={'YIP-08 Token Swap is now live! Click here to learn more.'}
		/>
	)
}

export default SwapBanner
