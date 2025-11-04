import { renderOverview } from './overview.js';
import { renderTransactions, addTransaction, deleteTransaction } from './transaction.js';
import { renderBudgets, addBudget } from './budget.js';
import { renderReports } from './report.js';
import { loadData, loadFromStorage } from './data.js';

document.addEventListener('DOMContentLoaded', async () => {
    const storedData = loadFromStorage();
    if (!storedData) {
        await loadData();
    }

    const savedTheme = localStorage.getItem('theme');
    const themeToggle = document.getElementById('theme-toggle-checkbox');

    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        if (themeToggle) themeToggle.checked = true;
    }

    const contentArea = document.getElementById('dynamic-content-area');
    const navButtons = document.querySelectorAll('.nav-btn');

    function filterTransactions() {
        const searchInput = document.getElementById('transaction-search-bar');
        const categorySelect = document.getElementById('category-filter-select');
        const transactionItems = document.querySelectorAll('#transaction-list-container .transaction-item');

        if (!searchInput || !categorySelect || !transactionItems) 
            return;

        const searchTerm = searchInput.value.toLowerCase();
        const filterValue = categorySelect.value.toLowerCase();

        transactionItems.forEach(item => {
            const name = item.dataset.name.toLowerCase();
            const category = item.dataset.category.toLowerCase();

            const nameMatch = name.includes(searchTerm);
            const categoryMatch = category.includes(searchTerm);
            const filterMatch = (filterValue === 'all') || (category === filterValue);

            if ((nameMatch || categoryMatch) && filterMatch) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    }

    navButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            navButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const targetId = button.getAttribute('href');

            if (targetId === '#overview') {
                contentArea.innerHTML = renderOverview();
            } else if (targetId === '#transactions') {
                contentArea.innerHTML = renderTransactions();
            } else if (targetId === '#budgets') {
                contentArea.innerHTML = renderBudgets();
            } else if (targetId === '#reports') {
                contentArea.innerHTML = renderReports();
            }
        });
    });

    contentArea.addEventListener('click', (e) => {
        if (e.target.id === 'view-all-transactions-link') {
            e.preventDefault();
            const transactionsButton = document.querySelector('.nav-btn[href="#transactions"]');
            if (transactionsButton) {
                transactionsButton.click();
            }
        }

        if (e.target.id === 'add-transaction-btn') {
            document.getElementById('add-transaction-modal-overlay').classList.remove('hidden');
            document.getElementById('add-transaction-modal-content').classList.remove('hidden');
        }

        if (e.target.id === 'modal-close-btn' || e.target.id === 'add-transaction-modal-overlay') {
            document.getElementById('add-transaction-modal-overlay').classList.add('hidden');
            document.getElementById('add-transaction-modal-content').classList.add('hidden');
        }

        if (e.target.id === 'add-budget-btn') {
            document.getElementById('add-budget-modal-overlay').classList.remove('hidden');
            document.getElementById('add-budget-modal-content').classList.remove('hidden');
        }

        if (e.target.id === 'budget-modal-close-btn' || e.target.id === 'add-budget-modal-overlay') {
            document.getElementById('add-budget-modal-overlay').classList.add('hidden');
            document.getElementById('add-budget-modal-content').classList.add('hidden');
        }

        if (e.target.closest('.btn-delete-transaction')) {
            const deleteBtn = e.target.closest('.btn-delete-transaction');
            const transactionId = parseInt(deleteBtn.dataset.id);

            if (confirm('Are you sure you want to delete this transaction?')) {
                deleteTransaction(transactionId);
                contentArea.innerHTML = renderTransactions();
            }
        }
    });

    contentArea.addEventListener('submit', (e) => {
        if (e.target.id === 'add-transaction-form') {
            e.preventDefault();

            const type = document.getElementById('transaction-type').value;
            const amount = document.getElementById('transaction-amount').value;
            const name = document.getElementById('transaction-name').value;
            const date = document.getElementById('transaction-date').value;
            const category = document.getElementById('transaction-category').value;
            const description = document.getElementById('transaction-description').value;

            addTransaction({
                type,
                amount,
                name,
                date,
                category,
                description
            });

            contentArea.innerHTML = renderTransactions();
        }

        if (e.target.id === 'add-budget-form') {
            e.preventDefault();

            const category = document.getElementById('budget-category').value;
            const amount = document.getElementById('budget-amount').value;
            const period = document.getElementById('budget-period').value;
            const startDate = document.getElementById('budget-start-date').value;

            addBudget({
                category,
                amount,
                period,
                startDate
            });

            contentArea.innerHTML = renderBudgets();
        }
    });

    contentArea.addEventListener('input', (e) => {
        if (e.target.id === 'transaction-search-bar') {
            filterTransactions();
        }

        if (e.target.id === 'budget-search-bar') {
            const searchTerm = e.target.value.toLowerCase();
            const budgetItems = document.querySelectorAll('#budget-list-container .budget-item');

            budgetItems.forEach(item => {
                const category = item.dataset.category.toLowerCase();
                if (category.includes(searchTerm)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        }
    });

    contentArea.addEventListener('change', (e) => {
        if (e.target.id === 'category-filter-select') {
            filterTransactions();
        }

        if (e.target.id === 'budget-period-filter') {
            const period = e.target.value;
            const budgetItems = document.querySelectorAll('#budget-list-container .budget-item');

            budgetItems.forEach(item => {
                const itemPeriod = item.dataset.period;

                if (period === 'all' || itemPeriod === period) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        }
    });

    const profileIconLink = document.querySelector('.profile-icon-link');
    if (profileIconLink) {
        profileIconLink.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('profile-modal-overlay').classList.remove('hidden');
            document.getElementById('profile-modal').classList.remove('hidden');
        });
    }

    const profileCloseBtn = document.getElementById('profile-close-btn');
    if (profileCloseBtn) {
        profileCloseBtn.addEventListener('click', () => {
            document.getElementById('profile-modal-overlay').classList.add('hidden');
            document.getElementById('profile-modal').classList.add('hidden');
        });
    }

    const profileOverlay = document.getElementById('profile-modal-overlay');
    if (profileOverlay) {
        profileOverlay.addEventListener('click', () => {
            document.getElementById('profile-modal-overlay').classList.add('hidden');
            document.getElementById('profile-modal').classList.add('hidden');
        });
    }

    const themeToggleCheckbox = document.getElementById('theme-toggle-checkbox');
    if (themeToggleCheckbox) {
        themeToggleCheckbox.addEventListener('change', (e) => {
            if (e.target.checked) {
                document.body.classList.add('light-mode');
                localStorage.setItem('theme', 'light');
            } else {
                document.body.classList.remove('light-mode');
                localStorage.setItem('theme', 'dark');
            }
        });
    }

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to logout?')) {
                window.location.href = 'login.html';
            }
        });
    }

    contentArea.innerHTML = renderOverview();
    const overviewButton = document.querySelector('.nav-btn[href="#overview"]');
    if (overviewButton) {
        overviewButton.classList.add('active');
    }
});