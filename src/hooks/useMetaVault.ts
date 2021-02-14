import { useWallet } from 'use-wallet'
import { BigNumber } from 'bignumber.js'
import useYaxis from './useYaxis'
import { depositAll, getYaxisMetaVault, withdraw } from '../yaxis/utils'
import { useCallback, useState, useMemo, useEffect } from 'react'
import { notification } from 'antd'
import Web3 from 'web3'
import { provider } from 'web3-core'
const erc20 = require('./../yaxis/abi/erc20.json')

const useMetaVault = () => {
	const {
		account,
		ethereum,
	}: { ethereum: provider; account: any } = useWallet()
	const yaxis = useYaxis()
	const defaultSlippage = 0.001 // 0.1%
	const vaultWithdrawFee = 0.001 // 0.1%
	const pickleWithdrawFee = 0 // 0.5%

	const [isSubmitting, setSubmitting] = useState<boolean>(false)
	const [isClaiming, setClaiming] = useState<boolean>(false)
	const [strategy, setStrategy] = useState<string>('')

	const web3 = useMemo(() => ethereum && new Web3(ethereum), [ethereum])

	const calcMinTokenAmount = async (amounts: string[]) => {
		// metaVaut.calc_token_amount_deposit([dai,usdc,usdt]) * (1 - slippage) + 3crv
		try {
			const contract: any = getYaxisMetaVault(yaxis)
			if (contract) {
				const params = amounts.slice(0, 3)
				const tokensDeposit = await contract.methods
					.calc_token_amount_deposit(params)
					.call()
				const threeCrvDeposit = amounts[3] || '0'
				return new BigNumber(tokensDeposit)
					.plus(threeCrvDeposit)
					.times(1 - defaultSlippage)
					.integerValue(BigNumber.ROUND_DOWN)
					.toFixed()
			}
		} catch (e) {}
		return '0'
	}

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
				return receipt
			} catch (e) {
				console.error(e)
			}
			setSubmitting(false)
		},
		[account, yaxis],
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
				return receipt
			} catch (e) {
				console.error(e)
			}
			setSubmitting(false)
		},
		[account, yaxis],
	)

	const onGetRewards = useCallback(async () => {
		setClaiming(true)
		try {
			const contract = getYaxisMetaVault(yaxis)
			await contract.methods
				.unstake('0')
				.send({ from: account })
				.on('transactionHash', (tx: any) => {
					console.log(tx)
					return tx.transactionHash
				})
		} catch (e) {
			console.error(e)
		}
		setClaiming(false)
	}, [account, yaxis])

	const fetchMetaVaultStrategy = async () => {
		try {
			const contract = getYaxisMetaVault(yaxis)
			const tokenAddress = await contract.methods.token().call()
			const tokenContract = new web3.eth.Contract(erc20, tokenAddress)
			const currentStrategy = await tokenContract.methods.name().call()
			setStrategy(currentStrategy)
		} catch (err) {}
	}

	useEffect(() => {
		if (yaxis && web3) fetchMetaVaultStrategy()
	}, [yaxis, web3])

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
