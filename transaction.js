// js/pages/Transactions.js

// --- Mock Data (Export this so main.js can access it) ---
export let transactionsData = [
    { id: 1, name: 'Salary Deposit', category: 'Income', amount: 2500.00, type: 'success', date: '2025-10-01' },
    { id: 2, name: 'Fresh Foods Market', category: 'Groceries', amount: -75.00, type: 'danger', date: '2025-10-15' },
    { id: 3, name: 'The Italian Place', category: 'Dining', amount: -45.00, type: 'danger', date: '2025-10-18' },
    { id: 4, name: 'Cinema City', category: 'Entertainment', amount: -20.00, type: 'danger', date: '2025-10-20' },
    { id: 5, name: 'Online Bookstore', category: 'Shopping', amount: -30.00, type: 'danger', date: '2025-10-22' },
    { id: 6, name: 'Monthly Rent', category: 'Housing', amount: -850.00, type: 'danger', date: '2025-10-01' },
    { id: 7, name: 'Utility Bill', category: 'Housing', amount: -120.00, type: 'danger', date: '2025-10-10' },
    { id: 8, name: 'Freelance Gig', category: 'Income', amount: 450.00, type: 'success', date: '2025-10-25' },
    { id: 9, name: 'Gym Membership', category: 'Health', amount: -50.00, type: 'danger', date: '2025-10-05' },
    { id: 10, name: 'Coffee Shop', category: 'Dining', amount: -5.50, type: 'danger', date: '2025-10-28' },
];

const categoriesData = ['All', 'Income', 'Groceries', 'Dining', 'Entertainment', 'Shopping', 'Housing', 'Health'];

// --- Helper Functions ---

/**
 * Add a new transaction to the array
 */
export function addTransaction(transactionData) {
    const newTransaction = {
        id: Date.now(),
        name: transactionData.name,
        category: transactionData.category.charAt(0).toUpperCase() + transactionData.category.slice(1),
        amount: transactionData.type === 'expense' ? -parseFloat(transactionData.amount) : parseFloat(transactionData.amount),
        type: transactionData.type === 'expense' ? 'danger' : 'success',
        date: transactionData.date
    };
    
    transactionsData.unshift(newTransaction); // Add to beginning of array
}

/**
 * Generates the HTML for the list of category filter options
 */
function generateCategoryOptionsHTML(categories) {
    return categories.map(category => 
        `<option value="${category.toLowerCase()}">${category}</option>`
    ).join('');
}

/**
 * Generates the HTML for a list of transactions
 * Each item gets data-attributes to make filtering/searching easy
 */
function generateTransactionListHTML(transactions) {
    if (transactions.length === 0) {
        return `<p class="no-transactions-message">No transactions found.</p>`;
    }

    return transactions.map(item => `
        <div class="transaction-item" 
             data-name="${item.name.toLowerCase()}" 
             data-category="${item.category.toLowerCase()}">
            
            <div class="transaction-details">
                <span class="transaction-name">${item.name}</span>
                <span class="transaction-category">${item.category}</span>
            </div>
            <span class="transaction-amount ${item.type}">
                ${item.amount > 0 ? '+' : ''}€${Math.abs(item.amount).toFixed(2)}
            </span>
        </div>
    `).join('');
}

// --- Main Render Function ---

export function renderTransactions() {
    // Generate the dynamic parts of the HTML
    const categoryOptions = generateCategoryOptionsHTML(categoriesData);
    const transactionList = generateTransactionListHTML(transactionsData);

    // Return the full page HTML
    return `
        <div class="overview-header">
            <h3 class="overview-title">All Transactions</h3>
        </div>

        <!-- Toolbar for Search, Filter, and Add -->
        <div class="transaction-toolbar">
            <div class="search-bar">
                <i class="fas fa-search"></i>
                <input type="text" id="transaction-search-bar" placeholder="Search transactions...">
            </div>
            <select id="category-filter-select" class="filter-select">
                ${categoryOptions}
            </select>
            <button id="add-transaction-btn" class="btn btn-primary">
                <i class="fas fa-plus"></i> Add Transaction
            </button>
        </div>

        <!-- Transaction List -->
        <div id="transaction-list-container" class="transaction-list">
            ${transactionList}
        </div>

        <!-- Add Transaction Modal (Hidden by default) -->
        <div id="add-transaction-modal-overlay" class="modal-overlay hidden"></div>
        <div id="add-transaction-modal-content" class="modal-content hidden">
            <div class="modal-header">
                <h3>Add New Transaction</h3>
                <button id="modal-close-btn" class="modal-close-btn">&times;</button>
            </div>
            <form id="add-transaction-form">
                <div class="modal-form-group">
                    <label for="transaction-type">Type</label>
                    <select id="transaction-type" class="form-select" required>
                        <option value="expense">Expense</option>
                        <option value="income">Income</option>
                    </select>
                </div>
                <div class="modal-form-group">
                    <label for="transaction-amount">Amount</label>
                    <input type="number" id="transaction-amount" class="form-input" placeholder="0.00" min="0.01" step="0.01" required>
                </div>
                <div class="modal-form-group">
                    <label for="transaction-name">Name</label>
                    <input type="text" id="transaction-name" class="form-input" placeholder="e.g., Coffee Shop" required>
                </div>
                <div class="modal-form-group">
                    <label for="transaction-date">Date</label>
                    <input type="date" id="transaction-date" class="form-input" required>
                </div>
                <div class="modal-form-group">
                    <label for="transaction-category">Category</label>
                    <select id="transaction-category" class="form-select" required>
                        <!-- Skipping 'All' for the form -->
                        ${generateCategoryOptionsHTML(categoriesData.filter(c => c !== 'All'))}
                    </select>
                </div>
                <div class="modal-form-group">
                    <label for="transaction-description">Description (Optional)</label>
                    <textarea id="transaction-description" class="form-textarea" rows="3" placeholder="e.g., Morning latte"></textarea>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">Save Transaction</button>
                </div>
            </form>
        </div>
    `;
}
