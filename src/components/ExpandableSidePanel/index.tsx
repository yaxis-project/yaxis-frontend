import React from 'react'
import {
  Typography, Collapse, Divider
} from 'antd'
const { Text, Title} = Typography;

const { Panel } = Collapse;

interface ExpandableRowProps {
  main: string | React.ReactNode;
  secondary: string | React.ReactNode;
}

export const ExpandableRow = (props: ExpandableRowProps) => {
  const { main, secondary } = props;
  return (<>
    <Text style={{ margin: 0, marginLeft: 22, marginTop: 22, display: "block" }} type="secondary">{main}</Text>
    <Title style={{ margin: 0, marginLeft: 22, marginBottom: 22 }} level={5}>{secondary}</Title>
    <Divider plain style={{ margin: 0 }} />
  </>);
}

interface ExpandableSidePanel {
  children: React.ReactNode;
  header: string;
}

export const ExpandableSidePanel = (props: ExpandableSidePanel) => {
  const { header, children } = props;
  return (<>
    <Collapse className="expandable-overview" defaultActiveKey={['1']} expandIconPosition='right'>
      <Panel header={header} key="1">
        {children}
      </Panel>
    </Collapse>
  </>)
}