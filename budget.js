export let budgetsData = [
    { 
        id: 1,
        category: 'Groceries', 
        budgeted: 300.00, 
        spent: 75.00, 
        icon: 'fas fa-shopping-cart',
        period: 'monthly'
    },
    { 
        id: 2,
        category: 'Dining', 
        budgeted: 150.00, 
        spent: 50.00, 
        icon: 'fas fa-utensils',
        period: 'monthly'
    },
    { 
        id: 3,
        category: 'Entertainment', 
        budgeted: 100.00, 
        spent: 20.00, 
        icon: 'fas fa-film',
        period: 'monthly'
    },
    { 
        id: 4,
        category: 'Shopping', 
        budgeted: 200.00, 
        spent: 30.00, 
        icon: 'fas fa-shopping-bag',
        period: 'monthly'
    },
    { 
        id: 5,
        category: 'Housing', 
        budgeted: 1000.00, 
        spent: 970.00, 
        icon: 'fas fa-home',
        period: 'monthly'
    },
    { 
        id: 6,
        category: 'Health', 
        budgeted: 100.00, 
        spent: 50.00, 
        icon: 'fas fa-heartbeat',
        period: 'monthly'
    },
];
const categoryIcons = {
    'groceries': 'fas fa-shopping-cart',
    'dining': 'fas fa-utensils',
    'entertainment': 'fas fa-film',
    'shopping': 'fas fa-shopping-bag',
    'housing': 'fas fa-home',
    'health': 'fas fa-heartbeat',
    'transportation': 'fas fa-car',
    'utilities': 'fas fa-lightbulb'
};

export function addBudget(budgetData) {
    const newBudget = {
        id: Date.now(), 
        category: budgetData.category.charAt(0).toUpperCase() + budgetData.category.slice(1),
        budgeted: parseFloat(budgetData.amount),
        spent: 0, 
        icon: categoryIcons[budgetData.category.toLowerCase()] || 'fas fa-wallet',
        period: budgetData.period
    };
    
    budgetsData.push(newBudget);
}

function calculateTotals(budgets) {
    const totalBudgeted = budgets.reduce((sum, b) => sum + b.budgeted, 0);
    const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
    return { totalBudgeted, totalSpent };
}

function getBudgetStatus(spent, budgeted) {
    const percentage = (spent / budgeted) * 100;
    if (percentage >= 90) return 'danger';
    if (percentage >= 70) return 'warning';
    return 'success';
}

function generateBudgetItemsHTML(budgets) {
    if (budgets.length === 0) {
        return `<p class="no-transactions-message">No budgets created yet.</p>`;
    }

    return budgets.map(budget => {
        const percentage = Math.min((budget.spent / budget.budgeted) * 100, 100);
        const remaining = Math.max(budget.budgeted - budget.spent, 0);
        const status = getBudgetStatus(budget.spent, budget.budgeted);

        return `
            <div class="budget-item" 
                 data-category="${budget.category.toLowerCase()}"
                 data-period="${budget.period.toLowerCase()}">
                <div class="budget-item-header">
                    <div class="budget-item-info">
                        <div class="budget-icon ${status}">
                            <i class="${budget.icon}"></i>
                        </div>
                        <div class="budget-item-details">
                            <span class="budget-item-name">${budget.category}</span>
                            <span class="budget-item-period">${budget.period.charAt(0).toUpperCase() + budget.period.slice(1)} Budget</span>
                        </div>
                    </div>
                    <div class="budget-item-amounts">
                        <span class="budget-spent ${status}">€${budget.spent.toFixed(2)}</span>
                        <span class="budget-total">of €${budget.budgeted.toFixed(2)}</span>
                    </div>
                </div>
                
                <div class="budget-progress-wrapper">
                    <div class="budget-progress-bar-container">
                        <div class="budget-progress-bar ${status}" style="width: ${percentage}%"></div>
                    </div>
                    <div class="budget-progress-info">
                        <span class="budget-percentage">${percentage.toFixed(0)}% used</span>
                        <span class="budget-remaining">€${remaining.toFixed(2)} left</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}


export function renderBudgets() {
    const { totalBudgeted, totalSpent } = calculateTotals(budgetsData);
    const totalRemaining = totalBudgeted - totalSpent;
    const budgetItems = generateBudgetItemsHTML(budgetsData);

    return `
        <div class="overview-header">
            <div>
                <h3 class="overview-title">Monthly Budget</h3>
                <span class="balance-display">€${totalBudgeted.toFixed(2)}</span>
            </div>
        </div>

        <div class="overview-cards-grid">
            <div class="overview-card">
                <div class="card-icon success">
                    <i class="fas fa-wallet"></i>
                </div>
                <div class="card-details">
                    <span class="card-title">Total Budgeted</span>
                    <span class="card-amount">€${totalBudgeted.toFixed(2)}</span>
                </div>
            </div>
            
            <div class="overview-card">
                <div class="card-icon ${getBudgetStatus(totalSpent, totalBudgeted)}">
                    <i class="fas fa-credit-card"></i>
                </div>
                <div class="card-details">
                    <span class="card-title">Total Spent</span>
                    <span class="card-amount">€${totalSpent.toFixed(2)}</span>
                </div>
            </div>
        </div>

        <div class="transaction-toolbar">
            <div class="search-bar">
                <i class="fas fa-search"></i>
                <input type="text" id="budget-search-bar" placeholder="Search budgets...">
            </div>
            <select id="budget-period-filter" class="filter-select">
                <option value="monthly">Monthly</option>
                <option value="weekly">Weekly</option>
                <option value="annual">Annual</option>
            </select>
            <button id="add-budget-btn" class="btn btn-primary">
                <i class="fas fa-plus"></i> Add Budget
            </button>
        </div>

        <div id="budget-list-container" class="budget-list">
            ${budgetItems}
        </div>

        <div id="add-budget-modal-overlay" class="modal-overlay hidden"></div>
        <div id="add-budget-modal-content" class="modal-content hidden">
            <div class="modal-header">
                <h3>Add New Budget</h3>
                <button id="budget-modal-close-btn" class="modal-close-btn">&times;</button>
            </div>
            <form id="add-budget-form">
                <div class="modal-form-group">
                    <label for="budget-category">Category</label>
                    <select id="budget-category" class="form-select" required>
                        <option value="">Select Category</option>
                        <option value="groceries">Groceries</option>
                        <option value="dining">Dining</option>
                        <option value="entertainment">Entertainment</option>
                        <option value="shopping">Shopping</option>
                        <option value="housing">Housing</option>
                        <option value="health">Health</option>
                        <option value="transportation">Transportation</option>
                        <option value="utilities">Utilities</option>
                    </select>
                </div>
                <div class="modal-form-group">
                    <label for="budget-amount">Budget Amount</label>
                    <input type="number" id="budget-amount" class="form-input" placeholder="0.00" min="0.01" step="0.01" required>
                </div>
                <div class="modal-form-group">
                    <label for="budget-period">Period</label>
                    <select id="budget-period" class="form-select" required>
                        <option value="weekly">Weekly</option>
                        <option value="monthly" selected>Monthly</option>
                        <option value="annual">Annual</option>
                    </select>
                </div>
                <div class="modal-form-group">
                    <label for="budget-start-date">Start Date</label>
                    <input type="date" id="budget-start-date" class="form-input" required>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">Create Budget</button>
                </div>
            </form>
        </div>
    `;
}