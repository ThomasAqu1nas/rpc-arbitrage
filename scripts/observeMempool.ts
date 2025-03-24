import { ethers } from "hardhat";
import addresses from "../addresses.json";

const wesocket = new ethers.providers.WebSocketProvider(
	"wss://dry-holy-gadget.matic.quiknode.pro/99b4ecef5962cdd432307782c1708c4672b3ad67/"
);
const provider = new ethers.providers.JsonRpcProvider(
	"https://dry-holy-gadget.matic.quiknode.pro/99b4ecef5962cdd432307782c1708c4672b3ad67/"
);

function init() {
	wesocket.on("queued", async (hash: string) => {
		try {
			const tx = await provider.getTransaction(hash);
			console.log(tx);
			if (tx?.data)
				for (const pool in addresses)
					if (tx.data.includes(pool[0]) && tx.data.includes(pool[1])) console.log("FOUND");
					else console.log("-");
		} catch (err) {
			console.log(err);
		}
	});

	wesocket._websocket.on("error", async (ep: any) => {
		console.log(`Unable to connect to ${ep.subdomain} retrying in 3s...`);
		setTimeout(init, 3000);
	});
	wesocket._websocket.on("close", async (code: any) => {
		console.log(`Connection lost with code ${code}! Attempting reconnect in 3s...`);
		wesocket._websocket.terminate();
		setTimeout(init, 3000);
	});
}

init();
