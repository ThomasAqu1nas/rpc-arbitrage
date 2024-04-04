import { ethers } from "ethers";

export const ipcProvider = new ethers.IpcSocketProvider("/home/ando/.ethereum/sepolia/geth.ipc");
