import { ethers } from "hardhat";
import pools from "../addresses.json";
import networks from "../networks.json";
import { Oracle__factory, Oracle } from "../typechain-types";
import { Core } from "@quicknode/sdk";

import { Executor__factory, Executor } from "../typechain-types";
import { config } from "dotenv";
config();

const NETWORK = networks.matic;

const defaultProvider = new ethers.providers.JsonRpcProvider(NETWORK.rpc);

const operator = new ethers.Wallet(process.env.PRIVATE_KEY, defaultProvider);

const core = new Core({
	endpointUrl: "https://dry-holy-gadget.matic.quiknode.pro/99b4ecef5962cdd432307782c1708c4672b3ad67/",
});

const executor = new ethers.Contract(networks.matic.executor, Executor__factory.abi, operator) as Executor;

const oracle = new ethers.Contract(NETWORK.oracle, Oracle__factory.abi, defaultProvider) as Oracle;

async function explore() {
	while (true) {
		for (const pool of pools.matic as [string, string, number, number][]) {
			const params = [
				{
					token0: pool[0],
					token1: pool[1],
					fee1: pool[2],
					fee2: pool[3],
				},
			];

			const resp = await core.client.readContract({
				address: NETWORK.oracle as `0x${string}`,
				abi: Oracle__factory.abi,
				functionName: "compute",
				args: params as any,
			});

			if (resp[1]) {
				console.log("POOLS", resp[0].poolA, resp[0].poolB);

				try {
					const gasInfo = await fetch("https://gasstation.polygon.technology/v2");

					const json = await gasInfo.json();

					const maxPriorityFeePerGas = ethers.utils.parseUnits(json.safeLow.maxPriorityFee.toString(), 9);
					const maxFeePerGas = ethers.utils.parseUnits(json.safeLow.maxFee.toString(), 9);

					const gasLimit = await executor.estimateGas.initArbitrage(resp[0], { maxPriorityFeePerGas, maxFeePerGas });

					const tx = await executor.initArbitrage(resp[0], {
						gasLimit,
						maxPriorityFeePerGas,
						maxFeePerGas,
					});

					const response = await tx.wait();

					console.log(response);
				} catch (error: any) {
					console.error(error.reason);
				}

				console.log("\n");
			}
		}
	}
}

explore()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
