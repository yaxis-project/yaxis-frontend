import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import { save, load } from 'redux-localstorage-simple'

import { updateVersion } from './actions'
import { reducer as application } from './application'
import { reducer as transactions } from './transactions'
import { reducer as user } from './user'
import { initialState as initialUserState } from './user/reducer'
import { reducer as onchain } from './onchain'
import { reducer as prices } from './prices'

const PERSISTED_KEYS: string[] = ['user', 'transactions']

const store = configureStore({
	reducer: {
		application,
		user,
		transactions,
		onchain,
		prices,
	},
	middleware: [
		...getDefaultMiddleware({ thunk: false }),
		save({ states: PERSISTED_KEYS }),
	],
	preloadedState: load({
		states: PERSISTED_KEYS,
		preloadedState: {
			user: JSON.parse(JSON.stringify(initialUserState)),
		},
	}),
})

store.dispatch(updateVersion())

export default store

export type AppState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
