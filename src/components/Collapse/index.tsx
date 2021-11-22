import { Collapse } from 'antd'
import styled from 'styled-components'

const StyledCollapse = styled(Collapse)`
	background: ${(props) => props.theme.secondary.background};
	border-color: ${(props) => props.theme.secondary.border};

	svg {
		fill: ${(props) => props.theme.primary.font};
	}

	.ant-collapse-content {
		border-top: 2px solid ${(props) => props.theme.secondary.border};
		background: ${(props) => props.theme.secondary.background};
	}
`
export default StyledCollapse
