import React from 'react'
import styled from 'styled-components'
import { Button as BaseButton, ButtonProps } from 'antd'

type Props = ButtonProps & { height?: string }

const StyledButton = styled<any>(BaseButton)`
	background: #0186d3;
	border: none;
	margin-top: 20;
	height: ${(props) => props.height || '60px'};
	font-weight: 700;
	&:hover {
		background-color: #016eac;
	}
	&:active {
		background-color: #016eac;
	}
	&:focus {
		background-color: #016eac;
	}
	&[disabled] {
		color: #8c8c8c;
		background-color: #f0f0f0;
		border: none;
	}
`

const Button: React.FC<Props> = ({ children, ...rest }) => (
	<StyledButton block type="primary" {...rest}>
		{children}
	</StyledButton>
)

export default Button
