import styled from 'styled-components'
import logo from '../../assets/img/logo-ui.svg'
import arrow from '../../assets/img/arrow-ui.svg'
import { NavLink } from 'react-router-dom'
import theme from '../../theme'
import { Row, Col, Typography, Divider, Grid } from 'antd'
import { LinkOutlined } from '@ant-design/icons'
const { Title, Text } = Typography
const { useBreakpoint } = Grid

const StyledMain = styled.div<any>`
	padding: 40px 10%;
	width: 100%;
	margin: auto;
	height: 100%;
	background: ${(props) => (props.background ? props.background : '#eff9ff')};

	font-size: 1rem;

	@media only screen and (max-width: 600px) {
		padding: 20px 3%;
	}
`

const StyledLink = styled.a`
	color: grey;
	font-size: 1rem;
	font-size: 0.8em;
	padding-left: 15px;
`

interface PageLeadBarProps {
	loading?: boolean
	mainTitle?: string
	secondaryText?: string
	secondaryTextLink?: string
	value?: string
	valueInfo?: string
	background?: string
}

/**
 * Generates a lead banner for page components.
 * @param props PageLeadBarProps
 */
const PageLeadBar = (props: PageLeadBarProps) => {
	const { md, lg } = useBreakpoint()
	const {
		mainTitle,
		secondaryText,
		secondaryTextLink,
		value,
		valueInfo,
		background,
	} = props
	if (
		!mainTitle &&
		!secondaryText &&
		!secondaryTextLink &&
		!value &&
		!valueInfo
	)
		return null
	return (
		<StyledMain background={background}>
			<Row
				style={{
					maxWidth: theme.siteWidth,
					margin: 'auto',
					alignItems: 'center',
				}}
				justify="space-between"
			>
				<Col xs={3} sm={2} md={2}>
					<NavLink to="/">
						<img
							src={arrow}
							height="24"
							alt="logo"
							style={{ marginLeft: '8px' }}
						/>
					</NavLink>
				</Col>
				<Col xs={6} sm={4} md={2}>
					<img src={logo} height="51" alt="logo" />
				</Col>
				<Col xs={15} sm={18} md={7}>
					<Title
						style={{
							margin: 0,
							fontWeight: 700,
							fontSize: '1.7em',
							paddingLeft: '15px',
						}}
						level={5}
					>
						{mainTitle}
					</Title>

					{secondaryTextLink ? (
						<StyledLink
							href={secondaryTextLink}
							target="_blank"
							rel="noopener noreferrer"
						>
							<LinkOutlined />
							<span style={{ padding: '0 6px' }}>
								{secondaryText}
							</span>
						</StyledLink>
					) : (
						<Text
							type="secondary"
							style={{ fontSize: '0.8em', paddingLeft: '15px' }}
						>
							{secondaryText}
						</Text>
					)}
				</Col>
				{md || lg ? (
					<Col md={1} style={{ marginTop: '8px' }}>
						<Divider type={'vertical'} style={{ height: '80px' }} />
					</Col>
				) : (
					<></>
				)}
				<Col xs={22} sm={22} md={12} style={{ marginTop: '8px' }}>
					<Title
						style={{
							margin: 0,
							fontWeight: 700,
							fontSize: '1.7em',
						}}
						level={5}
					>
						{value}
					</Title>
					<Text type="secondary" style={{ fontSize: '0.8em' }}>
						{valueInfo}
					</Text>
				</Col>
			</Row>
		</StyledMain>
	)
}

export default PageLeadBar
