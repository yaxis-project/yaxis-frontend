import { Collapse } from 'antd'
import styled from 'styled-components'

const StyledCollapse = styled(Collapse)`
	background-color: ${(props) => props.theme.secondary.background};

	.ant-collapse-content {
		background-color: ${(props) => props.theme.secondary.background};
	}

	.ant-collapse-item {
		color: ${(props) => props.theme.primary.font};
		background: ${(props) => props.theme.secondary.background};
		transition: background 0.5s;
	}

	.ant-collapse-header.ant-collapse-header {
		color: ${(props) => props.theme.primary.font};
	}

	svg {
		fill: ${(props) => props.theme.primary.font};
	}

	${(props) =>
		props.theme.type === 'dark'
			? `
			border: none;
			background-color: ${(props) => props.theme.secondary.background};

			.anticon.anticon-right.ant-collapse-arrow {
				svg {
					color: ${props.theme.primary.font};
				}
			}
		
			`
			: ''}
`
export default StyledCollapse
