import React from 'react'
import useTranslation from '../../../hooks/useTranslation'
import {
	ExpandableSidePanel,
	CardRow,
} from '../../../components/ExpandableSidePanel'

const BoostCalculator: React.FC = () => {
	const translate = useTranslation()

	return (
		<ExpandableSidePanel header={translate('Boost Calculator')}>
			<CardRow main={<div></div>} secondary={null} last />
		</ExpandableSidePanel>
	)
}

export { BoostCalculator }
