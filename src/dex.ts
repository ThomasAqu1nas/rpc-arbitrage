import { ethers } from "ethers";

export type Pool = {
	token0: string;
	token1: string;
	fee: ethers.BigNumberish;
};

export type SwapRoute = Pool[];
