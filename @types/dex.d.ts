import { ethers } from "ethers";

type Pool = {
	token0: string;
	token1: string;
	fee: ethers.BigNumberish;
};

type SwapRoute = {
	route: Pool[];
	hops?: number;
};
