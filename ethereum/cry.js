import web3 from './web3';
import Cry from './build/Cry.json';

const instance = new web3.eth.Contract(
    Cry.interface,
    '0xe2de858da87b96888611dc22bd862b738f0f467f'
);

export default instance;
