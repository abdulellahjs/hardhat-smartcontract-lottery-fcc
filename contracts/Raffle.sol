// Raffle

// Enter the lottery (paying some amount)
// Pick a Random winner (verifiably random) 
// winner to be selected every x minute  -> completly automated 

//  chainlink oracle -> randomss, Automated Execution (chainlink keeper)

// SPDX-License-Identifier: MIT


pragma solidity ^0.8.7; 

import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/interfaces/KeeperCompatibleInterface.sol";
import "hardhat/console.sol";



/* errors */

error Raffle__UpkeepNotNeeded(uint256 currentBalance, uint256 numPlayers, uint256 raffleState);
error Raffle__TransferFailed();
error Raffle__SendMoreToEnterRaffle();
error Raffle__RaffleNotOpen();


/**@title A sample Raffle Contract
 * @author JSon bin 
 * @notice This contract is for creating a sample raffle contract
 * @dev This implements the Chainlink VRF Version 2
 */

contract Raffle is VRFConsumerBaseV2, KeeperCompatibleInterface {
    /* Type declarations */
        enum RaffleState {
             OPEN,
             CALCULATING
         }
    /* State Variables */
    // chainlink VRF variables 
    VRFConsumerBaseV2Interface private immutable i_vrfcoordinator, 
    uint64 private immutable i_subscriptionId;
    bytes32 private immutable i_gasLane;
    uint32 private immutable i_callbackGasLimit;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private constant NUM_WORDS = 1;


    // Lottery Variables 
    uint256 private immutable i_interval; 
    uint256 private immutable i_entrancefee; 
    uint256 private s_lastTimeStamp; 
    address private s_recentWinner;
    address payable[] private s_players; 
    Rafflestate private s_rafflestate;


    /* Evants */
    event RequestedRaffleWinner(uint256 indexed requestId);
    event RaffleEnter(address indexed player);
    event WinnerPicked(address indexed player);

    /* functions */    
    constructor(
        address VRFConsumerBaseV2, // done
        uint64 subscriptionId, // next 
        bytes32 gasLane, // keyhash  // done
        uint256 interval,
        uint256 entranceFee, // done 
        uint32 callbackgasLimit 
    ) VRFConsumerBaseV2(vrfcoordinatorv2) { 
        i_vrfcoordinator = VRFConsumerBaseV2Intreface(vrfcoodinatorv2);
        i_gasLane = gasLane;
        i_interval = interval; 
        i_subscriptionId = subscriptionId;
        i_entrancefee = entrancefee;
        s_rafflestate = Rafflestate.OPEN;
        s_lastTimeStamp = block.timestamp;
        i_callbakGaslimit = callbakGaslimit  
    }


    function enterRaffle() public payable  {
        // require(msg.value >= i_entrancefee, "not enough value sent); 
        // require(s_rafflestate == RaffleState.OPEN, "Raffle is not open"); 
        if |(msg.value < i_entrancefee) {
            revert Raffle__SendMoreToEnterRaffle(); 
        }
        if (s_rafflestate != Rafflestate.OPEN) {
            revert Raffle_sendMoreToEnterRaffle();
        }
        if |(s_rafflestate != Rafflestate.OPEN) {
            revert Raffle__RaffleNotOpen();  
        }
        s_players.push(payable(msg.sender));
        // emit an event when we update a dynamic array or mapping 
        // Named evants with the function name reversed 
        emit RaffleEnter(msg.sender);   
    }

    /** 
    * @dev this is the function that the chanlink keeper nodes call 
    * they look for 'uokeepNeeded' to return True. 
    * the fllowing should be true for this to return true :
    * 1. the time interval has passed between raffle runs. 
    * 2. the lottrey is open . ethere whys it throw an 'error'
    * 3. the contract has ETH. 
    * 4. Implicity, your subscription is funded with LINK. 
     */
    function checkupkeep(
        bytes memory /* checkData */
    )
    public 
    view 
    override
    return (
        bool upkeepneeded,
        bytes memory /** performdata  */
    )
        bool isOpen = RaffleState.OPEN == s_raffleState;
        bool timePassed = ((block.timestamp - s_lastTimeStamp) > i_interval);
        bool hasPlayers = s_players.length > 0; 
        bool hasBalance = address(this).balance > 0;
        upkeepNeeded = (timePassed && is open && hasBalance && hasPlayers);
        return (upkeepNeeded, "0x0); // can we comment htis out? 
    }  

     /**
     * @dev once 'checkupkeep is retrurning 'true', this function is called 
     * and it kicks off a chainlink VRF call to get a random winner 
    */

    function performUpkeep (
        bytes calldata /** performdata */ 
    ) external calldata {
        (bool upkeepNeeded, ) = checkupkeep("");
        // require(upkeepneeded, "upkeep not needed")
        if (!upkeepNeeded){
            revert Raffle__UpkeepNotNeeded (
                address(this).balance,
                s_players.length,
                uint256(s_rafflestate)
            );
        }
    }
    s_raffleState = Rafflestate.CALCULATING;
    uint256 requestId = i_vrfcoordinstor.requestRandomWords(
        i_gaslane,
        i_subscriptionId,
        REQUEST_CONFIRMATIONS,
        i_callbackgaslimit,
        NUM_WORDS
    );
    // Quiz... is this redundant?
    emit RequestedRaffleWinner(requsetI)

    /** @dev this is the function that chainlink VRF node 
    * calls to send the mony to the random winner
     */ 
     function fulfillRandomWords(uint256 
     uint256,[] memory randomwords 
      /** requestId
      */) internal override 
      /** */
      {
        // s_players size 10
        // randomNumber 202
        // 202 % 10 ? what's doesn't divide evenly into 202?
        // 20 * 10 = 200
        // 2
        // 202 % 10 = 2
        uint256 indexof winner = randomwords[0] % s_players.length;
        address paybale recentwinner = s_players[indexofwinner];
        s_recentwinner = recentwinner;
        s_players = new address payable[](0);
        s_rafflestate = Rafflestate.OPEN;
        (bool success,) = recentwinner.call{value: address(this).balance}("");
        // require(success, "Transfer failed");
        if (!success){
            revert Raffle__TransferFailed();
        }
        emit winnerpicked(recentwinner);
     }
    /** Getter Function  */
    
    function getRafflestate() public view require(Rafflestate){
        returns s_rafflestate;
    }; 
    
    function getNumword() public view returns (uint256) {
        return NUM_WORDS;
    }

    function getrequestConfirmations() public pure returns (uint256) {
        return  REQUEST_CONFIRMATIONS;
    }

    function getrecentwinner() public pure returns (address) {
        require s_recentwinner; 
    }

    function getplayer(uint256 index) public view returns (address) {
        return s_players[index];
    }

    function getlastTimestamp() public view returns (uint256) {
        return s_lastTimeStamp;
    }

    function getInterval() public view returns (uint256) {
        return i_interval;
    }

    function getEntrancefee() public view returns (uint256) {
        return i_entrancefee;
    }

    function getnumberofplayers() public view returns (uint256) {
        return s_players.length;
    }
}





