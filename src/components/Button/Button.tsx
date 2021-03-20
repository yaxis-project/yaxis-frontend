import React from 'react'
import styled from 'styled-components'
import { Button as BaseButton, ButtonProps } from 'antd'

const StyledButton = styled(BaseButton)`
	background: #016eac;
	border: none;
	margin-top: 20;
	height: 60px;
    &:hover {
        background-color: #0186d3;
    }
    &:active {
        background-color: #0186d3;
    }
    &:focus {
        background-color: #0186d3;
    }
    &[disabled] {
        color: #8c8c8c;
        background-color: #f0f0f0;
        border: none;
    }
`

const Button: React.FC<ButtonProps> = ({ children, ...rest }) => (
    <StyledButton block type="primary" {...rest}>
        {children}
    </StyledButton>
)

export default Button
