import React from 'react'
import styled from 'styled-components'
import {
	InputNumber as BaseInputNumber,
	InputNumberProps as BaseInputNumberProps,
	Typography,
	Button,
} from 'antd'
const { Text } = Typography

const StyledInputNumber = styled(BaseInputNumber)``

export interface InputNumberProps extends BaseInputNumberProps {
	onClickMax?: () => void
	suffix?: string
}

const InputNumber: React.FC<InputNumberProps> = ({
	children,
	onClickMax,
	suffix,
	disabled,
	...rest
}) => (
	<StyledInputNumber
		// addonAfter={
		// 	onClickMax ? (
		// 		<>
		// 			{suffix && <Text type="secondary">{suffix}</Text>}
		// 			&nbsp;
		// 			<Button
		// 				block
		// 				size="small"
		// 				onClick={onClickMax}
		// 				disabled={disabled}
		// 			>
		// 				MAX
		// 			</Button>
		// 		</>
		// 	) : (
		// 		suffix
		// 	)
		// }
		disabled={disabled}
		{...rest}
	/>
)

export default InputNumber
