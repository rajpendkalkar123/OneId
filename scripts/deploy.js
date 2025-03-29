const hre = require("hardhat");

async function main() {
  console.log("Starting deployment...");
  
  try {
    // Get the deployer's address
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    // Get the balance
    const balance = await deployer.provider.getBalance(deployer.address);
    console.log("Account balance:", hre.ethers.formatEther(balance), "ETH");

    // Deploy the contract
    console.log("Deploying AadharDID contract...");
    const AadharDID = await hre.ethers.getContractFactory("AadharDID");
    const aadharDID = await AadharDID.deploy();

    console.log("Waiting for deployment transaction...");
    await aadharDID.waitForDeployment();
    
    const address = await aadharDID.getAddress();
    console.log("AadharDID deployed to:", address);
    
    console.log("Deployment completed successfully!");
  } catch (error) {
    console.error("Error during deployment:");
    console.error(error);
    throw error;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 