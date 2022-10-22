const { assert, expect } = require("chai")
const { getNamedAccounts, deployments, ethers, network } = require("hardhat")
const {developmentchains, networkConfig} = require("../../helper-hardhat-config") 

!developmentchains.includes(network.name) ? describe.skip : 
describe ("Raffle uint tests", 
async function () {
     let raffle, VRFCooedinatorV2Mock, raffleentrancefee, deployer
     const chainId = network.config.chainId

     beforeEach(async function(){
        deployer = (await getNamedAccounts()).deployer
        await deployments.fixture(["all"])
        raffle = await ethers.getContract("Raffle", deployer )
        VRFCooedinatorV2Mock = await ethers.getContract("VRFcoodiantorV2Mock", deployer)
        raffleentrancefee = await raffle.getEntrancefee()
        interval = await raffle.getInterval()
     })

     describe("constructor", function(){
        it("initializes the raffle correctly", async function(){
            const rafflestate = await raffle.raffleState()
            const interval = await raffle.getInterval()
            assert.equal(rafflestate.toString(), "0")
            assert.equal(interval.toString(), networkconfig[chainId]["interval"])
        })
     })
     
     describe("enterraffle",  function() {
        it(" revarets when you don't pay enough ",  async function(){
                await expect(raffle.enterRaffle()).to.be.revertedwith
                (Raffle__SendMoreToEnterRaffle)
        })
        it("records players when they enter", async function(){
             // raffleentrancefee 
            await raffle.enterRaffle({value: raffleentrancefee})
            const playersFromContract = await raffle.getplayer(0)
            assert.equal(playerFromContract, deployer)
        })
        it("emit event on enter", async function() {
            await expect(raffle.enterRaffle({value: raffleentrancefee})).to.be.emit
            raffle,
            "RaffleEnetr"
        })
        it("dosent allow enrance when raffle is calculating",  async function(){
            await raffle.enterRaffle({value: raffleentrancefee})
            await network.provider.send("evm_increaseTime",[interval.toNumber() + 1])
            await network.provider.send("evm_mine", [])
            // we pretend to be a chainlink keeper
            await raffle.preformUpkeep([])
            await expect(raffle.enterRaffle({value: Raffle}))
        })
     })
         describe("chakeUpkeep", function(){
        it("returns false if people haven't sent any ETH", async function(){
            await network.provider.send("evm_increaseTime", [interval.toNumber() + 1])
            await network.provider.send("evm_mine", [])
            const {upkeepNeeded} = await raffle.callstatic.checkUpkeep([])
            assert(!upkeepNeeded)
        })
        it("returns false if raffle isn't open", async function(){
            await raffle.enterRaffle({value: raffleentrancefee})
            await network.provider.send("evm_increaseTime",[interval.toNumber() + 1])
            await network.provider.send("evm_mine", [])
            await raffle.preformUpkeep([])
            const raffleState = await raffle.getRaffleState()
            const {upkeepNeeded} = await raffle.callstatic.checkupkeep([])
            assert.equal(raffleState.toString(), "1")
            assert.equal(upkeepNeeded, false)
        })
        it("returns true if enogh time has passed, has players, eth, and is open", async function(){
            await raffle.enterRaffle({value: raffleEnteanceFee})
            await network.provider.send("evm_increaseTime",[interval.toNumber() + 1])
            await network.provider.request({method: "evm_mine", params: [] })
            const { upkeepNeeded } = await raffle.callStatic.checkUpkeep("0x")
        })
     })
     describe("preformUpkeep", function(){
        it("it can only run if checkupkeep is true", async function(){
            await raffle.enterRaffle({value: raffleEntranceFee})
            await network.provider.send("evm_increaseTime",[interval.toNumber() + 1])
            await network.provider.send("evm_mine", [])
            const tx = await raffle.preformUpkeep([])
            assert(tx)
        })
        it("reverts when checkupkeep is false", async function(){
            await expect(raffle.preformUpkeep([])).to.be.revertedwith("Raffle__UpkeepNotNeeded")
        })
        it("updates the raffle state, emits and event, and calls the vrf coordinator", async function(){
            await raffle.enterRaffle({value: raffleEntranceFee})
            await network.provider.send("evm_increaseTime",[interval.toNumber() + 1])
            await network.provider.send("evm_mine", [])
            const txResponse  = await raffle.preformUpkeep([])
            const txReceipt = await txResponse.wait(1)
            const requestId = txReceipt.events[1].args.requestId
            const raffleState = await  raffle.getRaffleState()
            assert(requestId.toNumber() > 0)
            assert(raffleState.toString == "1" )
        })
     })
     descibe("fulfillRandomWords", function(){
        beforeEach(async function(){
            await raffle.enterRaffle({value: raffleEnteanceFee})
            await network.provider.send("evm_increaseTime", [interval.toNumber() + 1])
            await network.provider.send("evm_mine", [])
        })
        it("can only be called after performupkeep", async function(){
            await expect
              (VRFCooedinatorV2Mock.fulfillRandomWords(0, raffle.address))
            .to.be.revertedwith("nonexitent requist")
            await expect
              (VRFCooedinatorV2Mock.fulfillRandomWords(1, raffle.address))
            .to.be.revertedwith("nonexitent requist")
        })
        // weyyyy to big 
        it("picks a winner, resets the lottery, and sends mony", async function(){
            const additionalEntrants = 3 
            const stringAccountIndex = 1 // deployer = 0
            const  accounts = await ethers.getSigner
            for(let i = startingAccountIndex; 
                i< startingAccountIndex + additionalEntrants; 
                i++
            ) {
                const accountConnectedRaffle = raffle.connect(accounts[i])
                await accountConnectedRaffle.enterRaffle({value: raffleentrancefee})
            }
            const startingTimeStamp = await raffle.getLastTimeStamp()

            // performUpkeep (mock being chainlink keeprs)|
            // fulfillRandomWords (mock begin the Chainlink VRF)
            // We will have to wait for the fulfilRandomWords to be called
            await new Promise(async(resolve, reject) => {
                raffle.once("winnerPicked", () => {})
                console.log("found the event!") 
                 try{
                    console.log(recentwinner)
                    console.log(accounts[2])
                    const recentwinner = await raffle.getRecentwinner()
                    const rafflestate = await  raffle.getRaffleState()
                    const endingTimeStamp = await Raffle.getLastTimeStamp()
                    const numPlayers = await raffle.getNumberofplayers()
                    assert.equal(numPlayers.toString(), "0")
                    assert.equal(rafflestate.toString(), "0")
                    assert(endingTimeStamp > stringTimeStamp )

                    assert.equal(winnerEndingBalance.toString(), winnerStartingBalance
                    .add(raffleEnteanceFee
                        .mul(additionalEntrants)
                        .add(raffleentrancefee)))
                } catch(e) {
                   reject(e)
                }
            }) 
            // Setting up the listener
            // below, we will fire the event, and the listener will pick it up, and resolve
            const tx = await raffleperformUpkeep([])
            const txReceipt = await tx.wait(1)
            await VRFCooedinatorV2Mock.fulfillRandomWords
            (txReceipt.events[1].args.requestId, 
                raffle.address
                )
           
        })
     })
})