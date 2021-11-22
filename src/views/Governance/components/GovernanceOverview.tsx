import React from 'react'
import Typography from '../../../components/Typography'
import Value from '../../../components/Value'
import CardRow from '../../../components/CardRow'
import useTranslation from '../../../hooks/useTranslation'
import { ExpandableSidePanel } from '../../../components/ExpandableSidePanel'
import { useYaxisSupply } from '../../../state/internal/hooks'
import { useVotingPower } from '../../../state/wallet/hooks'

const { SecondaryText } = Typography

const GovernanceOverview: React.FC = () => {
	const translate = useTranslation()

	const { circulating } = useYaxisSupply()

	const { supply } = useVotingPower()

	return (
		<ExpandableSidePanel
			header={translate('Governance Overview')}
			icon="book"
		>
			<CardRow
				main={<SecondaryText>YAXIS locked in Governance</SecondaryText>}
				secondary={
					<Value
						numberSuffix="%"
						value={supply
							?.dividedBy(circulating)
							.multipliedBy(100)
							.toNumber()}
						decimals={2}
					/>
				}
				last
			/>
		</ExpandableSidePanel>
	)
}

export { GovernanceOverview }
