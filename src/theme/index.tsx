import { ThemeProvider } from 'styled-components'
import { useDarkModeManager } from '../state/user/hooks'
import { dark } from './dark'
import { light } from './light'
import * as colors from './colors'
import GlobalStyle from './globalStyle'

export interface BaseTheme {
	borderRadius: number
	radiusBase: number
	breakpoints: {
		mobile: number
	}
	siteWidth: number
	spacing: {
		1: number
		2: number
		3: number
		4: number
		5: number
		6: number
		7: number
	}
	topBarSize: number
	colors: typeof colors
}

export type ThemeType = 'dark' | 'light'

export interface ThemeColors {
	type: ThemeType
	primary: {
		light: string
		main: string
		hover: string
		background: string
		backgroundHover: string
		font: string
		active: string
		disabled: string
		lead: string
		footer: string
	}
	secondary: {
		main: string
		border: string
		background: string
		backgroundHover: string
		font: string
		active: string
	}
}

export const defaultBaseTheme: BaseTheme = {
	borderRadius: 12,
	radiusBase: 10,
	breakpoints: {
		mobile: 400,
	},
	siteWidth: 1116,
	spacing: {
		1: 4,
		2: 8,
		3: 16,
		4: 24,
		5: 32,
		6: 48,
		7: 64,
	},
	topBarSize: 72,
	colors,
}

export interface Theme extends BaseTheme, ThemeColors {}

export const darkTheme: Theme = { ...defaultBaseTheme, ...dark }
export const lightTheme: Theme = { ...defaultBaseTheme, ...light }

export const StatefulThemeProvider: React.FC = ({ children }) => {
	const [useDarkMode] = useDarkModeManager()
	return (
		<ThemeProvider theme={useDarkMode ? darkTheme : lightTheme}>
			<GlobalStyle />
			{children}
		</ThemeProvider>
	)
}
