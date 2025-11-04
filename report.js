import { getTransactions, getBudgets } from './data.js';


function calculateTotalIncome(transactions) {
    return transactions
        .filter(t => t.amount > 0)
        .reduce((sum, t) => sum + t.amount, 0);
}

function calculateTotalExpenses(transactions) {
    return transactions
        .filter(t => t.amount < 0)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);
}

function calculateSpendingByCategory(transactions) {
    const categoryTotals = {};
    
    transactions
        .filter(t => t.amount < 0) 
        .forEach(t => {
            const category = t.category;
            if (!categoryTotals[category]) {
                categoryTotals[category] = 0;
            }
            categoryTotals[category] += Math.abs(t.amount);
        });
    

    return Object.entries(categoryTotals)
        .map(([category, amount]) => ({ category, amount }))
        .sort((a, b) => b.amount - a.amount);
}


function calculateBudgetHealth(budgets) {
    if (budgets.length === 0) return 100;
    
    const totalBudgeted = budgets.reduce((sum, b) => sum + b.budgeted, 0);
    const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
    
    if (totalBudgeted === 0) return 100;
    
    const percentage = (totalSpent / totalBudgeted) * 100;
    return Math.min(percentage, 100);
}


function getBudgetHealthStatus(percentage) {
    if (percentage >= 90) return 'danger';
    if (percentage >= 70) return 'warning';
    return 'success';
}


function generatePieChartGradient(categoryData, totalExpenses) {
    if (categoryData.length === 0) return 'conic-gradient(var(--text-gray) 0% 100%)';
    
    const colors = [
        '#3b82f6',
        '#ef4444', 
        '#22c55e', 
        '#f59e0b', 
        '#8b5cf6', 
        '#ec4899', 
        '#06b6d4', 
        '#f97316', 
    ];
    
    let currentPercentage = 0;
    const gradientParts = [];
    
    categoryData.forEach((item, index) => {
        const percentage = (item.amount / totalExpenses) * 100;
        const color = colors[index % colors.length];
        gradientParts.push(`${color} ${currentPercentage}% ${currentPercentage + percentage}%`);
        currentPercentage += percentage;
    });
    
    return `conic-gradient(${gradientParts.join(', ')})`;
}

function generatePieChartLegend(categoryData, totalExpenses) {
    if (categoryData.length === 0) {
        return `<p class="no-transactions-message">No expense data available.</p>`;
    }
    
    const colors = [
        '#3b82f6', '#ef4444', '#22c55e', '#f59e0b',
        '#8b5cf6', '#ec4899', '#06b6d4', '#f97316',
    ];
    
    return categoryData.map((item, index) => {
        const percentage = totalExpenses > 0 ? (item.amount / totalExpenses) * 100 : 0;
        const color = colors[index % colors.length];
        
        return `
            <div class="pie-legend-item">
                <div class="pie-legend-color" style="background: ${color};"></div>
                <div class="pie-legend-details">
                    <span class="pie-legend-category">${item.category}</span>
                    <span class="pie-legend-amount">₹${item.amount.toFixed(2)} (${percentage.toFixed(1)}%)</span>
                </div>
            </div>
        `;
    }).join('');
}


export function renderReports() {
    const transactionsData = getTransactions();
    const budgetsData = getBudgets();
    const totalIncome = calculateTotalIncome(transactionsData);
    const totalExpenses = calculateTotalExpenses(transactionsData);
    const netSavings = totalIncome - totalExpenses;
    const budgetHealth = calculateBudgetHealth(budgetsData);
    const budgetHealthStatus = getBudgetHealthStatus(budgetHealth);
    const categoryData = calculateSpendingByCategory(transactionsData);
    const pieChartGradient = generatePieChartGradient(categoryData, totalExpenses);
    const pieChartLegend = generatePieChartLegend(categoryData, totalExpenses);
    
    const spendingRate = totalExpenses / 30;

    return `
        <div class="overview-header">
            <h3 class="overview-title">Financial Reports</h3>
        </div>

        <!-- Section 1: Financial Summary Cards -->
        <div class="overview-cards-grid">
            <!-- Net Savings Card -->
            <div class="overview-card">
                <div class="card-icon ${netSavings >= 0 ? 'success' : 'danger'}">
                    <i class="fas fa-piggy-bank"></i>
                </div>
                <div class="card-details">
                    <span class="card-title">Net Savings</span>
                    <span class="card-amount ${netSavings >= 0 ? 'success' : 'danger'}">
                        ${netSavings >= 0 ? '+' : ''}₹${netSavings.toFixed(2)}
                    </span>
                </div>
            </div>
            
            <!-- Spending Rate Card -->
            <div class="overview-card">
                <div class="card-icon warning">
                    <i class="fas fa-chart-line"></i>
                </div>
                <div class="card-details">
                    <span class="card-title">Daily Avg Spending</span>
                    <span class="card-amount">₹${spendingRate.toFixed(2)}</span>
                </div>
            </div>

            <!-- Budget Health Card -->
            <div class="overview-card">
                <div class="card-icon ${budgetHealthStatus}">
                    <i class="fas fa-heartbeat"></i>
                </div>
                <div class="card-details">
                    <span class="card-title">Budget Health</span>
                    <span class="card-amount">${budgetHealth.toFixed(1)}%</span>
                </div>
            </div>
        </div>

        <!-- Section 2: Spending by Category PIE CHART -->
        <div class="report-section">
            <h3 class="report-section-title">Spending by Category</h3>
            <div class="pie-chart-container">
                <div class="pie-chart" style="background: ${pieChartGradient};"></div>
                <div class="pie-chart-legend">
                    ${pieChartLegend}
                </div>
            </div>
        </div>

        <!-- Section 4: Income vs Expenses Comparison -->
        <div class="report-section">
            <h3 class="report-section-title">Income vs Expenses</h3>
            <div class="income-expense-comparison">
                <!-- Income Column -->
                <div class="comparison-column">
                    <div class="comparison-icon success">
                        <i class="fas fa-arrow-down"></i>
                    </div>
                    <div class="comparison-details">
                        <span class="comparison-label">Total Income</span>
                        <span class="comparison-amount success">₹${totalIncome.toFixed(2)}</span>
                    </div>
                </div>

                <!-- VS Divider -->
                <div class="comparison-divider">
                    <span class="vs-text">VS</span>
                </div>

                <!-- Expenses Column -->
                <div class="comparison-column">
                    <div class="comparison-icon danger">
                        <i class="fas fa-arrow-up"></i>
                    </div>
                    <div class="comparison-details">
                        <span class="comparison-label">Total Expenses</span>
                        <span class="comparison-amount danger">₹${totalExpenses.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            <!-- Difference Bar -->
            <div class="income-expense-bar">
                <div class="income-expense-bar-wrapper">
                    <div class="income-bar" style="width: ${totalIncome > 0 ? (totalIncome / (totalIncome + totalExpenses) * 100) : 0}%">
                        <span class="bar-label">Income</span>
                    </div>
                    <div class="expense-bar" style="width: ${totalExpenses > 0 ? (totalExpenses / (totalIncome + totalExpenses) * 100) : 0}%">
                        <span class="bar-label">Expenses</span>
                    </div>
                </div>
                <div class="income-expense-difference">
                    <span class="${netSavings >= 0 ? 'success' : 'danger'}">
                        Difference: ${netSavings >= 0 ? '+' : ''}₹${netSavings.toFixed(2)}
                    </span>
                </div>
            </div>
        </div>
    `;
}
