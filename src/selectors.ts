import { ethers } from "ethers";

function getFunctionSelector(functionSignature: string): string {
	const hash = ethers.keccak256(ethers.toUtf8Bytes(functionSignature));
	return hash.slice(0, 10);
}

/**
 * Get the function selector for a given function name in a contract.
 *
 * @param contract - An instance of a contract created with ethers.js
 * @param functionName - The name of the function whose selector you want to retrieve
 * @returns The function selector as a string, or an error message if the function does not exist.
 */
export function getFunctionSelectors(contract: ethers.ContractFactory) {
	const fragments = contract.interface.fragments;

	const functionFragments = fragments.filter((fragment) => fragment.type === "function");

	const selectors = functionFragments.map((fragment) => getFunctionSelector(fragment.format("sighash")));

	return selectors;
}
