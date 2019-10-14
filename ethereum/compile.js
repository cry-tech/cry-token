const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

const bulidPath = path.resolve(__dirname, 'build');
fs.removeSync(bulidPath);

const cryPath = path.resolve(__dirname, 'contracts', 'CRY.sol');
const OwnedPath = path.resolve(__dirname, 'contracts', 'Owned.sol');
const ProvableIPath = path.resolve(__dirname, 'contracts', 'ProvableI.sol');
const OracleAddrResolverIPath = path.resolve(__dirname, 'contracts', 'OracleAddrResolverI.sol');
const BufferPath = path.resolve(__dirname, 'contracts', 'Buffer.sol');
const CBORPath = path.resolve(__dirname, 'contracts', 'CBOR.sol');
const UsingProvablePath = path.resolve(__dirname, 'contracts', 'usingProvable.sol');
const SafeMathPath = path.resolve(__dirname, 'contracts', 'SafeMath.sol');
const StandardTokenPath = path.resolve(__dirname, 'contracts', 'StandardToken.sol');
const StandardTokenInterfacePath = path.resolve(__dirname, 'contracts', 'StandardTokenInterface.sol'); 

const input = {
    language: 'Solidity',
    sources: {
        'Owned.sol': { content: fs.readFileSync(OwnedPath, 'utf8') },
        'SafeMath.sol': { content: fs.readFileSync(SafeMathPath, 'utf8') },
        'StandardTokenInterface.sol': { content: fs.readFileSync(StandardTokenInterfacePath, 'utf8') },
        'StandardToken.sol': { content: fs.readFileSync(StandardTokenPath, 'utf8') },
        'ProvableI.sol': { content: fs.readFileSync(ProvableIPath, 'utf8') },
        'OracleAddrResolverI.sol': { content: fs.readFileSync(OracleAddrResolverIPath, 'utf8') },
        'Buffer.sol': { content: fs.readFileSync(BufferPath, 'utf8') },
        'CBOR.sol': { content: fs.readFileSync(CBORPath, 'utf8') },
        'usingProvable.sol': { content: fs.readFileSync(UsingProvablePath, 'utf8') },
        'CRY.sol': { content: fs.readFileSync(cryPath, 'utf8') },
    },
    settings: {
        outputSelection: {
            '*': {
                '*':  ['*']
            }
        }
    }
}
var output = JSON.parse(solc.compile(JSON.stringify(input)));
const { abi: interface, evm: { bytecode: { object } } } = output.contracts['CRY.sol'].CRY; // 
//var cryContract = output.contracts['CRY.sol'].CRY;
fs.outputJsonSync(path.resolve(bulidPath, 'CRY.json'), { interface : interface, bytecode: object });

