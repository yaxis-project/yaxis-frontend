import * as V3_0_0 from './V3_0_0'
import * as V3_1_0 from './V3_1_0'

export type UpdateVersion = 'V3_0_0' | 'V3_1_0'

interface TUpdate {
	Title: string
	Body: React.FC
}

type TUpdates = {
	[key in UpdateVersion]: TUpdate
}

const Updates: TUpdates = {
	V3_0_0,
	V3_1_0,
}

export { Updates }
