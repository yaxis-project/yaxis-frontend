import React from 'react'
import useTranslation from '../../../hooks/useTranslation'
import {
	ExpandableSidePanel,
	CardRow,
} from '../../../components/ExpandableSidePanel'

const DAOResources: React.FC = () => {
	const translate = useTranslation()

	return (
		<ExpandableSidePanel header={translate('DAO Resources')}>
			<CardRow main={<div></div>} secondary={null} />
		</ExpandableSidePanel>
	)
}

export { DAOResources }
