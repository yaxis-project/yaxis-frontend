import logo from '../../../assets/img/logo-ui.svg'
import { Row, Col, Grid } from 'antd'
import styled from 'styled-components'
import Card from '../../../components/Card'
import Typography from '../../../components/Typography'

const { useBreakpoint } = Grid
const { SecondaryText, Title } = Typography

interface AccountOverviewCardProps {
	loading: boolean
	mainTitle: string
	secondaryText: string
	value: string
}

const AccountOverviewCard: React.FC<AccountOverviewCardProps> = ({
	mainTitle,
	secondaryText,
	value,
}) => {
	const { xs } = useBreakpoint()

	return (
		<StyledCard>
			<Row gutter={16} align="middle" justify={'space-between'}>
				<Col xs={24} sm={13}>
					<Row
						align="middle"
						gutter={12}
						justify={xs ? 'center' : 'start'}
					>
						<Col xs={24} sm={4}>
							<Row justify="center">
								<img
									src={logo}
									height="32"
									width="36"
									alt="logo"
								/>
							</Row>
						</Col>
						<Col>
							<Row>
								<Title level={4} style={{ margin: 0 }}>
									{mainTitle}
								</Title>
							</Row>
							{secondaryText && (
								<Row>
									<SecondaryText>
										{secondaryText}
									</SecondaryText>
								</Row>
							)}
						</Col>
					</Row>
				</Col>

				<Col xs={24} sm={6}>
					<Row justify={xs ? 'center' : 'start'}>
						<Title level={4} style={{ margin: 0 }}>
							{value}
						</Title>
					</Row>
				</Col>
			</Row>
		</StyledCard>
	)
}

export default AccountOverviewCard

const StyledCard = styled(Card)`
	margin-top: 10px;
	padding: 20px 22px;
`
