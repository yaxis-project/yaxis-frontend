import React, { useMemo } from 'react'
import useTranslation from '../../../hooks/useTranslation'
import Card from '../../../components/Card'
import Typography from '../../../components/Typography'
import { Row, Col } from 'antd'
import useWeb3Provider from '../../../hooks/useWeb3Provider'
import { currentConfig } from '../../../constants/configs'
import { TVaults } from '../../../constants/type'
import styled from 'styled-components'

const { Text } = Typography

interface Props {
	vault: TVaults
}

/**
 * Generates investing vault stats card for the current signed in user.
 */
const CurvePool: React.FC<Props> = ({ vault }) => {
	const { chainId } = useWeb3Provider()

	const vaultData = useMemo(
		() => currentConfig(chainId).vaults[vault],
		[chainId, vault],
	)

	const t = useTranslation()

	if (!vaultData.url) return null

	return (
		<Card style={{ padding: '8px', fontSize: '16px' }}>
			<Row justify="center">
				This Vault accepts {vaultData.token.toUpperCase()} deposits, a
				Curve.fi Liqidity Pool token.
			</Row>
			<Row justify="center">
				Get some by
				<TextLink style={{ marginLeft: '4px' }} href={vaultData.url}>
					depositing your {vault.toUpperCase()}
				</TextLink>
				.
			</Row>
		</Card>
	)
}

export default CurvePool

const TextLink = styled.a`
	color: ${(props) => props.theme.primary.main};
	font-weight: 600;
`
