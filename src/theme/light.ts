import { ThemeColors } from '.'
import * as colors from './colors'

export const light: ThemeColors = {
	type: 'light',
	primary: {
		light: colors.brandBlue[200],
		main: colors.brandBlue,
		hover: colors.hoverBlue,
		background: colors.ghostWhite,
		backgroundHover: 'rgb(236,248,254)',
		font: 'rgb(29 29 29)',
		active: 'rgb(59	200	254)',
		disabled: colors.lightGray,
		lead: colors.lightAliceBlue,
		footer: colors.aliceBlue,
	},
	secondary: {
		main: colors.lightBrandBlue,
		border: colors.lightGray,
		background: colors.white,
		backgroundHover: 'rgb(236,248,254)',
		font: 'rgb(138 138 138)',
		active: 'rgb(59	200	254)',
	},
}
