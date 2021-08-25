import React from 'react'
import styled from 'styled-components'
import { Menu as BaseMenu, MenuProps as BaseMenuProps } from 'antd'

// TODO
const StyledMenu = styled(BaseMenu)`
	.ant-dropdown-menu-item:hover,
	.ant-dropdown-menu-submenu-title:hover {
		background-color: red;
	}
`

export interface MenuProps extends BaseMenuProps {}

const Menu: React.FC<MenuProps> = (props) => <StyledMenu {...props} />

export default Menu
