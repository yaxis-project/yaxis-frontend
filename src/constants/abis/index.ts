import { abis as mainnet } from './ethereum/mainnet'
import { abis as kovan } from './ethereum/kovan'

const networks = { ethereum: { 1: mainnet, 42: kovan } }
export default networks
