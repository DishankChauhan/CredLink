'use client';

import { ethers } from "ethers";

// ABI for the CredentialRegistry contract
const CredentialRegistryABI = {
  abi: [
    // Function: registerIssuer
    {
      inputs: [
        { internalType: "address", name: "issuer", type: "address" }
      ],
      name: "registerIssuer",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    // Function: removeIssuer
    {
      inputs: [
        { internalType: "address", name: "issuer", type: "address" }
      ],
      name: "removeIssuer",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    // Function: addCredential
    {
      inputs: [
        { internalType: "string", name: "credentialData", type: "string" }
      ],
      name: "addCredential",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    // Function: verifyCredential
    {
      inputs: [
        { internalType: "address", name: "user", type: "address" },
        { internalType: "bytes32", name: "credentialId", type: "bytes32" }
      ],
      name: "verifyCredential",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    // Function: revokeCredential
    {
      inputs: [
        { internalType: "bytes32", name: "credentialId", type: "bytes32" }
      ],
      name: "revokeCredential",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    // Function: isCredentialValid
    {
      inputs: [
        { internalType: "bytes32", name: "credentialId", type: "bytes32" }
      ],
      name: "isCredentialValid",
      outputs: [
        { internalType: "bool", name: "", type: "bool" }
      ],
      stateMutability: "view",
      type: "function"
    },
    // Function: getCredentialDetails
    {
      inputs: [
        { internalType: "bytes32", name: "credentialId", type: "bytes32" }
      ],
      name: "getCredentialDetails",
      outputs: [
        { internalType: "bytes32", name: "hash", type: "bytes32" },
        { internalType: "address", name: "owner", type: "address" },
        { internalType: "address", name: "issuer", type: "address" }
      ],
      stateMutability: "view",
      type: "function"
    },
    // Function: getUserCredentialIds
    {
      inputs: [
        { internalType: "address", name: "user", type: "address" }
      ],
      name: "getUserCredentialIds",
      outputs: [
        { internalType: "bytes32[]", name: "", type: "bytes32[]" }
      ],
      stateMutability: "view",
      type: "function"
    },
    // Function: getVerifiedCredentials
    {
      inputs: [
        { internalType: "address", name: "user", type: "address" }
      ],
      name: "getVerifiedCredentials",
      outputs: [
        { internalType: "bytes32[]", name: "credentialIds", type: "bytes32[]" },
        { internalType: "bytes32[]", name: "hashes", type: "bytes32[]" },
        { internalType: "address[]", name: "issuers", type: "address[]" }
      ],
      stateMutability: "view",
      type: "function"
    },
    // Function: isRegisteredIssuer
    {
      inputs: [
        { internalType: "address", name: "", type: "address" }
      ],
      name: "isRegisteredIssuer",
      outputs: [
        { internalType: "bool", name: "", type: "bool" }
      ],
      stateMutability: "view",
      type: "function"
    }
  ]
};

let provider: ethers.BrowserProvider | null = null;
let signer: ethers.Signer | null = null;
let credentialRegistryContract: ethers.Contract | null = null;

// Contract address from environment variable
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '';

// Network details for Sepolia testnet
const SEPOLIA_CHAIN_ID = '11155111';
const SEPOLIA_RPC_URL = 'https://eth-sepolia.g.alchemy.com/v2/' + process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;
const SEPOLIA_DETAILS = {
  chainId: `0x${parseInt(SEPOLIA_CHAIN_ID).toString(16)}`,
  chainName: 'Sepolia',
  nativeCurrency: {
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18
  },
  rpcUrls: [SEPOLIA_RPC_URL],
  blockExplorerUrls: ['https://sepolia.etherscan.io/']
};

export async function connectWallet(switchToSepolia = true) {
  if (typeof window !== 'undefined' && window.ethereum) {
    try {
      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      provider = new ethers.BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();
      const chainId = network.chainId.toString();
      
      // If we need to switch to Sepolia and we're not on it
      if (switchToSepolia && chainId !== SEPOLIA_CHAIN_ID) {
        try {
          // Try to switch to Sepolia
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: `0x${parseInt(SEPOLIA_CHAIN_ID).toString(16)}` }],
          });
        } catch (switchError: any) {
          // This error code indicates that the chain has not been added to MetaMask
          if (switchError.code === 4902) {
            try {
              console.log("Adding Sepolia network to wallet...", SEPOLIA_DETAILS);
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [SEPOLIA_DETAILS],
              });
            } catch (addError: any) {
              console.error("Failed to add Sepolia network:", addError);
              throw new Error(`Failed to add Sepolia network to wallet: ${addError.message || 'Unknown error'}`);
            }
          } else {
            console.error("Failed to switch to Sepolia network:", switchError);
            throw new Error(`Failed to switch to Sepolia network: ${switchError.message || 'Unknown error'}`);
          }
        }
        
        // Refresh provider after network switch
        provider = new ethers.BrowserProvider(window.ethereum);
      }
      
      signer = await provider.getSigner();
      
      return { 
        success: true, 
        address: await signer.getAddress(),
        chainId: (await provider.getNetwork()).chainId.toString()
      };
    } catch (error: any) {
      console.error("Error connecting to wallet", error);
      return { 
        success: false, 
        error: error.message || "Failed to connect to wallet" 
      };
    }
  } else {
    console.error("Wallet provider not found");
    return { 
      success: false, 
      error: "Please install MetaMask or another Web3 wallet to use this application" 
    };
  }
}

