const hre = require("hardhat");

async function main() {
  const AadharDID = await hre.ethers.getContractFactory("AadharDID");
  const aadharDID = await AadharDID.deploy();
  await aadharDID.waitForDeployment();

  console.log("AadharDID deployed to:", await aadharDID.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 