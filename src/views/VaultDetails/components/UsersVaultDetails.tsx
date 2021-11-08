import { CardRow } from '../../../components/ExpandableSidePanel'
// import { useAPY } from '../../../state/internal/hooks'
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

	// const apy = useAPY()

	return (
		<DetailOverviewCard title={t('Vault Overview')}>
			<Row justify="space-around">
				<Col>
					<CardRow
						main={t('APR')}
						secondary={
							<Value
								value={
									0
									// TODO
								}
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
								value={
									0
									// TODO
								}
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
