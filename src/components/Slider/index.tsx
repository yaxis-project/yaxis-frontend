import { Slider } from 'antd'
import styled from 'styled-components'

const StyledSlider = styled<any>(Slider)`
	.ant-slider-track {
		background: ${(props) => props.theme.secondary.main};
	}
`
export default StyledSlider
