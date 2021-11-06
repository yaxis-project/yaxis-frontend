import React from 'react'
import styled from 'styled-components'
import { Row } from 'antd'
import useTranslation from '../../../hooks/useTranslation'
import {
	ExpandableSidePanel,
	CardRow,
} from '../../../components/ExpandableSidePanel'
import Button from '../../../components/Button'

const DAOResources: React.FC = () => {
	const translate = useTranslation()

	return (
		<ExpandableSidePanel header={translate('DAO Resources')}>
			<CardRow
				main={<div>Participate in the discussion</div>}
				secondary={null}
				rightContent={
					<Row justify="end" style={{ paddingRight: '20px' }}>
						<div style={{ width: '100px' }}>
							<StyledButton height={'32px'}>Forum</StyledButton>
						</div>
					</Row>
				}
			/>
			<CardRow
				main={<div>Join the community!</div>}
				secondary={null}
				rightContent={
					<Row justify="end" style={{ paddingRight: '20px' }}>
						<div style={{ width: '100px' }}>
							<StyledButton height={'32px'}>Discord</StyledButton>
						</div>
					</Row>
				}
			/>
			<CardRow
				main={<div>Read more about yAxis</div>}
				secondary={null}
				rightContent={
					<Row justify="end" style={{ paddingRight: '20px' }}>
						<div style={{ width: '100px' }}>
							<StyledButton height={'32px'}>
								yAxis Learn
							</StyledButton>
						</div>
					</Row>
				}
				last
			/>
		</ExpandableSidePanel>
	)
}

export { DAOResources }

const StyledButton = styled(Button)`
	font-size: 12px;
`