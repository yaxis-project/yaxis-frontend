import { createGlobalStyle } from 'styled-components'
import { Theme } from '.'

const GlobalStyle = createGlobalStyle<{ theme: Theme }>`


    .ant-menu.ant-menu-sub.ant-menu-vertical {
		background: ${(props) => props.theme.secondary.background};

         .ant-menu-item-selected {
             background: ${(props) =>
					props.theme.type === 'light' ? '#EAF5F8' : '#022F49'};
         }
    }

    .ant-dropdown-menu.ant-dropdown-menu-sub.ant-dropdown-menu-vertical {
		background: ${(props) => props.theme.secondary.background};
    }
    
    .ant-modal-content {
	    background: ${(props) => props.theme.secondary.background};

        svg {
            fill: ${(props) => props.theme.primary.font};
        }
    }

    .ant-modal-header {
	    background: ${(props) => props.theme.secondary.background};
    }

    .ant-modal-title {
		color: ${(props) => props.theme.primary.font};
        font-size: 18px;
        font-weight: 700;
    }
`

export default GlobalStyle
