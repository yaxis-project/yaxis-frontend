import styled from 'styled-components'
import { Menu, Row, Col } from 'antd'
import Divider from '../../Divider'
import Typography from '../../Typography'
import {
	CopyOutlined,
	BlockOutlined,
	CheckCircleTwoTone,
} from '@ant-design/icons'
import { useExplorerUrl } from '../../../utils'
import useTranslation from '../../../hooks/useTranslation'
import { useENS } from '../../../hooks/useENS'

const { Text } = Typography

interface AccountInfoProps {
	account: string
	friendlyNetworkName: string
	mobile: boolean
}

const AccountInfo: React.FC<AccountInfoProps> = ({
	account,
	friendlyNetworkName,
	mobile,
}) => {
	const translate = useTranslation()
	const { ensName } = useENS(account)
	const explorerUrl = useExplorerUrl(`/address/${account}`)
	return (
		<>
			<Menu.ItemGroup
				title={
					<StyledCol>
						<StyledRow
							mobile={`${mobile}`}
							style={{
								margin: '5px 10px 12px 10px',
							}}
						>
							<AccountText>{translate('Account')}:</AccountText>
							<AccountIdText>
								{ensName ||
									`${account.slice(0, 4)} ... ${account.slice(
										-2,
									)}`}
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
											<Col>
												<CopyOutlined key="copy-icon" />
											</Col>
											<Col>
												<StyledText
													mobile={`${mobile}`}
												>
													{translate('Copy Address')}
												</StyledText>
											</Col>
										</Row>,
										<Row>
											<Col>
												<CheckCircleTwoTone
													key="copied-icon"
													twoToneColor="#52c41a"
												/>
											</Col>
											<Col>
												<StyledText
													mobile={`${mobile}`}
												>
													{translate(
														'Address Copied',
													)}
													!
												</StyledText>
											</Col>
										</Row>,
									],
									text: `${account}`,
									tooltips: false,
								}}
							/>
						</StyledRow>
						<StyledRow>
							<StyledBlockOutlined />
							<StyledText mobile={`${mobile}`}>
								<a
									href={explorerUrl}
									rel="noopener noreferrer"
									target="_blank"
								>
									{translate('View on Etherscan')}
								</a>
							</StyledText>
						</StyledRow>
						<StyledRow>
							<CheckCircleTwoTone twoToneColor="#52c41a" />{' '}
							<StyledText mobile={`${mobile}`}>
								{friendlyNetworkName}
							</StyledText>
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

const StyledRow = styled(Row)<{ mobile?: string }>`
	display: flex;
	align-items: center;
	margin-bottom: ${(props) => (props.mobile === 'true' ? '10' : '10')}px;
	margin-right: 10px;
`
const StyledText = styled.div<{ mobile?: string }>`
	color: ${(props) => props.theme.secondary.font};
	text-align: center;
	font-size: ${(props) => (props.mobile === 'true' ? '1.1' : '1')}em;
	margin-left: 10px;
`

const StyledCol = styled(Col)`
	margin-bottom: 5px;
	padding-left: 15px;
	padding-right: 5px;
`

const AccountText = styled.div`
	color: ${(props) => props.theme.secondary.font};
	font-weight: bold;
	font-size: 1.2em;
	margin-left: -8px;
`

const AccountIdText = styled.div`
	color: ${(props) => props.theme.secondary.font};
	font-weight: bold;
	font-size: 1em;
	color: #016eac;
	border: 1.5px solid #016eac;
	border-radius: 20px;
	padding: 2px 10px;
	margin-left: 10px;
`

const StyledBlockOutlined = styled(BlockOutlined)`
	${(props) => (props.theme.type === 'dark' ? 'color: white;' : '')}
`
