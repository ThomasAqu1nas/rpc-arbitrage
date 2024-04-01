import { readFile } from "fs";
import { promisify } from "util";

// Преобразуем readFile в версию, которая возвращает Promise
const readFileAsync = promisify(readFile);

interface Transaction {
	data?: string;
}

const filePath = "./transactions.json";

async function getTransactionData() {
	try {
		const data = await readFileAsync(filePath);
		const transactions: Transaction[] = JSON.parse(data.toString());

		const transactionData = transactions.map((tx: Transaction) => (tx.data ? tx.data : "Поле data отсутствует"));
		return transactionData;
	} catch (error: any) {
		console.error("Ошибка:", error.message);
		throw error;
	}
}

getTransactionData().then((data) => console.log(data));
