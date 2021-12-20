import React from 'react'

import ClaimFees from '../../../components/ClaimFees'
import Card from '../../../components/Card'
import useTranslation from '../../../hooks/useTranslation'

type Props = {}

const FeeDistributor: React.FC<Props> = () => {
	const translate = useTranslation()
	return (
		<Card title={translate('Fee Distribution')} icon="yaxis">
			<ClaimFees />
		</Card>
	)
}

export default FeeDistributor