// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

contract CredentialStore {
    mapping(string => string) private dataStore;
    
    function storeData(string memory id, string memory data) public {
        dataStore[id] = data;
    }
    
    function getData(string memory id) public view returns (string memory) {
        return dataStore[id];
    }
}