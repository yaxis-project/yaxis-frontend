import React from 'react'
import styled from 'styled-components'
import { Row } from 'antd'

const Offchain: React.FC = () => (
	<Row style={{ paddingTop: '5%' }} justify="center">
		{/* TODO: What is snapshot? */}
		<StyledLinkButton
			target="_blank"
			href="https://gov.yaxis.io/#/"
			rel="noopener noreferrer"
		>
			<span
				style={{
					position: 'relative',
					fontSize: '20px',
					top: '3px',
				}}
			>
				⚡️
			</span>
			<span style={{ color: 'black' }}>Snapshot</span>
		</StyledLinkButton>
	</Row>
)

export { Offchain }

const StyledLinkButton = styled.a`
	padding: 10px ${(props) => props.theme.spacing[3]}px;
	text-decoration: none;
	font-size: 16px;
	width: 200px;
	border: 1px solid grey;
	border-radius: 18px;
	text-align: center;
	background: ${(props) => props.theme.colors.aliceBlue};

	&:hover {
		border: 1px solid ${(props) => props.theme.primary.hover};
	}
`
