import styled from 'styled-components'
import { Row } from 'antd'

import { useDarkModeManager } from '../../state/user/hooks'

export default function App() {
	const [isDarkMode, toggleSetDarkMode] = useDarkModeManager()

	return isDarkMode ? (
		<ThemeToggle align="middle" onClick={() => toggleSetDarkMode()}>
			🌞
		</ThemeToggle>
	) : (
		<ThemeToggle align="middle" onClick={() => toggleSetDarkMode()}>
			🌚
		</ThemeToggle>
	)
}

const ThemeToggle = styled(Row)`
	margin: 0 5px;
	font-size: 24px;
	cursor: pointer;
	margin-top: 3px;
`
