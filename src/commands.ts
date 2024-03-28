
export enum DataValueType {
    V3_SWAP_EXACT_IN, V3_SWAP_EXACT_OUT, V2_SWAP_EXACT_IN, V2_SWAP_EXACT_OUT
}

let commands = new Map<number, ExecuteDataValue>()
commands.set(0x00, {
    type: DataValueType.V3_SWAP_EXACT_IN,
    iface: ["address","uint256","uint256","bytes","bool"]
})
commands.set(0x01, {
    type: DataValueType.V3_SWAP_EXACT_OUT,
    iface: ["address","uint256","uint256","bytes","bool"]
})
commands.set(0x08, {
    type: DataValueType.V2_SWAP_EXACT_IN,
    iface: ["address","uint256","uint256","address[]","bool"]
})
commands.set(0x09, {
    type: DataValueType.V2_SWAP_EXACT_OUT,
    iface: ["address","uint256","uint256","address[]","bool"]
})

export {commands};
type ExecuteDataValue = {
    type: DataValueType,
    iface: string[]
}
