import {ethers} from "ethers";
import dotenv from "dotenv";

dotenv.config();
export const jsonRpcProvider = new ethers.JsonRpcProvider(
    process.env.RPC_URL as string
)