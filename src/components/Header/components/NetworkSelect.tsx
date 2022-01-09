import React from 'react'
import styled from 'styled-components'
import { Menu, Row, Col } from 'antd'
import { CaretDownOutlined } from '@ant-design/icons'
import { useChain, useSetChain } from '../../../state/user/hooks'
import { SupportedChainId, CHAIN_INFO } from '../../../constants/chains'
import useTranslation from '../../../hooks/useTranslation'
import { switchToNetwork } from '../../../utils/switchToNetwork'
import Typography from '../../Typography'

const { Text } = Typography

type Props = {}

const Button: React.FC<Props> = () => {
    const chainId = useChain()
    const setChainId = useSetChain()
    const translate = useTranslation()
    const blockchain = CHAIN_INFO[chainId]

    return (
        <Row>
            <StyledMenu mode="horizontal">
                <StyledSubMenu
                    key="language-select"
                    title={
                        <NetworkSelector align="middle">
                            <Col>
                                {blockchain.label}
                            </Col>
                            {/* <Col>
                                <CaretDownOutlined
                                    style={{ paddingLeft: '1px' }}
                                />
                            </Col> */}
                        </NetworkSelector>
                    }
                    popupOffset={[-50, 5]}
                >

                    <Menu.Item
                        key={SupportedChainId.ETHEREUM_MAINNET}
                        onClick={() => {
                            // setChainId(key.toUpperCase())
                            // switchToNetwork()
                        }
                        }
                    >
                        <Row align="middle" gutter={10}>
                            <Col
                                style={{
                                    fontSize: '26px',
                                }}
                            >
                                {/* {flag} */}
                            </Col>
                            <Col>
                                <Text>{CHAIN_INFO[SupportedChainId.ETHEREUM_MAINNET].label}</Text>
                            </Col>
                        </Row>
                    </Menu.Item>
                </StyledSubMenu>
            </StyledMenu>
        </Row>
    )
}

export default Button

const StyledMenu = styled(Menu)`
width: 100px;
	border-bottom: none;
	background: none;
	color: ${(props) => props.theme.colors.white} !important;
	font-weight: 600;
	font-size: 14px;
	text-decoration: none;
`

const StyledSubMenu = styled(Menu.SubMenu)`
	padding: 0 !important;
	width: 40px;
`

const NetworkSelector = styled(Row)`
	-webkit-user-select: none; /* Safari */
	-moz-user-select: none; /* Firefox */
	-ms-user-select: none; /* IE10+/Edge */
	user-select: none; /* Standard */
`
