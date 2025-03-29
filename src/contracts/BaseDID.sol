// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract BaseDID {
    struct DID {
        string identifier;
        bool active;
        uint256 createdAt;
        uint256 updatedAt;
    }

    mapping(address => DID[]) public userDIDs;
    mapping(address => mapping(uint256 => mapping(address => mapping(string => bool)))) public accessControl;

    event DIDCreated(address indexed owner, string identifier);
    event AccessGranted(address indexed owner, uint256 indexed didIndex, address indexed user, string attribute);
    event AccessRevoked(address indexed owner, uint256 indexed didIndex, address indexed user, string attribute);

    modifier onlyDIDOwner(uint256 didIndex) {
        require(didIndex < userDIDs[msg.sender].length, "DID does not exist");
        _;
    }

    function createDID(string memory identifier) internal {
        userDIDs[msg.sender].push(DID({
            identifier: identifier,
            active: true,
            createdAt: block.timestamp,
            updatedAt: block.timestamp
        }));

        emit DIDCreated(msg.sender, identifier);
    }

    function grantAccess(uint256 didIndex, address user, string memory attribute) internal {
        require(didIndex < userDIDs[msg.sender].length, "DID does not exist");
        accessControl[msg.sender][didIndex][user][attribute] = true;
        emit AccessGranted(msg.sender, didIndex, user, attribute);
    }

    function revokeAccess(uint256 didIndex, address user, string memory attribute) internal {
        require(didIndex < userDIDs[msg.sender].length, "DID does not exist");
        accessControl[msg.sender][didIndex][user][attribute] = false;
        emit AccessRevoked(msg.sender, didIndex, user, attribute);
    }

    function hasAccess(address owner, uint256 didIndex, address user, string memory attribute) public view returns (bool) {
        return accessControl[owner][didIndex][user][attribute];
    }

    function getUserDIDs(address owner) public view returns (DID[] memory) {
        return userDIDs[owner];
    }
} 