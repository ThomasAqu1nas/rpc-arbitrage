import {ethers} from "ethers";
import dotenv from "dotenv";

dotenv.config();
export const webSocketProvider = new ethers.WebSocketProvider(
    process.env.WS_URL as string
)