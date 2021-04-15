import React from 'react'
import styled from 'styled-components'
import { Tooltip as BaseTooltip, TooltipProps as BaseTooltipProps } from 'antd'
import { isMobile } from 'react-device-detect'

const StyledTooltip = styled(BaseTooltip)``

export type TooltipProps = BaseTooltipProps

const Tooltip: React.FC<TooltipProps> = ({ children, ...rest }) => (
	<StyledTooltip
		placement="bottom"
		defaultVisible={isMobile}
		trigger={isMobile ? 'click' : 'hover'}
		{...rest}
	>
		{children}
	</StyledTooltip>
)

export default Tooltip
