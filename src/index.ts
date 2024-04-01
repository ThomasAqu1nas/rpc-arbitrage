import { prefixes } from "./prefixes";
import { ethers } from "ethers";
import { commands, DataValueType } from "./commands";
import addresses from "./addresses.json";
import { UniversalRouter } from "./Factories";
import { getTransactions } from "./read";

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

const abi = new ethers.AbiCoder();

export function parse(tx: ethers.TransactionResponse) {
	const selector = tx.data.substring(0, 10);
	const to = tx.to;

	if (addresses.mainnet.uniswap.universalRouter === to && selector === "0x24856bc3") {
		const parsed = UniversalRouter.interface.parseTransaction(tx)!.args;

		const commandBytes = ethers.getBytes(parsed[0]);

		console.log(commands);

		console.log(parsed);
	} else if (addresses.mainnet.uniswap.universalRouter === to && selector === "0x3593564c") {
		const parsed = UniversalRouter.interface.parseTransaction(tx)!.args;

		console.log("TRANSACTION:", tx);

		const commandBytes = ethers.getBytes(parsed[0]);

		commandBytes.forEach((byte, id) => {
			const command_id = byte & 0x1f; // 00011111
			const command_value = commands.get(command_id);

			console.log(command_value);

			if (command_value) {
				if (command_value.type === 0) {
					const encoded = parsed[1][id];

					const decoded = abi.decode(command_value.iface, parsed[1][id]);
					//const paths = decoded[3];
					console.log("##################################################");
					console.log("encoded: ", encoded);
					console.log("-------------------------------------------------");
					console.log("decoded: ", decoded);
					console.log("##################################################");

					// console.log(args);
				}
			}

			console.log(parsed);
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
