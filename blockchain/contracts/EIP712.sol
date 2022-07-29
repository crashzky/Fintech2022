// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

contract EIP712 {
    uint8 v;
    bytes32 r;
    bytes32 s;

    function setSign(
        uint8 _v,
        bytes32 _r,
        bytes32 _s
    ) public {
        v = _v;
        r = _r;
        s = _s;
    }

    function getSigner(bytes32 hash) private returns (address) {
        return ecrecover(hash, v, r, s);
    }

    bytes32 private constant DOMAIN_HASH =
        keccak256(
            "EIP712Domain(string name,string version,address, verifyingContract)"
        );

    bytes32 private constant TICKET_TYPE =
        keccak256("Ticket(uint256 deadline,uint256 nonce,uint256 value)");

    function getHashToSigh(
        address addr,
        uint256 deadline,
        uint256 nonce,
        uint256 value
    ) public returns (bytes32) {
        bytes32 DOMAIN_SEPARATOR = keccak256(
            abi.encode(
                DOMAIN_HASH,
                keccak256("Rental Agreement"),
                keccak256("1.0"),
                addr
            )
        );
        return
            keccak256(
                abi.encodePacked(
                    "\x19\x01",
                    DOMAIN_SEPARATOR,
                    keccak256(abi.encode(TICKET_TYPE, deadline, nonce, value))
                )
            );
    }

    function recover(
        address addr,
        uint256 deadline,
        uint256 nonce,
        uint256 value
    ) public returns (address) {
        return getSigner(getHashToSigh(addr, deadline, nonce, value));
    }

    constructor() {}
}
