// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CredentialStore {
    // Credential hash storage
    mapping(string => bytes32) private credentialHashes;
    
    // Transaction tracking for credentials
    mapping(string => string) private transactionIds;
    
    // Metadata for credentials (issuer, timestamp, etc.)
    mapping(string => string) private credentialMetadata;
    
    // Events
    event CredentialStored(string credentialId, bytes32 credentialHash);
    event CredentialUpdated(string credentialId, bytes32 credentialHash);
    
    // Store a new credential hash
    function storeCredential(string memory credentialId, bytes32 credentialHash) public {
        require(credentialHashes[credentialId] == bytes32(0), "Credential ID already exists");
        
        credentialHashes[credentialId] = credentialHash;
        
        // Store transaction ID
        transactionIds[credentialId] = toAsciiString(tx.origin);
        
        emit CredentialStored(credentialId, credentialHash);
    }
    
    // Update an existing credential
    function updateCredential(string memory credentialId, bytes32 credentialHash) public {
        require(credentialHashes[credentialId] != bytes32(0), "Credential ID does not exist");
        
        credentialHashes[credentialId] = credentialHash;
        
        // Update transaction ID
        transactionIds[credentialId] = toAsciiString(tx.origin);
        
        emit CredentialUpdated(credentialId, credentialHash);
    }
    
    // Get credential hash by ID
    function getCredential(string memory credentialId) public view returns (bytes32) {
        return credentialHashes[credentialId];
    }
    
    // Store metadata for a credential
    function storeMetadata(string memory credentialId, string memory metadata) public {
        require(credentialHashes[credentialId] != bytes32(0), "Credential ID does not exist");
        credentialMetadata[credentialId] = metadata;
    }
    
    // Get metadata for a credential
    function getMetadata(string memory credentialId) public view returns (string memory) {
        return credentialMetadata[credentialId];
    }
    
    // Helper function to convert address to string
    function toAsciiString(address x) internal pure returns (string memory) {
        bytes memory s = new bytes(40);
        for (uint i = 0; i < 20; i++) {
            bytes1 b = bytes1(uint8(uint(uint160(x)) / (2**(8*(19 - i)))));
            bytes1 hi = bytes1(uint8(b) / 16);
            bytes1 lo = bytes1(uint8(b) - 16 * uint8(hi));
            s[2*i] = char(hi);
            s[2*i+1] = char(lo);            
        }
        return string(s);
    }
    
    function char(bytes1 b) internal pure returns (bytes1 c) {
        if (uint8(b) < 10) return bytes1(uint8(b) + 0x30);
        else return bytes1(uint8(b) + 0x57);
    }
}