import { getTransactions, addTransaction as addTransactionToData, deleteTransaction as deleteTransactionFromData } from './data.js';

const categoriesData = ['All', 'Income', 'Groceries', 'Dining', 'Entertainment', 'Shopping', 'Housing', 'Health'];

export function addTransaction(transactionData) {
    const newTransaction = {
        name: transactionData.name,
        category: transactionData.category.charAt(0).toUpperCase() + transactionData.category.slice(1),
        amount: transactionData.type === 'expense' ? -parseFloat(transactionData.amount) : parseFloat(transactionData.amount),
        type: transactionData.type === 'expense' ? 'danger' : 'success',
        date: transactionData.date
    };

    return addTransactionToData(newTransaction);
}

export function deleteTransaction(id) {
    return deleteTransactionFromData(id);
}

function generateCategoryOptionsHTML(categories) {
    return categories.map(category => 
        `<option value="${category.toLowerCase()}">${category}</option>`
    ).join('');
}

function generateTransactionListHTML(transactions) {
    if (transactions.length === 0) {
        return `<p class="no-transactions-message">No transactions found.</p>`;
    }

    return transactions.map(item => `
        <div class="transaction-item" 
             data-id="${item.id}"
             data-name="${item.name.toLowerCase()}" 
             data-category="${item.category.toLowerCase()}">
            
            <div class="transaction-details">
                <span class="transaction-name">${item.name}</span>
                <span class="transaction-category">${item.category}</span>
            </div>
            
            <div class="transaction-actions">
                <span class="transaction-amount ${item.type}">
                    ${item.amount > 0 ? '+' : ''}₹${Math.abs(item.amount).toFixed(2)}
                </span>
            </div>
        </div>
    `).join('');
}

export function renderTransactions() {
    const transactions = getTransactions();
    const categoryOptions = generateCategoryOptionsHTML(categoriesData);
    const transactionList = generateTransactionListHTML(transactions);

    return `
        <div class="overview-header">
            <h3 class="overview-title">All Transactions</h3>
        </div>

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

        <div id="transaction-list-container" class="transaction-list">
            ${transactionList}
        </div>

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
