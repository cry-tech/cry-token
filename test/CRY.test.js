const assert = require('assert');
const { AssertionError } = require('assert');
const ganache = require('ganache-cli');
const options = { gasLimit: 9000000 };
const provider = ganache.provider(options);
const BigNumber = require('bignumber.js');

const Web3 = require('web3');
const web3 = new Web3(provider);

const compiledCry = require('../ethereum/build/CRY.json');

let accounts;
let contractAddress;
let cry;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    cry = await new web3.eth.Contract(compiledCry.interface)
        .deploy({data: compiledCry.bytecode })
        .send({ from: accounts[0], gas: '9000000', value:web3.utils.toWei('1', 'ether') });

    contractAddress = cry.options.address;
});

describe("Cry", () => {
    it('Deploy cry token', () => {
        assert.ok(cry.options.address);
    });

    it('Check contract balance', async () => {
        var contractBalance = await cry.methods.getBalance().call();
        assert.equal(web3.utils.toWei('1', 'ether'), contractBalance);
    });

    it('Check contract owner' , async () => {
        var contractOwner = await cry.methods.owner().call();
        assert.equal(accounts[0], contractOwner);
    });

    it('ICO : Buy with bonus and check ether transfer to owner', async () => {
        var ownerEtherBalance = new BigNumber(await web3.eth.getBalance(accounts[0]));
        var tokenBefore = await cry.methods.balanceOf(accounts[1]).call();
        var tokenPrice = new BigNumber(await cry.methods.tokenPrice().call());
        var ETHUSD = new BigNumber(await cry.methods.ETHUSD().call());
        var tenpow = (new BigNumber(10)).pow(18);
        var b = tokenPrice.times(tenpow).dividedToIntegerBy(ETHUSD);
        var calculatedToken = tenpow.dividedToIntegerBy(b).plus(tenpow.times(10).dividedToIntegerBy(b.times(100)));
        //console.log("tokenBefore : " + calculatedToken);
        await web3.eth.sendTransaction({ from: accounts[1], to: contractAddress, gas: '2000000', value:web3.utils.toWei('1', 'ether') });
        var tokenAfter = await cry.methods.balanceOf(accounts[1]).call();
        //console.log("tokenAfter : " + tokenAfter);
        assert.equal(calculatedToken.toNumber(), new BigNumber(tokenAfter).plus(tokenBefore).toNumber(), "not expected : buyer token balance");
        var expectedOwnerEtherBalance = ownerEtherBalance.plus(web3.utils.toWei('1', 'ether'));
        var newOwnerEtherBalance = new BigNumber(await web3.eth.getBalance(accounts[0]));
        assert.equal(newOwnerEtherBalance.toNumber(), expectedOwnerEtherBalance.toNumber(), "not expected : owner ether balance");
    });

    it('ICO : Buy without bonus', async () => {
        var bonus = 10;
        var start = parseInt((new Date("2019-01-01T00:00:00.000Z")).getTime() / 1000);
        var bnous_ends = parseInt((new Date("2019-01-14T00:00:00.000Z")).getTime() / 1000);
        var end = parseInt((new Date()).getTime() / 1000) + 3600;
        await cry.methods.setIcoVariable(bnous_ends, start, end, 0, 0, bonus)
            .send({ from: accounts[0], gas:'2000000'});

        var tokenBefore = await cry.methods.balanceOf(accounts[1]).call();
        var tokenPrice = new BigNumber(await cry.methods.tokenPrice().call());
        var ETHUSD = new BigNumber(await cry.methods.ETHUSD().call());
        var tenpow = (new BigNumber(10)).pow(18);
        var b = tokenPrice.times(tenpow).dividedToIntegerBy(ETHUSD);
        var calculatedToken = tenpow.dividedToIntegerBy(b);
        await web3.eth.sendTransaction({ from: accounts[1], to: contractAddress, gas: '2000000', value:web3.utils.toWei('1', 'ether') });
        var tokenAfter = await cry.methods.balanceOf(accounts[1]).call();
        assert.equal(calculatedToken.toNumber(), new BigNumber(tokenAfter).plus(tokenBefore).toNumber());
    });

    it('ICO : Buy out of time', async () => {
        var bonus = 10;
        var start = parseInt((new Date("2019-01-01T00:00:00.000Z")).getTime() / 1000);
        var bnous_ends = parseInt((new Date("2019-01-14T00:00:00.000Z")).getTime() / 1000);
        var end = parseInt((new Date()).getTime() / 1000) - 60;
        await cry.methods.setIcoVariable(bnous_ends, start, end, 0, 0, bonus)
            .send({ from: accounts[0], gas:'2000000'});
        try {
            await web3.eth.sendTransaction({ from: accounts[1], to: contractAddress, gas: '2000000', value:web3.utils.toWei('1', 'ether') });
            assert(false);
        } catch(e) {
            if (e instanceof AssertionError) {
                throw e;
            }
            else{
                assert(e);
            }
        }
    });
});

