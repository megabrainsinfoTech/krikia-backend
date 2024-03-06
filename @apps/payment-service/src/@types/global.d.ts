enum WalletType {
    User = "User",
    Agent = "Agent",
    Business = "Business"
}

enum AccountType {
    Personal = "Personal",
    Corporate = "Corporate",
    Control = "Control"
}

enum TransactionStatus {
    Pending = "Pending",
    Verified = "Verified",
    Refunded = "Refunded",
    Cancelled = "Cancelled"
}

enum PaymentMethod {
    Wallet = "Wallet",
    Transfer = "Transfer"
}

enum TransactionAction {
    Payment = "Payment",
    Refund = "Refund",
    Withdraw = "Withdraw"
}

enum TransactionType {
    Credit = "Credit",
    Debit = "Debit"
}