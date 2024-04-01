import { readFile } from "fs";
import { promisify } from "util";
import { ethers } from "ethers";

// Преобразуем readFile в версию, которая возвращает Promise
const readFileAsync = promisify(readFile);

const filePath = "./transactions.json";

export async function getTransactions() {
	try {
		const data = await readFileAsync(filePath);
		const transactions: ethers.TransactionResponse[] = JSON.parse(data.toString());

		return transactions;
	} catch (error: any) {
		console.error("Ошибка:", error.message);
		throw error;
	}
}
