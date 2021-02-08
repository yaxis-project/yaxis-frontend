import {supply} from "./supply";

export default async (req: any, res: any) => {
	res.setHeader('Cache-Control', 's-maxage=180')
	let supplyResult = await supply();
	res.status(200).send(supplyResult.totalSupply);
};
