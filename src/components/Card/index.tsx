import { Card as BaseCard, CardProps as CardPropsBase, Row, Col } from 'antd'
import styled from 'styled-components'
import Icon, { IconType } from '../Icon'

export const Grid = BaseCard.Grid
export const Meta = BaseCard.Meta

const StyledCard = styled(BaseCard)<CardPropsBase>`
	background: ${(props) => props.theme.secondary.background};
	border-color: ${(props) => props.theme.secondary.border};

	.ant-card-head {
		border-bottom: 3px solid ${(props) => props.theme.secondary.border};
		color: ${(props) => props.theme.primary.font};
		font-size: 19px;
		font-weight: 700;
	}

	.ant-card-body {
		padding: 0;
	}
`
interface CardProps extends CardPropsBase {
	icon?: IconType
}

const Card: React.FC<CardProps> = ({ title, icon, children, ...rest }) => {
	return (
		<StyledCard
			{...rest}
			title={
				title && (
					<Row gutter={12} align="middle">
						{icon && (
							<Col>
								<Icon type={icon} />
							</Col>
						)}
						<Col>{title}</Col>
					</Row>
				)
			}
		>
			{children}
		</StyledCard>
	)
}

export default Card
