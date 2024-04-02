import { prefixes } from "./prefixes";
import { ethers } from "ethers";
import { commands, DataValueType } from "./commands";
import addresses from "./addresses.json";
import { UniversalRouter } from "./Factories";
import { getTransactions } from "./read";

const abi = new ethers.AbiCoder();

export function parse(tx: ethers.TransactionResponse) {
	const selector = tx.data.substring(0, 10);
	const to = tx.to;

	if (addresses.mainnet.uniswap.universalRouter === to && selector === "0x24856bc3") {
		const parsed = UniversalRouter.interface.parseTransaction(tx)!.args;

		const commandBytes = ethers.getBytes(parsed[0]);

		console.log("TRANSACTION:", tx, "\n");
	} else if (addresses.mainnet.uniswap.universalRouter === to && selector === "0x3593564c") {
		const parsed = UniversalRouter.interface.parseTransaction(tx)!.args;

		const commandBytes = ethers.getBytes(parsed[0]);

		commandBytes.forEach((byte, id) => {
			const command_id = byte & 0x1f; // 00011111
			const command_value = commands.get(command_id);

			console.log(command_value);

			if (command_id == 0 || command_id == 1) {
				const encoded = parsed[1][id];

				

                if (command_value) {
                    const decoded = abi.decode(command_value!.iface, parsed[1][id]);
                    const paths = decoded[3];
                    let hexified_paths = ethers.toBeHex(paths)
                    let i = 0;
                    while (hexified_paths !== "") {
                        if (i % 2 === 0) {
                            const paths_array = []
                            let [rest, current] = [
                                hexified_paths.substring(0, hexified_paths.length - 23), 
                                hexified_paths.substring(hexified_paths.length)
                            ]
                            hexified_paths = rest;
                            
                            
                        }
                    }
                    //console.log(decoded);
                }
                

				// decoded[3] - строка адресов

				// const paths = decoded[3];
				// console.log("##################################################");
				// console.log("encoded: ", encoded);
				// console.log("-------------------------------------------------");
				// console.log("decoded: ", decoded);
				// console.log("##################################################");

				// console.log(args);
			}
		});
	}
}

/**
 * execute(bytes,bytes[]) -> 0x24856bc3
 * execute(bytes,bytes[],uint256) -> 0x3593564c
 */

async function listenTxPool() {
	const txs = await getTransactions();

	for (const tx of txs) {
		parse(tx);
	}

	// ipcProvider.on("pending", async (tx_hash: string) => {
	// 	let tx = await ipcProvider.getTransaction(tx_hash);
	// 	if (tx) parse(tx);
	// if (parsed_data) {
	//     const [name, data] = parsed_data;
	//     if (name == "execute") {
	//         const commands_hex_string: string = data[0];
	//         let commands_bytes = ethers.getBytes(commands_hex_string);

	//         commands_bytes.forEach((byte, id) => {
	//             const command_id = byte & 0x1f; // 00011111
	//             const command_value = commands.get(command_id)

	//             if (command_value) {
	//                 if (command_value.type === 0) {
	//                     const encoded = data[1][id];

	//                     const decoded = abi_coder.decode(command_value.iface, data[1][id]);
	//                     //const paths = decoded[3];
	//                     console.log("##################################################");
	//                     console.log("encoded: ", encoded)
	//                     console.log("-------------------------------------------------");
	//                     console.log("decoded: ", decoded)
	//                     console.log("##################################################");

	//                     // console.log(args);
	//                 }
	//             }
	//         })
	//     }
	// }
	// });
}

listenTxPool().catch((e) => {
	console.error(e);
});
