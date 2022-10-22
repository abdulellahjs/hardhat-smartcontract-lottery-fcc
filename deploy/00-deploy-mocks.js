const {developmentchains} = require("../helper-hardhat-config")

const BASE_FEE = ethers.utils.parseEther("0.25") // 0.25 is the permium. it costs 0.25 
const GAS_PRICE_LINK = 1e9 // // link per gas CALCULATED VALUE BASED ON THE GAS PRICE OF THE CHAIN. 

// Eth price ^ $1,000,000,000
// Chainlink nodes pay the gas fees to give us randomess & do external exeution 
// so they price of requets change bassed on the price of gas 

module.exports = async function({getNamedAccounts, deployments}) {
    const {deploy, log} = deployments 
    const {deployer} = await getNamedAccounts () 
    const args = [BASE_FEE, GAS_PRICE_LINK]


    if(developmentchains.includes(network.name)) {
        log("Local network detected! Deploying mocks..") 
        // deploy a mock vrfcoordinator...
        await deploy("VRFCooedinatorV2Mock", {
             from: deployer,
             log: true,
             args: args,  
        } )
        log("Mocks Deployed!>+_<")
        log("=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==--")
    }

}


module.exports.tags = ["all, mocks"]
