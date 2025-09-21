const hre = require("hardhat");

async function main() {
  console.log("Starting deployment to Holesky...");
  
  try {
    // Get the deployer's address
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    // Get the balance
    const balance = await deployer.provider.getBalance(deployer.address);
    console.log("Account balance:", hre.ethers.formatEther(balance), "ETH");

    // Check network
    const network = await hre.ethers.provider.getNetwork();
    console.log("Network:", network.name, "Chain ID:", network.chainId);

    if (Number(network.chainId) !== 17000) {
      console.log("⚠️  Warning: Not on Holesky testnet (chain 17000)");
    }

    // Deploy the contract
    console.log("Deploying AadharDID contract...");
    const AadharDID = await hre.ethers.getContractFactory("AadharDID");
    const aadharDID = await AadharDID.deploy();

    console.log("Waiting for deployment transaction...");
    await aadharDID.waitForDeployment();
    
    const address = await aadharDID.getAddress();
    console.log("✅ AadharDID deployed to:", address);
    
    // Update .env.local with the deployed address
    const fs = require('fs');
    const path = require('path');
    const envPath = path.join(__dirname, '..', '.env.local');
    
    let envContent = '';
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
    }
    
    // Update or add the Holesky address
    if (envContent.includes('REACT_APP_AADHAR_DID_ADDRESS_HOLESKY=')) {
      envContent = envContent.replace(
        /REACT_APP_AADHAR_DID_ADDRESS_HOLESKY=.*/,
        `REACT_APP_AADHAR_DID_ADDRESS_HOLESKY=${address}`
      );
    } else {
      envContent += `\nREACT_APP_AADHAR_DID_ADDRESS_HOLESKY=${address}`;
    }
    
    // Update the current address to Holesky
    if (envContent.includes('REACT_APP_AADHAR_DID_ADDRESS=')) {
      envContent = envContent.replace(
        /REACT_APP_AADHAR_DID_ADDRESS=.*/,
        `REACT_APP_AADHAR_DID_ADDRESS=${address}`
      );
    } else {
      envContent += `\nREACT_APP_AADHAR_DID_ADDRESS=${address}`;
    }
    
    fs.writeFileSync(envPath, envContent);
    console.log("✅ Updated .env.local with deployed address");
    
    console.log("\n🎉 Deployment completed successfully!");
    console.log("📝 Contract address:", address);
    console.log("🔗 View on Holesky Etherscan:", `https://holesky.etherscan.io/address/${address}`);
    console.log("\n⚠️  Restart your React app to load the new address!");
    
  } catch (error) {
    console.error("❌ Error during deployment:");
    console.error(error);
    throw error;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
