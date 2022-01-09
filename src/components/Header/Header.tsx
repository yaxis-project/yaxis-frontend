import { useMemo } from 'react'
import styled from 'styled-components'
import { Layout, Row, Col, Grid } from 'antd'
import AccountButton from './components/AccountButton'
import Nav from './components/Nav'
import NavTablet from './components/Nav_Tablet'
// import LanguageSelect from './components/LanguageSelect'
import NetworkSelect from './components/NetworkSelect'
import ThemeToggle from '../ThemeToggle'

const { Header: BaseHeader } = Layout
const { useBreakpoint } = Grid

const Logo = () => (
	<a href="https://yaxis.io">
		<img
			src={require('../../assets/img/yaxisLogoFull.svg').default}
			height={42}
			alt={`yAxis logo`}
		/>
	</a>
)

const Header = () => {
	const { lg } = useBreakpoint()

	const content = useMemo(() => {
		if (lg)
			return (
				<>
					<Col flex="auto" style={{ color: 'white' }}>
						<Nav />
					</Col>
					<Col>
						<NetworkSelect />
					</Col>
							{/* <Col>
						<LanguageSelect />
					</Col> */}
					<Col>
						<ThemeToggle />
					</Col>
					<StyledAccountButtonWrapper>
						<AccountButton />
					</StyledAccountButtonWrapper>
				</>
			)

		return (
			<Col style={{ display: 'flex', alignItems: 'center' }}>
				<NavTablet />
			</Col>
		)
	}, [lg])

	return (
		<StyledHeader>
			<StyledTopBar gutter={4} align="middle">
				<Col style={{ padding: '0px 13px 13px 2px' }}>
					<Logo />
				</Col>
				{content}
			</StyledTopBar>
		</StyledHeader>
	)
}

const StyledHeader = styled(BaseHeader)`
	height: 80px;
	padding: 0 8%;
	display: flex;
	justify-content: center;
	background: linear-gradient(180deg, #016eac 0%, #3c9fcf 100%);

	@media only screen and (max-width: 600px) {
		padding: 0;
	}
`

const StyledTopBar = styled(Row)`
	width: 100%;
	align-items: center;
	display: flex;
	justify-content: space-between;
	max-width: ${(props) => props.theme.siteWidth}px;
	@media (max-width: ${(props) => props.theme.siteWidth}px) {
		padding-left: 16px;
		padding-right: 16px;
	}
`

const StyledAccountButtonWrapper = styled(Col)`
	text-align: right;
	@media (max-width: ${(props) => props.theme.siteWidth}px) {
		text-align: center;
	}
`

export default Header
