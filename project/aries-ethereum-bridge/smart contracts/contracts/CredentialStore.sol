// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

contract CredentialStore {
    // Credential hash storage
    mapping(string => bytes32) private credentialHashes;
    
    // Transaction tracking for credentials
    mapping(string => string) private transactionIds;
    
    // Metadata for credentials (issuer, timestamp, etc.)
    mapping(string => string) private credentialMetadata;
    
    // Events
    event CredentialStored(string credentialId, bytes32 credentialHash);
    event TransactionLinked(string credentialId, string transactionId);
    
    // Store a credential hash on the blockchain
    function storeCredential(string memory credentialId, bytes32 credentialHash) public {
        credentialHashes[credentialId] = credentialHash;
        emit CredentialStored(credentialId, credentialHash);
    }
    
    // Get a credential hash from the blockchain
    function getCredentialHash(string memory credentialId) public view returns (bytes32) {
        return credentialHashes[credentialId];
    }
    
    // Store related transaction ID (e.g., Aries transaction ID)
    function storeTransactionId(string memory credentialId, string memory txId) public {
        transactionIds[credentialId] = txId;
        emit TransactionLinked(credentialId, txId);
    }
    
    // Get related transaction ID
    function getTransactionId(string memory credentialId) public view returns (string memory) {
        return transactionIds[credentialId];
    }
    
    // Store credential metadata (JSON string)
    function storeMetadata(string memory credentialId, string memory metadata) public {
        credentialMetadata[credentialId] = metadata;
    }
    
    // Get credential metadata
    function getMetadata(string memory credentialId) public view returns (string memory) {
        return credentialMetadata[credentialId];
    }
    
    // Check if a credential exists
    function credentialExists(string memory credentialId) public view returns (bool) {
        return credentialHashes[credentialId] != bytes32(0);
    }
}