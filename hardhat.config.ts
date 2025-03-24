import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import chains from "./networks.json";
import "./tasks/deployExecutor";
import "./tasks/deployOracle";

const config: HardhatUserConfig = {
	solidity: {
		version: "0.7.6",
		settings: {
			optimizer: {
				enabled: true,
				runs: 999999,
			},
		},
	},
	networks: {
		matic: {
			url: chains.matic.rpc,
			accounts: ["6478deef7de442fa81ec98eaf2442da82e4c2baf517ddc88514cc8cf425c486d"],
		},
		evmos: {
			url: chains.evmos.rpc,
			accounts: ["6478deef7de442fa81ec98eaf2442da82e4c2baf517ddc88514cc8cf425c486d"],
		},
	},
};

export default config;
