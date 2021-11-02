import { Card } from 'antd'
import styled from 'styled-components'

const StyledCard = styled(Card)`
	background: ${(props) => props.theme.secondary.background};
	border-color: ${(props) => props.theme.secondary.border};

	.ant-card-head {
		border-bottom: 1px solid ${(props) => props.theme.secondary.border};
	}

	.ant-card-body {
		padding: 0;
	}
`
export default StyledCard
