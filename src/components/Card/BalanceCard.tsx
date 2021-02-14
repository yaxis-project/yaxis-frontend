import React from 'react'
import { Spin } from 'antd'
import styled from 'styled-components'

import Card from './Card'
import Value from '../Value'

export const BalanceTitle = styled.div`
	color: ${(props) => props.theme.color.primary.main};
	font-weight: 500;
	font-size: 13px;
`

const Description = styled.div`
	font-weight: bold;
	font-size: 14px;
`

const InlineBlock = styled.div`
	display: inline-block;
`

type Props = {
	title?: string | React.ReactElement
	balance?: number
	loading?: boolean
	percent?: number
	prefixSymbol?: string
	symbol?: string
	children?: React.ReactElement
	height?: string
	decimals?: number
	suffix?: React.ReactElement
}

function BalanceCard({
	title,
	balance,
	percent,
	loading = false,
	prefixSymbol,
	symbol,
	children,
	height,
	decimals = 3,
	suffix,
}: Props): React.ReactElement {
	return (
		<Card height={height}>
			{title ? <BalanceTitle>{title}</BalanceTitle> : null}
			<Description>
				<div>
					<Spin spinning={loading} size="small">
						{children ?? (
							<>
								{!!prefixSymbol && <span>{prefixSymbol} </span>}
								<InlineBlock>
									<Value
										value={balance}
										decimals={decimals}
									/>
								</InlineBlock>
								{symbol ? <span>&nbsp;{symbol}</span> : ''}
								{percent ? <span> ({percent}%)</span> : ''}
								{suffix ?? null}
							</>
						)}
					</Spin>
				</div>
			</Description>
		</Card>
	)
}

export default React.memo(BalanceCard)
