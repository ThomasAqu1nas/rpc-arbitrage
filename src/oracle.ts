import { ethers } from "ethers";
import { Oracle, Oracle__factory } from "../typechain-types";
import dotenv from "dotenv";
import { ipcProvider } from "../scripts/ipcConnection";
dotenv.config();

export const oracle = new ethers.BaseContract(
	process.env.ORACLE_ADDRESS as string,
	Oracle__factory.abi,
	ipcProvider
) as Oracle;
