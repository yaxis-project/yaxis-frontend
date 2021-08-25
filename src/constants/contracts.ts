import { Contract } from '@ethersproject/contracts'
import {
	Config,
	InternalContracts,
	TInternalContracts,
	ExternalContracts,
	TExternalContracts,
	LiquidityPool,
	CurrenciesERC20,
	TCurrenciesERC20,
	CurrenciesERC677,
	TCurrenciesERC677,
	RewardsContracts,
	TRewardsContracts,
	LiquidityPools,
	TLiquidityPools,
	lpToken,
	Vaults,
	TVaults,
} from './type'
import { configs } from './configs'
import networks from './abis'
import { Currency, CurrencyContract, Currencies } from './currencies'

type InternalC = {
	[key in TInternalContracts]: Contract
}
type ExternalC = {
	[key in TExternalContracts]: Contract
}
type RewardsC = {
	[key in TRewardsContracts]: Contract
}
type CurrenciesC = {
	ERC20: {
		[key in TCurrenciesERC20]: CurrencyContract
	}
	ERC677: {
		[key in TCurrenciesERC677]: CurrencyContract
	}
}
type lpTokenContracts = lpToken & Currency
type LiquidityPoolWithContract = LiquidityPool & {
	lpContract: Contract
	tokenContract: CurrencyContract
	lpTokens: lpTokenContracts[]
}
type LiquidityPoolC = {
	[key in TLiquidityPools]: LiquidityPoolWithContract
}
interface VaultC {
	vault: Contract
	gauge: Contract
	token: CurrencyContract
	gaugeToken: CurrencyContract
}
type VaultsC = {
	[key in TVaults]: VaultC
}

export class Contracts {
	private config: Config
	public internal: InternalC
	public external: ExternalC
	public pools: LiquidityPoolC
	public currencies: CurrenciesC
	public rewards: RewardsC
	public vaults: VaultsC

	constructor(provider: any, networkId: number) {
		const abis = networks[networkId]
		this.config = configs[networkId]

		this.internal = {} as InternalC
		for (const title of InternalContracts) {
			this.internal[title] = new Contract(
				this.config.internal[title],
				abis[`${title.slice(0, 1).toUpperCase()}${title.slice(1)}ABI`],
				provider,
			)
		}

		this.external = {} as ExternalC
		for (const title of ExternalContracts) {
			this.external[title] = new Contract(
				this.config.external[title],
				abis[`${title.slice(0, 1).toUpperCase()}${title.slice(1)}ABI`],
				provider,
			)
		}

		this.rewards = {} as RewardsC
		for (const title of RewardsContracts) {
			this.rewards[title] = new Contract(
				this.config.rewards[title],
				abis.RewardsABI,
				provider,
			)
		}

		this.currencies = {
			ERC20: {},
			ERC677: {},
		} as CurrenciesC

		for (const title of CurrenciesERC20) {
			const Currency = Currencies[title.toUpperCase()]
			if (!Currency)
				console.error(`Currency not found: ${title.toUpperCase()}`)
			this.currencies.ERC20[title] = {
				...Currency,
				contract: new Contract(
					this.config.currencies.ERC20[title],
					abis.ERC20Abi,
					provider,
				),
			}
		}

		for (const title of CurrenciesERC677) {
			const Currency = Currencies[title.toUpperCase()]
			if (!Currency)
				console.error(`Currency not found: ${title.toUpperCase()}`)
			this.currencies.ERC677[title] = {
				...Currency,
				contract: new Contract(
					this.config.currencies.ERC677[title],
					abis.ERC677Abi,
					provider,
				),
			}
		}

		this.pools = {} as LiquidityPoolC
		for (const title of LiquidityPools) {
			const poolConfig = this.config.pools[title]
			const Currency = Currencies[poolConfig.tokenSymbol]
			if (!Currency)
				console.error(`Currency not found: ${title.toUpperCase()}`)
			const LP_ABI = abis.UNIV2PairAbi

			this.pools[title] = {
				...poolConfig,
				lpContract: new Contract(
					poolConfig.lpAddress,
					LP_ABI,
					provider,
				),
				tokenContract: {
					...Currency,
					contract: new Contract(
						poolConfig.lpAddress,
						abis.ERC20Abi,
						provider,
					),
				},
				lpTokens: poolConfig.lpTokens.map((t) => {
					const currency = Currencies[t.tokenId.toUpperCase()]
					if (!currency) console.error('LP token currency not found')
					return { ...t, ...currency }
				}),
			}
		}

		this.vaults = {} as VaultsC
		for (const vault of Vaults) {
			const vaultConfig = this.config.vaults[vault]
			const VaultCurrency = Currencies[vaultConfig.token.toUpperCase()]
			if (!VaultCurrency)
				console.error(`Currency not found: ${vaultConfig.token.toUpperCase()}`)
			const GaugeCurrency = Currencies[vaultConfig.token.toUpperCase() + '-GAUGE']
			if (!GaugeCurrency)
				console.error(`Currency not found: ${vaultConfig.token.toUpperCase()}-GAUGE`)
			this.vaults[vault] = {
				vault:
					new Contract(
						this.config.vaults[vault].vault,
						abis.VaultABI,
						provider,
					),
				gauge:
					new Contract(
						this.config.vaults[vault].gauge,
						abis.GaugeABI,
						provider,
					),
				token: {
					...VaultCurrency,
					contract: new Contract(
						vaultConfig.vault,
						abis.ERC20Abi,
						provider,
					),
				},
				gaugeToken: {
					...GaugeCurrency,
					contract: new Contract(
						vaultConfig.gauge,
						abis.ERC20Abi,
						provider,
					),
				},
			}
		}
	}
}
