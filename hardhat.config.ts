// Buidler
import "@nomiclabs/hardhat-ethers"
import "@nomiclabs/hardhat-waffle"
import "@nomiclabs/hardhat-web3"
import "hardhat-deploy"
import "hardhat-deploy-ethers"

// ================================= CONFIG =========================================
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      blockGasLimit: 12000000,
    },
  },
  solidity: {
    version: "0.6.11",
    settings: {
      // optimizer: {
      //   enabled: true,
      //   runs: 200
      // },
    },
  },

};

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

