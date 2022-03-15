// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

contract RentalAgreement {
    function sayHelloWorld() external pure returns (string memory) {
        return "Hello, world!";
    }

    uint roomID;
    address ladd;

    mapping(address => uint) data;

    constructor (address _ladd, uint _roomID) {
        data[_ladd] = _roomID;
        ladd = _ladd;
    }

    function getRoomInternalId() public view returns(uint) {
        return data[ladd];
    }

    function getLandlord() public view returns(address) {
        return ladd;
    }
}
