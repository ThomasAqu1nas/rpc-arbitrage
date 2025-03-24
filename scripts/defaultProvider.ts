import { ethers } from "hardhat";

const url = "https://polygon-mainnet.g.alchemy.com/v2/tSfIc0YuyvrGkNUwsWRuGQC8xfSeHSlg"; //  https://polygon-mainnet.g.alchemy.com/v2/tSfIc0YuyvrGkNUwsWRuGQC8xfSeHSlg https://eth.bd.evmos.org:8545

const defaultProvider = new ethers.providers.JsonRpcProvider(url);

export default defaultProvider;
