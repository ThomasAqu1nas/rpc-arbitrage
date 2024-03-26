import { FunctionFragment } from "ethers";

export const prefixes: Map<string, FunctionFragment> = new Map<string, FunctionFragment>([
    ["0x41060ae0", FunctionFragment.from({
        "inputs": [
            {
                "components": [
                    {
                        "internalType": "address",
                        "name": "tokenIn",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "tokenOut",
                        "type": "address"
                    },
                    {
                        "internalType": "uint24",
                        "name": "fee",
                        "type": "uint24"
                    },
                    {
                        "internalType": "address",
                        "name": "recipient",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "deadline",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amountIn",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amountOutMinimum",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint160",
                        "name": "sqrtPriceLimitX96",
                        "type": "uint160"
                    }
                ],
                "internalType": "struct ISwapRouter.ExactInputSingleParams",
                "name": "params",
                "type": "tuple"
            }
        ],
        "name": "exactInputSingle",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "amountOut",
                "type": "uint256"
            }
        ],
        "stateMutability": "payable",
        "type": "function"
    })],
    ["0xdb833ebc", FunctionFragment.from({
        "inputs": [
            {
                "components": [
                    {
                        "internalType": "address",
                        "name": "tokenIn",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "tokenOut",
                        "type": "address"
                    },
                    {
                        "internalType": "uint24",
                        "name": "fee",
                        "type": "uint24"
                    },
                    {
                        "internalType": "address",
                        "name": "recipient",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "deadline",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amountOut",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amountInMaximum",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint160",
                        "name": "sqrtPriceLimitX96",
                        "type": "uint160"
                    }
                ],
                "internalType": "struct ISwapRouter.ExactOutputSingleParams",
                "name": "params",
                "type": "tuple"
            }
        ],
        "name": "exactOutputSingle",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "amountIn",
                "type": "uint256"
            }
        ],
        "stateMutability": "payable",
        "type": "function"
    })],
    ["0x41f9ad65", FunctionFragment.from({
        "inputs": [
            {
                "components": [
                    {
                        "internalType": "bytes",
                        "name": "path",
                        "type": "bytes"
                    },
                    {
                        "internalType": "address",
                        "name": "recipient",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "deadline",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amountIn",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amountOutMinimum",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct ISwapRouter.ExactInputParams",
                "name": "params",
                "type": "tuple"
            }
        ],
        "name": "exactInput",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "amountOut",
                "type": "uint256"
            }
        ],
        "stateMutability": "payable",
        "type": "function"
    })],
    ["0x583cd00b", FunctionFragment.from({
        "inputs": [
            {
                "components": [
                    {
                        "internalType": "bytes",
                        "name": "path",
                        "type": "bytes"
                    },
                    {
                        "internalType": "address",
                        "name": "recipient",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "deadline",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amountOut",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amountInMaximum",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct ISwapRouter.ExactOutputParams",
                "name": "params",
                "type": "tuple"
            }
        ],
        "name": "exactOutput",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "amountIn",
                "type": "uint256"
            }
        ],
        "stateMutability": "payable",
        "type": "function"
    })],
    ["0x128acb08", FunctionFragment.from({
        "inputs": [
            {
                "internalType": "address",
                "name": "recipient",
                "type": "address"
            },
            {
                "internalType": "bool",
                "name": "zeroForOne",
                "type": "bool"
            },
            {
                "internalType": "int256",
                "name": "amountSpecified",
                "type": "int256"
            },
            {
                "internalType": "uint160",
                "name": "sqrtPriceLimitX96",
                "type": "uint160"
            },
            {
                "internalType": "bytes",
                "name": "data",
                "type": "bytes"
            }
        ],
        "name": "swap",
        "outputs": [
            {
                "internalType": "int256",
                "name": "amount0",
                "type": "int256"
            },
            {
                "internalType": "int256",
                "name": "amount1",
                "type": "int256"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    })],
    ["0x3593564c", FunctionFragment.from({
        "inputs": [
            {
                "internalType": "bytes",
                "name": "commands",
                "type": "bytes"
            },
            {
                "internalType": "bytes[]",
                "name": "inputs",
                "type": "bytes[]"
            },
            {
                "internalType": "uint256",
                "name": "deadline",
                "type": "uint256"
            }
        ],
        "name": "execute",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    })],
])