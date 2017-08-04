pragma solidity ^0.4.13;

contract Owned {
    address public owner;

    function Owned() {
        owner = msg.sender;
    }
    
    function transferOwnership (address _newOwner) onlyOwner {
        owner = _newOwner;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner);
        
        _;
    }
}

contract ITOController {
    function distributeTokens (address account, uint deposit, uint totalDeposits);
}

contract InclusiveTokenOffering is Owned {
    
    uint public OFFER_STARTS; //Starting timestamp of the offering
    uint public OFFER_EXPIRES; //Timestamp of when the token offering expires
    uint public WITHDRAW_PERIOD_EXPIRES; //Timestamp of when the withdraw period exipres
    
    uint public uncommitted_ether; //How much ether can still be withdrawn
    uint public committed_ether; //How much ether cannot be withdrawn
    uint public converted_ether; //How much ether has been converted to tokens
    
    mapping (address => Balance) public balances; //Keeps track of committed and 
                                                  //uncommitted ether for each account
////////////////
// ITO Functions
////////////////
    
    function InclusiveTokenOffering (
        uint _OFFER_STARTS,
        uint _OFFER_EXPIRES,
        uint _WITHDRAW_PERIOD_EXPIRES
    ) {
        require(now < _OFFER_STARTS);
        require(_OFFER_STARTS < _OFFER_EXPIRES);
        require(_OFFER_EXPIRES < _WITHDRAW_PERIOD_EXPIRES);
        
        OFFER_STARTS = _OFFER_STARTS;
        OFFER_EXPIRES = _OFFER_EXPIRES;
        WITHDRAW_PERIOD_EXPIRES = _WITHDRAW_PERIOD_EXPIRES;
    }
    
    function () payable {
        deposit(msg.sender);    
    }
    
    function deposit (address account) payable afterOfferStarts beforeOfferExpires {
        require(msg.value != 0);
        
        balances[account].uncommitted += msg.value;
        uncommitted_ether += msg.value;
        
        Deposit_event(account, msg.value);
    }
    
    function commit (uint amount) afterOfferStarts beforeWithdrawPeriodExpires hasDeposit {
        commit_internal(msg.sender, amount);
    }
    
    function depositAndCommit (address account) payable {
        deposit(account);
        commit_internal(account, msg.value);
    }
    
    function commit_internal(address account, uint amount) internal {
        require(amount <= balances[account].uncommitted);
        
        balances[account].uncommitted -= amount;
        balances[account].committed += amount;
        uncommitted_ether -= amount;
        committed_ether += amount;
        
        Commit_event(account,amount);
    }
    
    function withdraw (uint amount) beforeWithdrawPeriodExpires hasDeposit  {
        require(balances[msg.sender].uncommitted >= amount);
        require(amount > 0);
        
        balances[msg.sender].uncommitted -= amount;
        uncommitted_ether -= amount;
        msg.sender.transfer(amount);
        
        Withdraw_event(msg.sender,amount);
    }
    
    function claimTokens (address account) unclaimed (account) afterWithdrawPeriodExpires {
        uint accountDeposit = balanceOf(account);
        require(accountDeposit > 0);
        
        ITOController(owner).distributeTokens(account,accountDeposit,totalEther());
        converted_ether += accountDeposit;
    }
    
    function collectEther (address Vault) onlyOwner afterWithdrawPeriodExpires {
        Vault.transfer(this.balance);
    }
    
    function balanceOf (address account) constant returns (uint) {
        return balances[account].uncommitted + balances[account].committed;
    }
    
    function totalEther () constant returns (uint) {
        return uncommitted_ether + committed_ether;
    }

////////////////
// Structs, Modifiers, and Events
////////////////

    struct Balance {
        uint uncommitted;
        uint committed;
        bool claimed;
    }
    
    modifier afterOfferStarts () {
        require(now > OFFER_STARTS);
        
        _;
    }
    
    modifier beforeOfferExpires () {
        require(now < OFFER_EXPIRES);
        
        _;
    }
    
    modifier beforeWithdrawPeriodExpires () {
        require(now < WITHDRAW_PERIOD_EXPIRES);
        
        _;
    }
    
    modifier afterWithdrawPeriodExpires () {
        require(now > WITHDRAW_PERIOD_EXPIRES);
        
        _;
    }
    
    modifier hasDeposit () {
        require(balances[msg.sender].uncommitted > 0);
        
        _;
    }
    
    modifier unclaimed (address account) {
        require(!balances[account].claimed);
        require(balanceOf(account) > 0);
        
        _;
        
        balances[account].claimed = true;
    }
    
    event Deposit_event(address account, uint amount);
    
    event Commit_event(address account, uint amount);
    
    event Withdraw_event(address account, uint amount);
    
}
