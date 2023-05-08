// SPDX-License-Identifier: MIT
pragma solidity =0.7.6;
pragma abicoder v2;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "./TreasuryDemo.sol"; 

contract MBRDAO{
    struct Proposal{
        uint256 id;
        address proposer;
        address target;
        bytes data;
        uint256 votes;
        string description;
    }

    address treasury;
    uint256 threshold;
    uint256 cost;

    mapping(uint256 => Proposal) proposals;
    mapping(uint256 => mapping(address => bool)) voted;
    uint256 totalProposals;
    Proposal[] active;

    constructor() {
        
    }

    modifier onlyDAO(){
        require(msg.sender == address(this), "Only DAO");
        _;
    }

    function setThreshold(uint256 _threshold) public onlyDAO {
        threshold = _threshold;
    }

    function setCost(uint256 _cost) public onlyDAO {
        cost = _cost;
    }

    function createProposal(address _target, bytes memory _data, string memory _description) public {
        //Treasury(treasury).burn(msg.sender, cost);
        totalProposals += 1;
        Proposal memory p;
        p.id = totalProposals;
        p.proposer = msg.sender;
        p.target = _target;
        p.data = _data;
        p.description = _description;
        active.push(p);
    }

    function vote(uint256 id, uint256 votes) public {
        require(votes <= IERC20(treasury).balanceOf(msg.sender));
        Proposal storage p = proposals[id];
        p.votes += votes;
        
        voted[id][msg.sender] = true;
    }

    function executeProposal(uint256 id) public {
        Proposal memory p = proposals[id];
        require(p.votes > threshold, "vote threshold not met");
        Address.functionCall(p.target, p.data);
    }

    function getProposals() external view returns(Proposal[] memory){
        Proposal[] memory p = active;
        return p;
    }

    function setTreasury(address _treasury) external returns(bool){
        treasury = _treasury;
        return true;
    }

}
