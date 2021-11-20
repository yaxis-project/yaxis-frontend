import React from 'react'
import Typography from '../../../components/Typography'
import Value from '../../../components/Value'
import CardRow from '../../../components/CardRow'
import useTranslation from '../../../hooks/useTranslation'
import { ExpandableSidePanel } from '../../../components/ExpandableSidePanel'

const { SecondaryText } = Typography

const GovernanceOverview: React.FC = () => {
	const translate = useTranslation()

	return (
		<ExpandableSidePanel
			header={translate('Governance Overview')}
			icon="book"
		>
			<CardRow
				main={<SecondaryText>Percentage of YAXIS locked</SecondaryText>}
				secondary={
					<Value
						numberSuffix="%"
						value={
							0
							// rewardsUSD.toNumber()
							// TODO
						}
						decimals={2}
					/>
				}
				// TODO: circulating supply / totalSupply of VE
				last
			/>
			{/* <CardRow main={<div></div>} secondary={null} />
			<CardRow main={<div></div>} secondary={null} last /> */}
		</ExpandableSidePanel>
	)
}

export { GovernanceOverview }
