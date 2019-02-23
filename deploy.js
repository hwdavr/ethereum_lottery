const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode } = require('./compile');

const provider = new HDWalletProvider(
    'simple egg file credit wagon garbage vapor slow sunset exile glove dial',
    'https://rinkeby.infura.io/v3/b035af3b15a7449788b306f5247aa07f'
)

const web3 = new Web3(provider);

const deploy = async () => {
  // Get a list of all accounts
  const accounts = await web3.eth.getAccounts();
  console.log('Attempt to deploy from', accounts[0]);
  // Use one of those accounts to deploy the contract
  inbox = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode })
    .send({ from: accounts[0], gas: '1000000' });
  
  console.log('Contract deployed to', inbox.options.address);
  // ADD THIS ONE LINE RIGHT HERE!!!!! <---------------------
  //inbox.setProvider(provider);
};

deploy();