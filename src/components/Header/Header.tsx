import styled from 'styled-components'
import { Layout, Row, Col, Grid } from 'antd'
import Logo from '../Logo'

import AccountButton from './components/AccountButton'
import Nav from './components/Nav'
import NavTablet from './components/Nav_Tablet'
import LanguageSelect from './components/LanguageSelect'
import ThemeToggle from '../ThemeToggle'

const { Header: BaseHeader } = Layout
const { useBreakpoint } = Grid

const Header = ({ home }: any) => {
	const { lg } = useBreakpoint()
	return (
		<StyledHeader>
			<StyledTopBar gutter={4} align="middle">
				<Col style={{ padding: '0px 13px 13px 2px' }}>
					<StyledLogoWrapper>
						<Logo />
					</StyledLogoWrapper>
				</Col>
				{lg ? (
					<>
						<Col flex="auto" style={{ color: 'white' }}>
							<Nav />
						</Col>
						<Col>
							<ThemeToggle></ThemeToggle>
						</Col>
						<Col>
							<LanguageSelect />
						</Col>
						<StyledAccountButtonWrapper>
							<AccountButton />
						</StyledAccountButtonWrapper>
					</>
				) : (
					<Col style={{ display: 'flex', alignItems: 'center' }}>
						<NavTablet />
					</Col>
				)}
			</StyledTopBar>
		</StyledHeader>
	)
}

const StyledHeader = styled(BaseHeader)`
	height: 80px;
	padding: 0 10%;
	display: flex;
	justify-content: center;

	@media only screen and (max-width: 600px) {
		padding: 0;
	}
`

const StyledLogoWrapper = styled.div`
	img {
		width: auto;
		height: auto;
	}
	@media (max-width: 400px) {
		width: auto;
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