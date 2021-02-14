import React from 'react'
import { Input, Radio, Form } from 'antd'
import styled from 'styled-components'

const Img = styled.img`
	width: 20px;
	height: 20px;
	margin-right: 8px;
`

const LeftSide = styled.div`
	width: 80px;
	text-align: left;
	font-size: 12px;
`

const NameStyled = styled.div`
	display: inline-block;
	font-weight: 600;
`

const MaxButton = styled.div`
	padding: 4px;
	font-size: 12px;
	cursor: pointer;
`

const InputWrapper = styled.div`
	margin-bottom: 8px;
`

type Props = {
	id: string
	name: string
	icon?: string
	max: string
	showRadioButton?: boolean
	value?: string
	disabled?: boolean
	checked?: boolean
	showMax?: boolean
	loading?: boolean
	error?: boolean
	onChange?: (key: string, value: string) => void
}

function CurrencyInput({
	id,
	name,
	icon,
	max,
	value,
	disabled = false,
	checked = false,
	showMax = true,
	loading = false,
	error = false,
	showRadioButton = false,
	onChange,
}: Props): React.ReactElement {
	const handleChange = (value: string) => {
		onChange(id, value)
	}
	const addonBefore = (
		<LeftSide>
			{showRadioButton && <Radio value={id} checked={checked} />}
			{icon && <Img src={icon} alt={name} />}
			<NameStyled>{name}</NameStyled>
		</LeftSide>
	)
	const addonAfter = (
		<MaxButton onClick={() => handleChange(max + '')}>Max</MaxButton>
	)
	return (
		<InputWrapper>
			<Form.Item
				validateStatus={error ? 'error' : ''}
				style={{ marginBottom: 0 }}
			>
				<Input
					disabled={disabled}
					addonBefore={addonBefore}
					addonAfter={showMax ? addonAfter : null}
					placeholder="0.00"
					onChange={(e) => handleChange(e.target.value)}
					size="large"
					type="number"
					value={value}
				/>
			</Form.Item>
			{/*<small style={showRadioButton ? {fontSize: '11px', lineHeight: 1.5} : {}}>Max: {max}</small>*/}
			<small>Max: {max}</small>
		</InputWrapper>
	)
}

export default CurrencyInput
