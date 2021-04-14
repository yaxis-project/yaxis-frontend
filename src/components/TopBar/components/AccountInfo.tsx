import styled from 'styled-components'
import { Menu, Row, Col, Divider, Typography } from 'antd'
import {
	CopyOutlined,
	BlockOutlined,
	CheckCircleTwoTone,
} from '@ant-design/icons'
import { etherscanUrl } from '../../../yaxis/utils'

const { Text } = Typography

const StyledRow = styled(Row)<any>`
	display: flex;
	align-items: center;
	margin-bottom: ${(props) => (props.mobile ? '5' : '10')}px;
`
const StyledText = styled.div`
	text-align: center;
	// font-size: 0.9em;
	// margin-left: 10px;
	color: rgba(0, 0, 0, 0.45);
`

const StyledCol = styled(Col)`  
    margin-bottom: 5px,
    padding-left: 15px,
    padding-right: 5px,`

const AccountText = styled.div`
	font-weight: bold;
	// margin-left: -8px;
`

const AccountIdText = styled.div`
	font-weight: bold;
	font-size: 1em;
	color: #016eac;
	border: 1.5px solid #016eac;
	border-radius: 20px;
	// padding: 2px 10px;
	// margin-left: 10px;
`

interface AccountInfoProps {
	account: string
	networkName: string
	friendlyNetworkName: string
	mobile: boolean
}

const AccountInfo: React.FC<AccountInfoProps> = ({
	account,
	networkName,
	friendlyNetworkName,
	mobile,
}) => {
	return (
		<>
			<Menu.ItemGroup
				title={
					<StyledCol>
						<StyledRow
							mobile={mobile}
							style={{
								margin: '5px 10px 12px 10px',
							}}
						>
							<AccountText>Account:</AccountText>
							<AccountIdText>
								{account.slice(0, 4)} ... {account.slice(-2)}
							</AccountIdText>
						</StyledRow>
						<StyledRow>
							<Text
								style={{
									marginLeft: '-2px',
								}}
								copyable={{
									icon: [
										<Row>
											<CopyOutlined key="copy-icon" />
											<StyledText>
												Copy Address
											</StyledText>
										</Row>,
										<Row>
											<CheckCircleTwoTone
												key="copied-icon"
												twoToneColor="#52c41a"
											/>
											<StyledText>
												Address Copied!
											</StyledText>
										</Row>,
									],
									text: `${account}`,
									tooltips: false,
								}}
							></Text>
						</StyledRow>
						<StyledRow>
							<BlockOutlined />
							<StyledText>
								<a
									href={etherscanUrl(
										`/address/${account}`,
										networkName,
									)}
									rel="noopener noreferrer"
									target="_blank"
								>
									View on Etherscan
								</a>
							</StyledText>
						</StyledRow>
						<StyledRow>
							<CheckCircleTwoTone twoToneColor="#52c41a" />{' '}
							<StyledText>{friendlyNetworkName}</StyledText>
						</StyledRow>
						<Divider
							orientation="left"
							style={{
								margin: '10px 0px 5px 0px',
							}}
						/>
					</StyledCol>
				}
			/>
		</>
	)
}

export default AccountInfo
