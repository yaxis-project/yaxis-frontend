import { Switch } from 'antd'
import { useDarkModeManager } from '../../state/user/hooks'

export default function App() {
	const [isDarkMode, toggleSetDarkMode] = useDarkModeManager()

	return (
		<Switch
			checked={isDarkMode}
			checkedChildren={'Dark theme'}
			unCheckedChildren={'Light theme'}
			defaultChecked
			onChange={() => toggleSetDarkMode()}
		/>
	)
}
