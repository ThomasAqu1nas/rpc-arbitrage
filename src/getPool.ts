import { computePoolAddress } from "@uniswap/v3-sdk";
import { Token } from "@uniswap/sdk-core";
import addresses from "./addresses.json";
import { Pool } from "./dex";

export default function getPool(pool: Pool) {
	const tokenA = new Token(1, pool.token0, 0);
	const tokenB = new Token(1, pool.token1, 0);

	return computePoolAddress({
		factoryAddress: addresses.mainnet.uniswap.v3Factory,
		tokenA,
		tokenB,
		fee: pool.fee,
	});
}
