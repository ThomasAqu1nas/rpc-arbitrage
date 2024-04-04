import { computePoolAddress } from "@uniswap/v3-sdk";
import { Token } from "@uniswap/sdk-core";
import addresses from "./addresses.json";
import { Pool } from "./dex";

type networks = keyof typeof addresses.v3;

export default function getPool(pool: Pool, net: networks = "mainnet") {
	const tokenA = new Token(1, pool.token0, 0);
	const tokenB = new Token(1, pool.token1, 0);

	return computePoolAddress({
		factoryAddress: addresses.v3[net].factory,
		tokenA,
		tokenB,
		fee: pool.fee,
	});
}
