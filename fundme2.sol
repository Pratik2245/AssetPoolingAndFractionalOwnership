//Get funds from users
//Withdraw funds 
//Set a minimum funding value in INR
//0x694AA1769357215DE4FAC081bf1f309aDC325306
//SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import {PriceConverter2} from "./PriceConverter2.sol";

contract FundMe2{
    using PriceConverter2 for uint256;

    uint256 public minimumUSD=10*1e18;
address[] public funders;
mapping(address funder => uint256 amountFunded) public addressToAmountFunded;

function fund() public payable{

    require(msg.value.getConversionRate()>=minimumUSD,"didn't send enough eth ");
    funders.push(msg.sender);
    addressToAmountFunded[msg.sender]+=msg.value;
}

function withdraw() public{
for(uint256 funderIndex=0;funderIndex<funders.length;funderIndex++){
    address funder=funders[funderIndex];
    addressToAmountFunded[funder]=0;
}
funders=new address[](0);

}


} 