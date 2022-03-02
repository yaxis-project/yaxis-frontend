import { UpdateVersion } from './Updates'

const LOCAL_STORAGE_PROVIDER_KEY = 'lastUpdateModalSeen'

export const setLastSeenUpdate = (version: UpdateVersion): void =>
	localStorage.setItem(LOCAL_STORAGE_PROVIDER_KEY, version)

export const getLastSeenUpdate = (): string =>
	localStorage.getItem(LOCAL_STORAGE_PROVIDER_KEY)
