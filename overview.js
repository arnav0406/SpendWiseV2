export function renderOverview() {

    
    return `
        <div class="overview-header">
            <div>
                <h3 class="overview-title">Current Balance</h3>
                <span class="balance-display">€2,355.00</span>
            </div>
        </div>

        <div class="overview-cards-grid">
            <!-- Income Card -->
            <div class="overview-card">
                <div class="card-icon success">
                    <i class="fas fa-arrow-down"></i>
                </div>
                <div class="card-details">
                    <span class="card-title">Income</span>
                    <span class="card-amount">€2,500.00</span>
                </div>
            </div>
            
            <!-- Expenses Card -->
            <div class="overview-card">
                <div class="card-icon danger">
                    <i class="fas fa-arrow-up"></i>
                </div>
                <div class="card-details">
                    <span class="card-title">Expenses</span>
                    <span class="card-amount">-€145.00</span>
                </div>
            </div>
        </div>

        <!-- Latest Transactions Summary -->
        <div class="overview-list-header">
            <h3>Latest Transactions</h3>
            <!-- This is the link we are updating -->
            <a href="#" id="view-all-transactions-link" class="view-all-link">View All &gt;</a>
        </div>
        
        <div class="transaction-list">
            <div class="transaction-item">
                <div class="transaction-details">
                    <span class="transaction-name">Salary Deposit</span>
                    <span class="transaction-category">Income</span>
                </div>
                <span class="transaction-amount success">+€2,500.00</span>
            </div>
            <div class="transaction-item">
                <div class="transaction-details">
                    <span class="transaction-name">Fresh Foods Market</span>
                    <span class="transaction-category">Groceries</span>
                </div>
                <span class="transaction-amount danger">-€75.00</span>
            </div>
            <div class="transaction-item">
                <div class="transaction-details">
                    <span class="transaction-name">The Italian Place</span>
                    <span class="transaction-category">Dining</span>
                </div>
                <span class="transaction-amount danger">-€45.00</span>
            </div>
        </div>
    `;
}

