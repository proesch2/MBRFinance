// SPDX-License-Identifier: MIT
pragma solidity =0.7.6;

import "./interfaces/ITreasury.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "./TreasuryDemo.sol";

contract MBRFinance is Ownable, ERC20{

    modifier activeAgg {
        //Do I need an OR here? Just a tx? 
        require(activeAggregators[msg.sender] || activeAggregators[tx.origin]);
        _;
    }
    
    mapping(address => bool) public approvedToken;
    address[] public tokens;
    mapping(address => address) public tokenToReward;
    mapping(address => bool) private blacklisted;

    address treasury;
    uint currentStaking;

    //aggregator tresury allocation

    mapping(address => bool) public activeAggregators;

    event purchaseEvent(address token, uint256 amount, address buyer);
    event stakeEvent(address account, uint256 amountStaked);
    event unstakeEvent(address amount, uint256 amountunstaked);
    event tokenStatusEvent(address token, bool status);
    event redeemEvent(uint256 amount);


    constructor() ERC20("MBRFinance", "MBR"){
        treasury = address(new Treasury()); //address(new Treasury(0x1F98431c8aD98523631AE4a59f267346ea31F984));   // hardcoded uniswapv3 factory
        //emit treasury address

    }

    // external functions
    //deposit approved token into tresury
    function purchase(address token, uint256 amount) external returns(bool) {
        require(approvedToken[token], "Token NOT MBR Finance Compatible");  // only allow approved token/stablecoin to deposit
        require(!blacklisted[msg.sender] && !blacklisted[tx.origin], "XXX Blacklisted XXX");   // check if msg.sender address or EOA source is blacklisted
        require(amount > 0, "Deposit amount needs to be > 0");    // need to actually make deposit

        IERC20(token).transferFrom(msg.sender, treasury, amount);
        //ITreasury(treasury).deposit(token, amount);
        _mint(msg.sender, amount);  
        emit purchaseEvent(token, amount, msg.sender);
        return true;
    }

    //
    function redeem(address token, uint256 amount) external returns(bool){
        require(approvedToken[token], "Cannot Redeem For Token Param");
        require(!blacklisted[msg.sender] && !blacklisted[tx.origin], "XXX Blacklisted XXX");   // check if msg.sender address or EOA source is blacklisted
        _burn(msg.sender, amount);
        ITreasury(treasury).withdraw(token, amount, msg.sender);
        emit redeemEvent(amount);
        return true;
    }

    function stake(uint256 amount) external returns (bool) {
        require(!blacklisted[msg.sender] && !blacklisted[tx.origin], "XXX Blacklisted XXX");   // check if msg.sender address or EOA source is blacklisted
        _burn(msg.sender, amount);
        emit stakeEvent(msg.sender, amount);
        return ITreasury(treasury).stake(msg.sender, amount);
    }

    function unstake(uint256 amount) external returns (bool){
        require(!blacklisted[msg.sender] && !blacklisted[tx.origin], "XXX Blacklisted XXX");   // check if msg.sender address or EOA source is blacklisted
        uint256 received = ITreasury(treasury).unstake(msg.sender, amount);
        _mint(msg.sender, received);
        emit unstakeEvent(msg.sender, amount);
        return true;
    }

    // state modifying functions

    function tokenStatus(address token, bool status) external onlyOwner returns(bool){
        if(approvedToken[token] && !status){
            tokens.push(token);
        }else if(!approvedToken[token] && status){
            uint256 length = tokens.length;
            for(uint256 i; i < length; ++i){
                if(token == tokens[i]){
                    tokens[i] = tokens[length-1];
                    tokens.pop();
                    break;
                }
            }
        }
        approvedToken[token] = status;
        emit tokenStatusEvent(token, status);
        return true;
    }

    function userStatus(address user, bool status) external onlyOwner returns(bool){
        blacklisted[user] = status;
        return true;
    }

    function changeAggregator(address newAgg, address oldAgg) external onlyOwner returns(bool){
        //TODO add require statements??

        //update activeAggregator
        activeAggregators[oldAgg] = false;
        activeAggregators[newAgg] = true;

        //reallocate assests.
        return true;
    }

    function setAddr(address DAO) external returns(bool){
        return ITreasury(treasury).setAddress(address(this), DAO);
    }

    function getTreasury() external returns(address){
        return treasury;
    }
}