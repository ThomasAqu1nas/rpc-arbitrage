import { HDNodeWallet, Wallet } from "ethers";
import { ipcProvider } from "./ipcConnection";
import dotenv from "dotenv";
dotenv.config();

export type TWallet = {
	pk: string;
	addr: string;
};

export function getWallet(): HDNodeWallet {
	return Wallet.createRandom();
}

// const wallet = getWallet();

// console.log("mnemonic:", wallet.mnemonic?.phrase);
// console.log("private key:", wallet.privateKey);
// console.log("address:", wallet.address);

export function wallet(): Wallet {
	return new Wallet(process.env.OPERATOR_PK as string, ipcProvider);
}
