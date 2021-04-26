import { useContext } from 'react'
import { LanguageContext } from '../../../contexts/Language'
import phrases from './translations'
import {
	ExpandableSidePanel,
	CardRow,
} from '../../../components/ExpandableSidePanel'
import CountUp from 'react-countup'
import Value from '../../../components/Value'
import {
	useMetaVaultData,
	useTVL,
	useAnnualProfits,
} from '../../../state/internal/hooks'

export default function VaultStatsCard() {
	const languages = useContext(LanguageContext)
	const language = languages.state.selected
	const t = (s: string) => phrases[s][language]
	const { stakingTvl } = useTVL()

	const annualProfits = useAnnualProfits()
	const { strategy } = useMetaVaultData()

	return (
		<>
			<ExpandableSidePanel header={t('Vault Stats')} key="1">
				<CardRow
					main={t('Current Strategy')}
					secondary={
						strategy ? (
							<>
								<div>{strategy}</div>
								<div>YearnV2: DAI</div>
							</>
						) : (
							<div></div>
						)
					}
				/>
				<CardRow
					main={t('Total Value Locked')}
					secondary={
						<CountUp
							start={0}
							end={stakingTvl.toNumber()}
							decimals={0}
							duration={1}
							prefix="$"
							separator=","
						/>
					}
				/>
				<CardRow
					main={t('Distributed Interest (annually)')}
					secondary={
						<Value
							// TODO: Profit sharing from strategy
							value={Number(
								annualProfits.multipliedBy(0).toFixed(2),
							)}
							numberPrefix="$"
							decimals={0}
						/>
					}
				/>
			</ExpandableSidePanel>
		</>
	)
}
