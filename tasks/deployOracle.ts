import { task } from "hardhat/config";
import oracles from "./oracles.json";
import networks from "../networks.json";
import fs from "fs";

task("deployOracle", "deploy oracle contract")
	.addParam("networkName", "Name of network to deploy to")
	.setAction(async ({ networkName }, { ethers }) => {
		if (!Object.keys(oracles).includes(networkName)) throw "NOT VALID NETWORK NAME";

		const network: keyof typeof networks = networkName;

		const [deployer] = await ethers.getSigners();

		console.log("Deploying contracts with the account:", deployer.address);

		const Oracle = await ethers.getContractFactory("Oracle");

		const oracle = await Oracle.deploy(networks[network].factory);

		console.log("New oracle address: ", oracle.address);

		networks[network]["oracle"] = oracle.address;

		const updated = JSON.stringify(networks, null, 2);

		fs.writeFileSync("networks.json", updated);
	});
