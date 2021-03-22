import { useContext, useMemo } from 'react'
import styled from 'styled-components'
import { Typography, Col } from 'antd'
import { LanguageContext } from '../../../contexts/Language'
import phrases from './translations'
import {
	DetailOverviewCard,
	DetailOverviewCardRow,
} from '../../../components/DetailOverviewCard'
import Value from '../../../components/Value'
import useYaxisStaking from '../../../hooks/useYaxisStaking'
import BigNumber from 'bignumber.js'
import useMetaVaultData from '../../../hooks/useMetaVaultData'

const { Text } = Typography

const commas = (num: string) => Number(num).toLocaleString(
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


	const { stakedBalance } = useYaxisStaking()
	const {
		metaVaultData: { totalBalance, mvltPrice, },
		returns
	} = useMetaVaultData('v1')

	// const savingsBalance = stakedBalanceUSD.toNumber()
	const investingBalance = new BigNumber(totalBalance || '0')
		.multipliedBy(mvltPrice || '0')

	const [
		metaVaultReturnsUSD,
		metaVaultReturnsYAX,
		stakingReturnsYAX,
		totalUSD,
		totalYAX
	] = useMemo(() => {
		if (!returns.fetched) return ["0", "0", "0", "0", "0"]
		const mvReUSD = returns.metaVault.USD.plus(investingBalance)
		const mvReYAX = returns.metaVault.YAX
		const stReYAX = returns.staking.YAX.plus(stakedBalance)
		return [
			mvReUSD.toFixed(2),
			mvReYAX.toFixed(2),
			stReYAX.toFixed(2),
			mvReUSD.toFixed(2),
			mvReYAX.plus(stReYAX).toFixed(2)
		]
	}, [returns, investingBalance, stakedBalance])

	return (
		<DetailOverviewCard title={t("Your Return")}>
			<DetailOverviewCardRow inline>
				<Text>
					<strong>Total</strong>
				</Text>
				<Col>
					<Value
						numberPrefix="$"
						value={commas(totalUSD)} decimals={2} />
					<Value
						numberSuffix=" YAX"
						value={commas(totalYAX)} decimals={2} />
				</Col>
			</DetailOverviewCardRow>
			<DetailOverviewCardRow inline>
				<StyledText>MetaVault Account</StyledText>
				<Col>
					<Value
						numberPrefix="$"
						value={commas(metaVaultReturnsUSD)} decimals={2} />
					<Value
						numberSuffix=" YAX"
						value={commas(metaVaultReturnsYAX)} decimals={2} />
				</Col>
			</DetailOverviewCardRow>
			<DetailOverviewCardRow inline>
				<StyledText>Staking Account</StyledText>
				<Col>
					<Value
						numberSuffix=" YAX"
						value={commas(stakingReturnsYAX)} decimals={2} />
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
