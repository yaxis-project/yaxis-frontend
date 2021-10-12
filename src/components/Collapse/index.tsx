import { Collapse } from 'antd'
import styled from 'styled-components'

const StyledCollapse = styled(Collapse)`
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
