import React from 'react'
import styled from 'styled-components'
import { Row, Col } from 'antd'
import Collapse from '../../components/Collapse'
import Icon, { IconType } from '../Icon'

const { Panel } = Collapse

interface ExpandableSidePanelProps {
	children: React.ReactNode
	header: React.ReactElement | string
	icon?: IconType
}

export const ExpandableSidePanel: React.FC<ExpandableSidePanelProps> = ({
	header,
	children,
	icon,
}) => {
	return (
		<Collapse defaultActiveKey={['1']} expandIconPosition="right">
			<Panel
				header={
					header && (
						<Row gutter={12} align="middle">
							{icon && (
								<Col>
									<Icon type={icon} />
								</Col>
							)}
							<Col>
								<StyledTitle>{header}</StyledTitle>
							</Col>
						</Row>
					)
				}
				key="1"
			>
				{children}
			</Panel>
		</Collapse>
	)
}

const StyledTitle = styled.span`
	color: ${(props) => props.theme.primary.font};
	font-size: 19px;
`
