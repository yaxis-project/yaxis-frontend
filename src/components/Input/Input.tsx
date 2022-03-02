import React from 'react'
import styled from 'styled-components'
import {
	Input as BaseInput,
	InputProps as BaseInputProps,
	Typography,
	Button,
} from 'antd'
const { Text } = Typography

const StyledInput = styled(BaseInput)`
	padding: 8px 15px;
	border-radius: 4px;
	font-size: 18px;

	.ant-input {
		font-size: 16px;
	}

	.ant-input-suffix {
		font-size: 16px;
		line-height: 23px;
		color: rgba(17, 51, 83, 0.6);
	}
`

export interface InputProps extends BaseInputProps {
	onClickMax?: () => void
}

const Input: React.FC<InputProps> = ({
	onClickMax,
	suffix,
	disabled,
	...rest
}) => (
	<StyledInput
		suffix={
			onClickMax ? (
				<>
					{suffix && <Text type="secondary">{suffix}</Text>}
					&nbsp;
					<Button
						size="small"
						onClick={onClickMax}
						disabled={disabled}
					>
						MAX
					</Button>
				</>
			) : (
				suffix
			)
		}
		disabled={disabled}
		{...rest}
	/>
)

export default Input
