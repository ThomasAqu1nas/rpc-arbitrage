import fs from "fs";
import addresses from "../addresses.json";

type TupleArray = (string | number)[][];
type ObjectArray = { token0: string; token1: string; fee1: number; fee2: number }[];

const transformArray = (input: TupleArray): ObjectArray => {
	return input.map(([token0, token1, fee1, fee2]) => ({
		token0,
		token1,
		fee1,
		fee2,
	}));
};

const saveToJsonFile = (data: ObjectArray, filePath: string): void => {
	const jsonData = JSON.stringify(data, null, 2);

	console.log(jsonData);
	fs.writeFile(filePath, jsonData, (err) => {
		if (err) {
			console.error("Error writing to file:", err);
		} else {
			console.log(`Data saved to ${filePath}`);
		}
	});
};

// Example usage
const tupleArray: TupleArray = addresses.matic;

const transformedArray = transformArray(tupleArray);

// Specify the JSON file path
const filePath = "./transformedData.json";

// Save the transformed array to a JSON file
saveToJsonFile(transformedArray, filePath);
