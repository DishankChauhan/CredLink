const hre = require("hardhat");

async function main() {
  console.log("Deploying CredentialRegistry contract...");

  const [deployer] = await hre.ethers.getSigners();
  console.log(`Deploying with account: ${deployer.address}`);

  const credentialRegistry = await hre.ethers.deployContract("CredentialRegistry");
  await credentialRegistry.waitForDeployment();

  const address = await credentialRegistry.getAddress();
  console.log(`CredentialRegistry deployed to: ${address}`);
  console.log(`Contract owner: ${deployer.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 