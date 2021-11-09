import React, { useMemo } from 'react'
import { NavLink } from 'react-router-dom'
import { Row, Col, Typography } from 'antd'
import Menu from '../../Menu'
import styled from 'styled-components'
import { currentConfig } from '../../../constants/configs'
import { Currencies } from '../../../constants/currencies'
import { CaretDownFilled } from '@ant-design/icons'
import { useWeb3React } from '@web3-react/core'
import useTranslation from '../../../hooks/useTranslation'

/**
 * Horizontal top navigation bar for the application.
 * @param props any
 */

const Nav: React.FC = () => {
	const translate = useTranslation()

	const { chainId } = useWeb3React()
	const vaults = useMemo(
		() => Object.keys(currentConfig(chainId).vaults),
		[chainId],
	)
	const currentPools = useMemo(
		() =>
			Object.values(currentConfig(chainId).pools).filter(
				(pool) => pool.active && !pool.legacy,
			),
		[chainId],
	)

	return (
		<StyledMenu
			mode="horizontal"
			defaultSelectedKeys={[window.location.pathname]}
		>
			<MenuItem key={'/'}>
				<StyledLink exact activeClassName="active" to="/">
					{translate('Overview')}
				</StyledLink>
			</MenuItem>

			<StyledSubMenu
				key={'/vault'}
				title={
					<StyledLink activeClassName="active" to="/vault">
						{translate('Vault')}{' '}
						<CaretDownFilled style={{ margin: 0 }} />
					</StyledLink>
				}
			>
				{vaults.map((vault) => (
					<Menu.Item key={`/vault/${vault}`}>
						<StyledLink
							activeClassName="active"
							to={`/vault/${vault}`}
						>
							<Row gutter={10} align="middle">
								<Col>
									<Row align="middle">
										<img
											src={
												Currencies[vault.toUpperCase()]
													.icon
											}
											height="36"
											width="36"
											alt="logo"
										/>
									</Row>
								</Col>
								<Col>
									<MenuText>{vault.toUpperCase()}</MenuText>
								</Col>
							</Row>
						</StyledLink>
					</Menu.Item>
				))}
			</StyledSubMenu>

			<StyledSubMenu
				key={'/liquidity'}
				title={
					<StyledLink activeClassName="active" to="/liquidity">
						{translate('Liquidity')}{' '}
						<CaretDownFilled style={{ margin: 0 }} />
					</StyledLink>
				}
			>
				<ItemGroup title="Provide Liquidity" />
				{currentPools.map((pool) => (
					<Menu.Item key={`/liquidity/${pool.lpAddress}`}>
						<StyledLink
							activeClassName="active"
							to={`/liquidity/${pool.lpAddress}`}
						>
							<MenuText>{pool.name}</MenuText>
						</StyledLink>
					</Menu.Item>
				))}
			</StyledSubMenu>

			<MenuItem key={'/governance'}>
				<StyledLink activeClassName="active" to="/governance">
					{translate('Governance')}
				</StyledLink>
			</MenuItem>
		</StyledMenu>
	)
}

const StyledMenu = styled(Menu.Menu)`
	svg {
		fill: white;
	}
`
const StyledSubMenu = styled(Menu.SubMenu)`
	height: 38px;
`

const MenuText = styled(Typography.Text)`
	display: block;
`

const MenuItem = styled(Menu.Item)`
	height: 38px;
`

const ItemGroup = styled(Menu.ItemGroup)`
	height: 30px;
`

const StyledLink = styled(NavLink)`
	color: ${(props) => props.theme.colors.white} !important;
	font-weight: 600;
	font-size: 18px;
	text-decoration: none;
`

export default Nav
