import React, { useMemo } from 'react'
import styled from 'styled-components'
import { Row, Col } from 'antd'
import { useSingleCallResultByName } from '../../state/onchain/hooks'
import useContractWrite from '../../hooks/useContractWrite'
import useWeb3Provider from '../../hooks/useWeb3Provider'
import Button from '../Button'
import BigNumber from 'bignumber.js'
import { MAX_UINT } from '../../utils/number'
import { ethers } from 'ethers'
import useTranslation from '../../hooks/useTranslation'

type Props = {
	contractName: string
	approvee: string
	hidden?: boolean
	noWrapper?: boolean
	buttonText?: string
}

const ApprovalCover: React.FC<Props> = ({
	children,
	contractName,
	approvee,
	hidden,
	noWrapper,
	buttonText,
}) => {
	const translate = useTranslation()

	const { account } = useWeb3Provider()

	const { loading: loadingAllowance, result: allowance } =
		useSingleCallResultByName(contractName, 'allowance', [
			account,
			approvee,
		])

	const { call: handleApprove, loading: loadingApprove } = useContractWrite({
		contractName,
		method: 'approve',
		description: `approve token usage`,
	})

	const visible = useMemo(
		() =>
			!hidden &&
			approvee &&
			!loadingAllowance &&
			new BigNumber(allowance?.toString() || 0).lt(MAX_UINT),
		[approvee, allowance, hidden, loadingAllowance],
	)

	const cover = useMemo(
		() => (
			<Cover align="middle" justify="center">
				<Col span={7}>
					<Button
						height={'40px'}
						style={{ minWidth: '100px' }}
						loading={loadingApprove}
						onClick={async () => {
							await handleApprove({
								args: [
									approvee,
									ethers.constants.MaxUint256.toString(),
								],
							})
						}}
					>
						{translate(
							buttonText ? `Approve ${buttonText}` : 'Approve',
						)}
					</Button>
				</Col>
			</Cover>
		),
		[translate, handleApprove, loadingApprove, approvee, buttonText],
	)

	if (noWrapper)
		return (
			<>
				{children}
				{visible && cover}
			</>
		)

	return (
		<div style={{ position: 'relative' }}>
			{children}
			{visible && cover}
		</div>
	)
}

export { ApprovalCover }

const Cover = styled(Row)<any>`
	width: 100%;
	height: 100%;
	position: absolute;
	top: 0;
	left: 0;
	background-color: rgb(128, 128, 128, 0.7);
	z-index: 2;
	text-align: center;
`
