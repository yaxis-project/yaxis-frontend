import React, { useMemo } from 'react'
import styled from 'styled-components'
import { Row, RowProps } from 'antd'
import { useSingleCallResultByName } from '../../state/onchain/hooks'
import useContractWrite from '../../hooks/useContractWrite'
import useWeb3Provider from '../../hooks/useWeb3Provider'
import Button from '../Button'
import BigNumber from 'bignumber.js'
import { MAX_UINT } from '../../utils/number'
import { ethers } from 'ethers'
import useTranslation from '../../hooks/useTranslation'
import { Phrases } from '../../constants/translations'

type Props = {
	noWrapper?: boolean
	approvee1: string
	contractName1: string
	buttonText1?: Phrases
	hidden1?: boolean
	approvee2: string
	contractName2: string
	buttonText2?: Phrases
	hidden2?: boolean
}

const DoubleApprovalCover: React.FC<Props> = ({
	children,
	noWrapper,
	approvee1,
	contractName1,
	buttonText1,
	hidden1,
	approvee2,
	contractName2,
	buttonText2,
	hidden2,
}) => {
	const translate = useTranslation()

	const { account } = useWeb3Provider()

	const { loading: loadingAllowance1, result: allowance1 } =
		useSingleCallResultByName(contractName1, 'allowance', [
			account,
			approvee1,
		])

	const { call: handleApprove1, loading: loadingApprove1 } = useContractWrite(
		{
			contractName: contractName1,
			method: 'approve',
			description: `approve token usage`,
		},
	)

	const visible1 = useMemo(
		() =>
			account &&
			!hidden1 &&
			approvee1 &&
			!loadingAllowance1 &&
			new BigNumber(allowance1?.toString() || 0).lt(MAX_UINT),
		[approvee1, allowance1, hidden1, loadingAllowance1],
	)

	const cover1 = useMemo(
		() => (
			<Cover align="middle" justify="center">
				<Button
					height={'40px'}
					style={{ minWidth: '100px' }}
					loading={loadingApprove1}
					onClick={async () => {
						await handleApprove1({
							args: [
								approvee1,
								ethers.constants.MaxUint256.toString(),
							],
						})
					}}
				>
					{translate(buttonText1 ?? 'Approve')}
				</Button>
			</Cover>
		),
		[translate, handleApprove1, loadingApprove1, approvee1, buttonText1],
	)

	const { loading: loadingAllowance2, result: allowance2 } =
		useSingleCallResultByName(contractName2, 'allowance', [
			account,
			approvee2,
		])

	const { call: handleApprove2, loading: loadingApprove2 } = useContractWrite(
		{
			contractName: contractName2,
			method: 'approve',
			description: `approve token usage`,
		},
	)

	const visible2 = useMemo(
		() =>
			account &&
			!hidden2 &&
			approvee2 &&
			!loadingAllowance2 &&
			new BigNumber(allowance2?.toString() || 0).lt(MAX_UINT),
		[approvee2, allowance2, hidden2, loadingAllowance2],
	)

	const cover2 = useMemo(
		() => (
			<Cover align="middle" justify="center">
				<Button
					height={'40px'}
					style={{ minWidth: '100px' }}
					loading={loadingApprove2}
					onClick={async () => {
						await handleApprove2({
							args: [
								approvee2,
								ethers.constants.MaxUint256.toString(),
							],
						})
					}}
				>
					{translate(buttonText2 ?? 'Approve')}
				</Button>
			</Cover>
		),
		[translate, handleApprove2, loadingApprove2, approvee2, buttonText2],
	)

	if (noWrapper)
		return (
			<>
				{children}
				{visible1 && cover1}
				{!visible1 && visible2 && cover2}
			</>
		)

	return (
		<div style={{ position: 'relative', width: '100%' }}>
			{children}
			{visible1 && cover1}
			{!visible1 && visible2 && cover2}
		</div>
	)
}

export { DoubleApprovalCover }

const Cover = styled(Row)<RowProps>`
	width: 100%;
	height: 100%;
	position: absolute;
	top: 0;
	left: 0;
	background-color: rgb(128, 128, 128, 0.7);
	z-index: 2;
	text-align: center;
`
