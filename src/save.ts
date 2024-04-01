import fs from "fs"
import { ipcProvider } from "./ipcConnection";
import { TransactionResponse } from "ethers";
// Путь к файлу, в который будут сохраняться данные
const filePath = './transactions.json';

// Функция для сохранения транзакции в JSON файл
function saveTransaction(tx: TransactionResponse) {
    fs.readFile(filePath, (err, data) => {
        let transactions = [];
        if (!err) {
            try {
                transactions = JSON.parse(data.toString());
            } catch (e: any) {
                console.error("Ошибка при парсинге JSON:", e.message);
                // Вы можете решить сохранить текущую транзакцию в новый файл или принять другие меры
            }
        }
        transactions.push(tx);
        fs.writeFile(filePath, JSON.stringify(transactions, null, 2), (err) => {
            if (err) throw err;
            console.log('Транзакция успешно добавлена.');
        });
    });
}


// Дополняем исходный код
ipcProvider.on("pending", async (tx_hash: string) => {
    let tx = await ipcProvider.getTransaction(tx_hash);
    // Сохраняем полученную транзакцию в файл
    if (tx) saveTransaction(tx);
});
