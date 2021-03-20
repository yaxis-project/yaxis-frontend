const LOCAL_STORAGE_PROVIDER_KEY = 'lastSeenProvider'

export const setRecentProvider = (provider: string) =>
	localStorage.setItem(LOCAL_STORAGE_PROVIDER_KEY, provider)

export const getEagerProvider = () =>
	localStorage.getItem(LOCAL_STORAGE_PROVIDER_KEY)
