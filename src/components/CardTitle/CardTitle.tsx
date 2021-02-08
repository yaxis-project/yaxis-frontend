import React from 'react'
import styled from 'styled-components'
import {white} from "../../theme/colors";

interface CardTitleProps {
  text?: string
}

const CardTitle: React.FC<CardTitleProps> = ({ text }) => (
  <StyledCardTitle>{text}</StyledCardTitle>
)

const StyledCardTitle = styled.div`
  color: ${(props) => props.theme.color.white};
  font-size: 14px;
  font-weight: 700;
  padding: ${(props) => props.theme.spacing[4]}px;
  text-align: center;
`

export default CardTitle