export async function getCredentialRegistryContract() {
  if (!signer || !CONTRACT_ADDRESS) {
    throw new Error("Wallet not connected or contract address not set");
  }

  if (!credentialRegistryContract) {
    credentialRegistryContract = new ethers.Contract(
      CONTRACT_ADDRESS,
      CredentialRegistryABI.abi,
      signer
    );
  }

  return credentialRegistryContract;
}

export async function addCredential(credentialData: string) {
  try {
    const contract = await getCredentialRegistryContract();
    
    const tx = await contract.addCredential(credentialData);
    await tx.wait();
    
    return { success: true, transactionHash: tx.hash };
  } catch (error) {
    console.error("Error adding credential to blockchain", error);
    return { success: false, error: "Failed to add credential to blockchain" };
  }
}

export async function checkCredentialValidity(credentialId: string) {
  try {
    const contract = await getCredentialRegistryContract();
    
    // Convert string to bytes32
    const credentialIdBytes = ethers.hexlify(ethers.toUtf8Bytes(credentialId));
    
    const isValid = await contract.isCredentialValid(credentialIdBytes);
    
    return { success: true, isValid };
  } catch (error) {
    console.error("Error checking credential validity", error);
    return { success: false, error: "Failed to check credential validity" };
  }
}

export async function getCredentialDetails(credentialId: string) {
  try {
    const contract = await getCredentialRegistryContract();
    
    // Convert string to bytes32
    const credentialIdBytes = ethers.hexlify(ethers.toUtf8Bytes(credentialId));
    
    const [hash, owner, issuer] = await contract.getCredentialDetails(credentialIdBytes);
    
    return { 
      success: true, 
      hash,
      owner,
      issuer,
      isVerified: issuer !== ethers.ZeroAddress
    };
  } catch (error) {
    console.error("Error getting credential details", error);
    return { success: false, error: "Failed to get credential details" };
  }
}

// This would need to be called by a registered issuer
export async function verifyCredential(userAddress: string, credentialId: string) {
  try {
    const contract = await getCredentialRegistryContract();
    
    // Convert string to bytes32
    const credentialIdBytes = ethers.hexlify(ethers.toUtf8Bytes(credentialId));
    
    const tx = await contract.verifyCredential(userAddress, credentialIdBytes);
    await tx.wait();
    
    return { success: true, transactionHash: tx.hash };
  } catch (error) {
    console.error("Error verifying credential", error);
    return { success: false, error: "Failed to verify credential" };
  }
}

export async function getUserCredentials(userAddress: string) {
  try {
    const contract = await getCredentialRegistryContract();
    
    const credentialIds = await contract.getUserCredentialIds(userAddress);
    
    return { 
      success: true, 
      credentialIds 
    };
  } catch (error) {
    console.error("Error getting user credentials", error);
    return { success: false, error: "Failed to get user credentials" };
  }
}

export async function getVerifiedCredentials(userAddress: string) {
  try {
    const contract = await getCredentialRegistryContract();
    
    const [credentialIds, hashes, issuers] = await contract.getVerifiedCredentials(userAddress);
    
    return { 
      success: true, 
      credentialIds,
      hashes,
      issuers
    };
  } catch (error) {
    console.error("Error getting verified credentials", error);
    return { success: false, error: "Failed to get verified credentials" };
  }
}

export async function checkIfRegisteredIssuer(address: string) {
  try {
    const contract = await getCredentialRegistryContract();
    
    const isRegistered = await contract.isRegisteredIssuer(address);
    
    return { 
      success: true, 
      isRegistered 
    };
  } catch (error) {
    console.error("Error checking if address is a registered issuer", error);
    return { success: false, error: "Failed to check if address is a registered issuer" };
  }
}

// Function to get the contract instance
export async function getCredentialContract(): Promise<ethers.Contract | null> {
  try {
    if (!provider || !signer) {
      await connectWallet();
    }
    
    if (!provider || !signer) {
      throw new Error("Failed to connect wallet");
    }
    
    if (!credentialRegistryContract) {
      credentialRegistryContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CredentialRegistryABI.abi,
        signer
      );
    }
    
    return credentialRegistryContract;
  } catch (error) {
    console.error("Error getting contract instance:", error);
    return null;
  }
} 