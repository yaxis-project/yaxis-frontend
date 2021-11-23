import { Tabs } from 'antd'
import styled from 'styled-components'

const StyledTabs = styled(Tabs)`
	.ant-tabs-nav {
		border: none;
		margin: 0;
		background: ${(props) => props.theme.secondary.background};

		.ant-tabs-ink-bar {
			background: #016eac;
		}

		.ant-tabs-tab {
			padding: 16px 22px;
			font-size: 22px;
			border-right: none;
			margin: 0;

			.ant-tabs-tab-btn {
				font-weight: 700;
				color: #8899a9;
			}

			&.ant-tabs-tab-active {
				.ant-tabs-tab-btn {
					font-weight: 700;
					color: #016eac;
				}
			}
		}
	}
`
export default StyledTabs
