import { Table } from 'antd'
import styled from 'styled-components'

const StyledTable = styled(Table)`
.ant-table {
    border-radius: 0px;
    background: ${(props) => props.theme.secondary.background};
}
.ant-table-thead > tr > th {
    background: none;
	color: ${(props) => props.theme.secondary.font};
}
td.ant-table-column-sort {
    background: none;
}
`
export default StyledTable
