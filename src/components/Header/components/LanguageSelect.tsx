import React from 'react'
import styled from 'styled-components'
import { Menu, Row, Col } from 'antd'
import { CaretDownOutlined } from '@ant-design/icons'
import { useLanguage, useSetLanguage } from '../../../state/user/hooks'
import { TLanguages, LanguagesDisplay } from '../../../constants/translations'
import useTranslation from '../../../hooks/useTranslation'
import Typography from '../../Typography'

const { Text } = Typography

type Props = {
	//
}

const Button: React.FC<Props> = () => {
	const language = useLanguage()
	const setLanguage = useSetLanguage()
	const translate = useTranslation()

	return (
		<Row>
			<StyledMenu mode="horizontal">
				<StyledSubMenu
					key="language-select"
					title={
						<LanguageSelector align="middle">
							<Col>
								{language.slice(0, 1)}
								{language.slice(1, 2).toLowerCase()}
							</Col>
							<Col>
								<CaretDownOutlined
									style={{ paddingLeft: '1px' }}
								/>
							</Col>
						</LanguageSelector>
					}
					popupOffset={[-50, 5]}
				>
					{Object.values(LanguagesDisplay)
						.filter(({ key }) => key !== language)
						.map(({ key, flag, name }) => (
							<Menu.Item
								key={key}
								onClick={() =>
									setLanguage(key.toUpperCase() as TLanguages)
								}
							>
								<Row align="middle" gutter={10}>
									<Col
										style={{
											fontSize: '26px',
										}}
									>
										{flag}
									</Col>
									<Col>
										<Text>{translate(name)}</Text>
									</Col>
								</Row>
							</Menu.Item>
						))}
				</StyledSubMenu>
			</StyledMenu>
		</Row>
	)
}

export default Button

const StyledMenu = styled(Menu)`
	border-bottom: none;
	background: none;
	color: ${(props) => props.theme.colors.white} !important;
	font-weight: 600;
	font-size: 18px;
	text-decoration: none;
`

const StyledSubMenu = styled(Menu.SubMenu)`
	padding: 0 !important;
	width: 40px;
`

const LanguageSelector = styled(Row)`
	-webkit-user-select: none; /* Safari */
	-moz-user-select: none; /* Firefox */
	-ms-user-select: none; /* IE10+/Edge */
	user-select: none; /* Standard */
`
