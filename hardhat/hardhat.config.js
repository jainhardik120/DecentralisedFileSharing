require('dotenv').config(); 
require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.20",
  networks:{
    hardhat:{
      chainId:1337,
      gas: 2100000,
      gasPrice: 8000000000,
    },
    sepolia: {
      url: `${process.env.ALCHEMY_SEPOLIA_URL}`,
      accounts: [`0x${process.env.SEPOLIA_PRIVATE_KEY}`],
    }
  },
  paths:{
    artifacts:"../client/src/artifacts",
  },  
};
