const { verifyMessage } = require("ethers/lib/utils")
const { network, ethers, getChainId } = require("hardhat")
const { developmentchains, networkConfig } = require("../helper-hardhat-config")
const interval = networkConfig[chainId]["interval"]

module.exports = async function({ getNamedAccounts, deployments }) {
    const {deploy, log } = deployments
    const {deployer} = await getNamedAccounts() 
    const chainId = network.gonfig.chainId 
    let VRFCooedinatorV2Adress

    if(developmentchains.includes(network.name)) {
        const VRFCooedinatorV2Mock = await ethers.getContract("VRFCoordinatorv2Mocks")
        VRFCooedinatorV2Adress = VRFCooedinatorV2Mock.address
    } else{
        VRFCooedinatorV2Adress = networkConfig[ChainId]["vrfcoordinatorv2"]
    }

    const entranceFee = networkConfig[chainId]["entranceFee"]
    const gasLane = networkConfig[chainId]["gasLane"]
    const args = [VRFCooedinatorV2Adress, entranceFee, gasLane]
    const raffle = await deploy("Raffle", {
        from: deployer,
        args: [], 
        log: true, 
        waitConfirmations: network.gonfig.blockConfirmations,  
    })

    if (!developmentchains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying...")
        await verify(raffle.address, args) 
    }
    log("-=----=-=-=------=-=-=-=-=-=-=-=-=-=-=--==-=-=-=-=-=-=")
}

module.exports.tags =["all","raffle",]