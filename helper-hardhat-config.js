const { ethers } = require("hardhat")

const networkConfig = {
    5: {
        name: "Georli",
        vrfcoordinatorv2: "0x2ca8e0c643bde4c2e08ab1fa0da3401adad7734d",
        entranceFee: ethers.utils.parseEther("0.01"),
        gasLane: "0x708701a1DfF4f478de54383E49a627eD4852C816",
    },
    31337: {
        name: "hardhat",
        entranceFee: ethers.utils.parseEther("0.01"), 
        gasLane: "0x708701a1DfF4f478de54383E49a627eD4852C816",
    }
}

const developmentchains = ["hardhat", "localhost"] 

module.exports = {
    networkConfig,
    developmentchains,
}