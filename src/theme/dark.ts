import { ThemeColors } from '.'
import * as colors from './colors'

export const dark: ThemeColors = {
	type: 'dark',
	primary: {
		light: 'brandBlue[200]',
		main: colors.brandBlue,
		hover: colors.hoverBlue,
		background: colors.darkRichBlack,
		backgroundHover: '#202c37',
		font: 'white',
		active: 'rgb(59	200	254)',
		disabled: colors.darkGray,
		lead: colors.richBlack,
		footer: colors.richBlack,
	},
	secondary: {
		main: colors.darkBrandBlue,
		border: 'rgba(0, 0, 0, 0.45)',
		background: colors.richBlack,
		backgroundHover: '#202c37',
		font: colors.gray,
		active: 'rgb(59	200	254)',
	},
}
