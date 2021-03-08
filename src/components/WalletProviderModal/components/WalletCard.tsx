import React from 'react'
import Button from '../../Button'
import CardIcon from '../../CardIcon'
import CardTitle from '../../CardTitle'
import Spacer from '../../Spacer'

interface WalletCardProps {
	icon: React.ReactNode
	onConnect: () => Promise<boolean>
	title: string
	setError: (message: string) => void
}

const WalletCard: React.FC<WalletCardProps> = ({ icon, onConnect, title, setError }) => {
	return (<>
		<CardIcon>{icon}</CardIcon>
		<CardTitle text={title} />
		<Spacer />
		<Button onClick={async () => {
			const error = await onConnect()
			if (error)
				setError(`${title} not found. Ensure that the extension is installed or that you are using the ${title} in-app browser.`)
		}}
			text="Connect"
		/>
	</>)
}

export default WalletCard
