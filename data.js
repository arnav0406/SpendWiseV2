let appData = {
    transactions: [],
    budgets: [],
    user: {},
    settings: {}
};

export async function loadData() {
    try {
        const response = await fetch('./data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        appData = await response.json();
        console.log('✅ Data loaded successfully from data.json');
        return appData;
    } catch (error) {
        console.error('❌ Error loading data.json:', error);
        return appData;
    }
}

export function getTransactions() {
    return appData.transactions || [];
}

export function getBudgets() {
    return appData.budgets || [];
}

export function getUserData() {
    return appData.user || {};
}

export function getSettings() {
    return appData.settings || {};
}

export function addTransaction(transaction) {
    const newTransaction = {
        id: Date.now(),
        ...transaction
    };
    appData.transactions.unshift(newTransaction);
    saveData();
    return newTransaction;
}

export function deleteTransaction(id) {
    const index = appData.transactions.findIndex(t => t.id === id);
    if (index > -1) {
        appData.transactions.splice(index, 1);
        saveData();
        return true;
    }
    return false;
}

export function addBudget(budget) {
    const newBudget = {
        id: Date.now(),
        spent: 0,
        ...budget
    };
    appData.budgets.push(newBudget);
    saveData();
    return newBudget;
}

function saveData() {
    localStorage.setItem('financeFlowData', JSON.stringify(appData));
    console.log('💾 Data saved to localStorage');
}

export function loadFromStorage() {
    const savedData = localStorage.getItem('financeFlowData');
    if (savedData) {
        appData = JSON.parse(savedData);
        console.log('✅ Data loaded from localStorage');
        return appData;
    }
    return null;
}
