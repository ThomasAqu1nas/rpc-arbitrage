import universalRouter from "./artifacts/UniversalRouter.json";
import swapRouter from "./artifacts/SwapRouter.json";
import { ethers } from "ethers";

export const UniversalRouter = new ethers.ContractFactory(universalRouter.abi, universalRouter.bytecode);

export const SwapRouter = new ethers.ContractFactory(swapRouter.abi, swapRouter.bytecode);
