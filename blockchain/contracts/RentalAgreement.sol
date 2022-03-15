// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

contract RentalAgreement {
    function sayHelloWorld() external pure returns (string memory) {
        return "Hello, world!";
    }

    uint roomID;
    address ladd;
    address tadd;
    uint rrate;
    uint duration;
    uint stime;
    uint endtime;
    uint256 public balance;

    mapping(address => uint) data;
    mapping(address => bool) hasContract;

    constructor (uint _roomID) {
        data[msg.sender] = _roomID;
        ladd = msg.sender;
    }

    function getRoomInternalId() public view returns(uint) {
        return data[ladd];
    }

    function getLandlord() public view returns(address) {
        return ladd;
    }

    struct Sign {
        uint8 v;
        bytes32 r;
        bytes32 s;
    }

    function RentalPermit(uint256 deadline, address tenant, uint256 rentalRate, 
        uint256 billingPeriodDuration, uint256 billingsCount) public {
        
    }

    function EIP712Domain(string memory name,string memory version,address verifyingContract) public{
        name = "Rental Agreement";
        version = "1.0";
    }

    uint a=0;
    function rent(uint deadline, address tenant, uint rentalRate, 
        uint billingPeriodDuration, uint billingsCount, Sign memory landlordSign) public payable {
        tadd = tenant;
        if (a==1) {
            revert("The contract is being in not allowed state");
        }
        hasContract[tadd];
        rrate = rentalRate;
        duration = billingPeriodDuration;
        stime = deadline - 10;
        endtime = billingsCount * billingPeriodDuration + stime;
        a=1;
    }

    function getTenant() view public returns (address) {
        return tadd;
    }

    function getRentalRate() view public returns (uint) {
        return rrate;
    }

    function getBillingPeriodDuration() view public returns (uint) {
        return duration;
    }

    function getRentStartTime() view public returns (uint) {
        return stime;
    }

    function getRentEndTime() view public returns (uint) {
        return endtime;
    }

    function balanceo() view public returns(uint256) {
        return address(this).balance;
    }
}