import React from 'react'
import styled from 'styled-components'
import { Ticker } from '../../constants/type'
import { Currencies } from '../../constants/currencies'

export interface Props {
	type: Ticker
}

const Icon: React.FC<Props> = ({ type }) => {
	const currency = Currencies[type.toUpperCase()]
	if (!currency) console.error('Currency not found')

	const icons = currency.icon

	return (
		<Background>
			<img
				src={require(`../../assets/img/icons/${type}.svg`).default}
				height={20}
				alt={`${type} logo`}
			/>
		</Background>
	)
}

export default Icon

const Background = styled.div`
	position: relative
	height: 34px;
	width: 34px;
`
