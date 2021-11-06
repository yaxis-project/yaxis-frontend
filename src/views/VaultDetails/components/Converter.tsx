import useTranslation from '../../../hooks/useTranslation'
import { DetailOverviewCard } from '../../../components/DetailOverviewCard'
import { Row } from 'antd'
import * as Helpers from './helpers'
import { TVaults } from '../../../constants/type'

type Props = {
	vault: TVaults
}

const Converter: React.FC<Props> = ({ vault }) => {
	const t = useTranslation()

	return (
		<DetailOverviewCard title={''}>
			<Row justify="space-around">
				{vault === '3crv' && <Helpers.Stable3PoolTabs />}
			</Row>
		</DetailOverviewCard>
	)
}

export { Converter }