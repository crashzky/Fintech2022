// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

contract RentalAgreement {
    function sayHelloWorld() external pure returns (string memory) {
        return "Hello, world!";
    }

    uint roomID;
    address ladd;
    address tadd;

    mapping(address => uint) data;

    constructor (uint _roomID) {
        data[msg.sender] = _roomID;
        ladd = msg.sender;
    }

    function getRoomInternalId() public view returns(uint) {
        return data[msg.sender];
    }

    function getLandlord() public view returns(address) {
        return msg.sender;
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

    function rent(uint deadline, address tenant, uint rentalRate, 
        uint billingPeriodDuration, uint billingsCount, Sign memory landlordSign ) public payable {
        
        tadd = tenant;

    }

    function getTenant() view public returns (address) {
        return tadd;
    }
}

