import React, { useMemo } from 'react'
import styled from 'styled-components'
import { Row, Col } from 'antd'
import useContractReadAccount from '../../hooks/useContractReadAccount'
import useContractWrite from '../../hooks/useContractWrite'
import useWeb3Provider from '../../hooks/useWeb3Provider'
import Button from '../Button'

import { ethers } from 'ethers'

type Props = {
	contractName: string
	approvee: string
	hidden?: boolean
}

const ApprovalCover: React.FC<Props> = ({
	children,
	contractName,
	approvee,
	hidden,
}) => {
	const { account } = useWeb3Provider()

	const {
		loading: loadingAllowance,
		data: allowance,
	} = useContractReadAccount({
		contractName,
		method: 'allowance',
		args: [account, approvee],
	})

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
				visible={
					!hidden && !loadingAllowance && allowance < 2 ** 256 - 1
				}
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
						Approve
					</Button>
				</Col>
			</Cover>
		)
	}, [
		allowance,
		loadingAllowance,
		handleApprove,
		loadingApprove,
		approvee,
		hidden,
	])

	return (
		<CoverWrapper>
			{cover}
			{children}
		</CoverWrapper>
	)
}

export default ApprovalCover

const CoverWrapper = styled(Col)`
	position: relative;
	height: 100%;
`
const Cover = styled(Row)<any>`
	width: 100%;
	height: 100%;
	border-radius: 4px;
	position: absolute;
	top: 0;
	left: 0;
	background-color: rgb(128, 128, 128, 0.3);
	z-index: 2;
	text-align: center;
	visibility: ${(props) => (props.visible ? 'visibile' : 'hidden')};
`
