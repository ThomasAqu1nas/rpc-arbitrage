// SPDX-License-Identifier: MIT
pragma solidity >=0.7.6;
pragma abicoder v2;

import "@uniswap/v3-periphery/contracts/interfaces/external/IWETH9.sol";
import "@uniswap/v3-core/contracts/libraries/LowGasSafeMath.sol";
import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";
import "@uniswap/v3-core/contracts/interfaces/callback/IUniswapV3SwapCallback.sol";
import "@uniswap/v3-periphery/contracts/libraries/CallbackValidation.sol";
import "@uniswap/v3-core/contracts/libraries/TickMath.sol";
import "@uniswap/v3-core/contracts/interfaces/IERC20Minimal.sol";
import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol";

contract Executor {
    address immutable W_NATIVE;
    address payable public operator;
    address immutable FACTORY;

    bool arbDone;

    struct ArbitrageInfo {
        IUniswapV3Pool poolA;
        IUniswapV3Pool poolB;
        address token0;
        address token1;
        uint160 priceA;
        uint160 priceB;
    }

    modifier onlyOwner() {
        require(msg.sender == operator, "Executor: Access denied");
        _;
    }

    constructor(address _factory, address wNative) {
        operator = payable(msg.sender);
        W_NATIVE = wNative;
        FACTORY = _factory;
    }

    function uniswapV3SwapCallback(int256 amount0Delta, int256 amount1Delta, bytes calldata _data) external {
        ArbitrageInfo memory data = abi.decode(_data, (ArbitrageInfo));

        if (msg.sender == address(data.poolA) && !arbDone) {
            pay(data.token0, address(this), msg.sender, uint256(amount0Delta));
        } else if (msg.sender == address(data.poolB) && !arbDone) {
            data.poolA.swap(address(this), true, -amount0Delta, TickMath.MIN_SQRT_RATIO + 1, _data);

            pay(data.token1, address(this), msg.sender, uint256(amount1Delta));
        } else if (arbDone) {
            pay(data.token1, address(this), msg.sender, uint256(data.token1 < W_NATIVE ? amount0Delta : amount1Delta));
        }
    }

    function initArbitrage(ArbitrageInfo memory data) external onlyOwner {
        uint256 gasBefore = gasleft();

        data.poolB.swap(address(this), false, type(int256).min, data.priceB, abi.encode(data));

        arbDone = true;

        uint256 profit = balanceOf(data.token1);

        if (data.token1 == W_NATIVE) {
            pay(data.token1, address(this), operator, uint256(profit));

            require((gasBefore - gasleft()) * tx.gasprice < profit, "non-profitable");
        }

        bool zeroForOne = data.token1 < W_NATIVE;
        IUniswapV3Pool poolW = getWPool(data.token1, W_NATIVE, zeroForOne);

        (int256 amount0, int256 amount1) = poolW.swap(
            address(this),
            zeroForOne,
            int256(profit),
            zeroForOne ? TickMath.MIN_SQRT_RATIO + 1 : TickMath.MAX_SQRT_RATIO - 1,
            abi.encode(data)
        );

        profit = zeroForOne ? uint256(-amount1) : uint256(-amount0);

        pay(W_NATIVE, address(this), operator, uint256(profit));

        require((gasBefore - gasleft()) * tx.gasprice < profit, "non-profitable");

        arbDone = false;
    }

    function balanceOf(address addr) private view returns (uint256) {
        (bool success, bytes memory data) =
            addr.staticcall(abi.encodeWithSelector(IERC20Minimal.balanceOf.selector, address(this)));
        require(success && data.length >= 32);
        return abi.decode(data, (uint256));
    }

    function getWPool(address token0, address token1, bool zeroForOne) private view returns (IUniswapV3Pool) {
        if (!zeroForOne) (token0, token1) = (token1, token0);
        return getPool(token0, token1, 3000);
    }

    function pay(address token, address payer, address recipient, uint256 value) private {
        if (recipient == operator && token == W_NATIVE) {
            IWETH9(W_NATIVE).withdraw(value);
        } else if (payer == address(this)) {
            TransferHelper.safeTransfer(token, recipient, value);
        }
    }

    function getPool(address tokenA, address tokenB, uint24 fee) internal view returns (IUniswapV3Pool) {
        return IUniswapV3Pool(
            PoolAddress.computeAddress(FACTORY, PoolAddress.PoolKey({token0: tokenA, token1: tokenB, fee: fee}))
        );
    }

    receive() external payable {}
}
