import { ethers } from "hardhat";
import pools from "../addresses.json";
import networks from "../networks.json";

// initialize and connect to the api
import { Core } from "@quicknode/sdk";

import { Executor__factory, Executor } from "../typechain-types";
import { config } from "dotenv";
config();

const defaultProvider = new ethers.providers.JsonRpcProvider(networks.matic.rpc);

const operator = new ethers.Wallet(process.env.PRIVATE_KEY, defaultProvider);

const core = new Core({
	endpointUrl: "https://misty-practical-layer.matic.quiknode.pro/a4e06d0505147df3a0a97edcba116cf97d207e19/",
});

const executor = new ethers.Contract(networks.matic.executor, Executor__factory.abi, operator) as Executor;

async function findOpportunity() {
	const pools_ = pools.matic as [string, string, number, number][];

	while (true) {
		for (let i = 0; i < pools_.length; i++) {
			console.log("\n");
			console.log(pools_[i]);

			const params = {
				token0: pools_[i][0],
				token1: pools_[i][1],
				fee1: pools_[i][2],
				fee2: pools_[i][3],
			};

			try {
				const gas = await core.client.estimateContractGas({
					address: networks.matic.executor as `0x${string}`,
					abi: Executor__factory.abi,
					functionName: "initArbitrage",
					args: params as any,
					account: "0x727540700F83f08495fe062B2cCEd0545023246D",
				});

				console.log(gas);
			} catch (err: any) {
				console.log(`failure \n`);
				console.log(err);
				continue;
			}
		}
	}
}

findOpportunity()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
