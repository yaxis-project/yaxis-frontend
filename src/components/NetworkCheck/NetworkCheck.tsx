import React, { useMemo } from 'react'
import { useWeb3React } from "@web3-react/core"
import { Modal } from 'antd';
import { SUPPORTED_NETWORKS, NETWORK_NAMES, WALLET_CONNECT_SUPPORTED_NETWORKS } from "../../connectors"

const NetworkCheck: React.FC = ({ children }) => {
    const { chainId, active, connector } = useWeb3React()
    const wrongWCNetwork = useMemo(() => {
        const wcNetwork = connector?.['walletConnectProvider']?.['chainId']
        return wcNetwork && !WALLET_CONNECT_SUPPORTED_NETWORKS.includes(wcNetwork)
    }, [connector])
    const visible = useMemo(() => (active && !SUPPORTED_NETWORKS.includes(chainId)) || wrongWCNetwork, [active, chainId, wrongWCNetwork])

    return <>
        {children}
        <Modal
            closable={false}
            visible={visible}
            title={"Unsupported Network"}
            footer={null}
        >
            {wrongWCNetwork ?
                <div>Wallet Connect only supports Ethereum mainnet. Please switch networks.</div>
                :
                <>
                    <div>Please switch to one of the following Ethereum networks</div>
                    {
                        SUPPORTED_NETWORKS.map(n => {
                            const name = NETWORK_NAMES[n]
                            return <div key={n}>{name && (name[0].toUpperCase() + name.slice(1))}</div>
                        })
                    }
                </>
            }
        </Modal>
    </>
}

export default NetworkCheck
