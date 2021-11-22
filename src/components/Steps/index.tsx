import { Steps } from 'antd'
import styled from 'styled-components'

const StyledSteps = styled(Steps)`
	.ant-steps-item-container {
		.ant-steps-item-content {
			.ant-steps-item-title {
				color: ${(props) => props.theme.primary.font};
			}
		}

		.ant-steps-item-content {
			.ant-steps-item-description {
				color: ${(props) => props.theme.primary.font};
			}
		}
	}
`
export default StyledSteps
