import React from 'react'
import styled from 'styled-components'
import useImage from '../../hooks/useImage'

export type IconType =
	| 'vault'
	| 'gear'
	| 'lineupdown'
	| 'lineup'
	| 'book'
	| 'calculator'
	| 'coins'
	| 'gear'
	| 'text'
	| 'verticalbars'
	| 'yaxis'

export interface Props {
	type: IconType
}

const Icon: React.FC<Props> = ({ type }) => {
	const { error, image } = useImage(`img/icons/${type}.svg`)

	if (error) return <div></div>

	return (
		<Background>
			<img src={image} height={20} alt={`${type} logo`} />
		</Background>
	)
}

export default Icon

const Background = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	background: ${(props) =>
		props.theme.type === 'light' ? '#EAF5F8' : '#022F49'};
	border-radius: 100%;
	height: 34px;
	width: 34px;
`
