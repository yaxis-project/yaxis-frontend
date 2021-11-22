import React from 'react'
import styled from 'styled-components'
import { Anchor, Alert } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'
import { NavLink } from 'react-router-dom'

const StyledAlert = styled(Alert)`
	@-webkit-keyframes errorBg {
		0% {
			background-position: 100% 0%;
		}
		100% {
			background-position: 15% 100%;
		}
	}

	@-moz-keyframes errorBg {
		0% {
			background-position: 100% 0%;
		}
		100% {
			background-position: 15% 100%;
		}
	}

	@keyframes errorBg {
		0% {
			background-position: 100% 0%;
		}
		100% {
			background-position: 15% 100%;
		}
	}

	background: #016eac;
	background: -webkit-linear-gradient(
		45deg,
		#016eac 0%,
		#52b2dc 30%,
		#016eac 66%,
		#52b2dc 100%
	);
	background: -moz-linear-gradient(
		45deg,
		#016eac 0%,
		#52b2dc 30%,
		#016eac 66%,
		#52b2dc 100%
	);
	background: -ms-linear-gradient(
		45deg,
		#016eac 0%,
		#52b2dc 30%,
		#016eac 66%,
		#52b2dc 100%
	);
	background: -o-linear-gradient(
		45deg,
		#016eac 0%,
		#52b2dc 30%,
		#016eac 66%,
		#52b2dc 100%
	);
	background: linear-gradient(
		45deg,
		#016eac 0%,
		#52b2dc 30%,
		#016eac 66%,
		#52b2dc 100%
	);
	background-size: 500% 500%;
	-webkit-animation: errorBg 5s linear infinite;
	-moz-animation: errorBg 5s linear infinite;
	animation: errorBg 5s linear infinite;
`
const Shadow = styled.div`
	z-index: 1;
	-webkit-box-shadow: 0 -12px 20px 0px white;
	-moz-box-shadow: 0 -12px 20px 0px white;
	box-shadow: 0 -12px 20px 0px white;
`
const Text = styled.div`
	color: white;
	font-size: 18px;
	font-weight: 550;
`

const Icon = styled(InfoCircleOutlined)`
	font-size: 30px;
	color: #ffbb00;
	transform: rotate(180deg);
`

interface BannerProps {
	text?: string
	visible?: boolean
	to: string
}

const Banner: React.FC<BannerProps> = ({ text, to, visible = true }) => (
	<Anchor style={{ padding: 0 }}>
		<Shadow>
			<NavLink to={to}>
				{visible && (
					<StyledAlert
						icon={<Icon />}
						message={<Text>{text}</Text>}
						banner
					/>
				)}
			</NavLink>
		</Shadow>
	</Anchor>
)

export default Banner
