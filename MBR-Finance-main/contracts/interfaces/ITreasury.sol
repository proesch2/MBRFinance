// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;

interface ITreasury {
    function deposit(address token, uint256 amount) external returns (bool);
    function withdraw(address token, uint256 amount, address receiver) external returns (bool);
    function stake(address user, uint256 amount) external returns (bool);
    function unstake(address user, uint256 amount) external returns (uint256);
    function setAddress(address mbr, address dao) external returns (bool);
}