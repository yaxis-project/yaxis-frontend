import BigNumber from 'bignumber.js'

const Web3 = require("web3");
const web3 = new Web3(
	new Web3.providers.HttpProvider(process.env.RPC_URL)
);

const erc20Abi = require("./erc20.json")
const yaxAddress = "0xb1dc9124c395c1e97773ab855d66e879f053a289"
const yaxChefAddress = "0xc330e7e73717cd13fb6ba068ee871584cf8a194f"
const yaxEthLpAddress = "0x1107b6081231d7f256269ad014bf92e041cb08df"
const yaxContract = new web3.eth.Contract(erc20Abi, yaxAddress)

export function numberToFloat(value: any, decimal = 18, fixNumber = 3) {
	return Number(new BigNumber(value).div(new BigNumber(10).pow(decimal)).toFixed(fixNumber))
}

export async function supply() {
	let totalSupply = numberToFloat(await yaxContract.methods.totalSupply().call(), 18);
	let yaxAmountInChef = numberToFloat(await yaxContract.methods.balanceOf(yaxChefAddress).call(), 18);
	let yaxAmountInUniLp = numberToFloat(await yaxContract.methods.balanceOf(yaxEthLpAddress).call(), 18);

	let supply = {
		circulatingSupply: totalSupply - yaxAmountInChef - yaxAmountInUniLp,
		totalSupply: totalSupply,
	};
	return supply;
}

export default async (req: any, res: any) => {
	res.setHeader('Cache-Control', 's-maxage=180')
	res.status(200).send(await supply());
};