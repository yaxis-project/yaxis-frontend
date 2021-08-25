import React from 'react'
import styled from 'styled-components'
import { Dropdown, Menu } from 'antd'
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
	const t = useTranslation()
	return (
		<StyledDropdown
			placement="bottomCenter"
			overlay={
				<StyledMenu>
					{Object.values(LanguagesDisplay)
						.filter(({ key }) => key !== language)
						.map(({ key, flag, name }) => (
							<Menu.Item
								onClick={() =>
									setLanguage(key.toUpperCase() as TLanguages)
								}
							>
								<Text>
									<span style={{ paddingRight: '5px' }}>
										{flag}
									</span>
									{t[name]}
								</Text>
							</Menu.Item>
						))}
				</StyledMenu>
			}
		>
			<div>
				{language}
				<CaretDownOutlined style={{ paddingLeft: '1px' }} />
			</div>
		</StyledDropdown>
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
