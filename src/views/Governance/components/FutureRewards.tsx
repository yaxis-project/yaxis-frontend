import React from 'react'
import useTranslation from '../../../hooks/useTranslation'
import { ExpandableSidePanel } from '../../../components/ExpandableSidePanel'
import CardRow from '../../../components/CardRow'
import { DistributionPieChart } from '../../../components/Charts/DistributionPieChart'
import { useGauges } from '../../../state/internal/hooks'
import moment from 'moment'

const FutureRewards: React.FC = () => {
	const translate = useTranslation()

	const { loading, nextWeekStart } = useGauges()

	return (
		<ExpandableSidePanel header={translate('Future Distribution')}>
			<CardRow
				main={
					<div>
						Starts on{' '}
						{loading
							? '-'
							: moment(Number(nextWeekStart) * 1000).format(
									'MMM Do, HH:mm',
							  )}
						.
					</div>
				}
				secondary={null}
				last
			/>
			<DistributionPieChart type="nextRelativeWeight" />
		</ExpandableSidePanel>
	)
}

export { FutureRewards }
