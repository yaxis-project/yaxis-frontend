import React, { useMemo, useCallback } from 'react'
import styled from 'styled-components'
import { useWallet } from 'use-wallet'
import { NavLink } from 'react-router-dom'
import { currentConfig } from '../../../yaxis/configs'
import { Menu, Dropdown, Button, Typography } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import WalletProviderModal from '../../WalletProviderModal'
import useModal from '../../../hooks/useModal'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'

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
    const { account, reset } = useWallet()

    const [onPresentWalletProviderModal] = useModal(
        <WalletProviderModal />,
        'provider',
    )

    const handleUnlockClick = useCallback(() => {
        onPresentWalletProviderModal()
    }, [onPresentWalletProviderModal])

    const handleSignOutClick = useCallback(() => {
        localStorage.setItem('signOut', account)
        reset()
    }, [reset, account])

    const activePools = currentConfig.pools.filter(pool => pool.active)

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
                {activePools.map(
                    (farm) =>
                        <MenuItem key={`/liquidity/${farm.lpAddress}`}>
                            <StyledLink activeClassName="active" to={`/liquidity/${farm.lpAddress}`}>
                                <MenuText>{farm.name}</MenuText>
                            </StyledLink>
                        </MenuItem>
                )}
            </StyledSubMenu>


            <Menu.Divider />
            {!account ? (
                <MenuItem
                    onClick={handleUnlockClick}
                >
                    Connect
                </MenuItem>
            ) : (

                    <Menu.ItemGroup title={
                        <a
                            href={`https://etherscan.io/address/${account}`}
                            target={'_blank'}
                            rel="noopener noreferrer"
                        >
                            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>

                                <Jazzicon
                                    diameter={36}
                                    seed={jsNumberForAddress(account)}
                                />
                                <div>{account.slice(0, 4)} ... {account.slice(-2)}</div>
                            </div>
                        </a>
                    }
                    >
                        <MenuItem key="logout" onClick={handleSignOutClick}>
                            Logout
                        </MenuItem>
                    </Menu.ItemGroup>
                )}
        </StyledMenu>
        , [activePools, account, handleUnlockClick, handleSignOutClick])
    return (
        <Dropdown overlay={menu} trigger={['click']}>
            <Button size="large" type="default" ghost style={{ border: "none" }} icon={<MenuOutlined style={{ fontSize: '30px' }} />} />
        </Dropdown>
    )
}

export default NavTablet
