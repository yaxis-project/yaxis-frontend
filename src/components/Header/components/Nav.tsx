import React, { useMemo } from 'react'
import { NavLink } from 'react-router-dom'
import { Row, Col } from 'antd'
import Typography from '../../Typography'
import Menu from '../../Menu'
import styled from 'styled-components'
import { currentConfig } from '../../../constants/configs'
import { Currencies } from '../../../constants/currencies'
import { CaretDownFilled } from '@ant-design/icons'
import { useWeb3React } from '@web3-react/core'
import useTranslation from '../../../hooks/useTranslation'

const { Text } = Typography

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
				<StyledLink to="/">{translate('Overview')}</StyledLink>
			</MenuItem>

			<StyledSubMenu
				key={'/vault'}
				title={
					<StyledLink to="/vault">
						{translate('Vault')}{' '}
						<CaretDownFilled style={{ margin: 0 }} />
					</StyledLink>
				}
			>
				<Menu.Item key={`/vault`}>
					<StyledLink to={`/vault`}>
						<Row gutter={10} align="middle">
							<Col>
								<Text>{translate('Overview')}</Text>
							</Col>
						</Row>
					</StyledLink>
				</Menu.Item>
				{vaults.map((vault) => (
					<Menu.Item key={`/vault/${vault}`}>
						<StyledLink to={`/vault/${vault}`}>
							<Row gutter={20} align="middle">
								<Col push={2}>
									<Row align="middle">
										<img
											src={
												Currencies[vault.toUpperCase()]
													.icon
											}
											height="30"
											width="30"
											alt={`${vault} logo`}
										/>
									</Row>
								</Col>
								<Col>
									<Text>{vault.toUpperCase()}</Text>
								</Col>
							</Row>
						</StyledLink>
					</Menu.Item>
				))}
			</StyledSubMenu>

			<StyledSubMenu
				key={'/liquidity'}
				title={
					<StyledLink to="/liquidity">
						{translate('Liquidity')}{' '}
						<CaretDownFilled style={{ margin: 0 }} />
					</StyledLink>
				}
			>
				<Menu.Item key={`/liquidity`}>
					<StyledLink to={`/liquidity`}>
						<Row gutter={10} align="middle">
							<Col>
								<Text>{translate('Overview')}</Text>
							</Col>
						</Row>
					</StyledLink>
				</Menu.Item>
				{currentPools.map((pool) => (
					<Menu.Item key={`/liquidity/${pool.lpAddress}`}>
						<StyledLink to={`/liquidity/${pool.lpAddress}`}>
							<Text>{pool.name}</Text>
						</StyledLink>
					</Menu.Item>
				))}
			</StyledSubMenu>

			<MenuItem key={'/governance'}>
				<StyledLink to="/governance">
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

const MenuItem = styled(Menu.Item)`
	height: 38px;
`

const StyledLink = styled(NavLink)`
	color: ${(props) => props.theme.colors.white} !important;
	font-weight: 600;
	font-size: 18px;
	text-decoration: none;
`

export default Nav
