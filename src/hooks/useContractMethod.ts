import {
	// useCallback,
	useMemo,
} from 'react'
// import { notification } from 'antd'
import useYaxis from './useYaxis'
// import { useWeb3React } from '@web3-react/core'
// import { getXSushiStakingContract, getYaxisContract } from '../yaxis/utils'

// "approve YAX for staking"
const useContractMethod = ({ description, args }) => {
	// const { account } = useWeb3React()
	const yaxis = useYaxis()
	const contract = useMemo(
		() => yaxis && yaxis.contracts && yaxis.contracts.xYaxStaking,
		[yaxis],
	)
	// test how long it takes to initialize contracts
	console.log(contract)
	// const handleApprove = useCallback(async () => {
	// 	try {
	// 		notification.info({
	// 			message: `Please ${description}.`,
	// 		})
	// 		const approve = async (
	// 			lpContract: Contract,
	// 			yaxisChefContract: Contract,
	// 			account: string,
	// 		) =>
	// 			lpContract.methods
	// 				.approve(
	// 					yaxisChefContract.options.address,
	// 					ethers.constants.MaxUint256,
	// 				)
	// 				.send({ from: account })
	// 				.estimateGas()

	// 		await approve(lpContract, contract, account)
	// 		console.log(g)
	// 		return g
	// 	} catch (e) {
	// 		console.error(e)
	// 		notification.error({
	// 			description: e.message,
	// 			message: `Unable to ${description}:`,
	// 		})
	// 		//////HERE work on notifications & stifiling errors
	// 		return false
	// 	}
	// }, [account, lpContract, contract])

	return {}
}

export default useContractMethod
