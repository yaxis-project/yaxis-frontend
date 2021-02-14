import { supply } from './supply'

export default async (req: any, res: any) => {
	let supplyResult = await supply()
	res.status(200).send(supplyResult.circulatingSupply)
}
