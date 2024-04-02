import { ethers } from "ethers";

export interface Pool {
	token0: string;
	token1: string;
	fee: ethers.BigNumberish;
}

export interface SwapRoute {
	route: Pool[];
	hops?: number;
}
