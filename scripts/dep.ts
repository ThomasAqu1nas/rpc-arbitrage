import { ContractFactory, ethers } from "ethers";
import { Oracle__factory } from "../typechain-types";
import dotenv from "dotenv";
import { wallet } from "./getWallet";
dotenv.config();

async function main() {
	console.log("Deploying contracts with the account:", process.env.OPERATOR_ADDRESS);

	const Oracle = new ContractFactory(Oracle__factory.abi, Oracle__factory.bytecode, wallet());
	const oracle = await Oracle.deploy();

	await oracle.waitForDeployment();

	console.log("Oracle address:", oracle.target);
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
