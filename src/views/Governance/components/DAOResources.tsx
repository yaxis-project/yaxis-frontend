import React from 'react'
import styled from 'styled-components'
import { Row } from 'antd'
import useTranslation from '../../../hooks/useTranslation'
import { ExpandableSidePanel } from '../../../components/ExpandableSidePanel'
import Button from '../../../components/Button'
import CardRow from '../../../components/CardRow'

const DAOResources: React.FC = () => {
	const translate = useTranslation()

	return (
		<ExpandableSidePanel header={translate('DAO Resources')} icon="text">
			<CardRow
				main={<div>Participate in the discussion</div>}
				secondary={null}
				rightContent={
					<Row justify="end" style={{ paddingRight: '20px' }}>
						<div style={{ width: '100px' }}>
							<StyledButton
								height={'32px'}
								href="https://yaxis.discourse.group/"
								rel="noopener noreferrer"
								target="_blank"
							>
								<div style={{ marginTop: '2px' }}>Forum</div>
							</StyledButton>
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
							<StyledButton
								height={'32px'}
								href="https://discord.gg/yaxis-project"
								rel="noopener noreferrer"
								target="_blank"
							>
								<div style={{ marginTop: '2px' }}>Discord</div>
							</StyledButton>
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
							<StyledButton
								height={'32px'}
								href="https://resources.yaxis.io/"
								rel="noopener noreferrer"
								target="_blank"
							>
								<div style={{ marginTop: '2px' }}>
									yAxis Learn
								</div>
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
	width: 100%;
`
