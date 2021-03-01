import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import logo from '../../assets/img/logo.svg'

const Logo: React.FC = () => {
	return (
		<StyledLogo href="https://yaxis.io">
			<img src={logo} height="32" alt="logo" />
		</StyledLogo>
	)
}

const StyledLogo = styled.a`
	align-items: center;
	display: flex;
	justify-content: center;
	margin: 0;
	padding: 0;
	text-decoration: none;
`

const StyledText = styled.span`
	color: ${(props) => props.theme.color.grey[100]};
	font-family: 'Reem Kufi', sans-serif;
	font-size: 20px;
	font-weight: 700;
	letter-spacing: 0.03em;
	margin-left: ${(props) => props.theme.spacing[2]}px;
	@media (max-width: 475px) {
		display: none;
	}
`

const YaxisChefText = styled.span`
	font-family: 'Monaco', sans-serif;
`

export default Logo
