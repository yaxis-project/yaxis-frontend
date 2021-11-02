import React from 'react'
import useTranslation from '../../../hooks/useTranslation'
import {
	ExpandableSidePanel,
	CardRow,
} from '../../../components/ExpandableSidePanel'

const GaugesOverview: React.FC = () => {
	const translate = useTranslation()

	return (
		<ExpandableSidePanel header={translate('Gauges Overview')}>
			<CardRow main={<div></div>} secondary={null} last />
		</ExpandableSidePanel>
	)
}

export { GaugesOverview }
