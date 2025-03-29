require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const HOLESKY_RPC_URL = process.env.HOLESKY_RPC_URL;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545"
    },
    holesky: {
      url: HOLESKY_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 17000
    }
  },
  etherscan: {
    apiKey: {
      holesky: ETHERSCAN_API_KEY
    }
  },
  sourcify: {
    enabled: true
  },
  paths: {
    sources: "./src/contracts",
    artifacts: "./src/contracts/artifacts"
  }
}; 