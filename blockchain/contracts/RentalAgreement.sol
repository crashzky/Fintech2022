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

    mapping(address => uint) data;

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

    function RentalPermit(uint256 deadline,address tenant,uint256 rentalRate,uint256 billingPeriodDuration,uint256 billingsCount) public {
        
    }

    function EIP712Domain(string memory name,string memory version,address verifyingContract) public{
        name = "Rental Agreement";
        version = "1.0";
    }

    uint a=0;
    function rent(uint deadline, address tenant, uint rentalRate, 
        uint billingPeriodDuration, uint billingsCount, Sign memory landlordSign) public payable {
        tadd = tenant;
        
        rrate = rentalRate;
        duration = billingPeriodDuration;
        stime = deadline - 10;
        endtime = billingsCount * billingPeriodDuration + stime;
        a=1;
        payable(address(this)).transfer(rentalRate);


        bytes32 message = keccak256(abi.encode(deadline, tenant, rentalRate, billingPeriodDuration, billingsCount));
        address signer = ecrecover(message, landlordSign.v, landlordSign.r, landlordSign.s);

        if (signer != ladd) {
            revert("Invalid landlord sign");
        }
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

    address[] cashiers;
    uint i=0;
    function addCashier(address addr) public {
        if (addr!=tadd && msg.sender!=tadd) {
            revert("You are not a tenant");
        }
        if (msg.sender==tadd && addr==ladd) {
            revert("The landlord cannot become a cashier");
        }
        if (msg.sender==tadd && addr==address(0)) {
            revert("Zero address cannot become a cashier");
        }
        cashiers[i] = addr;
        i++;
    }

    function getCashierNonce(address cashierAddr) view public returns (uint) {
        if (msg.sender!=tadd) {
            return 0;
        }
    }
}