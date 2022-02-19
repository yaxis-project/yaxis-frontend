import styled from 'styled-components'
import { Row } from 'antd'
import { useDarkModeManager } from '../../state/user/hooks'
import light from '../../assets/img/light.svg'
import dark from '../../assets/img/dark.svg'

export default function App() {
	const [isDarkMode, toggleSetDarkMode] = useDarkModeManager()

	return isDarkMode ? (
		<ThemeToggle align="middle" onClick={() => toggleSetDarkMode()}>
			<img src={light} height="37" alt={`Sun symbolizing light theme`} />
		</ThemeToggle>
	) : (
		<ThemeToggle align="middle" onClick={() => toggleSetDarkMode()}>
			<img src={dark} height="37" alt={`Moon symbolizing dark theme`} />
		</ThemeToggle>
	)
}

const ThemeToggle = styled(Row)`
	margin: 0 5px;
	font-size: 24px;
	cursor: pointer;
`
