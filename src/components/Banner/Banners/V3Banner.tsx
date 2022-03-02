import { useMemo } from 'react'
import Banner from '..'
import { useRewardsBalances } from '../../../state/wallet/hooks'

const V3Banner: React.FC = () => {
	const { walletBalance: walletMVLT, stakedBalance: stakedMVLT } =
		useRewardsBalances('mvlt', 'MetaVault')
	const { stakedBalance: stakedYAXIS } = useRewardsBalances('yaxis', 'Yaxis')

	const visible = useMemo(() => {
		return (
			// MVLT in wallet
			walletMVLT.gt(0) ||
			// MVLT in rewards contract
			stakedMVLT.gt(0) ||
			// YAXIS in rewards contract
			stakedYAXIS.gt(0)
		)
	}, [walletMVLT, stakedMVLT, stakedYAXIS])

	return (
		<Banner
			to={'/v3'}
			visible={visible}
			text={'Version 3 is here. Click here to migrate.'}
		/>
	)
}

export default V3Banner
