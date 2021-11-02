import React from 'react'
import styled from 'styled-components'
import { Dropdown, Menu, Row, Col } from 'antd'
import { CaretDownOutlined } from '@ant-design/icons'
import { useLanguage, useSetLanguage } from '../../../state/user/hooks'
import { TLanguages, LanguagesDisplay } from '../../../constants/translations'
import useTranslation from '../../../hooks/useTranslation'
import Typography from '../../Typography'

const { Text } = Typography

type Props = {}

const Button: React.FC<Props> = () => {
	const language = useLanguage()
	const setLanguage = useSetLanguage()
	const translate = useTranslation()
	return (
		<Row
			style={{
				margin: '0 10px',
			}}
		>
			<StyledDropdown
				placement="bottomCenter"
				overlay={
					<StyledMenu>
						{Object.values(LanguagesDisplay)
							.filter(({ key }) => key !== language)
							.map(({ key, flag, name }) => (
								<Menu.Item
									onClick={() =>
										setLanguage(
											key.toUpperCase() as TLanguages,
										)
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
					</StyledMenu>
				}
			>
				<Row align="middle">
					<Col>{language}</Col>
					<Col>
						<CaretDownOutlined style={{ paddingLeft: '1px' }} />
					</Col>
				</Row>
			</StyledDropdown>
		</Row>
	)
}

export default Button

const StyledMenu = styled(Menu)`
	background: ${(props) => props.theme.primary.background};
	padding: 8px;
	color: ${(props) => props.theme.primary.main};
`
const StyledDropdown = styled(Dropdown)`
	font-size: 1rem;
	color: white;
`
