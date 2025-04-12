// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

/**
 * @title CredentialRegistry
 * @dev A contract for registering issuers and verifying credential hashes on the blockchain
 */
contract CredentialRegistry is Ownable {
    using ECDSA for bytes32;

    // Mapping from credentialId to its hash
    mapping(bytes32 => bytes32) public credentials;
    
    // Mapping from credentialId to issuer address
    mapping(bytes32 => address) public credentialIssuers;
    
    // Mapping from credentialId to owner (user) address
    mapping(bytes32 => address) public credentialOwners;

    // Mapping to track registered issuers
    mapping(address => bool) public isRegisteredIssuer;

    // Mapping from user address to their credentials
    mapping(address => bytes32[]) public userCredentials;

    // Events
    event CredentialAdded(bytes32 indexed credentialId, address indexed owner, bytes32 credentialHash);
    event CredentialVerified(bytes32 indexed credentialId, address indexed owner, address indexed issuer);
    event CredentialRevoked(bytes32 indexed credentialId, address indexed issuer);
    event IssuerRegistered(address indexed issuer);
    event IssuerRemoved(address indexed issuer);

    constructor() Ownable(msg.sender) {}

    /**
     * @dev Register a new issuer
     * @param issuer Address of the issuer to register
     */
    function registerIssuer(address issuer) external onlyOwner {
        require(issuer != address(0), "Invalid issuer address");
        require(!isRegisteredIssuer[issuer], "Issuer already registered");
        
        isRegisteredIssuer[issuer] = true;
        emit IssuerRegistered(issuer);
    }

    /**
     * @dev Remove an issuer
     * @param issuer Address of the issuer to remove
     */
    function removeIssuer(address issuer) external onlyOwner {
        require(isRegisteredIssuer[issuer], "Issuer not registered");
        
        isRegisteredIssuer[issuer] = false;
        emit IssuerRemoved(issuer);
    }

    /**
     * @dev Add a new credential to the blockchain
     * @param credentialData Raw credential data that will be hashed
     */
    function addCredential(string calldata credentialData) external {
        // Generate a unique credentialId based on data and sender
        bytes32 credentialId = keccak256(abi.encodePacked(msg.sender, credentialData, block.timestamp));
        
        // Hash the credential data using keccak256
        bytes32 credentialHash = keccak256(abi.encodePacked(credentialData));
        
        require(credentials[credentialId] == bytes32(0), "Credential already exists");
        
        credentials[credentialId] = credentialHash;
        credentialOwners[credentialId] = msg.sender;
        
        // Add credential to user's list
        userCredentials[msg.sender].push(credentialId);
        
        emit CredentialAdded(credentialId, msg.sender, credentialHash);
    }
    
    /**
     * @dev Verify a credential as a registered issuer
     * @param user Address of the credential owner
     * @param credentialId Unique identifier for the credential
     */
    function verifyCredential(address user, bytes32 credentialId) external {
        require(isRegisteredIssuer[msg.sender], "Not a registered issuer");
        require(credentials[credentialId] != bytes32(0), "Credential does not exist");
        require(credentialOwners[credentialId] == user, "Credential not owned by specified user");
        require(credentialIssuers[credentialId] == address(0), "Credential already verified");
        
        credentialIssuers[credentialId] = msg.sender;
        
        emit CredentialVerified(credentialId, user, msg.sender);
    }
    
    /**
     * @dev Revoke a credential (only the issuer who verified it can revoke)
     * @param credentialId Unique identifier for the credential
     */
    function revokeCredential(bytes32 credentialId) external {
        require(credentials[credentialId] != bytes32(0), "Credential does not exist");
        require(credentialIssuers[credentialId] == msg.sender, "Only verifying issuer can revoke credential");
        
        // We don't actually delete the credential record to maintain history
        // We just remove the issuer to mark it as no longer verified
        credentialIssuers[credentialId] = address(0);
        
        emit CredentialRevoked(credentialId, msg.sender);
    }
    
    /**
     * @dev Check if a credential exists and is verified
     * @param credentialId Unique identifier for the credential
     * @return bool True if credential exists and is verified
     */
    function isCredentialValid(bytes32 credentialId) external view returns (bool) {
        return credentials[credentialId] != bytes32(0) && 
               credentialIssuers[credentialId] != address(0) && 
               isRegisteredIssuer[credentialIssuers[credentialId]];
    }
    
    /**
     * @dev Get credential details
     * @param credentialId Unique identifier for the credential
     * @return hash The credential hash
     * @return owner The credential owner
     * @return issuer The credential issuer
     */
    function getCredentialDetails(bytes32 credentialId) external view returns (bytes32 hash, address owner, address issuer) {
        return (credentials[credentialId], credentialOwners[credentialId], credentialIssuers[credentialId]);
    }

    /**
     * @dev Get all credential IDs for a specific user
     * @param user Address of the user
     * @return Array of credential IDs belonging to the user
     */
    function getUserCredentialIds(address user) external view returns (bytes32[] memory) {
        return userCredentials[user];
    }

    /**
     * @dev Get all verified credentials for a specific user
     * @param user Address of the user
     * @return credentialIds Array of verified credential IDs
     * @return hashes Array of credential hashes
     * @return issuers Array of issuer addresses
     */
    function getVerifiedCredentials(address user) external view returns (
        bytes32[] memory credentialIds,
        bytes32[] memory hashes,
        address[] memory issuers
    ) {
        // First, count verified credentials to allocate arrays properly
        uint256 verifiedCount = 0;
        bytes32[] memory userCredentialIds = userCredentials[user];
        
        for (uint256 i = 0; i < userCredentialIds.length; i++) {
            bytes32 credId = userCredentialIds[i];
            if (credentialIssuers[credId] != address(0) && isRegisteredIssuer[credentialIssuers[credId]]) {
                verifiedCount++;
            }
        }
        
        // Allocate arrays with the correct size
        credentialIds = new bytes32[](verifiedCount);
        hashes = new bytes32[](verifiedCount);
        issuers = new address[](verifiedCount);
        
        // Populate arrays with verified credentials
        uint256 index = 0;
        for (uint256 i = 0; i < userCredentialIds.length; i++) {
            bytes32 credId = userCredentialIds[i];
            if (credentialIssuers[credId] != address(0) && isRegisteredIssuer[credentialIssuers[credId]]) {
                credentialIds[index] = credId;
                hashes[index] = credentials[credId];
                issuers[index] = credentialIssuers[credId];
                index++;
            }
        }
        
        return (credentialIds, hashes, issuers);
    }
} 