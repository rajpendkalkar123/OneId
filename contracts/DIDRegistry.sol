// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// This smart contract issues Decentralized Identifiers (DIDs).

contract DIDRegistry {
    struct DID {
        bytes32 didHash;
        address owner;
    }

    mapping(address => DID) public dids;
    event DIDIssued(address indexed user, bytes32 didHash);
    event DIDUpdated(address indexed user, bytes32 newDIDHash);

    function issueDID(bytes32 didHash) external {
        require(dids[msg.sender].didHash == 0, "DID already exists");
        dids[msg.sender] = DID(didHash, msg.sender);
        emit DIDIssued(msg.sender, didHash);
    }

    function updateDID(bytes32 newDIDHash) external {
        require(dids[msg.sender].didHash != 0, "DID not found");
        dids[msg.sender].didHash = newDIDHash;
        emit DIDUpdated(msg.sender, newDIDHash);
    }

    function resolveDID(address user) external view returns (bytes32) {
        return dids[user].didHash;
    }
}
