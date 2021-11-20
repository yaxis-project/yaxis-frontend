import React, { useMemo } from 'react'
import useTranslation from '../../../hooks/useTranslation'
import { ExpandableSidePanel } from '../../../components/ExpandableSidePanel'
import CardRow from '../../../components/CardRow'
import { useGauges } from '../../../state/internal/hooks'
import moment from 'moment'

const FutureRewards: React.FC = () => {
	const translate = useTranslation()

	const [loading, gauges] = useGauges()

	const nextDate = useMemo(() => {
		if (loading) return null
		return Object.values(gauges).reduce((soonestDate, { time }) => {
			if (moment(time * 1000).isBefore(soonestDate))
				return moment(time * 1000)
			return soonestDate
		}, moment(8640000000000000))
	}, [loading, gauges])

	return (
		<ExpandableSidePanel header={translate('Future Distribution')}>
			<CardRow
				main={
					<div>
						Starts on {nextDate && nextDate.format('MMM Do, HH:mm')}
						.
					</div>
				}
				secondary={null}
				last
			/>
		</ExpandableSidePanel>
	)
}

export { FutureRewards }
