export default (req: any, res: any) => {
	const date = new Date().toString()
	res.status(200).send({ date })
}
