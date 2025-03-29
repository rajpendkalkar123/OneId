const hre = require("hardhat");

async function main() {
  const AadharDID = await hre.ethers.getContractFactory("AadharDID");
  const aadharDID = await AadharDID.deploy();

  await aadharDID.waitForDeployment();
  
  const address = await aadharDID.getAddress();
  console.log("AadharDID deployed to:", address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 