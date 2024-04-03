import { keccak256, defaultAbiCoder, solidityKeccak256 } from "ethers/lib/utils";
import { BigNumber } from "ethers";

const POOL_INIT_CODE_HASH = "0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54";
const FACTORY = "0xf544365e7065966f190155F629cE0182fC68Eaa2"; // 0x1F98431c8aD98523631AE4a59f267346ea31F984
export function getPoolAddress(token0: string, token1: string, fee: number) {
	if (BigNumber.from(token0).gt(BigNumber.from(token1))) {
		let temp = token0;
		token0 = token1;
		token1 = temp;
	}

	let PKEncode = keccak256(defaultAbiCoder.encode(["address", "address", "uint24"], [token0, token1, fee]));
	let encodePacked = solidityKeccak256(["bytes1", "address", "bytes32", "bytes32"], [255, FACTORY, PKEncode, POOL_INIT_CODE_HASH]);
	return "0x" + encodePacked.substring(26, 67);
}
