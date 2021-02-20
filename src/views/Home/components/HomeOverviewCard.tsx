import React, { useContext } from 'react'
import styled from 'styled-components'
import { Typography } from 'antd'
import { LanguageContext } from '../../../contexts/Language'
import phrases from './translations'
import {
	DetailOverviewCard,
	DetailOverviewCardRow,
} from '../../../components/DetailOverviewCard'
import useAccountReturns from '../../../hooks/useAccountReturns'
import Value from '../../../components/Value'
import useYaxisStaking from '../../../hooks/useYaxisStaking'
import { YAX } from '../../../utils/currencies'
import BigNumber from 'bignumber.js'
import useMetaVaultData from '../../../hooks/useMetaVaultData'

const { Text } = Typography

/**
 * Creates a loadable detail overview for users on the home page, showing financial returns and account balances.
 */
export default function HomeOverviewCard() {
	const languages = useContext(LanguageContext)
	const language = languages.state.selected

	const t = (s: string) => phrases[s][language]

	const { yaxReturnsUSD } = useAccountReturns()

	const { stakedBalanceUSD } = useYaxisStaking(YAX)
	const {
		metaVaultData: { totalBalance, mvltPrice },
	} = useMetaVaultData('v1')

	const savingsBalance = stakedBalanceUSD.toNumber()
	const investingBalance = new BigNumber(totalBalance || '0')
		.multipliedBy(mvltPrice || '0')
		.toNumber()

	return (
		<DetailOverviewCard title="Your Return">
			<DetailOverviewCardRow inline>
				<Text>
					<strong>Total</strong>
				</Text>
				<Value numberPrefix="$" value={yaxReturnsUSD} decimals={2} />
			</DetailOverviewCardRow>
			<DetailOverviewCardRow inline>
				<StyledText>MetaVault Account</StyledText>
				<Value numberPrefix="$" value={investingBalance} decimals={2} />
			</DetailOverviewCardRow>
			<DetailOverviewCardRow inline>
				<StyledText>Savings Account</StyledText>
				<Value numberPrefix="$" value={savingsBalance} decimals={2} />
			</DetailOverviewCardRow>
		</DetailOverviewCard>
	)
}


const StyledText = styled(Text)`
	@media only screen and (max-width: 600px) {
		margin-right: 55px;
	}
`
