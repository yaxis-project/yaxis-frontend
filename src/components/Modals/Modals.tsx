import React from 'react'
import * as AllModals from './Modal'

const modals = Object.values(AllModals).map((M) => <M />)
const Modals: React.FC = () => <>{modals}</>

export default Modals
