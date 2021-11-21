import React from 'react'
import styled from 'styled-components'
import useTranslation from '../../../hooks/useTranslation'
import { ExpandableSidePanel } from '../../../components/ExpandableSidePanel'
import { DistributionPieChart } from '../../../components/Charts/DistributionPieChart'

const CurrentDistribution: React.FC = () => {
	const translate = useTranslation()

	return (
		<ExpandableSidePanel header={translate('Current Distribution')}>
			<StyledRow>
				<DistributionPieChart type="relativeWeight" />
			</StyledRow>
		</ExpandableSidePanel>
	)
}

export { CurrentDistribution }

const StyledRow = styled.div`
	padding: 10px;
	&&& {
		background: ${(props) => props.theme.secondary.background};
		border-color: ${(props) => props.theme.secondary.border};
	}
`
