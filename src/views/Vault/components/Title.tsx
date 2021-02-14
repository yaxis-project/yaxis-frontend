import React from 'react'
import { Spin } from 'antd'
import styled from 'styled-components'

const InlineBlock = styled.div`
	display: inline-block;
`

const TitleWrapper = styled.h3`
	display: inline-block;
	font-size: 16px;
	font-weight: bold;
	line-height: 24px;
`

type Props = {
	text: string
	loading?: boolean
}

function Title({ text, loading }: Props) {
	return (
		<InlineBlock>
			<Spin spinning={loading} size="small">
				<TitleWrapper>{text}</TitleWrapper>
			</Spin>
		</InlineBlock>
	)
}

export default Title
