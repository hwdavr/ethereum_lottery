const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
 
// UPDATE THESE TWO LINES RIGHT HERE!!!!! <-----------------
const provider = ganache.provider();
const web3 = new Web3(provider);  // Use ganache as provider 
 
const { interface, bytecode } = require('../compile');
 
let accounts;
let lottery;
 
beforeEach(async () => {
  // Get a list of all accounts
  accounts = await web3.eth.getAccounts();
  // Use one of those accounts to deploy the contract
  lottery = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode })
    .send({ from: accounts[0], gas: '1000000' });
    
  // ADD THIS ONE LINE RIGHT HERE!!!!! <---------------------
  lottery.setProvider(provider);
});
 
describe('Lottery', () => {
  it('deploys a contract', () => {
    console.log(accounts);
    assert.ok(lottery.options.address);
  });

  it('It allow player to enter', async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('0.0012', 'ether')
    });
    const players = await lottery.methods.getPlayers().call({
      from: accounts[0]
    });

    assert.equal(accounts[0], players[0]);
    assert.equal(1, players.length);
  })

  it('Require minimum amount of ether to entery', async() => {
    try {
      await lottery.methods.enter().send({
        from: accounts[0],
        value: 0
      });
      assert(false);
    } catch (err) {
      //console.log(err);
      assert(err);
    }
  })

  it('Only manager can pickWinner', async() => {
    try {
      await lottery.methods.enter().send({
        from: accounts[1],
        value: web3.utils.toWei('0.0012', 'ether')
      });
      await lottery.methods.pickWinner().send({
        from: accounts[1]
      });
      assert(false);
    } catch (err) {
      //console.log(err);
      assert(err);
    }
  })

  it('Send money to the winner and resets players array', async() => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('2', 'ether')
    });
    const initBalance = await web3.eth.getBalance(accounts[0]);
    await lottery.methods.pickWinner().send({
      from: accounts[0]
    });
    const finalBalance = await web3.eth.getBalance(accounts[0]);
    const diff = finalBalance - initBalance;
    console.log(diff);
    assert(diff > web3.utils.toWei("1.8", 'ether'));
  })
});
