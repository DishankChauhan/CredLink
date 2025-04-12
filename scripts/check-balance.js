const hre = require("hardhat");

async function main() {
  console.log("Checking wallet balance on Sepolia...");

  const [deployer] = await hre.ethers.getSigners();
  console.log(`Account address: ${deployer.address}`);

  const balanceWei = await deployer.provider.getBalance(deployer.address);
  const balanceEth = Number(balanceWei) / 1e18;
  
  console.log(`Account balance: ${balanceEth} ETH`);
  
  if (balanceEth < 0.01) {
    console.log("WARNING: Your balance is very low. You may not have enough ETH to deploy.");
    console.log("Consider getting more Sepolia ETH from a faucet like https://sepoliafaucet.com/");
  } else {
    console.log("Balance is sufficient for deployment.");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 