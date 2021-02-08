import useGlobal from "./useGlobal";

const useBlock = () => {
	const {block} = useGlobal()
	return block
}

export default useBlock
