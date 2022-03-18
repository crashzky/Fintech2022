// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;
//
//library IterableMapping {
//    // Iterable mapping from address to uint;
//    struct Map {
//        address[] keys;
//        mapping(address => uint) values;
//        mapping(address => uint) indexOf;
//        mapping(address => bool) inserted;
//    }
//
//    function get(Map storage map, address key) public view returns (uint) {
//        return cashiers.values[key];
//    }
//
//    function getKeyAtIndex(Map storage map, uint index) public view returns (address) {
//        return cashiers.keys[index];
//    }
//
//    function size(Map storage map) public view returns (uint) {
//        return cashiers.keys.length;
//    }
//
//    function set(
//        Map storage map,
//        address key,
//        uint val
//    ) public {
//        if (cashiers.inserted[key]) {
//            cashiers.values[key] = val;
//        } else {
//            cashiers.inserted[key] = true;
//            cashiers.values[key] = val;
//            cashiers.indexOf[key] = cashiers.keys.length;
//            cashiers.keys.push(key);
//        }
//    }
//
//    function remove(Map storage map, address key) public {
//        if (!cashiers.inserted[key]) {
//            return;
//        }
//
//        delete cashiers.inserted[key];
//        delete cashiers.values[key];
//
//        uint index = cashiers.indexOf[key];
//        uint lastIndex = cashiers.keys.length - 1;
//        address lastKey = cashiers.keys[lastIndex];
//
//        cashiers.indexOf[lastKey] = index;
//        delete cashiers.indexOf[key];
//
//        cashiers.keys[index] = lastKey;
//        cashiers.keys.pop();
//    }
//}


