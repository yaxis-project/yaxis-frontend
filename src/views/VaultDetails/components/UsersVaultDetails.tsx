import CardRow from '../../../components/CardRow'
import {
	useUserBoost,
	useVaultsAPRWithBoost,
} from '../../../state/wallet/hooks'
import Value from '../../../components/Value'
import useTranslation from '../../../hooks/useTranslation'
import { DetailOverviewCard } from '../../../components/DetailOverviewCard'
import { Row, Col } from 'antd'
import { TVaults } from '../../../constants/type'

interface UserVaultDetailsProps {
	vault: TVaults
}

const UserVaultDetails: React.FC<UserVaultDetailsProps> = ({ vault }) => {
	const t = useTranslation()

	const { boost } = useUserBoost(vault)

	const apr = useVaultsAPRWithBoost()

	return (
		<DetailOverviewCard title={t('Vault Overview')}>
			<Row justify="space-around">
				<Col>
					<CardRow
						main={t('Boost')}
						secondary={
							<Value
								value={boost?.toFixed(2)}
								numberSuffix="x"
								decimals={2}
							/>
						}
						last
					/>
				</Col>
				<Col>
					<CardRow
						main={t('APR')}
						secondary={
							<Value
								value={apr[vault]?.totalAPR
									.multipliedBy(100)
									.toNumber()}
								numberSuffix="%"
								decimals={2}
							/>
						}
						last
					/>
				</Col>
				<Col>
					<CardRow
						main={t('APY')}
						secondary={
							<Value
								value={apr[vault]?.totalAPR
									.multipliedBy(100)
									.toNumber()}
								numberSuffix="%"
								decimals={2}
							/>
						}
						last
					/>
				</Col>
			</Row>
		</DetailOverviewCard>
	)
}

export default UserVaultDetails
