import React, { useState, useEffect } from 'react'
import CountUp from 'react-countup'

import styled from 'styled-components'

interface ValueProps {
	value: string | number
	decimals?: number
	inline?: boolean
	fontSize?: string
	numberPrefix?: string
	numberSuffix?: string
	extra?: string
	secondary?: boolean
}

/**
 * Generate a human readable styled number.
 * @param param0 ValueProps
 */
const Value: React.FC<ValueProps> = ({
	value,
	decimals,
	inline,
	fontSize,
	numberPrefix,
	numberSuffix,
	extra,
	secondary,
}) => {
	const [start, updateStart] = useState(0)
	const [end, updateEnd] = useState(0)

	useEffect(() => {
		if (typeof value === 'number') {
			updateStart(end)
			updateEnd(value)
		}
	}, [value, end])

	return (
		<StyledValue inline={inline} fontSize={fontSize} secondary={secondary}>
			{numberPrefix && <span className="prefix">{numberPrefix}</span>}
			{typeof value == 'string' ? (
				value
			) : (
				<>
					<CountUp
						start={start}
						end={end}
						decimals={
							decimals !== undefined
								? decimals
								: end < 0
								? 4
								: end > 1e5
								? 0
								: 3
						}
						duration={1}
						separator=","
					/>
				</>
			)}
			{numberSuffix && <span className="suffix">{numberSuffix}</span>}
			{extra && <span className="extra">{extra}</span>}
		</StyledValue>
	)
}

const StyledValue = styled.div<{
	inline?: boolean
	fontSize?: string
	secondary?: boolean
}>`
	font-size: ${({ fontSize }) => fontSize ?? '18px'};
	${(props) => (props.secondary ? '' : 'font-weight: 700;')}
	display: ${({ inline }) => inline && 'inline-block'};

	.extra {
		font-size: 14px;
		color: rgba(17, 51, 83, 0.6);
		font-weight: 400;
		margin-left: 10px;
	}
`
// color: ${(props) =>
// 	props.secondary
// 		? props.theme.color.secondary.grey
// 		: props.theme.color.black};

export default Value
