pragma solidity >= 0.5.0 < 0.6.0;

import "./StandardTokenInterface.sol";

contract StandardToken is StandardTokenInterface {
    string public name;
    string public symbol;
    uint8 public decimals = 4;
    uint256 public totalSupply;
    mapping (address => uint256) balances;
    mapping (address => mapping (address => uint256)) allowed
    ;
    address [] public holders;
    mapping (address => bool) holds;

    event Transfer(address indexed _from, address _to, uint256 _value); 
    event Approval(address indexed _owner, address _spender, uint256 _value);

    constructor(uint initialSupply, string memory tokenName, string memory tokenSymbol) public {
        balances[address(this)] = initialSupply; 
        totalSupply = initialSupply;
        name = tokenName;
        symbol = tokenSymbol;
    }

    function balanceOf(address _owner) public view returns (uint256 balance) {
        return balances[_owner];
    }

    function _transfer(address _from, address _to, uint _value) internal {
        require(_to != address(0));
        require(balances[_from] >= _value);
        require(balances[_to] + _value >= balances[_to]);
        balances[_from] -= _value;
        if(balances[_to] == 0 && !holds[_to]){
            holders.push(_to);
            holds[_to] = true;
        }
        balances[_to] += _value;
        emit Transfer(_from, _to, _value);
    }

    function transfer(address _to, uint256 _value) public returns (bool success) {
        _transfer(msg.sender, _to, _value);
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        require(allowed[_from][msg.sender] >= _value);
        allowed[_from][msg.sender] -= _value;
        _transfer(_from, _to, _value);
        return true;
    }

    function approve(address _spender, uint256 _value) public returns (bool success) {
        allowed[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function allowance(address _owner, address _spender) public view returns (uint256 remaining) {
        return allowed[_owner][_spender];
    } // end of Token contract
}
