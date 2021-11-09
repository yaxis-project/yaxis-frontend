import React from 'react'
import styled from 'styled-components'

type IconTypes = ''

interface Props {
	type: IconTypes
}

const Icon: React.FC<Props> = ({ type }) => {
	return (
		<Background>
			<img
				src={require(`../../assets/img/${type}.svg`).default}
				height={42}
				alt={`${type} logo`}
			/>
		</Background>
	)
}

export default Icon

const Background = styled.div`
	background: red;
`
