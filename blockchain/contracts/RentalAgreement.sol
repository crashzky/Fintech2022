// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

struct Sign {
    uint8 v;
    bytes32 r;
    bytes32 s;
}

contract RentalAgreement {
    function getSigner(bytes32 hash, Sign calldata sign)
        private
        pure
        returns (address)
    {
        return ecrecover(hash, sign.v, sign.r, sign.s);
    }

    bytes32 private constant DOMAIN_HASH =
        keccak256(
            "EIP712Domain(string name,string version,address verifyingContract)"
        );
    bytes32 private DOMAIN_SEPARATOR =
        keccak256(
            abi.encode(
                DOMAIN_HASH,
                keccak256("Rental Agreement"),
                keccak256("1.0"),
                address(this)
            )
        );

    bytes32 private constant RENTAL_PERMIT_TYPE =
        keccak256(
            "RentalPermit(uint256 deadline,address tenant,uint256 rentalRate,uint256 billingPeriodDuration,uint256 billingsCount)"
        );

    bytes32 private constant TICKET_TYPE =
        keccak256("Ticket(uint256 deadline,uint256 nonce,uint256 value)");

    bytes32 private constant END_CONSENT_TYPE =
        keccak256("EndConsent(uint256 deadline)");

    uint256 roomInternalId;
    address landlord;

    address tenant = address(0);
    uint256 deadline;
    uint256 rentalRate;
    uint256 rentStartTime;
    uint256 billingPeriodDuration;
    uint256 billingsCount;

    function isRented() public view returns (bool) {
        return tenant != address(0);
    }

    function isExpired() public view returns (bool) {
        return block.timestamp >= getRentEndTime();
    }

    uint256 paidPeriod = 1;
    uint256 periodProfit;
    uint256 tenantProfit;
    uint256 landlordProfit;

    function isPaid() public view returns (bool) {
        return paidPeriod >= getBillingPeriod();
    }

    function getBillingPeriod() internal view returns (uint256) {
        return (block.timestamp - rentStartTime) / billingPeriodDuration + 1;
    }

    constructor(uint256 _roomInternalId) {
        roomInternalId = _roomInternalId;
        landlord = msg.sender;
    }

    function getRoomInternalId() public view returns (uint256) {
        return roomInternalId;
    }

    function getLandlord() public view returns (address) {
        return landlord;
    }

    function rent(
        uint256 _deadline,
        address _tenant,
        uint256 _rentalRate,
        uint256 _billingPeriodDuration,
        uint256 _billingsCount,
        Sign calldata landlordSign
    ) external payable {
        bytes32 expectedHash = keccak256(
            abi.encodePacked(
                "\x19\x01",
                DOMAIN_SEPARATOR,
                keccak256(
                    abi.encode(
                        RENTAL_PERMIT_TYPE,
                        _deadline,
                        _tenant,
                        _rentalRate,
                        _billingPeriodDuration,
                        _billingsCount
                    )
                )
            )
        );

        require(!isRented(), "The contract is being in not allowed state");
        require(
            getSigner(expectedHash, landlordSign) == landlord,
            "Invalid landlord sign"
        );
        require(_deadline > block.timestamp, "The operation is outdated");
        require(
            msg.sender == _tenant,
            "The caller account and the account specified as a tenant do not match"
        );
        require(msg.sender != landlord, "The landlord cannot become a tenant");
        require(
            _rentalRate > 0,
            "Rent amount should be strictly greater than zero"
        );
        require(
            _billingPeriodDuration > 0,
            "Rent period should be strictly greater than zero"
        );
        require(
            _billingsCount > 0,
            "Rent period repeats should be strictly greater than zero"
        );
        require(msg.value == _rentalRate, "Incorrect deposit");

        deadline = _deadline;
        tenant = _tenant;
        rentStartTime = block.timestamp;
        rentalRate = _rentalRate;
        billingPeriodDuration = _billingPeriodDuration;
        billingsCount = _billingsCount;
        landlordProfit += _rentalRate;
    }

    function getTenant() public view returns (address) {
        return tenant;
    }

    function getBillingPeriodDuration() public view returns (uint256) {
        return billingPeriodDuration;
    }

    function getRentStartTime() public view returns (uint256) {
        return rentStartTime;
    }

    function getRentEndTime() public view returns (uint256) {
        return rentStartTime + (billingPeriodDuration * billingsCount);
    }

    function getRentalRate() public view returns (uint256) {
        return rentalRate;
    }

    address[] cashiers;
    uint256 cashiersAdditionsCount;
    mapping(address => uint256) nonceBaseByCashier;
    mapping(uint256 => address) cashierByNonceBase;
    mapping(address => uint256) cashierNonce;

    function isCashier(address cashier) public view returns (bool) {
        return cashierNonce[cashier] != 0;
    }

    function addCashier(address cashier) external {
        require(msg.sender == tenant, "You are not a tenant");
        require(cashier != landlord, "The landlord cannot become a cashier");
        require(
            cashier != address(0x0),
            "Zero address cannot become a cashier"
        );

        uint256 nonceBase = uint256(
            keccak256(abi.encode(cashier, cashiersAdditionsCount))
        );
        cashiers.push(cashier);
        cashierNonce[cashier] = 1;
        nonceBaseByCashier[cashier] = nonceBase;
        cashierByNonceBase[nonceBase] = cashier;
        cashiersAdditionsCount += 1;
    }

    function removeCashier(address cashier) external {
        require(msg.sender == tenant, "You are not a tenant");
        require(isCashier(cashier), "Unknown cashier");

        uint256 i = 0;
        for (; i < cashiers.length; i++) if (cashiers[i] == cashier) break;
        cashiers[i] = cashiers[cashiers.length - 1];
        cashiers.pop();
        cashierNonce[cashier] = 0;
        nonceBaseByCashier[cashier] = 0;
    }

    function getCashierNonce(address cashier) public view returns (uint256) {
        return nonceBaseByCashier[cashier] + cashierNonce[cashier];
    }

    function getCashiersList() external view returns (address[] memory) {
        return cashiers;
    }

    event PurchasePayment(uint256 amount);

    function pay(
        uint256 deadline,
        uint256 nonce,
        uint256 value,
        Sign calldata cashierSign
    ) external payable {
        bytes32 expectedHash = keccak256(
            abi.encodePacked(
                "\x19\x01",
                DOMAIN_SEPARATOR,
                keccak256(abi.encode(TICKET_TYPE, deadline, nonce, value))
            )
        );
        address signer = getSigner(expectedHash, cashierSign);

        require(isCashier(signer), "Unknown cashier");
        require(deadline > block.timestamp, "The operation is outdated");
        require(getCashierNonce(signer) == nonce, "Invalid nonce");
        require(msg.value == value, "Invalid value");
        require(!isExpired(), "The contract is being in not allowed state");
        require(isPaid(), "The contract is being in not allowed state");

        cashierNonce[signer] += 1;
        emit PurchasePayment(value);

        uint256 billingPeriod = getBillingPeriod();
        if (paidPeriod == billingPeriod && billingPeriod != billingsCount) {
            periodProfit += msg.value;
            if (periodProfit >= rentalRate) {
                paidPeriod++;
                landlordProfit += rentalRate;
                tenantProfit += periodProfit - rentalRate;
                periodProfit = 0;
            }
        } else tenantProfit += value;
    }

    function getTenantProfit() public view returns (uint256) {
        return tenantProfit;
    }

    function getLandlordProfit() public view returns (uint256) {
        uint256 totalLandlordProfit = landlordProfit;
        if (!isPaid()) totalLandlordProfit += periodProfit;
        if (paidPeriod > getBillingPeriod()) totalLandlordProfit -= rentalRate;
        return totalLandlordProfit;
    }

    function withdrawTenantProfit() public {
        /* require(msg.sender == tenant); */
        address payable tenant = payable(tenant);
        tenant.transfer(getTenantProfit());
        tenantProfit = 0;
    }

    function withdrawLandlordProfit() public {
        /* require(msg.sender == landlord); */
        address payable landlord = payable(landlord);
        landlord.transfer(getLandlordProfit());
        landlordProfit = 0;
        if (!isPaid()) periodProfit = 0;
        if (paidPeriod > getBillingPeriod()) landlordProfit += rentalRate;
    }

    function endAgreementManually(
        uint256 deadline,
        Sign calldata landlordSign,
        Sign calldata tenantSign
    ) public {
        bytes32 expectedHash = keccak256(
            abi.encodePacked(
                "\x19\x01",
                DOMAIN_SEPARATOR,
                keccak256(abi.encode(END_CONSENT_TYPE, deadline))
            )
        );

        address _landlord = getSigner(expectedHash, landlordSign);
        address _tenant = getSigner(expectedHash, tenantSign);
        require(isRented(), "The contract is being in not allowed state");
        require(_tenant == tenant, "Invalid tenant sign");
        require(_landlord == landlord, "Invalid landlord sign");
        require(deadline > block.timestamp, "The operation is outdated");

        uint256 totalTenantProfit = tenantProfit + periodProfit;
        if (paidPeriod > getBillingPeriod()) totalTenantProfit += rentalRate;
        address payable tenant = payable(tenant);
        tenant.transfer(totalTenantProfit);
        selfdestruct(payable(landlord));
    }

    function endAgreement() public {
        require(isRented(), "The contract is being in not allowed state");
        if (!isPaid()) {
            uint256 totalTenantProfit = tenantProfit + periodProfit;
            if (paidPeriod > getBillingPeriod())
                totalTenantProfit += rentalRate;
            address payable tenant = payable(tenant);
            tenant.transfer(totalTenantProfit);
            selfdestruct(payable(landlord));
        } else if (isExpired()) {
            withdrawTenantProfit();
            selfdestruct(payable(landlord));
        } else revert("The contract is being in not allowed state");
    }

    function getTicketSigner(
        uint256 deadline,
        uint256 nonce,
        uint256 value,
        uint8 v,
        uint256 r,
        uint256 s
    ) public returns (address) {
        bytes32 expectedHash = keccak256(
            abi.encodePacked(
                "\x19\x01",
                DOMAIN_SEPARATOR,
                keccak256(abi.encode(TICKET_TYPE, deadline, nonce, value))
            )
        );
        return ecrecover(expectedHash, v, bytes32(r), bytes32(s));
    }
}
