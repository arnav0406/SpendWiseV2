import { getTransactions } from './data.js';

export function renderOverview() {
    const transactions = getTransactions();

    const income = transactions
        .filter(t => t.amount > 0)
        .reduce((sum, t) => sum + t.amount, 0);

    const expenses = transactions
        .filter(t => t.amount < 0)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const balance = income - expenses;

    const latestTransactions = transactions.slice(0, 3);

    return `
        <div class="overview-header">
            <div>
                <h3 class="overview-title">Current Balance</h3>
                <span class="balance-display">₹${balance.toFixed(2)}</span>
            </div>
        </div>

        <div class="overview-cards-grid">
            <div class="overview-card">
                <div class="card-icon success">
                    <i class="fas fa-arrow-down"></i>
                </div>
                <div class="card-details">
                    <span class="card-title">Income</span>
                    <span class="card-amount">₹${income.toFixed(2)}</span>
                </div>
            </div>

            <div class="overview-card">
                <div class="card-icon danger">
                    <i class="fas fa-arrow-up"></i>
                </div>
                <div class="card-details">
                    <span class="card-title">Expenses</span>
                    <span class="card-amount">-₹${expenses.toFixed(2)}</span>
                </div>
            </div>
        </div>

        <div class="overview-list-header">
            <h3>Latest Transactions</h3>
            <a href="#" id="view-all-transactions-link" class="view-all-link">View All &gt;</a>
        </div>

        <div class="transaction-list">
            ${latestTransactions.map(item => `
                <div class="transaction-item">
                    <div class="transaction-details">
                        <span class="transaction-name">${item.name}</span>
                        <span class="transaction-category">${item.category}</span>
                    </div>
                    <span class="transaction-amount ${item.type}">
                        ${item.amount > 0 ? '+' : ''}₹${Math.abs(item.amount).toFixed(2)}
                    </span>
                </div>
            `).join('')}
        </div>
    `;
}
