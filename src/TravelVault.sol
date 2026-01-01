// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract TravelVault {
    // --- State Variables ---
    address public owner;
    address public aiAgent;

    // --- Events ---
    event Deposit(address indexed sender, uint256 amount);
    event TicketPurchased(address indexed destination, uint256 cost, string flightId);

    // --- Errors (Gas tasarrufu için require yerine error kullanıyoruz - Clean Code) ---
    error NotAuthorized();
    error InsufficientFunds();
    error TransferFailed();
    error DepositZero();

    // --- Modifiers ---
    modifier onlyOwnerOrAgent() {
        if (msg.sender != owner && msg.sender != aiAgent) {
            revert NotAuthorized();
        }
        _;
    }

    constructor(address _aiAgent) {
        owner = msg.sender;
        aiAgent = _aiAgent;
    }

    // --- Functions ---

    function depositBudget() external payable {
        if (msg.value == 0) revert DepositZero();
        emit Deposit(msg.sender, msg.value);
    }

    function executePurchase(address payable _destination, uint256 _cost, string memory _flightId)
        external
        onlyOwnerOrAgent
    {
        if (address(this).balance < _cost) revert InsufficientFunds();

        // Call kullanımı (Transfer'den daha güvenli)
        (bool success,) = _destination.call{value: _cost}("");
        if (!success) revert TransferFailed();

        emit TicketPurchased(_destination, _cost, _flightId);
    }

    function withdraw() external {
        if (msg.sender != owner) revert NotAuthorized();
        (bool success,) = payable(owner).call{value: address(this).balance}("");
        if (!success) revert TransferFailed();
    }

    // Testlerde kolaylık olsun diye
    receive() external payable {}
}
