import { ethers } from "hardhat";

async function main() {
	const [deployer] = await ethers.getSigners();

	console.log("Deploying contracts with the account:", deployer.address);

	const ArbitrageOracle = await ethers.getContractFactory("ArbitrageDetector");
	const arbitrage = await ArbitrageOracle.deploy();

	console.log("Oracle address:", arbitrage.address);
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
