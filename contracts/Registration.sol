//SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// This smart contract manages user identity registration, verification, and revocation.

contract IdentityRegistry {
    struct Identity {
        bytes32 hashedIdentity;
        address issuer;
        bool verified;
    }

    mapping(address => Identity) public identities;
    event IdentityRegistered(address indexed user, bytes32 hashedIdentity, address issuer);
    event IdentityVerified(address indexed user);
    event IdentityRevoked(address indexed user);

    function registerUser(bytes32 hashedIdentity, address issuer) external {
        require(identities[msg.sender].hashedIdentity == 0, "User already registered");
        identities[msg.sender] = Identity(hashedIdentity, issuer, false);
        emit IdentityRegistered(msg.sender, hashedIdentity, issuer);
    }

    function verifyIdentity(address user) external {
        require(msg.sender == identities[user].issuer, "Only issuer can verify");
        identities[user].verified = true;
        emit IdentityVerified(user);
    }

    function revokeIdentity(address user) external {
        require(msg.sender == identities[user].issuer, "Only issuer can revoke");
        delete identities[user];
        emit IdentityRevoked(user);
    }
}
