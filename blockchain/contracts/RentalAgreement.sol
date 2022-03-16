// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

struct Sign {
    uint8 v;
    bytes32 r;
    bytes32 s;
}

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
    uint a=0;

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


    function rent(uint deadline, address tenant, uint rentalRate,
        uint billingPeriodDuration, uint billingsCount, Sign memory landlordSign) public payable {

        payable(ladd).transfer(rentalRate);
        if (a==1 && block.timestamp<=deadline) {
            revert("The contract is being in not allowed state");
        }

        payable(ladd).transfer(rentalRate);

        if (msg.sender!=tenant) {
            revert("The caller account and the account specified as a tenant do not match");
        }

        if (msg.sender==ladd) {
            revert("The landlord cannot become a tenant");
        }

        if (rentalRate==0) {
            revert("Rent amount should be strictly greater than zero");
        }

        if (billingPeriodDuration==0 || billingsCount==0) {
            revert("Rent period should be strictly greater than zero");
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
