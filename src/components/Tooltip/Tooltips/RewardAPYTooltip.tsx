import React from 'react'
import styled from 'styled-components'
import {
	Row,
	Col,
	Tooltip as BaseTooltip,
	TooltipProps as BaseTooltipProps,
} from 'antd'
import { useAPY } from '../../../state/internal/hooks'
import { ArrowRightOutlined } from '@ant-design/icons'
import { NavLink } from 'react-router-dom'

const StyledTooltip = styled(BaseTooltip)``
const Link = styled(NavLink)`
	color: black;

	&:hover {
		color: black;
	}
`

const Title: React.FC = () => {
	const { yaxisAprPercent } = useAPY('Yaxis', 0.2)

	// TODO
	return (
		<Link to="/staking">
			<Row>
				<Col span={22}>
					Earn{' '}
					<b>
						{yaxisAprPercent
							.div(100)
							.dividedBy(365)
							.plus(1)
							.pow(365)
							.minus(1)
							.multipliedBy(100)
							.toFixed(2)}
						% APY
					</b>{' '}
					by staking! 💰
				</Col>
				<Col span={1}>
					<ArrowRightOutlined style={{ marginRight: '10px' }} />
				</Col>
			</Row>
		</Link>
	)
}

export type TooltipProps = BaseTooltipProps

const RewardAPYTooltip: React.FC<TooltipProps> = ({
	children,
	title,
	...rest
}) => (
	<StyledTooltip placement="bottom" color="#FFD700" {...rest} title={Title}>
		{children}
	</StyledTooltip>
)

export default RewardAPYTooltip
