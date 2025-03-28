// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// This smart contract works as a recovery mechanisms in case of key loss or revocation.


contract IdentityRecovery {
    struct RecoveryRequest {
        address newOwner;
        uint8 approvals;
        bool active;
    }

    mapping(address => address[]) public guardians;
    mapping(address => RecoveryRequest) public recoveryRequests;
    event GuardianAdded(address indexed user, address guardian);
    event RecoveryRequested(address indexed user, address newOwner);
    event RecoveryApproved(address indexed user, address newOwner, uint8 approvals);
    event IdentityRecovered(address indexed user, address newOwner);

    function addGuardian(address guardian) external {
        require(guardian != msg.sender, "Cannot add yourself as a guardian");
        guardians[msg.sender].push(guardian);
        emit GuardianAdded(msg.sender, guardian);
    }

    function requestRecovery(address newOwner) external {
        require(guardians[msg.sender].length > 1, "At least 2 guardians required");
        recoveryRequests[msg.sender] = RecoveryRequest(newOwner, 0, true);
        emit RecoveryRequested(msg.sender, newOwner);
    }

    function approveRecovery(address user) external {
        require(recoveryRequests[user].active, "No active recovery request");
        bool isGuardian = false;
        for (uint256 i = 0; i < guardians[user].length; i++) {
            if (guardians[user][i] == msg.sender) {
                isGuardian = true;
                break;
            }
        }
        require(isGuardian, "Not a guardian");

        recoveryRequests[user].approvals++;
        emit RecoveryApproved(user, recoveryRequests[user].newOwner, recoveryRequests[user].approvals);

        if (recoveryRequests[user].approvals >= 2) {
            address newOwner = recoveryRequests[user].newOwner;
            delete recoveryRequests[user];
            emit IdentityRecovered(user, newOwner);
        }
    }
}
