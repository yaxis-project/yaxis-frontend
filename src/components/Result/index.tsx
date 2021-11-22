import { Result } from 'antd'
import styled from 'styled-components'

const StyledResult = styled<any>(Result)`
	.ant-result-title {
		color: ${(props) => props.theme.primary.font};
	}
`
export default StyledResult
