import { useCallback, useEffect, useState } from 'react'
import useYaxis from './useYaxis'
import { getMutilcallContract } from '../yaxis/utils'
import usePriceMap from './usePriceMap'
interface YAxisAPY {
	[key: string]: number
}

interface PoolInfo {
	[key: string]: {
		[key: string]: string
	}
}

const useYAxisAPY = () => {
	const [yAxisAPY, setYAxisAPY] = useState<YAxisAPY>({})
	const [isInitialized, setIsInitialized] = useState<boolean>(false)
	const yaxis = useYaxis()
	const multicallContract = getMutilcallContract(yaxis)
	const priceMap = usePriceMap()

	const getYAxisAPY = useCallback(
		async (_priceMap) => {
			try {
				const poolInfo: PoolInfo = {
					compound: {
						swap: '0xA2B47E3D5c44877cca798226B7B8118F9BFb7A56',
						swap_token:
							'0x845838DF265Dcd2c412A1Dc9e959c7d08537f8a2',
						name: 'compound',
						gauge: '0x7ca5b0a2910B33e9759DC7dDB0413949071D7575',
					},
					usdt: {
						swap: '0x52EA46506B9CC5Ef470C5bf89f17Dc28bB35D85C',
						swap_token:
							'0x9fC689CCaDa600B6DF723D9E47D84d76664a1F23',
						name: 'usdt',
						gauge: '0xBC89cd85491d81C6AD2954E6d0362Ee29fCa8F53',
					},
					y: {
						swap: '0x45F783CCE6B7FF23B2ab2D70e416cdb7D6055f51',
						swap_token:
							'0xdF5e0e81Dff6FAF3A7e52BA697820c5e32D806A8',
						name: 'y',
						gauge: '0xFA712EE4788C042e2B7BB55E6cb8ec569C4530c1',
					},
					busd: {
						swap: '0x79a8C46DeA5aDa233ABaFFD40F3A0A2B1e5A4F27',
						swap_token:
							'0x3B3Ac5386837Dc563660FB6a0937DFAa5924333B',
						name: 'busd',
						gauge: '0x69Fb7c45726cfE2baDeE8317005d3F94bE838840',
					},
					susdv2: {
						swap: '0xA5407eAE9Ba41422680e2e00537571bcC53efBfD',
						swap_token:
							'0xC25a3A3b969415c80451098fa907EC722572917F',
						name: 'susdv2',
						gauge: '0xA90996896660DEcC6E997655E065b23788857849',
					},
					pax: {
						swap: '0x06364f10B501e868329afBc005b3492902d6C763',
						swap_token:
							'0xD905e2eaeBe188fc92179b6350807D8bd91Db0D8',
						name: 'pax',
						gauge: '0x64E3C23bfc40722d3B649844055F1D51c1ac041d',
					},
					ren: {
						swap: '0x93054188d876f558f4a66B2EF1d97d16eDf0895B',
						swap_token:
							'0x49849C98ae39Fff122806C06791Fa73784FB3675',
						name: 'ren',
						gauge: '0xB1F2cdeC61db658F091671F5f199635aEF202CAC',
					},
					sbtc: {
						swap: '0x7fC77b5c7614E1533320Ea6DDc2Eb61fa00A9714',
						swap_token:
							'0x075b1bb99792c9E1041bA13afEf80C91a1e70fB3',
						name: 'sbtc',
						gauge: '0x705350c4BcD35c9441419DdD5d2f097d7a55410F',
					},
					'3crv': {
						swap: '0xbEbc44782C7dB0a1A60Cb6fe97d0b483032FF1C7',
						swap_token:
							'0x6c3F90f043a72FA612cbac8115EE7e52BDe6E490',
						name: '3crv',
						gauge: '0xbFcF63294aD7105dEa65aA58F8AE5BE2D9d0952A',
					},
				}
				const decodedGauges = [
					'0x7ca5b0a2910B33e9759DC7dDB0413949071D7575',
					'0xBC89cd85491d81C6AD2954E6d0362Ee29fCa8F53',
					'0xFA712EE4788C042e2B7BB55E6cb8ec569C4530c1',
					'0x69Fb7c45726cfE2baDeE8317005d3F94bE838840',
					'0x64E3C23bfc40722d3B649844055F1D51c1ac041d',
					'0xB1F2cdeC61db658F091671F5f199635aEF202CAC',
					'0xA90996896660DEcC6E997655E065b23788857849',
					'0x705350c4BcD35c9441419DdD5d2f097d7a55410F',
					'0xbFcF63294aD7105dEa65aA58F8AE5BE2D9d0952A',
				]
				const gaugeController_address =
					'0x2F50D538606Fa9EDD2B11E2446BEb18C9D5846bB'
				const gauge_relative_weight =
					'0x6207d866000000000000000000000000'
				const { BTC: btcPrice, CRV: CRVprice } = _priceMap
				const weightCalls = decodedGauges.map((gauge) => [
					gaugeController_address,
					gauge_relative_weight + gauge.slice(2),
				])
				let aggCallsWeights = await multicallContract.methods
					.aggregate(weightCalls)
					.call()
				let decodedWeights = aggCallsWeights[1].map(
					(hex: any, i: number) => {
						// @ts-ignore
						return [
							weightCalls[i][0],
							(yaxis.web3.eth.abi.decodeParameter(
								'uint256',
								hex,
							) as any) / 1e18,
						]
					},
				)
				let ratesCalls = decodedGauges.map((gauge) => [
					[gauge, '0x180692d0'],
					[gauge, '0x17e28089'],
				])
				let aggRates = await multicallContract.methods
					.aggregate(ratesCalls.flat())
					.call()
				let decodedRate = aggRates[1].map((hex: any) => {
					// @ts-ignore
					return yaxis.web3.eth.abi.decodeParameter('uint256', hex)
				})
				let gaugeRates = decodedRate
					.filter((_: any, i: number) => i % 2 === 0)
					.map((v: number) => v / 1e18)
				let workingSupplies = decodedRate
					.filter((_: any, i: number) => i % 2 === 1)
					.map((v: number) => v / 1e18)
				let virtualPriceCalls = Object.values(
					poolInfo,
				).map((v: any) => [v.swap, '0xbb7b8b80'])
				let aggVirtualPrices = await multicallContract.methods
					.aggregate(virtualPriceCalls)
					.call()
				let decodedVirtualPrices = aggVirtualPrices[1].map(
					(hex: any, i: number) => {
						// @ts-ignore
						return [
							virtualPriceCalls[i][0],
							(yaxis.web3.eth.abi.decodeParameter(
								'uint256',
								hex,
							) as any) / 1e18,
						]
					},
				)
				const apys: any = {}
				console.log(decodedWeights)
				decodedWeights.forEach((w: any, i: number) => {
					// @ts-ignore
					let pool: string = Object.values(poolInfo).find(
						(v: any) =>
							v.gauge.toLowerCase() ===
							'0x' + weightCalls[i][1].slice(34).toLowerCase(),
					).name
					let swap_address = poolInfo[pool].swap
					let virtual_price = decodedVirtualPrices.find(
						(v: any) =>
							v[0].toLowerCase() === swap_address.toLowerCase(),
					)[1]
					let _working_supply = workingSupplies[i]
					if (['ren', 'sbtc'].includes(pool))
						_working_supply *= btcPrice
					let rate =
						(((gaugeRates[i] * w[1] * 31536000) / _working_supply) *
							0.4) /
						virtual_price
					let apy = rate * CRVprice * 100
					if (isNaN(apy)) apy = 0
					// @ts-ignore
					Object.values(poolInfo).find(
						(v: any) => v.name === pool,
					).gauge_relative_weight = w[1]
					apys[pool] = apy
					console.log('apys', apys)
				})
				setYAxisAPY(apys)
				setIsInitialized(true)
			} catch (e) {
				console.error('[getYAxisAPY]', e)
			}
		},
		[multicallContract, yaxis],
	)

	useEffect(() => {
		if (yaxis?.web3 && priceMap.initialized) {
			getYAxisAPY(priceMap)
		}
	}, [getYAxisAPY, yaxis, priceMap.initialized])

	return {
		yAxisAPY,
		isInitialized,
	}
}

export default useYAxisAPY
