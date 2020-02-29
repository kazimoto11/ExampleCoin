pragma solidity >=0.5.0;

contract ExampleCoin {
    //declares a state variable minter of type address that is publicly accessible
    //The keyword public automatically generates a getter-function that allows
    //you to access the current value of the state variable.
    //This function can either be called internally or via transactions from other contracts or users
    address public minter;

    //creates a public state variable, balances, that allows addresses to be mapped to unsigned integers
    mapping (address => uint) public balances;

    //declares the event Sent, which is executed in the last line of the function send
    //User interfaces are able to listen to events being fired on the blockchain without much cost
    //As soon as it is fired, the listener will also receive the arguments from, to and amount, which makes it easy to track transactions
    //Events allow light clients to track and react to transactions efficiently.
    event Sent(address from, address to, uint amount);

    //When a contract is created, the constructor function is executed only once and never again
    //While deploying the contract, the constructor is invoked and is used to initialize the state variables.
    //It permanently stores the address of the person creating the contract.
    //The information is retrieved from the global variable msg, that contains some properties which allow access to the blockchain
    //msg.sender always stores the address of the user or contract executing the current (external) function call.
    constructor() public {
        minter = msg.sender;
    }

    //The two functions mint and send are accessible only to users because they are external.

    //mint, however, can only be successfully executed by the creator of the contract
    //because it checks if the message sender is the minter,
    //(note that is functionality could have also been implemented as a modifier).
    //If another user calls this function, it will return without executing the mining,
    //The mint function controls the supply of the currency by issuing new coins to the creator of the contract.

    function mint(address receiver, uint amount) public {
        require(msg.sender == minter, "Function can only be called by minter.");
        require(amount < 1e60, "Amount is too high.");
        balances[receiver] += amount;
    }

    //send can be used by anyone who already has some of these coins to send coins to somebody else.
    //Note that if you use this contract to send coins to an address,
    //you will not see these coins when you look at that address on an Ethereum blockchain explorer,
    //because the balance is only stored in the data storage of that particular coin contract.
    // By the use of events, however, it is relatively easy to create your own “blockchain explorer”,
    //that tracks transactions and balances of your new coin.

    function send(address receiver, uint amount) public {
        require(amount <= balances[msg.sender], "Insufficient balance.");
        balances[msg.sender] -= amount;
        balances[receiver] += amount;
        emit Sent(msg.sender, receiver, amount);
    }
}