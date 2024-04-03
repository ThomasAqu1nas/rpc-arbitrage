// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;
pragma abicoder v2;

import "@uniswap/v3-core/contracts/libraries/SqrtPriceMath.sol";
import "@uniswap/v3-periphery/contracts/libraries/PoolAddress.sol";
import "@uniswap/v3-core/contracts/libraries/TickMath.sol";
import "./TickBitmap.sol";
import "@uniswap/v3-core/contracts/libraries/LiquidityMath.sol";
import "@uniswap/v3-core/contracts/libraries/SwapMath.sol";

library Oracle {
    using TickBitmap for IUniswapV3Pool;

    enum PricesPosition {
        BA,
        AB,
        BB,
        AA,
        OO
    }

    struct PoolData {
        IUniswapV3Pool entity;
        uint160 price;
        uint160 checkpoint;
        uint128 liquidity;
        uint24 fee;
        int24 tick;
    }

    function compute(IUniswapV3Pool poolA, IUniswapV3Pool poolB)
        public
        view
        returns (uint160 priceA, uint160 priceB, bool arbitrage)
    {
        PoolData memory A;
        PoolData memory B;

        (A.entity, B.entity) = (poolA, poolB);
        (A.fee, B.fee) = (poolA.fee(), poolB.fee());
        (A.price, A.tick,,,,,) = poolA.slot0();
        (B.price, B.tick,,,,,) = poolB.slot0();
        (A.liquidity, B.liquidity) = (poolA.liquidity(), poolB.liquidity());

        if (A.price < B.price) (A, B) = (B, A);

        bool spread = true;

        while (spread) {
            (priceA, priceB) = (A.price, B.price);

            bool initializedA;
            bool initializedB;

            (A.tick, initializedA) = poolA.nextInitializedTickWithinOneWord(A.tick, true);
            (B.tick, initializedB) = poolB.nextInitializedTickWithinOneWord(B.tick, false);

            if (B.tick > TickMath.MAX_TICK) B.tick = TickMath.MAX_TICK;
            if (A.tick < TickMath.MIN_TICK) A.tick = TickMath.MIN_TICK;

            (A.checkpoint, B.checkpoint) = (TickMath.getSqrtRatioAtTick(A.tick), TickMath.getSqrtRatioAtTick(B.tick));

            if (B.price == B.checkpoint && initializedB) {
                (, int128 liquidityNetB,,,,,,) = poolB.ticks(B.tick);

                B.liquidity = LiquidityMath.addDelta(B.liquidity, liquidityNetB);

                A.tick = TickMath.getTickAtSqrtRatio(A.price);
            }
            if (A.price == A.checkpoint) {
                if (initializedA) {
                    (, int128 liquidityNetA,,,,,,) = poolA.ticks(A.tick);

                    A.liquidity = LiquidityMath.addDelta(A.liquidity, -liquidityNetA);
                }

                A.tick -= 1;
                B.tick = TickMath.getTickAtSqrtRatio(B.price);
            }

            (A.price, B.price, spread) = computeStep(A, B);
        }

        arbitrage = priceA < A.price || priceB > B.price;
    }

    function computeStep(PoolData memory A, PoolData memory B)
        private
        pure
        returns (uint160 priceAafter, uint160 priceBafter, bool spread)
    {
        PricesPosition priceCase = PricesPosition.OO;

        (priceAafter, priceBafter) = (A.price, B.price);

        if (B.checkpoint <= A.checkpoint) {
            priceCase = PricesPosition.BA;
        } else if (A.price > B.checkpoint && B.price < A.checkpoint) {
            priceCase = PricesPosition.AB;
        } else if (A.price > B.checkpoint && B.price >= A.checkpoint) {
            priceCase = PricesPosition.BB;
        } else if (A.price <= B.checkpoint && B.price < A.checkpoint) {
            priceCase = PricesPosition.AA;
        } else {
            (priceAafter, priceBafter) = getPrices(A, B);

            spread = SqrtPriceMath.getAmount0Delta(B.price, priceBafter, B.liquidity, false) > 0;

            return (priceAafter, priceBafter, spread);
        }

        uint160[4] memory checkpointsA = [A.checkpoint, B.checkpoint, B.checkpoint, A.checkpoint];
        uint160[4] memory checkpointsB = [B.checkpoint, A.checkpoint, B.checkpoint, A.checkpoint];

        A.checkpoint = checkpointsA[uint256(priceCase)];
        B.checkpoint = checkpointsB[uint256(priceCase)];

        return getNextPrices(A, B);
    }

    function getPrices(PoolData memory A, PoolData memory B) private pure returns (uint160 PA, uint160 PB) {
        uint256 criteria = getCriteria(A.fee, B.fee, A.price);

        if (B.price < criteria) {
            uint160 P1 = getP1(A, B);

            return (P1, P1);
        } else {
            return (A.price, B.price);
        }
    }

    function getNextPrices(PoolData memory A, PoolData memory B)
        internal
        pure
        returns (uint160 priceA, uint160 priceB, bool spread)
    {
        (priceA, priceB) = getCase(A, B);

        (, uint256 amountInB, uint256 amountOutB, uint256 feeB) =
            SwapMath.computeSwapStep(B.price, priceB, B.liquidity, type(int256).min, B.fee);

        (,, uint256 amountOutA,) = SwapMath.computeSwapStep(A.price, priceA, A.liquidity, int256(amountOutB), A.fee);

        spread = amountInB + feeB < amountOutA;
    }

    function getP1(PoolData memory A, PoolData memory B) private pure returns (uint160) {
        uint256 liqAconverted = uint256(A.liquidity) << FixedPoint96.RESOLUTION;
        uint256 liqBconverted = uint256(B.liquidity) << FixedPoint96.RESOLUTION;

        uint256 denom1 = liqAconverted / A.price;
        uint256 denom2 = FullMath.mulDiv(liqBconverted, 1e6 - A.fee, uint256(B.price) * 1e6);

        uint256 numer = liqAconverted + FullMath.mulDivRoundingUp(liqBconverted, 1e6 - A.fee, 1e6);

        return uint160(numer / (denom1 + denom2));
    }

    function getCriteria(uint24 feeA, uint24 feeB, uint160 priceA) private pure returns (uint256) {
        return FullMath.mulDiv(1e6 - feeB, priceA * (1e6 - feeA), 1e12);
    }

    function getCase(PoolData memory A, PoolData memory B)
        private
        pure
        returns (uint160 nextPriceA, uint160 nextPriceB)
    {
        uint256 delta0A = SqrtPriceMath.getAmount0Delta(A.price, A.checkpoint, A.liquidity, true);
        uint256 delta0B = SqrtPriceMath.getAmount0Delta(B.price, B.checkpoint, B.liquidity, false);

        uint256 delta0APlusFee = FullMath.mulDivRoundingUp(delta0A, 1e6, 1e6 - A.fee);

        uint256 delta0 = delta0APlusFee < delta0B ? delta0APlusFee : delta0B;

        if (delta0 == delta0B) {
            nextPriceA = SqrtPriceMath.getNextSqrtPriceFromAmount0RoundingUp(
                A.price, A.liquidity, FullMath.mulDivRoundingUp(delta0, 1e6, 1e6 - A.fee), true
            );
            nextPriceB = B.checkpoint;
        } else {
            nextPriceA = A.checkpoint;
            nextPriceB = SqrtPriceMath.getNextSqrtPriceFromAmount0RoundingUp(B.price, B.liquidity, delta0, false);
        }
    }
}
