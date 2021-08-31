import React from 'react'
import * as AllModals from './Modal'

const modals = Object.values(AllModals).map((M, i) => <M key={`Modal-${i}`} />)
const Modals: React.FC = () => <>{modals}</>

export default Modals
