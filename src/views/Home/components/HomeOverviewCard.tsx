import { useContext } from 'react'
import styled from 'styled-components'
import { Typography, Col } from 'antd'
import { LanguageContext } from '../../../contexts/Language'
import phrases from './translations'
import {
	DetailOverviewCard,
	DetailOverviewCardRow,
} from '../../../components/DetailOverviewCard'
import Value from '../../../components/Value'
import useReturns from '../../../hooks/useReturns'

const { Text } = Typography

const commas = (num: string) =>
	Number(num).toLocaleString(
		undefined, // leave undefined to use the browser's locale,
		// or use a string like 'en-US' to override it.
		{ minimumFractionDigits: 2 },
	)

/**
 * Creates a loadable detail overview for users on the home page, showing financial returns and account balances.
 */
export default function HomeOverviewCard() {
	const languages = useContext(LanguageContext)
	const language = languages.state.selected

	const t = (s: string) => phrases[s][language]

	const {
		returns: {
			metaVaultUSD,
			stakingUSD,
			totalUSD,
		},
	} = useReturns()

	return (
		<DetailOverviewCard title={t('Your Lifetime Earnings')}>
			<DetailOverviewCardRow inline>
				<Text>
					<strong>Total</strong>
				</Text>
				<Col>
					<Value
						numberPrefix="$"
						value={commas(totalUSD)}
						decimals={2}
					/>
				</Col>
			</DetailOverviewCardRow>
			<DetailOverviewCardRow inline>
				<StyledText>MetaVault Account</StyledText>
				<Col>
					<Value
						numberPrefix="$"
						value={commas(metaVaultUSD)}
						decimals={2}
					/>
				</Col>
			</DetailOverviewCardRow>
			<DetailOverviewCardRow inline>
				<StyledText>Staking Account</StyledText>
				<Col>
					<Value
						numberPrefix="$"
						value={commas(stakingUSD)}
						decimals={2}
					/>
				</Col>
			</DetailOverviewCardRow>
		</DetailOverviewCard>
	)
}

const StyledText = styled(Text)`
	@media only screen and (max-width: 600px) {
		margin-right: 55px;
	}
`
