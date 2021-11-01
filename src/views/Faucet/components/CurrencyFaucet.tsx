import { useMemo } from 'react'
import { Row, Col } from 'antd'
import Button from '../../../components/Button'
import { Currencies } from '../../../constants/currencies'
import useContractWrite from '../../../hooks/useContractWrite'
import BN from 'bignumber.js'

export default function CurrencyFaucet({ currency, contractName }) {
	const { call: handleFaucet, loading: loadingFaucet } = useContractWrite({
		contractName,
		method: 'faucet',
		description: `drip ${currency.toUpperCase()} from faucet`,
	})

	const Currency = useMemo(
		() => Currencies[currency.toUpperCase()],
		[currency],
	)

	return (
		<Button
			block={false}
			onClick={async () =>
				handleFaucet({
					args: [
						new BN(1)
							.multipliedBy(10 ** Currency.decimals)
							.toString(),
					],
				})
			}
			loading={loadingFaucet}
		>
			<Row gutter={10} align="middle">
				<Col>
					<img
						src={Currency.icon}
						height="36"
						width="36"
						alt="logo"
					/>
				</Col>
				<Col>{currency.toUpperCase()}</Col>
			</Row>
		</Button>
	)
}
