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

export type MenuProps = BaseMenuProps

const Menu: React.FC<MenuProps> = (props) => <StyledMenu {...props} />

const StyledSubMenu = styled(BaseMenu.SubMenu)``

const StyledMenus = {
	Menu,
	SubMenu: StyledSubMenu,
	Divider: BaseMenu.Divider,
	Item: BaseMenu.Item,
	ItemGroup: BaseMenu.ItemGroup,
}
export default StyledMenus
