pragma solidity >= 0.5.0 < 0.6.0;

contract Owned {
    address payable public owner;

    constructor() public {
        owner = msg.sender;
    }

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }
    
    modifier onlyOwnerAndContract() {
        require(msg.sender == owner || msg.sender == address(this));
        _;
    }

    function transferOwnership(address payable newOwner) onlyOwner public {
        owner = newOwner;
    }
}
