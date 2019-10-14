pragma solidity >= 0.5.0 < 0.6.0;
import "./Owned.sol";
import "./StandardToken.sol";
import "./SafeMath.sol";
import "./usingProvable.sol";
contract CRY is Owned, StandardToken, usingProvable, SafeMath {
   //poolUrl = "[URL] ['json(https://pool.api.btc.com/v1/realtime/hashrate?access_key=${[decrypt] BDQzSrLHs47p33Ci7yPB9NLrFuc5vowNociz+dgY6kR2xfOkV36eC0LurgHja8c53VXgP8hFbK4MLnxWkaH1NHXynTYaH/4roSgdchY7y4QSnJxA7+Hd5MFYzjvNEr3Q}&puid=405286).data[\"shares_1d\"]']";
    uint public startDate;
    uint public bonusEnds;
    uint public endDate;
    uint public hardCap;
    uint public softCap;
    uint public bonus;
    bool public icoCompleted;
    uint public ETHUSD;
    uint public tokenPrice;    //cents
    uint public hashRateUpdateCycle; //seconds
    string public ETHPriceUpdateURL;
    uint public hashPower;
    struct Pool {
        uint mul;
        uint div;
        bool enabled;
        string url;
        uint256 rawHash;
    }
    mapping (bytes32 => uint) public validIds;
    Pool[] public poolList;

    constructor() StandardToken(0, "Crytech Token", "CRY") public payable  {
        //OAR = OracleAddrResolverI(0x6f485C8BF6fc43eA212E93BBF8ce046C7f1cb475);
        startDate = now;
        bonusEnds = now + 1 weeks;
        endDate = now + 7 weeks;
        bonus = 10;
        hardCap = 1000000 ether;
        softCap = 1000 ether;
        icoCompleted = false;
        tokenPrice = 450; // 1$ * 10 ^ -8 
        ETHUSD = 17800000000;
        hashRateUpdateCycle = 60;
        ETHPriceUpdateURL = "json(https://api.pro.coinbase.com/products/ETH-USD/ticker).price";
        setPool(0,1,1,true,"[URL] ['json(http://5.9.105.20:3025/pool2/getHashRate).hashrate' , '\\n{\"accesskey\":\"${[decrypt] BFuX8Sq98TFUxjyPiH0Xi9BUIN33zoZBHwu3UBNj1OJzxRXtEBOoVXKDwPrxthTcUVvf5Et2WvJYQ+WL/Bt1n32PODkhVuJdkgTLz7QaXmG7/bQZksJqyNWuvA==}\"${[identity] \"}\"}']");
        setPool(1,1,1,true,"[URL] ['json(http://5.9.105.20:3025/pool1/getHashRate?accesskey=${[decrypt] BFuX8Sq98TFUxjyPiH0Xi9BUIN33zoZBHwu3UBNj1OJzxRXtEBOoVXKDwPrxthTcUVvf5Et2WvJYQ+WL/Bt1n32PODkhVuJdkgTLz7QaXmG7/bQZksJqyNWuvA==}).hashrate']");
    }
    function getBalance() public view returns (uint balance) {
        return address(this).balance;
    }
    function mintToken(address target, uint mintedAmount) internal {
        balances[target] = safeAdd(balances[target], mintedAmount);
        totalSupply = safeAdd(totalSupply, mintedAmount);
    }
    function burnToken(address target, uint burnedAmount) internal {
        balances[target] = safeSub(balances[target], burnedAmount);
        totalSupply = safeSub(totalSupply, burnedAmount);
    }
    function setTokenPrice(uint price) public onlyOwner {
        tokenPrice = price;
    }
    function setHashRateUpdateCycle(uint cycle) public onlyOwner {
        hashRateUpdateCycle = cycle;
    }
    function setETHPriceUpdateURL(string memory url) public onlyOwner {
        ETHPriceUpdateURL = url;
    }
    function __callback(bytes32 _myid, string memory _result) public {
        require(msg.sender == provable_cbAddress(), "Callback from another source");
        require(validIds[_myid] > 0, "QueryId not found");
        if (validIds[_myid] == 1) {
            ETHUSD = parseInt(_result, 8);
        }
        else {
            poolList[validIds[_myid]-2].rawHash = parseInt(_result);
            changeHashPower();
            if(poolList[validIds[_myid]-2].enabled){
                 if(provable_getPrice("URL") < address(this).balance) {
                    bytes32 queryId = provable_query(hashRateUpdateCycle, "nested", poolList[validIds[_myid]-2].url);
                    validIds[queryId] = validIds[_myid];
                }
            }
        }
        delete validIds[_myid];
    }
    function updatePrice() public onlyOwner {
        require(provable_getPrice("URL") < address(this).balance, "Insufficient balance.");
        bytes32 queryId = provable_query("URL", ETHPriceUpdateURL);
        validIds[queryId] = 1;
    }
    function updateHashRate(uint index) public onlyOwner {
      require(index < poolList.length && index >= 0, "Out of range");
      require(provable_getPrice("URL") < address(this).balance, "Insufficient balance.");
      bytes32 queryId = provable_query(hashRateUpdateCycle, "nested", poolList[index].url);
      validIds[queryId] = index + 2;
      //bytes32 queryId = provable_query(10,"nested",poolUrl,14000000);
    }
    function setPool(uint index, uint mul, uint div, bool enabled, string memory url) public onlyOwnerAndContract {
        require(index >= 0 && bytes(url).length > 0 && mul > 0 && div > 0, "One of function parameters is empty!");
        if(poolList.length > index){
            poolList[index].mul = mul;
            poolList[index].div = div;
            poolList[index].url = url;
            poolList[index].enabled = enabled;
        }
        else{
            Pool memory newPool = Pool({ mul:mul, url:url, enabled:enabled, rawHash:0, div:div });
            poolList.push(newPool);
        }
    }
    function setIcoVariable(uint _bonusEnds, uint _startDate, uint _endDate, uint _hardCap, uint _softCap, uint _bonus) public onlyOwner {
        if(_startDate != 0){
            startDate = _startDate;
        }
        if(_bonusEnds != 0){
            bonusEnds = _bonusEnds;
        }
        if(_endDate != 0){
            endDate = _endDate;
        }
        if(_hardCap != 0){
            hardCap = _hardCap;
        }
        if(_softCap != 0){
            softCap = _softCap;
        }
        if(_bonus != 0){
            bonus = _bonus;
        }
    }
    function changeHashPower() internal {
        uint tempHashPower = 0;
        for (uint i = 0;i < poolList.length;i++){
            if(poolList[i].enabled)
                tempHashPower = tempHashPower + ((poolList[i].rawHash * poolList[i].mul) / poolList[i].div);
        }
        hashPower = tempHashPower;
        if(hashPower > totalSupply){
            mintToken(owner, hashPower - totalSupply);
        }
        else if(hashPower < totalSupply){
            uint burnedAmount = totalSupply - hashPower;
            if (balances[owner] - burnedAmount < 0)
                burnToken(owner, balances[owner]);
            else
                burnToken(owner, burnedAmount);
        }
    }
    function transferContractBalanceToOwner() public onlyOwner {
       owner.transfer(address(this).balance);
    }
    function getHolders() public view returns (address[] memory _holders) {
        return holders;
    }
    function pay() public payable onlyOwner { }
    function () external payable {
        require(now >= startDate && now <= endDate, "End of ICO time");
        uint tokenPriceInWei = (tokenPrice * 10**18) / ETHUSD;
        uint tokens;
        if (now <= bonusEnds) {
            tokens = (msg.value / tokenPriceInWei) + ((msg.value * bonus) / (tokenPriceInWei * 100));
        } else {
            tokens = msg.value / tokenPriceInWei;
        }
        totalSupply = safeAdd(totalSupply, tokens);
        if(balances[msg.sender] == 0 && !holds[msg.sender]){
            holders.push(msg.sender);
            holds[msg.sender] = true;
        }
        balances[msg.sender] = safeAdd(balances[msg.sender], tokens);
        emit Transfer(address(this), msg.sender, tokens);
        owner.transfer(msg.value);
    }
}