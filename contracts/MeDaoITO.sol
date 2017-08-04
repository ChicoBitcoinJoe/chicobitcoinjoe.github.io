pragma solidity ^0.4.13;

import "browser/MiniMeToken.sol";
import "browser/InclusiveTokenOffering.sol";

contract MeDaoITO is ITOController, TokenController, Owned {
    
    InclusiveTokenOffering public ITO;
    MiniMeTokenFactory public Factory;
    MiniMeToken public Token;
    address public Vault;
    
    uint constant public MAX_TOKEN_SUPPLY = 7488000 ether; //Maximum allowed tokens
    uint public claimed_tokens; //How many tokens have been been created so far

////////////////
// MeDaoITO Functions
////////////////

    function setup (
        string name, 
        string symbol,
        address vault,
        MiniMeTokenFactory factory,
        uint DELAY_START_IN_DAYS,
        uint OFFER_DURATION_IN_DAYS,
        uint WITHDRAW_PERIOD_IN_DAYS
    ) onlyOwner {
        require(Token == address(0x0));
        require(OFFER_DURATION_IN_DAYS >= 30);
        require(WITHDRAW_PERIOD_IN_DAYS >= 7);
        
        Vault = vault;
        Factory = factory;
        Token = new MiniMeToken(
            Factory,
            address(0x0),
            0,
            name,
            18,
            symbol,
            true
        );
        
        uint offer_start = now + DELAY_START_IN_DAYS * 1 days;
        uint offer_expires = offer_start + OFFER_DURATION_IN_DAYS * 1 days;
        uint withdraw_period_expires = offer_expires + WITHDRAW_PERIOD_IN_DAYS * 1 days;
        
        ITO = new InclusiveTokenOffering(
            offer_start,
            offer_expires,
            withdraw_period_expires
        );
    }
    
    function () payable {
        ITO.deposit.value(msg.value)(msg.sender);
    }
    
    function distributeTokens (address account, uint deposit, uint totalDeposits) onlyITO {
        uint tokenClaim = claimCalculator(deposit,totalDeposits);
        Token.generateTokens(account, tokenClaim);
        claimed_tokens += tokenClaim;
        
        Claim_event(account,deposit,tokenClaim);
    }
    
    function collectEther () {
        ITO.collectEther(Vault); //This is only callable after the offering expires
    }
    
    function claimCalculator (uint deposit, uint totalDeposits) constant returns (uint) {
        return MAX_TOKEN_SUPPLY * deposit / totalDeposits;
    }
    
////////////////
// Token Controller
////////////////
    
    function proxyPayment(address _owner) payable returns(bool) {
        ITO.deposit.value(msg.value)(_owner);
        
        return true;
    }

    function onTransfer(address _from, address _to, uint _amount) returns(bool) {
        _from; _to; _amount; //Needed to compile unused variables...
        
        return true;
    }

    function onApprove(address _owner, address _spender, uint _amount) returns(bool) {
        _owner; _spender; _amount; //Needed to compile unused variables...
        
        return true;
    }

////////////////
// Modifiers and Events
////////////////
    
    modifier onlyITO () {
        require(msg.sender == address(ITO));
        
        _;
    }
    
    event Claim_event(address account, uint deposit, uint tokens);
    
}
