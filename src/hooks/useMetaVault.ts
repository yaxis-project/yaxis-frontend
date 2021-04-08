import { useCallback, useState, useMemo, useEffect } from 'react'
import useWeb3Provider from '../hooks/useWeb3Provider'
import { BigNumber } from 'bignumber.js'
import useGlobal from './useGlobal'
import { depositAll, getYaxisMetaVault, withdraw } from '../yaxis/utils'
import { notification } from 'antd'
import Web3 from 'web3'
import networks from '../yaxis/abis'
const erc20 = networks["1"].ERC20Abi

const useMetaVault = () => {
	const { account, library } = useWeb3Provider()
	const { yaxis } = useGlobal()
	const defaultSlippage = 0.001 // 0.1%
	const vaultWithdrawFee = 0.001 // 0.1%
	const pickleWithdrawFee = 0 // 0.5%

	const [isSubmitting, setSubmitting] = useState<boolean>(false)
	const [isClaiming, setClaiming] = useState<boolean>(false)
	const [strategy, setStrategy] = useState<string>('')

	const web3 = useMemo(() => library && new Web3(library), [library])

	const calcMinTokenAmount = useCallback(
		async (amounts: string[]) => {
			// metaVaut.calc_token_amount_deposit([dai,usdc,usdt]) * (1 - slippage) + 3crv
			const threeCrvIndex = 3 // Index from InvestingDepositCurrencies that DepositAll expects
			try {
				const contract: any = getYaxisMetaVault(yaxis)
				if (contract) {
					const params = [...amounts]
					params.splice(threeCrvIndex, 1)
					const tokensDeposit = await contract.methods
						.calc_token_amount_deposit(params)
						.call()
					const threeCrvDeposit = amounts[threeCrvIndex] || '0'
					return new BigNumber(tokensDeposit)
						.plus(threeCrvDeposit)
						.times(1 - defaultSlippage)
						.integerValue(BigNumber.ROUND_DOWN)
						.toFixed()
				}
			} catch (e) { }
			return '0'
		},
		[yaxis],
	)

	const onDepositAll = useCallback(
		async (amounts, isStake = true) => {
			setSubmitting(true)
			const minMintAmount = await calcMinTokenAmount(amounts)

			notification.info({
				message: 'Please confirm deposit transaction',
			})
			const params = [amounts, minMintAmount, isStake]

			try {
				const receipt = await depositAll(
					getYaxisMetaVault(yaxis),
					params,
					account,
				)
				setSubmitting(false)
				return receipt
			} catch (e) {
				setSubmitting(false)
				console.error(e)
			}
		},
		[account, yaxis, calcMinTokenAmount],
	)

	const onWithdraw = useCallback(
		async (sharesAmount: string, currencyAddress: string) => {
			setSubmitting(true)
			const params = [
				new BigNumber(sharesAmount).toFixed(0),
				currencyAddress,
			]
			try {
				const receipt = await withdraw(
					getYaxisMetaVault(yaxis),
					params,
					account,
				)
				setSubmitting(false)
				return receipt
			} catch (e) {
				setSubmitting(false)
				console.error(e)
			}
		},
		[account, yaxis],
	)

	const onGetRewards = useCallback(async (cb?) => {
		setClaiming(true)
		try {
			const contract = getYaxisMetaVault(yaxis)
			await contract.methods
				.unstake('0')
				.send({ from: account })
				.on('transactionHash', (tx: any) => {
					console.log(tx)
					cb && cb()
					return tx.transactionHash
				})
		} catch (e) {
			console.error(e)
		}
		setClaiming(false)
	}, [account, yaxis])

	const fetchMetaVaultStrategy = useCallback(async () => {
		try {
			const contract = getYaxisMetaVault(yaxis)
			const tokenAddress = await contract.methods.token().call()
			const tokenContract = new web3.eth.Contract(erc20, tokenAddress)
			const currentStrategy = await tokenContract.methods.name().call()
			setStrategy(currentStrategy)
		} catch (err) { }
	}, [web3, yaxis])

	useEffect(() => {
		if (yaxis && web3) fetchMetaVaultStrategy()
	}, [yaxis, web3, fetchMetaVaultStrategy])

	return {
		isSubmitting,
		isClaiming,
		pickleWithdrawFee,
		vaultWithdrawFee,
		slippage: defaultSlippage,
		calcMinTokenAmount,
		onDepositAll,
		onWithdraw,
		onGetRewards,
		strategy,
	}
}

export default useMetaVault
