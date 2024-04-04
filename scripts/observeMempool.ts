import { ethers } from "ethers";

const wesocket = new ethers.WebSocketProvider(
	"wss://dry-holy-gadget.matic.quiknode.pro/99b4ecef5962cdd432307782c1708c4672b3ad67/"
);
const provider = new ethers.JsonRpcProvider(
	"https://dry-holy-gadget.matic.quiknode.pro/99b4ecef5962cdd432307782c1708c4672b3ad67/"
);

function init() {
	wesocket.on("queued", async (hash: string) => {
		try {
			const tx = await provider.getTransaction(hash);
			console.log(tx);
				
		} catch (err) {
			console.log(err);
		}
	});
}

init();
