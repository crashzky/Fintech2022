// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

// VRS Signature
struct Sign {
    uint8 v;
    bytes32 r;
    bytes32 s;
}

contract RentalAgreement {
    // From constructor
    uint globalRoomInternalID;
    address globalLandlord;

    // From rent
    address globalTenant;
    uint globalRentalRate;
    uint globalBillingPeriodDuration;
    uint globalRentStartTime;
    uint globalRentEndTime;
    bool globalIsRented = false;

    constructor (uint roomInternalId) {
        globalRoomInternalID = roomInternalId;
        globalLandlord = msg.sender;
    }

    function getRoomInternalId() public view returns(uint) {
        return globalLandlord;
    }

    function getLandlord() public view returns(address) {
        return globalLandlord;
    }

    function rent(
        uint deadline,
        address tenant,
        uint rentalRate,
        uint billingPeriodDuration,
        uint billingsCount,
        Sign memory landlordSign
    ) public payable {

        // Check it's still free
        if (globalIsRented) {
            revert("The contract is being in not allowed state");
        }

        // Save last settings to global scope
        globalTenant = tenant;
        globalRentalRate = rentalRate;
        globalBillingPeriodDuration = billingPeriodDuration;
        globalRentStartTime = block.timestamp;
        globalRentEndTime = globalRentStartTime + billingsCount * billingPeriodDuration;
        globalIsRented = true;

        // Complete transaction and pay for the renting
        payable(globalLandlord).transfer(rentalRate);
    }

    function getTenant() view public returns (address) {
        return globalTenant;
    }

    function getRentalRate() view public returns (uint) {
        return globalRentalRate;
    }

    function getBillingPeriodDuration() view public returns (uint) {
        return globalBillingPeriodDuration;
    }

    function getRentStartTime() view public returns (uint) {
        return globalRentStartTime;
    }

    function getRentEndTime() view public returns (uint) {
        return globalRentEndTime;
    }

//    address[] cashiers;
//    uint i=0;
//    function addCashier(address addr) public {
//        if (addr!=tadd && msg.sender!=tadd) {
//            revert("You are not a tenant");
//        }
//        if (msg.sender==tadd && addr==ladd) {
//            revert("The landlord cannot become a cashier");
//        }
//        if (msg.sender==tadd && addr==address(0)) {
//            revert("Zero address cannot become a cashier");
//        }
//        cashiers[i] = addr;
//        i++;
//    }
//
//    function getCashierNonce(address cashierAddr) view public returns (uint) {
//        if (msg.sender!=tadd) {
//            return 0;
//        }
//    }
}
