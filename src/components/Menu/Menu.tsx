import React from 'react'
import styled from 'styled-components'
import { Menu as BaseMenu, MenuProps as BaseMenuProps } from 'antd'

const StyledMenu = styled(BaseMenu)`
	border-bottom: none;
	background: none;

	svg {
		fill: ${(props) => props.theme.primary.font};
	}
`

export interface MenuProps extends BaseMenuProps {}

const Menu: React.FC<MenuProps> = (props) => <StyledMenu {...props} />

// TODO: background color

const StyledSubMenu = styled(BaseMenu.SubMenu)`
	.ant-dropdown-menu-submenu-title:hover {
		// background: red;
	}

	// .ant-dropdown-menu-item:hover {
	// 	background: red;
	// }

	// .ant-dropdown-menu-item-active {
	// 	background: red;
	// }
`

const StyledMenus = {
	Menu,
	SubMenu: StyledSubMenu,
	Divider: BaseMenu.Divider,
	Item: BaseMenu.Item,
	ItemGroup: BaseMenu.ItemGroup,
}
export default StyledMenus