contract RentalAgreement {

    struct Map {
        address[] keys;
        mapping(address => uint) values;
        mapping(address => uint) indexOf;
        mapping(address => bool) inserted;
    }

    event PurchasePayment(uint amount);

    // VRS Signature
    struct Sign {
        uint8 v;
        bytes32 r;
        bytes32 s;
    }
    // From constructor
    uint globalRoomInternalID;
    address globalLandlord;

    // From rent
    address globalTenant;
    uint globalRentalRate;
    uint globalBillingPeriodDuration;
    uint globalRentStartTime;
    uint globalRentEndTime;
    uint globalBillingsCount;
    bool globalIsRented = false;

    // landlord profit
    uint landlordProfit = 0;

    // Cashiers
    Map cashiers;
    mapping(uint => address) cashierNonce;
    uint cashierIncrement = 1;
    uint cashierNonceIncrement = 1;

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
        globalRentEndTime = block.timestamp + billingsCount * billingPeriodDuration;
        globalBillingsCount = billingsCount;
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

        landlordProfit += rentalRate;

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
        uint newNonce = ++cashierIncrement;
        if (cashiers.inserted[addr]) {
            cashiers.values[addr] = newNonce;
        } else {
            cashiers.inserted[addr] = true;
            cashiers.values[addr] = newNonce;
            cashiers.indexOf[addr] = cashiers.keys.length;
            cashiers.keys.push(addr);
        }

        cashierNonce[newNonce] = addr;
    }

    // Check if cashier exists
    function getCashierNonce(address cashierAddr) public view returns (uint) {
        return cashiers.values[cashierAddr];
    }

    function removeCashier(address cashierAddr) public {
        if (msg.sender != globalTenant) {
            revert("You are not a tenant");
        } else if (cashiers.values[cashierAddr] == 0) {
            revert("Unknown cashier");
        }

        if (!cashiers.inserted[cashierAddr]) {
            return;
        }

        delete cashiers.inserted[cashierAddr];
        delete cashiers.values[cashierAddr];

        uint index = cashiers.indexOf[cashierAddr];
        uint lastIndex = cashiers.keys.length - 1;
        address lastKey = cashiers.keys[lastIndex];

        cashiers.indexOf[lastKey] = index;
        delete cashiers.indexOf[cashierAddr];

        cashiers.keys[index] = lastKey;
        cashiers.keys.pop();

    }

    function getCashiersList() view public returns (address[] memory) {
        return cashiers.keys;
    }

    function pay(
        uint deadline,
        uint nonce,
        uint value,
        Sign memory cashierSign
    ) payable public {
        // Renew rent end time

        address cashierAddress = cashierNonce[nonce];
        // Таймтамп на месяце, который полностью оплачен
        uint payedPeriodTime = globalRentStartTime + (landlordProfit / globalRentalRate)*globalBillingPeriodDuration;
        if (cashierAddress == address(0)) {
            revert("Invalid nonce");
        } else if (msg.value != value) {
            revert("Invalid value");
        } else if (block.timestamp > deadline) {
            revert("The operation is outdated");
        }
        if (
            deadline > globalRentEndTime
            || block.timestamp > payedPeriodTime
        ) {
            revert("The contract is being in not allowed state");
        }

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


        bytes32 cashierSignKeccak = keccak256(
            abi.encode(
                keccak256("Ticket(uint256 deadline,uint256 nonce,uint256 value)"),
                deadline,
                nonce,
                value
            )
        );


        bytes32 messageHash = keccak256(abi.encodePacked("\x19\x01", EIP712Domain, cashierSignKeccak));
        address signer = ecrecover(messageHash, cashierSign.v, cashierSign.r, cashierSign.s);

        if (cashierAddress != signer) {
            revert("Unknown cashier");
        }

//        // Если следующий период не покрыт
//        if (payedPeriodTime - globalBillingPeriodDuration < deadline) {
//            // Иделаьный профит для лендрода за эту сделку, который нужен для покрытия
//            // задолженности по следующему месяцу
//            uint landlordPerfectProfit = (payedPeriodTime + globalBillingPeriodDuration) / globalBillingPeriodDuration;
//            // Сумма, которую нужно получить лендлорду, чтобы получить иделаьный профит
//            uint landlordRequiredToGet = landlordPerfectProfit - landlordProfit;
//
//            // Если эта сумма перекрывается текущей оплатой,
//            // То нужно остаток отдать тенанту
//            // Иначе вся сумма идет ленлорду
//            if (landlordRequiredToGet < value) {
//                landlordProfit += landlordRequiredToGet;
//                payable(globalLandlord).transfer(landlordRequiredToGet);
//                payable(globalTenant).transfer(value - landlordRequiredToGet);
//            } else {
//                landlordProfit += value;
//                payable(globalLandlord).transfer(value);
//            }
//        } else {
//            payable(globalTenant).transfer(value);
//        }
//        emit PurchasePayment(value);

        // Если следующий период не покрыт
        if (payedPeriodTime - globalBillingPeriodDuration < deadline) {
            // Иделаьный профит для лендрода за эту сделку, который нужен для покрытия
            // задолженности по следующему месяцу
            uint landlordPerfectProfit = (payedPeriodTime + globalBillingPeriodDuration) / globalBillingPeriodDuration;
            // Сумма, которую нужно получить лендлорду, чтобы получить иделаьный профит
            uint landlordRequiredToGet = landlordPerfectProfit - landlordProfit;

            // Если эта сумма перекрывается текущей оплатой,
            // То нужно остаток отдать тенанту
            // Иначе вся сумма идет ленлорду
            if (landlordRequiredToGet < value) {
                landlordProfit += landlordRequiredToGet;
                payable(globalLandlord).transfer(landlordRequiredToGet);
                payable(globalTenant).transfer(value - landlordRequiredToGet);
            } else {
                landlordProfit += value;
                payable(globalLandlord).transfer(value);
            }
        } else {
            payable(globalTenant).transfer(value);
        }
        emit PurchasePayment(value);


        // Renew nonce
        uint newNonce = ++cashierIncrement;
        delete cashierNonce[nonce];
        cashiers.values[cashierAddress] = newNonce;
        cashierNonce[newNonce] = cashierAddress;
    }
}
