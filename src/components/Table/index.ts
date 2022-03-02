import { TableProps, Table } from 'antd'
import styled from 'styled-components'

const StyledTable = styled(Table)<TableProps<unknown>>`
	.ant-table {
		border-radius: 0px;
		background: ${(props) => props.theme.secondary.background};

		.ant-table-cell {
			color: ${(props) => props.theme.primary.font};
		}

		.ant-table-thead > tr > th {
			background: none;
			color: ${(props) => props.theme.secondary.font};
		}

		td.ant-table-column-sort {
			background: none;
		}
	}
` as typeof Table

export default StyledTable
