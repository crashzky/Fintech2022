// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

contract Nft {
    address private owner;
    string private nftUrl;

    constructor(string memory _nftUrl, address _owner) {
        nftUrl = _nftUrl;
        owner = _owner;
    }

    function getNftOwner() public view returns (address) {
        return owner;
    }

    function getNftUrl() public view returns (string memory) {
        require(owner == msg.sender, "You must be nft owner to cal this method");
        
        return nftUrl;
    }

    function changeNftOwner(address newOwner) public {
        require(owner == msg.sender, "You must be nft owner to cal this method");

        owner = newOwner;
    }
}

