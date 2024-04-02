import { ethers } from "ethers";
import { FeeAmount } from "@uniswap/v3-sdk";

export type Pool = {
	token0: string;
	token1: string;
	fee: FeeAmount;
};

export type SwapRoute = Pool[];
