import { jsonRpcProvider } from "./rpcConnection";
import { webSocketProvider } from "./wsConnection";
import { prefixes } from "./prefixes";
import { ethers } from "ethers";
import abi from "./erc20Abi.json"; 

function parseTransactionData(tx: ethers.TransactionResponse | null) {
    if (tx !== null && typeof tx.data !== "undefined") {
        const calldataSelector = tx.data.substring(0, 10); 
        const functionFragment = prefixes.get(calldataSelector);
        if (functionFragment) {
            const iface = new ethers.Interface([functionFragment]);
            const decodedData = iface.decodeFunctionData(functionFragment, tx.data);
            return [functionFragment.name, decodedData];
        }
    }
}

const alchemyProvider = new ethers.AlchemyProvider("mainnet", "MLPsNWnRXK3iDwR_sWSmBu18XcwzxL6g");
async function listenTxPool() {
    webSocketProvider.on("pending", async (tx_hash: string) => {
        let tx = await webSocketProvider.getTransaction(tx_hash);
        
        let res = parseTransactionData(tx);
        console.log("res: ", res)

    })
}

listenTxPool().catch((e) => {
    console.error(e)
})