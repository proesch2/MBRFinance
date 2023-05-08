// SPDX-License-Identifier: MIT
pragma solidity =0.7.6;
pragma abicoder v2;

import '@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol';
import '@uniswap/v3-core/contracts/libraries/TickMath.sol';
import '@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol';
import '@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol';
import '@uniswap/v3-periphery/contracts/interfaces/INonfungiblePositionManager.sol';
import '@uniswap/v3-periphery/contracts/base/LiquidityManagement.sol';
import '@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol';
import '@openzeppelin/contracts/math/SafeMath.sol';
import '@openzeppelin/contracts/utils/SafeCast.sol';

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

import './interfaces/ITreasury.sol';

contract Treasury is ITreasury, IERC721Receiver, ERC20 {
    using SafeMath for uint256;
    // pool fee
    uint24 public constant poolFee = 3000;

    // Uniswap provided helper addresses
    INonfungiblePositionManager public constant nonfungiblePositionManager = INonfungiblePositionManager(0xC36442b4a4522E871399CD717aBDD847Ab11FE88);
    ISwapRouter public constant swapRouter = ISwapRouter(address(0));

    struct Deposit {
        uint256 id;
        uint128 liquidity;
        address token0;
        address token1;
    }

    mapping(address => Deposit) public deposits;
    uint256[] positions;

    uint256 totalLiquidity;
    address mbr = address(0xB409FCd95b4aDeB57fE653200B04ea2b9a7a64e4);
    address dao = address(0);

    constructor() ERC20("MBR Treasury", "sMBR") {
    }

    // Implementing `onERC721Received` so this contract can receive custody of erc721 tokens
    function onERC721Received(
        address,
        address,
        uint256,
        bytes calldata
    ) external override returns (bytes4) {
        return this.onERC721Received.selector;
    }

    function deposit(address token, uint256 amount) external override returns (bool){
        Deposit memory info = deposits[token];
        address token0 = info.token0;
        address token1 = info.token1;
        uint256 id = info.id;

        (uint256 amount0, uint256 amount1) = _split(token, token0, token1, amount);

        if(id == 0){
            (uint256 tokenId, uint128 liquidity,,)  = _initialDeposit(token0, token1, amount0, amount1);
            deposits[token].id = tokenId;
            deposits[token].liquidity += liquidity;
            totalLiquidity += liquidity;
            positions.push(tokenId);
        }
        else{
            collectTokenFees(id);
            (uint128 liquidity,,) = _deposit(id, token0, token1, IERC20(token0).balanceOf(address(this)), IERC20(amount1).balanceOf(address(this)));
            deposits[token].liquidity += liquidity;
            totalLiquidity += liquidity;
        }
        return true;
    }

    function _split(address token, address token0, address token1, uint256 amount) internal returns (uint256 amount0, uint256 amount1) {
        uint256 amountIn = amount / 2;

        // Approve the router to spend DAI.
        TransferHelper.safeApprove(token, address(swapRouter), amountIn);

        address t0 = token0;
        address t1 = token1;
        if(token == token1){
            t0 = token1;
            t1 = token0;
        }

        ISwapRouter.ExactInputSingleParams memory params =
            ISwapRouter.ExactInputSingleParams({
                tokenIn: t0,
                tokenOut: t1,
                fee: poolFee,
                recipient: address(this),
                deadline: block.timestamp,
                amountIn: amountIn,
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0
            });

        uint256 amountOut = swapRouter.exactInputSingle(params);

        amount0 = amount - amountIn;
        amount1 = amountOut;
        if(token == token1){
            amount1 = amount - amountIn;
            amount0 = amountOut;
        }
    }

    function _initialDeposit(address token0, address token1, uint256 amount0, uint256 amount1)
        internal
        returns (
            uint256 tokenId,
            uint128 liquidity,
            uint256 amount0Out,
            uint256 amount1Out
        )
    {

        // Approve the position manager
        TransferHelper.safeApprove(token0, address(nonfungiblePositionManager), amount0);
        TransferHelper.safeApprove(token1, address(nonfungiblePositionManager), amount1);

        INonfungiblePositionManager.MintParams memory params =
            INonfungiblePositionManager.MintParams({
                token0: token0,
                token1: token1,
                fee: poolFee,
                tickLower: TickMath.MIN_TICK,   // TODO: Optimize ticks
                tickUpper: TickMath.MAX_TICK,   // TODO: Optimize ticks
                amount0Desired: amount0,
                amount1Desired: amount1,
                amount0Min: 0,
                amount1Min: 0,
                recipient: address(this),
                deadline: block.timestamp
            });

        (tokenId, liquidity, amount0Out, amount1Out) = nonfungiblePositionManager.mint(params);
    }

    function _deposit(
        uint256 tokenId,
        address token0,
        address token1,
        uint256 amount0,
        uint256 amount1
    )
        internal
        returns (
            uint128 liquidity,
            uint256 amount0Out,
            uint256 amount1Out
        ) {
            //Transfer the tokens to the nonfung Position manager
        TransferHelper.safeApprove(token0, address(nonfungiblePositionManager), amount0);
        TransferHelper.safeApprove(token1, address(nonfungiblePositionManager), amount1);

        INonfungiblePositionManager.IncreaseLiquidityParams memory params = INonfungiblePositionManager.IncreaseLiquidityParams({
            tokenId: tokenId,
            amount0Desired: amount0,
            amount1Desired: amount1,
            amount0Min: 0,
            amount1Min: 0,
            deadline: block.timestamp
        });

        (liquidity, amount0Out, amount1Out) = nonfungiblePositionManager.increaseLiquidity(params);

    }

    function collectTokenFees(uint256 tokenId) public returns (uint256 amount0, uint256 amount1) {
        INonfungiblePositionManager.CollectParams memory params =
            INonfungiblePositionManager.CollectParams({
                tokenId: tokenId,
                recipient: address(this),
                amount0Max: type(uint128).max,
                amount1Max: type(uint128).max
            });

        (amount0, amount1) = nonfungiblePositionManager.collect(params);
    }

    function withdraw(address token, uint256 amount, address receiver) external override returns(bool) {
        //Deposit memory info = deposits[token];

        //(uint256 amount0, uint256 amount1) = _withdraw(info.id, amount);

        //TransferHelper.safeTransfer(info.token0, receiver, amount0);
        //TransferHelper.safeTransfer(info.token1, receiver, amount1);
        TransferHelper.safeTransfer(token, receiver, amount);

        return true;
    }

    function _withdraw(uint256 tokenId, uint256 amount) internal returns (uint256 amount0, uint256 amount1) {
        uint128 liquidity = _amountToLiquidity(amount);
        totalLiquidity -= liquidity;
        INonfungiblePositionManager.DecreaseLiquidityParams memory params =
            INonfungiblePositionManager.DecreaseLiquidityParams({
                tokenId: tokenId,
                liquidity: liquidity,
                amount0Min: 0,
                amount1Min: 0,
                deadline: block.timestamp
            });

        (amount0, amount1) = nonfungiblePositionManager.decreaseLiquidity(params);
    }
    
    function _amountToLiquidity(uint256 amount) internal view returns (uint128){
        uint256 total = IERC20(mbr).totalSupply();
        uint256 result = amount.mul(totalLiquidity).div(total);
        return SafeCast.toUint128(result);
    }

    function stake(address user, uint256 amount) external override returns (bool){
        _mint(user, amount);
        return true;
    }

    function unstake(address user, uint256 amount) external override returns (uint256){
        _burn(user, amount);
        return amount;
    }

    function burn(address recipient, uint256 amount) public returns (bool){
        require(msg.sender == dao, "Only DAO");
        _burn(recipient, amount);
        return true;
    }

    function transfer(address recipient, uint256 amount) public pure override returns(bool){
        revert("sMBR non-transferrable");
        return false;
    }

    function transferFrom(address sender, address recipient, uint256 amount) public pure override returns(bool){
        revert("sMBR non-transferrable");
        return false;
    }

    function setAddress(address _mbr, address _dao) external override returns(bool){
        mbr = _mbr;
        dao = _dao;
        return true;
    }
}