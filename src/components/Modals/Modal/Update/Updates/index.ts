import { Title as V3_0_0title, Body as V3_0_0body } from './V3_0_0'

export type UpdateVersion = 'V3_0_0'

interface TUpdate {
    title: string
    Body: React.FC
}

type TUpdates = {
    [key in UpdateVersion]: TUpdate
}

const Updates: TUpdates = {
    V3_0_0: {
        title: V3_0_0title,
        Body: V3_0_0body
    }
}

export { Updates }