import React, { useMemo } from 'react'
import styled from 'styled-components'
import { useWallet } from 'use-wallet'
import { NavLink } from 'react-router-dom'

import useFarms from '../../../hooks/useFarms'
import { Menu, Dropdown, Button, Typography } from 'antd';
import { MenuOutlined } from '@ant-design/icons';


interface NavTabletProps { }

const StyledMenu = styled(Menu)`
	padding: 10px;
`
const StyledLink = styled(NavLink)`
	font-weight: 400;
	text-decoration: none;
`
const MenuItem = styled(Menu.Item)`
	height: 38px;
    font-size: 18px;
`
const StyledSpan = styled.span`
    font-size: 18px;
`

const StyledSubMenu = styled(Menu.SubMenu)`
	height: 38px;
`

const MenuText = styled(Typography.Text)`
	display: block;
`

const ItemGroup = styled(Menu.ItemGroup)`
	height: 30px;
`


const NavTablet: React.FC<NavTabletProps> = () => {
    const { farms } = useFarms()
    const activeFarms = farms.filter(farm => farm.active)

    const menu = useMemo(
        () => <StyledMenu>
            <MenuItem key={'/'}>
                <StyledLink exact activeClassName="active" to="/">
                    Overview
                    </StyledLink>
            </MenuItem>

            <MenuItem key={'/investing'}>
                <StyledLink activeClassName="active" to="/investing">
                    MetaVault
                    </StyledLink>
            </MenuItem>

            <MenuItem key={'/savings'}>
                <StyledLink activeClassName="active" to="/savings">
                    Staking
                    </StyledLink>
            </MenuItem>

            <StyledSubMenu
                key={'/liquidity'}
                title={
                    // TODO: to: /liquidity
                    <StyledSpan>
                        Advanced
                    </StyledSpan>
                }
            >
                <ItemGroup title="Provide Liquidity" />
                {activeFarms.map(
                    (farm) =>
                        <MenuItem key={`/liquidity/${farm.lpAddress}`}>
                            <StyledLink activeClassName="active" to={`/liquidity/${farm.lpAddress}`}>
                                <MenuText>{farm.name}</MenuText>
                            </StyledLink>
                        </MenuItem>
                )}
            </StyledSubMenu>


            <Menu.Divider />
            <MenuItem key="3">
                Logout
            </MenuItem>
        </StyledMenu>
        , [activeFarms])
    return (
        <Dropdown overlay={menu} trigger={['click']}>
            <Button size="large" type="default" ghost style={{ border: "none" }} icon={<MenuOutlined style={{ fontSize: '30px' }} />} />
        </Dropdown>
    )
}

export default NavTablet
