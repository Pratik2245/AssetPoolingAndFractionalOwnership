// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract APFOS_WALLET {
    address public owner;
    mapping(string => uint256) public balances;

    constructor() {
        owner = msg.sender;
    }

    function deposit(string memory id) external payable {
        require(msg.value > 0, "Deposit amount must be greater than 0");
        balances[id] += msg.value;
    }

    function withdraw(string memory id,uint _amount ,address payable _receiver) external payable  {
        require(_amount > 0, "Withdrawal amount must be greater than 0");
        require(_amount <= balances[id], "Insufficient balance");
        
        // Transfer Ether to the specified receiver
        _receiver.transfer(_amount);
        
        // Update the balance
        balances[id] -= _amount;
    }

    function getBalance(string memory id) external view returns (uint256) {
        return balances[id];
    }

    function contractBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
