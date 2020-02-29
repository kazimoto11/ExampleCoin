const truffleAssert = require('truffle-assertions')

// import the contract artifact
const ExampleCoin = artifacts.require('./ExampleCoin.sol')

// test starts here
contract('ExampleCoin', function (accounts) {
  // predefine the contract instance
  let ExampleCoinInstance

  // before each test, create a new contract instance
  beforeEach(async function () {
    ExampleCoinInstance = await ExampleCoin.new()
  })

  // first test: define what it should do in the string
  it('should set account 0 to the minter', async function () {
    // minter is a public variable in the contract so you can get it directly via the created call function
    let minter = await ExampleCoinInstance.minter()
    // check whether minter is equal to account 0
    assert.equal(minter, accounts[0], "minter wasn't properly set")
  })
  // second test
  it('should initialize with 0 coins in account all accounts', async function () {
    // loop over the accounts
    for (let i = 0; i < 10; i++) {
      // get the balance of this account
      let balance = await ExampleCoinInstance.balances(accounts[i])
      // check that the balance is 0
      assert.equal(balance.toNumber(), 0, "0 wasn't in account" + i.toString())
    }
  })
  // third test
  it('should mint 10 coins if sent from account 0', async function () {
    // call the mint function to mint 10 coins to account 0
    await ExampleCoinInstance.mint(accounts[0], 10, { 'from': accounts[0] })
    // retrieve the updated balance of account 0
    let balance = await ExampleCoinInstance.balances(accounts[0])
    // check that the balance is now 10
    assert.equal(balance.toNumber(), 10, "10 wasn't in account 0")
  })
  // fourth test
  it('should send 5 coins from account 0 to account 1', async function () {
    // call the mint function to mint 10 coins to account 0
    await ExampleCoinInstance.mint(accounts[0], 10, { 'from': accounts[0] })
    // send 5 coins from account 0 to account 1
    await ExampleCoinInstance.send(accounts[1], 5, { 'from': accounts[0] })
    // retrieve the balances of account 0 and account 1
    let balance0 = await ExampleCoinInstance.balances(accounts[0])
    let balance1 = await ExampleCoinInstance.balances(accounts[1])
    // check that both balances are equal to 5
    assert.equal(balance0.toNumber(), 5, "5 wasn't in account 0")
    assert.equal(balance1.toNumber(), 5, "5 wasn't in account 1")
  })
  // more tests here
  // fifth test
  it('should mint no coins if sent from account 1', async function () {
    // try to mint 10 coins from using account 1
    await truffleAssert.reverts(ExampleCoinInstance.mint(accounts[1], 10, { 'from': accounts[1] }))
    // fetch the balance of account 1
    let balance = await ExampleCoinInstance.balances(accounts[1])
    // check that the balance of account 1 is still 0
    assert.equal(balance.toNumber(), 0, "0 wasn't in account 1")
  })

})