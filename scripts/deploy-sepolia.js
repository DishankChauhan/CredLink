const hre = require("hardhat");

async function main() {
  console.log("Deploying CredentialRegistry contract to Sepolia Testnet...");

  const [deployer] = await hre.ethers.getSigners();
  console.log(`Deploying with account: ${deployer.address}`);
  const balance = await deployer.provider.getBalance(deployer.address);
  console.log(`Account balance: ${Number(balance) / 1e18} ETH`);

  // Deploy the contract
  const credentialRegistry = await hre.ethers.deployContract("CredentialRegistry");
  await credentialRegistry.waitForDeployment();

  const address = await credentialRegistry.getAddress();
  console.log(`CredentialRegistry deployed to: ${address}`);
  console.log(`Contract owner: ${deployer.address}`);

  console.log("\nWaiting for block confirmations...");
  await credentialRegistry.deploymentTransaction().wait(5);
  console.log("Confirmed!");

  // Verify the contract on Etherscan
  if (process.env.ETHERSCAN_API_KEY) {
    console.log("\nVerifying contract on Etherscan...");
    try {
      await hre.run("verify:verify", {
        address: address,
        constructorArguments: [],
      });
      console.log("Contract verified successfully");
    } catch (error) {
      console.log("Error verifying contract:", error.message);
    }
  } else {
    console.log("\nSkipping contract verification: No Etherscan API key provided");
  }

  console.log("\n=== Deployment Summary ===");
  console.log(`Network: Sepolia Testnet`);
  console.log(`Contract address: ${address}`);
  console.log(`Transaction hash: ${credentialRegistry.deploymentTransaction().hash}`);
  console.log(`Explorer: https://sepolia.etherscan.io/address/${address}`);
  console.log("===========================");
  console.log("\nImportant: Add this contract address to your .env file:");
  console.log(`NEXT_PUBLIC_CONTRACT_ADDRESS=${address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 