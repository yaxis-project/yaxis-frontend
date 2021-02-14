import { brandBlue, black, green, grey, white } from './colors'

const theme = {
	borderRadius: 12,
	radiusBase: 10,
	breakpoints: {
		mobile: 400,
	},
	color: {
		black,
		grey,
		primary: {
			light: brandBlue[200],
			main: brandBlue,
		},
		secondary: {
			main: green[500],
			grey: 'rgba(0, 0, 0, 0.45)',
		},
		white,
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
}

export default theme
