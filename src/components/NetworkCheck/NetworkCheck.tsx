import React, { useMemo } from 'react'
import { useWeb3React } from "@web3-react/core"
import { Modal } from 'antd';
import { SUPPORTED_NETWORKS, NETWORK_NAMES } from "../../connectors"

const NetworkCheck: React.FC = ({ children }) => {
    const { chainId } = useWeb3React()
    const visible = useMemo(() => !SUPPORTED_NETWORKS.includes(chainId), [chainId])
    return <>
        {children}
        <Modal
            closable={false}
            visible={visible}
            title={"Unsupported Network"}
            footer={null}
        >
            <div>Please switch to one of the following Ethereum networks</div>
            {SUPPORTED_NETWORKS.map(n => {
                const name = NETWORK_NAMES[n]
                return <div>{name && (name[0].toUpperCase() + name.slice(1))}</div>
            })}
        </Modal>
    </>
}

export default NetworkCheck
