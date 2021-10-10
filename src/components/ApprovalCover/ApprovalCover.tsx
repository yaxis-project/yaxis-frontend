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
	autoStake?: string
}

const ApprovalCover: React.FC<Props> = ({
	children,
	contractName,
	approvee,
	hidden,
	noWrapper,
	autoStake,
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

	const cover = useMemo(() => {
		return (
			<Cover
				align="middle"
				justify="center"
				visible={String(
					!hidden &&
						!loadingAllowance &&
						new BigNumber(allowance?.toString() || 0).lt(MAX_UINT),
				)}
			>
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
						{translate('Approve')}
					</Button>
				</Col>
			</Cover>
		)
	}, [
		translate,
		allowance,
		loadingAllowance,
		handleApprove,
		loadingApprove,
		approvee,
		hidden,
	])

	if (noWrapper)
		return (
			<>
				{children}
				{cover}
			</>
		)

	return (
		<div style={{ position: 'relative' }}>
			{children}
			{cover}
		</div>
	)
}

export default ApprovalCover

const Cover = styled(Row)<any>`
	width: 100%;
	height: 100%;
	position: absolute;
	top: 0;
	left: 0;
	background-color: rgb(128, 128, 128, 0.7);
	z-index: 2;
	text-align: center;
	visibility: ${(props) =>
		props.visible === 'true' ? 'visibile' : 'hidden'};
`
