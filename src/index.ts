import { prefixes } from "./prefixes";
import { ethers } from "ethers";
import { commands, DataValueType } from "./commands";
import addresses from "./addresses.json";
import { UniversalRouter } from "./Factories";
import { Pool, SwapRoute } from "./dex";
import { computePoolAddress, FeeAmount } from "@uniswap/v3-sdk";
import getPool from "./getPool";
import { ipcProvider } from "../scripts/ipcConnection";
import { oracle } from "./oracle";
import fs from "fs";

const abi = new ethers.AbiCoder();

interface ArbitrageParams {
	poolA: string;
	poolB: string;
}

function parseTokenPath(path: string): SwapRoute {
	let l = 0;
	let r = 86;

	const route: SwapRoute = [];

	while (r <= path.length) {
		const window = path.slice(2).substring(l, r);

		const token0 = "0x" + window.substring(l, l + 40);
		const fee = ethers.toNumber("0x" + window.substring(l + 40, l + 46)) as FeeAmount;
		const token1 = "0x" + window.substring(l + 46, r);

		const pool1: Pool = { token0, token1, fee };

		route.push(pool1);

		l += 46;
		r += 46;
	}

	return route;
}

function getPoolsFromRoute(route: SwapRoute): ArbitrageParams[] {
	const fees = [FeeAmount.LOWEST, FeeAmount.LOW, FeeAmount.MEDIUM, FeeAmount.HIGH];

	const poolPairs: ArbitrageParams[] = [];

	for (const pool1 of route) {
		const pool1Address = getPool(pool1, "sepolia");

		fees.forEach(async (fee) => {
			if (fee === pool1.fee) return;
			const pool2: Pool = {
				token0: pool1.token0,
				token1: pool1.token1,
				fee: fee,
			};

			const pool2Address = getPool(pool2, "sepolia");

			poolPairs.push({ poolA: pool1Address, poolB: pool2Address });
		});
	}

	return poolPairs;
}

export function parse(tx: ethers.TransactionResponse) {
	const selector = tx.data.substring(0, 10);
	const to = tx.to;

	if (addresses.v3.sepolia.universalRouter === to && selector === "0x24856bc3") {
		const parsed = UniversalRouter.interface.parseTransaction(tx)!.args;
	} else if (addresses.v3.mainnet.universalRouter === to && selector === "0x3593564c") {
		const parsed = UniversalRouter.interface.parseTransaction(tx)!.args;

		const commandBytes = ethers.getBytes(parsed[0]);

		commandBytes.forEach(async (byte, id) => {
			const command_id = byte & 0x1f; // 00011111
			const command_value = commands.get(command_id);

			// Uniswap V3
			if (command_id == 0 || command_id == 1) {
				if (command_value) {
					const decoded = abi.decode(command_value!.iface, parsed[1][id]);
					const path: string = decoded[3];

					const route = parseTokenPath(path);

					const poolPairs = getPoolsFromRoute(route);

					for (const poolPair of poolPairs) {
						try {
							console.log("computing", poolPair);
							const response = await oracle.compute(poolPair.poolA, poolPair.poolB);
							console.log(response);

							if (response.arbitrage === false)
								fs.writeFile("./arb.txt", poolPair.poolA + " " + poolPair.poolB, { flag: "a" }, () => {
									console.log("successful write");
								});
						} catch (err) {
							console.error(err);
						}
					}
				}
			}
		});
	}
}

/**
 * execute(bytes,bytes[]) -> 0x24856bc3
 * execute(bytes,bytes[],uint256) -> 0x3593564c
 */

async function listenTxPool() {
	//const txs = await getTransactions();
	ipcProvider.on("pending", async (tx_hash: string) => {
		let tx = await ipcProvider.getTransaction(tx_hash);

		if (tx) {
			parse(tx);
		}
	});
}

listenTxPool().catch((e) => {
	console.error(e);
});
