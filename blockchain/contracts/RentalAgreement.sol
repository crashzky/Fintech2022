// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

// VRS Signature
struct Sign {
    uint8 v;
    bytes32 r;
    bytes32 s;
}

library IterableMapping {
    // Iterable mapping from address to uint;
    struct Map {
        address[] keys;
        mapping(address => uint) values;
        mapping(address => uint) indexOf;
        mapping(address => bool) inserted;
    }

    function get(Map storage map, address key) public view returns (uint) {
        return map.values[key];
    }

    function getKeyAtIndex(Map storage map, uint index) public view returns (address) {
        return map.keys[index];
    }

    function size(Map storage map) public view returns (uint) {
        return map.keys.length;
    }

    function set(
        Map storage map,
        address key,
        uint val
    ) public {
        if (map.inserted[key]) {
            map.values[key] = val;
        } else {
            map.inserted[key] = true;
            map.values[key] = val;
            map.indexOf[key] = map.keys.length;
            map.keys.push(key);
        }
    }

    function remove(Map storage map, address key) public {
        if (!map.inserted[key]) {
            return;
        }

        delete map.inserted[key];
        delete map.values[key];

        uint index = map.indexOf[key];
        uint lastIndex = map.keys.length - 1;
        address lastKey = map.keys[lastIndex];

        map.indexOf[lastKey] = index;
        delete map.indexOf[key];

        map.keys[index] = lastKey;
        map.keys.pop();
    }
}


contract RentalAgreement {
    using IterableMapping for IterableMapping.Map;
    event PurchasePayment(uint amount);
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

    // Cashiers
    IterableMapping.Map cashiers;
    address[] public cashiersList;
    uint cashierIncrement = 1;
    uint cashierDecrement = 0;

    // For pay
    bool Paid = false;

    constructor (uint roomInternalId) {
        globalRoomInternalID = roomInternalId;
        globalLandlord = msg.sender;
    }

    function getRoomInternalId() public view returns(uint) {
        return globalRoomInternalID;
    }

    function getLandlord() public view returns(address) {
        return globalLandlord;
    }

    function getRentedState() public view returns(bool) {
        return globalIsRented;
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

        // Verify sign
        bytes32 EIP712Domain = keccak256(
            abi.encode(
                keccak256(
                    "EIP712Domain(string name,string version,address verifyingContract)"
                ),
                keccak256(bytes("Rental Agreement")),
                keccak256(bytes("1.0")),
                address(this)
            )
        );

        bytes32 RentalPermit = keccak256(
            abi.encode(
                keccak256("RentalPermit(uint256 deadline,address tenant,uint256 rentalRate,uint256 billingPeriodDuration,uint256 billingsCount)"),
                deadline,
                tenant,
                rentalRate,
                billingPeriodDuration,
                billingsCount
            )
        );

        bytes32 messageHash = keccak256(abi.encodePacked("\x19\x01", EIP712Domain, RentalPermit));
        address signer = ecrecover(messageHash, landlordSign.v, landlordSign.r, landlordSign.s);

        // 002 checks
        if (signer != globalLandlord) {
            revert("Invalid landlord sign");
        } else if (block.timestamp > deadline) {
            revert("The operation is outdated");
        } else if (msg.sender != tenant) {
            revert("The caller account and the account specified as a tenant do not match");
        } else if (msg.sender == globalLandlord) {
            revert("The landlord cannot become a tenant");
        } else if (rentalRate <= 0) {
            revert("Rent amount should be strictly greater than zero");
        } else if (billingPeriodDuration <= 0) {
            revert("Rent period should be strictly greater than zero");
        } else if (billingsCount <= 0) {
            revert("Rent period repeats should be strictly greater than zero");
        } else if (msg.value != rentalRate) {
            revert("Incorrect deposit");
        }

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

    function addCashier(address addr) public {
        if (msg.sender != globalTenant) {
            revert("You are not a tenant");
        } else if (addr == globalLandlord) {
            revert("The landlord cannot become a cashier");
        } else if (addr == address(0)) {
            revert("Zero address cannot become a cashier");
        }
        // Commit it
        cashiers.set(addr, ++cashierIncrement);
    }

    // Check if cashier exists
    function getCashierNonce(address cashierAddr) view public returns (uint) {
        return cashiers.get(cashierAddr);
    }

    function removeCashier(address cashierAddr) public {
        if (msg.sender != globalTenant) {
            revert("You are not a tenant");
        } else if (cashiers.get(cashierAddr) == 0) {
            revert("Unknown cashier");
        }

        cashiers.remove(cashierAddr);

    }

    function getCashiersList() view public returns (address[] memory) {
        return cashiers.keys;
    }

    function pay(uint deadline, uint nonce, uint value, Sign memory cashierSign) payable public {
        payable(globalTenant).transfer(value);
        emit PurchasePayment(value);
        Paid = true;
    }
}
