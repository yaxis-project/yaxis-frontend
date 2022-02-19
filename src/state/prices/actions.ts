import { createAction } from '@reduxjs/toolkit'
import { TPrices } from './reducer'

export const updatePrices =
	createAction<{ prices: Partial<TPrices> }>('user/updatePrices')
