//SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract VerifiableCredentials {
    struct Credential {
        string credentialType;
        bytes32 credentialHash;
        address issuer;
        bool valid;
    }

    mapping(address => Credential[]) public userCredentials;
    event CredentialIssued(address indexed user, string credentialType, bytes32 credentialHash, address issuer);
    event CredentialRevoked(address indexed user, string credentialType);

    function issueCredential(address user, string memory credentialType, bytes32 credentialHash) external {
        userCredentials[user].push(Credential(credentialType, credentialHash, msg.sender, true));
        emit CredentialIssued(user, credentialType, credentialHash, msg.sender);
    }

    function revokeCredential(address user, string memory credentialType) external {
        Credential[] storage credentials = userCredentials[user];
        for (uint256 i = 0; i < credentials.length; i++) {
            if (
                keccak256(abi.encodePacked(credentials[i].credentialType)) == keccak256(abi.encodePacked(credentialType)) &&
                credentials[i].issuer == msg.sender
            ) {
                credentials[i].valid = false;
                emit CredentialRevoked(user, credentialType);
                return;
            }
        }
        revert("Credential not found or unauthorized");
    }

    function verifyCredential(address user, string memory credentialType) external view returns (bool) {
        Credential[] storage credentials = userCredentials[user];
        for (uint256 i = 0; i < credentials.length; i++) {
            if (
                keccak256(abi.encodePacked(credentials[i].credentialType)) == keccak256(abi.encodePacked(credentialType)) &&
                credentials[i].valid
            ) {
                return true;
            }
        }
        return false;
    }
}
