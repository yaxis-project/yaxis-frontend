import React, { useMemo, useCallback } from 'react'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { NavLink } from 'react-router-dom'
import { currentConfig } from '../../../yaxis/configs'
import { Menu, Dropdown, Button, Typography } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import WalletProviderModal from '../../WalletProviderModal'
import useModal from '../../../hooks/useModal'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import { etherscanUrl } from '../../../yaxis/utils'

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
    const { account, chainId, deactivate } = useWeb3React()

    const [onPresentWalletProviderModal] = useModal(
        <WalletProviderModal />,
        'provider',
    )

    const handleUnlockClick = useCallback(() => {
        onPresentWalletProviderModal()
    }, [onPresentWalletProviderModal])

    const handleSignOutClick = useCallback(() => {
        localStorage.setItem('signOut', account)
        deactivate()
    }, [deactivate, account])

    const activePools = currentConfig(chainId).pools.filter(pool => pool.active)

    const menu = useMemo(
        () => <StyledMenu>
            <MenuItem key={'/'}>
                <StyledLink exact activeClassName="active" to="/">
                    Overview
                    </StyledLink>
            </MenuItem>

            <MenuItem key={'/vault'}>
                <StyledLink activeClassName="active" to="/vault">
                    MetaVault
                    </StyledLink>
            </MenuItem>

            <MenuItem key={'/staking'}>
                <StyledLink activeClassName="active" to="/staking">
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
                        href={etherscanUrl(`/address/${account}`)}
                        target={'_blank'}
                        rel="noopener noreferrer"
                    >
                        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                            <div>{chainId === 1 ? "Mainnet" : "Kovan"}</div>
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
        , [activePools, account, handleUnlockClick, handleSignOutClick, chainId])
    return (
        <Dropdown overlay={menu} trigger={['click']}>
            <Button size="large" type="default" ghost style={{ border: "none" }} icon={<MenuOutlined style={{ fontSize: '30px' }} />} />
        </Dropdown>
    )
}

export default NavTablet
