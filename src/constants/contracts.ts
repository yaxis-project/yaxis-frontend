import { Contract } from '@ethersproject/contracts'
import { configs } from './configs'
import networks from './abis'
import { Currency, CurrencyContract, Currencies } from './currencies'
import {
	Config,
	InternalContracts,
	TInternalContracts,
	ExternalContracts,
	TExternalContracts,
	CurveLPContracts,
	TExternalLPContracts,
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

type InternalC = {
	[key in TInternalContracts]: Contract
}
type ExternalLpC = {
	[key in TExternalLPContracts]: {
		gauge?: Contract
		pool: Contract
		token: Contract
		convexRewards: Contract
		extraRewards?: {
			[token: string]: { contract: Contract; token: Contract }
		}
		currency: string
	}
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
	token: CurrencyContract
	vault: Contract
	vaultToken: CurrencyContract
	gauge: Contract
	gaugeToken: CurrencyContract
	tokenPool: Contract
}
type VaultsC = {
	[key in TVaults]: VaultC
}

export class Contracts {
	private config: Config
	public internal: InternalC
	public external: ExternalC
	public externalLP: ExternalLpC
	public pools: LiquidityPoolC
	public currencies: CurrenciesC
	public rewards: RewardsC
	public vaults: VaultsC

	constructor(provider: any, blockchain: string, networkId: number) {
		const abis = networks[blockchain][networkId]
		this.config = configs[blockchain][networkId]

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

		this.externalLP = {} as ExternalLpC
		for (const title of CurveLPContracts) {
			this.externalLP[title] = {
				pool: new Contract(
					this.config.externalPools.curve[title].pool,
					abis[`CurvePoolABI`],
					provider,
				),
				gauge: new Contract(
					this.config.externalPools.curve[title].gauge,
					abis.GaugeABI,
					provider,
				),
				token: new Contract(
					this.config.externalPools.curve[title].token,
					abis.ERC20Abi,
					provider,
				),
				convexRewards: new Contract(
					this.config.externalPools.curve[title].convexRewards,
					abis.ConvexRewardPoolABI,
					provider,
				),
				currency: this.config.externalPools.curve[title].currency,
			}
			if (this.config.externalPools.curve[title].extraRewards) {
				this.externalLP[title].extraRewards = {}

				for (const [name, config] of Object.entries(
					this.config.externalPools.curve[title].extraRewards,
				)) {
					this.externalLP[title].extraRewards[name] = {
						contract: new Contract(
							config.contract,
							abis.RewardsABI,
							provider,
						),
						token: new Contract(
							config.token,
							abis.ERC20Abi,
							provider,
						),
					}
				}
			}
		}

		this.rewards = {} as RewardsC
		for (const title of RewardsContracts) {
			if(title === "FeeDistributor") {
				this.rewards[title] = new Contract(
					this.config.rewards[title],
					abis.FeeDistributorABI,
					provider,
				)
			} else {
				this.rewards[title] = new Contract(
					this.config.rewards[title],
					abis.RewardsABI,
					provider,
				)
			}
		}

		this.currencies = {
			ERC20: {},
			ERC677: {},
		} as CurrenciesC

		for (const title of CurrenciesERC20) {
			const Currency = Currencies[title.toUpperCase()]
			if (!Currency)
				console.error(`Currency not found: ${title.toUpperCase()}`)

			if (title === 'cvx') {
				this.currencies.ERC20[title] = {
					...Currency,
					contract: new Contract(
						this.config.currencies.ERC20[title],
						abis.CVXABI,
						provider,
					),
				}
			} else if (title === 'crv') {
				this.currencies.ERC20[title] = {
					...Currency,
					contract: new Contract(
						this.config.currencies.ERC20[title],
						abis.CRVABI,
						provider,
					),
				}
			} else {
				this.currencies.ERC20[title] = {
					...Currency,
					contract: new Contract(
						this.config.currencies.ERC20[title],
						abis.ERC20Abi,
						provider,
					),
				}
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
				console.error(
					`Currency not found: ${vaultConfig.token.toUpperCase()}`,
				)
			const VaultTokenCurrency =
				Currencies[vaultConfig.vaultToken.toUpperCase()]
			if (!VaultTokenCurrency)
				console.error(
					`Currency not found: ${vaultConfig.token.toUpperCase()}`,
				)
			const GaugeCurrency =
				Currencies[vaultConfig.vaultToken.toUpperCase() + '-GAUGE']
			if (!GaugeCurrency)
				console.error(
					`Currency not found: ${vaultConfig.vaultToken.toUpperCase()}-GAUGE`,
				)
			this.vaults[vault] = {
				token: {
					...VaultCurrency,
					contract: new Contract(
						vaultConfig.tokenContract,
						abis.ERC20Abi,
						provider,
					),
				},
				vault: new Contract(
					this.config.vaults[vault].vault,
					abis.VaultABI,
					provider,
				),
				vaultToken: {
					...VaultTokenCurrency,
					contract: new Contract(
						vaultConfig.vaultTokenContract,
						abis.VaultTokenABI,
						provider,
					),
				},
				gauge: new Contract(
					this.config.vaults[vault].gauge,
					abis.GaugeABI,
					provider,
				),
				gaugeToken: {
					...GaugeCurrency,
					contract: new Contract(
						vaultConfig.gauge,
						abis.ERC20Abi,
						provider,
					),
				},
				tokenPool: new Contract(
					this.config.vaults[vault].tokenPoolContract,
					abis.CurvePoolABI,
					provider,
				),
			}
		}
	}
}
