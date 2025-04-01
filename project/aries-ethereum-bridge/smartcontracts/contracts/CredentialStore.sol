// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CredentialStore {
    mapping(string => bytes32) private credentialHashes;
    mapping(string => address) private transactionOwners;
    mapping(string => string) private credentialMetadata;

    event CredentialStored(string credentialId, bytes32 credentialHash, address sender);
    event CredentialUpdated(string credentialId, bytes32 credentialHash, address sender);

    function storeCredential(string memory credentialId, bytes32 credentialHash) public {
        require(credentialHashes[credentialId] == bytes32(0), "Credential ID already exists");
        credentialHashes[credentialId] = credentialHash;
        transactionOwners[credentialId] = msg.sender;
        emit CredentialStored(credentialId, credentialHash, msg.sender);
    }

    function updateCredential(string memory credentialId, bytes32 credentialHash) public {
        require(credentialHashes[credentialId] != bytes32(0), "Credential ID does not exist");
        credentialHashes[credentialId] = credentialHash;
        transactionOwners[credentialId] = msg.sender;
        emit CredentialUpdated(credentialId, credentialHash, msg.sender);
    }

    function getCredential(string memory credentialId) public view returns (bytes32) {
        return credentialHashes[credentialId];
    }

    function getTransactionOwner(string memory credentialId) public view returns (address) {
        return transactionOwners[credentialId];
    }

    function storeMetadata(string memory credentialId, string memory metadata) public {
        require(credentialHashes[credentialId] != bytes32(0), "Credential ID does not exist");
        credentialMetadata[credentialId] = metadata;
    }

    function getMetadata(string memory credentialId) public view returns (string memory) {
        return credentialMetadata[credentialId];
    }
}