import { Select } from 'antd'
import styled from 'styled-components'

const StyledSelect = styled<any>(Select)`
	${(props) =>
		props.theme.type === 'dark'
			? `
            svg {
                fill: ${props.theme.secondary.font};
            }
			`
			: ''}
`
export default StyledSelect
