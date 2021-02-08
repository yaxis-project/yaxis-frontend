import React from 'react'
import styled from 'styled-components'

interface CardProps {
  children: React.ReactNode;
  height?: string;
}

const Card: React.FC<CardProps> = ({
  height,
  children,
}) => (
  <StyledCard height={height}>{children}</StyledCard>
)

const StyledCard = styled.div<{ height?: string }>`
  height: ${({ height }) => height ?? '100%'};
  background: none;
  border: 1px solid #373E50;
  padding: 14px !important;
  box-shadow: 0px 2px 4px 2px #151923;
  border-radius: ${(props) => props.theme.radiusBase}px;
  transition: box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  background-color: #202635;
  display: flex;
  flex: 1;
  flex-direction: column;
`

export default Card
