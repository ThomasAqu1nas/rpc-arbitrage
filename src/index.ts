import { prefixes } from "./prefixes";
import { ethers } from "ethers";
import { commands, DataValueType } from "./commands";
import { ipcProvider } from "./ipcConnection";
import abi from "./erc20Abi.json"; 

let abi_coder = new ethers.AbiCoder();
function parseTransactionData(tx: ethers.TransactionResponse | null): [string, ethers.Result] | undefined {
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


async function listenTxPool() {
    ipcProvider.on("pending", async (tx_hash: string) => {
        let tx = await ipcProvider.getTransaction(tx_hash);
        const parsed_data = parseTransactionData(tx);
        //
        if (parsed_data) {
            const [name, data] = parsed_data;
            if (name == "execute") {
                const commands_hex_string: string = data[0];
                let commands_bytes = ethers.getBytes(commands_hex_string);


                commands_bytes.forEach((byte, id) => {
                    const command_id = byte & 0x1f; // 00011111
                    const command_value = commands.get(command_id)
                    
                    if (command_value) {
                        if (command_value.type === 0) {
                            const encoded = data[1][id];

                            const decoded = abi_coder.decode(command_value.iface, data[1][id]);
                            //const paths = decoded[3];
                            console.log("##################################################");
                            console.log("encoded: ", encoded)
                            console.log("-------------------------------------------------");
                            console.log("decoded: ", decoded)
                            console.log("##################################################");

                            // console.log(args); 
                        }
                    }
                })
            }
        }
    })
}

listenTxPool().catch((e) => {
    console.error(e)
})
