import styled from 'styled-components'
import { Row } from 'antd'

import { useDarkModeManager } from '../../state/user/hooks'

export default function App() {
	const [isDarkMode, toggleSetDarkMode] = useDarkModeManager()

	return isDarkMode ? (
		<ThemeToggle align="middle" onClick={() => toggleSetDarkMode()}>
			<img
				src={require('../../assets/img/light.svg').default}
				height="37"
				alt={`Sun symbolizing light theme`}
			/>
		</ThemeToggle>
	) : (
		<ThemeToggle align="middle" onClick={() => toggleSetDarkMode()}>
			<img
				src={require('../../assets/img/dark.svg').default}
				height="37"
				alt={`Moon symbolizing dark theme`}
			/>
		</ThemeToggle>
	)
}

const ThemeToggle = styled(Row)`
	margin: 0 5px;
	font-size: 24px;
	cursor: pointer;
`
