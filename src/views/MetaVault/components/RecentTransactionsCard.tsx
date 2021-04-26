import { useContext, useMemo } from 'react'
import { Typography, Card, Button } from 'antd'
import { CloseOutlined } from '@ant-design/icons'
import transactionIn from '../../../assets/img/icons/transaction-in.svg'
import transactionOut from '../../../assets/img/icons/transaction-out.svg'
import { LanguageContext } from '../../../contexts/Language'
import { Languages } from '../../../utils/languages'
import phrases from './translations'
import { useAllTransactions } from '../../../state/transactions/hooks'
import { map } from 'lodash'
import styled from 'styled-components'

const { Text, Title } = Typography

const gridStyle = {
	width: '100%',
	boxShadow: 'none',
	padding: 0,
	marginTop: 10,
}

const ClearTransactionsButton = styled(Button)`
	color: #016eac;
	button-radius: none;
	border: none;
	position: relative;
	//top: -2.5px;
	//left: 10px;
	padding: 0;
	line-height: 1em;
	box-shadow: none;
`

interface CardTitleProps {
	language: Languages
	onClearTransactions: Function
	showClear: boolean
}

const CardTitle = (props: CardTitleProps) => {
	const { language, onClearTransactions, showClear } = props
	return (
		<>
			<Title level={4}>{phrases['Recent Transactions'][language]}</Title>
			{showClear ? (
				<ClearTransactionsButton
					onClick={() => onClearTransactions()}
					style={{ float: 'right' }}
				>
					{phrases['Clear all'][language]} <CloseOutlined />
				</ClearTransactionsButton>
			) : (
				''
			)}
		</>
	)
}

interface RecentTransactionRowProps {
	main: string
	secondary: string
}

const RecentTransactionRow = (props: RecentTransactionRowProps) => {
	const { main, secondary } = props
	const transactionImg = main === 'Deposit' ? transactionIn : transactionOut
	return (
		<Card.Grid hoverable={false} style={gridStyle}>
			<img
				src={transactionImg}
				height="32"
				style={{ marginTop: 4, position: 'absolute' }}
				alt="logo"
			/>
			<Title style={{ margin: 0, marginLeft: '48px' }} level={5}>
				{main}
			</Title>
			<Text
				style={{ margin: 0, marginLeft: '48px', display: 'block' }}
				type="secondary"
			>
				{secondary}
			</Text>
		</Card.Grid>
	)
}

function generateTransactionRow([hash, val]) {
	return (
		<RecentTransactionRow
			key={hash}
			main={val.summary}
			secondary={'$' + val.amount}
		/>
	)
}

export default function RecentTransactionsCard() {
	const transactions = useAllTransactions()
	const mvTxs = useMemo(
		() =>
			Object.entries(transactions || {}).filter(
				([_, t]) =>
					t.contract === 'rewards.MetaVault' &&
					(t.method === 'depositAll' || t.method === 'withdraw'),
			),
		[transactions],
	)
	const languages = useContext(LanguageContext)
	const language = languages.state.selected
	const txCount = mvTxs.length > 0

	if (!txCount) return null
	return (
		<Card
			title={
				<CardTitle
					showClear={false}
					onClearTransactions={() => {}}
					language={language}
				/>
			}
			style={{ marginTop: 10 }}
		>
			{map(mvTxs, generateTransactionRow)}
		</Card>
	)
}
