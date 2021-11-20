// globalStyles.js
import { createGlobalStyle } from 'styled-components'
import { Theme } from '.'

const GlobalStyle = createGlobalStyle<{ theme: Theme }>`
    .ant-menu.ant-menu-sub.ant-menu-vertical {
		background: ${(props) => props.theme.secondary.background};
    }

    .ant-dropdown-menu.ant-dropdown-menu-sub.ant-dropdown-menu-vertical {
		background: ${(props) => props.theme.secondary.background};
    }
`

export default GlobalStyle
