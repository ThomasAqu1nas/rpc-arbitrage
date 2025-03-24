import { task } from "hardhat/config";
import networks from "../networks.json";
import fs from "fs";

task("deployExecutor", "deploy executor contract")
	.addParam("networkName", "Name of network to deploy to")
	.setAction(async ({ networkName }, { ethers }) => {
		if (!Object.keys(networks).includes(networkName)) throw "NOT VALID NETWORK NAME";

		const network: keyof typeof networks = networkName;

		const [deployer] = await ethers.getSigners();

		console.log("Deploying contracts with the account:", deployer.address);

		const Executor = await ethers.getContractFactory("Executor");

		const executor = await Executor.deploy(networks[network].factory, networks[network].wNative);

		console.log("New executor address:", executor.address);

		networks[network]["executor"] = executor.address;

		const updated = JSON.stringify(networks, null, 2);

		fs.writeFileSync("networks.json", updated);
	});
