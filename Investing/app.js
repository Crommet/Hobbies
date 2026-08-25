// Initial Default State (Fallback if backend has no data)
const defaultDebts = [
    { name: "Credit Card", balance: 4500, apr: 24.2, minPay: 140 },
    { name: "Auto Loan", balance: 14000, apr: 6.2, minPay: 310 },
    { name: "Student Loan", balance: 22000, apr: 4.8, minPay: 240 }
];

const defaultInvestments = [
    { name: "401(k) Match Target", balance: 12000, roi: 8.0, monthly: 500 },
    { name: "Roth IRA", balance: 8500, roi: 8.0, monthly: 583 },
    { name: "Taxable Brokerage", balance: 15000, roi: 7.5, monthly: 300 }
];

let chartInstance = null;
let debounceTimer = null;
let saveDebounceTimer = null;
let isInitializing = true;

// --- API Integration for Persistence ---
async function loadData() {
    try {
        const response = await fetch('/api/data');
        if (response.ok) {
            const data = await response.json();
            if (data && data.debts && data.investments) {
                // Populate inputs
                document.getElementById('income-input').value = data.settings?.income || 5000;
                document.getElementById('income-slider').value = data.settings?.income || 5000;
                document.getElementById('allocation-slider').value = data.settings?.allocation || 2800;
                document.getElementById('threshold-input').value = data.settings?.threshold || 7.0;
                document.getElementById('inflation-input').value = data.settings?.inflation || 3.0;
                document.getElementById('tax-input').value = data.settings?.taxRate || 15.0;
                
                initTables(data.debts, data.investments);
            } else {
                initTables(defaultDebts, defaultInvestments);
            }
        } else {
            initTables(defaultDebts, defaultInvestments);
        }
    } catch (e) {
        console.error("Failed to load data, using defaults.", e);
        initTables(defaultDebts, defaultInvestments);
    }
    isInitializing = false;
    recalculate();
}

async function saveData(payload) {
    if (isInitializing) return;
    try {
        await fetch('/api/data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
    } catch (e) {
        console.error("Failed to save data.", e);
    }
}

function triggerSave(debts, investments, settings) {
    clearTimeout(saveDebounceTimer);
    saveDebounceTimer = setTimeout(() => {
        saveData({ debts, investments, settings });
    }, 1000);
}

// --- Formatting Helpers (Currency Input UX) ---
function formatCurrency(value) {
    const num = parseFloat(value);
    if (isNaN(num)) return value;
    return '$' + num.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 2});
}

function unformatCurrency(value) {
    if (typeof value === 'number') return value;
    const num = parseFloat(value.replace(/[^0-9.-]+/g, ""));
    return isNaN(num) ? 0 : num;
}

// We change input types from 'number' to 'text' for currency fields on focus/blur
function setupCurrencyFormatting(input) {
    input.type = 'text';
    input.value = formatCurrency(input.value);

    input.addEventListener('focus', function() {
        this.value = unformatCurrency(this.value);
        this.type = 'number';
    });

    input.addEventListener('blur', function() {
        this.type = 'text';
        this.value = formatCurrency(this.value);
        triggerRecalculation();
    });
}

// --- Table Management ---
function initTables(debts, investments) {
    const debtBody = document.getElementById('debt-table-body');
    const investBody = document.getElementById('invest-table-body');
    debtBody.innerHTML = '';
    investBody.innerHTML = '';

    debts.forEach(d => addDebtRow(d.name, d.balance, d.apr, d.minPay, false));
    investments.forEach(i => addInvestRow(i.name, i.balance, i.roi, i.monthly, false));
}

function addDebtRow(name = '', balance = 0, apr = 0, minPay = 0, trigger = true) {
    const tbody = document.getElementById('debt-table-body');
    const row = document.createElement('tr');
    row.innerHTML = `
        <td><input type="text" class="debt-name" value="${name}"></td>
        <td><input type="number" class="debt-balance" value="${balance}" step="100"></td>
        <td><input type="number" class="debt-apr" value="${apr}" step="0.1"></td>
        <td><input type="number" class="debt-min" value="${minPay}" step="10"></td>
        <td><button class="btn-del" onclick="removeRow(this)">&times;</button></td>
    `;
    tbody.appendChild(row);
    
    // Apply formatting to money fields
    setupCurrencyFormatting(row.querySelector('.debt-balance'));
    setupCurrencyFormatting(row.querySelector('.debt-min'));
    
    if (trigger) triggerRecalculation();
}

function addInvestRow(name = '', balance = 0, roi = 7.0, monthly = 0, trigger = true) {
    const tbody = document.getElementById('invest-table-body');
    const row = document.createElement('tr');
    row.innerHTML = `
        <td><input type="text" class="invest-name" value="${name}"></td>
        <td><input type="number" class="invest-balance" value="${balance}" step="500"></td>
        <td><input type="number" class="invest-roi" value="${roi}" step="0.1"></td>
        <td><input type="number" class="invest-monthly" value="${monthly}" step="25"></td>
        <td><button class="btn-del" onclick="removeRow(this)">&times;</button></td>
    `;
    tbody.appendChild(row);
    
    setupCurrencyFormatting(row.querySelector('.invest-balance'));
    setupCurrencyFormatting(row.querySelector('.invest-monthly'));
    
    if (trigger) triggerRecalculation();
}

function removeRow(button) {
    button.closest('tr').remove();
    triggerRecalculation();
}

// --- Data Extraction ---
function extractData() {
    const debts = [];
    document.querySelectorAll('#debt-table-body tr').forEach(row => {
        debts.push({
            name: row.querySelector('.debt-name').value,
            balance: unformatCurrency(row.querySelector('.debt-balance').value),
            apr: parseFloat(row.querySelector('.debt-apr').value) || 0,
            minPay: unformatCurrency(row.querySelector('.debt-min').value)
        });
    });

    const investments = [];
    document.querySelectorAll('#invest-table-body tr').forEach(row => {
        investments.push({
            name: row.querySelector('.invest-name').value,
            balance: unformatCurrency(row.querySelector('.invest-balance').value),
            roi: parseFloat(row.querySelector('.invest-roi').value) || 0,
            monthly: unformatCurrency(row.querySelector('.invest-monthly').value)
        });
    });

    const settings = {
        income: parseFloat(document.getElementById('income-slider').value) || 0,
        allocation: parseFloat(document.getElementById('allocation-slider').value) || 0,
        threshold: parseFloat(document.getElementById('threshold-input').value) || 7.0,
        inflation: parseFloat(document.getElementById('inflation-input').value) || 3.0,
        taxRate: parseFloat(document.getElementById('tax-input').value) || 15.0
    };

    return { debts, investments, settings };
}

// --- Engine Logic ---
function runSimulation(allocatedPool, debts, investments, settings) {
    const months = 60;
    const labels = [];
    const optimalNetWorth = [];

    let optDebts = debts.map(d => ({ ...d }));
    let optInvestTotal = investments.reduce((acc, i) => acc + i.balance, 0);
    
    // Calculate Average Nominal ROI
    let avgRoi = investments.length > 0 
        ? (investments.reduce((acc, i) => acc + (i.roi * i.balance), 0) / (optInvestTotal || 1)) / 100 
        : 0.07;
    
    // Apply Taxes (e.g. 15% tax reduces 10% ROI to 8.5%)
    let effectiveRoi = avgRoi * (1 - (settings.taxRate / 100));

    for (let m = 0; m <= months; m++) {
        if (m % 6 === 0) labels.push(`M${m}`);

        let totalDebt = optDebts.reduce((sum, d) => sum + d.balance, 0);
        let currentNet = optInvestTotal - totalDebt;
        
        // Discount for Inflation to show "Real" Purchasing Power Net Worth
        let realNetWorth = currentNet / Math.pow(1 + (settings.inflation / 100), m / 12);
        
        if (m % 6 === 0) optimalNetWorth.push(Math.round(realNetWorth));

        let availableCash = allocatedPool;

        // 1. Pay minimums
        optDebts.forEach(d => {
            if (d.balance > 0) {
                let monthlyRate = (d.apr / 100) / 12;
                let interest = d.balance * monthlyRate;
                let payment = Math.min(d.minPay, d.balance + interest);
                d.balance = Math.max(0, d.balance + interest - payment);
                availableCash -= payment;
            }
        });

        // 2. Extra to high interest (Avalanche based on Configurable Threshold)
        optDebts.sort((a, b) => b.apr - a.apr);
        for (let d of optDebts) {
            if (d.balance > 0 && d.apr >= settings.threshold && availableCash > 0) {
                let extra = Math.min(availableCash, d.balance);
                d.balance -= extra;
                availableCash -= extra;
            }
        }

        // 3. Invest remainder
        if (availableCash > 0) {
            optInvestTotal += availableCash;
        }
        
        // Grow investments with tax-adjusted ROI
        optInvestTotal *= (1 + (effectiveRoi / 12));
    }

    return { labels, optimalNetWorth };
}

function generateAllocationDirective(allocatedPool, debts, investments, settings) {
    const planBody = document.getElementById('action-plan-body');
    planBody.innerHTML = '';
    
    let availableCash = allocatedPool;
    let plan = [];

    // 1. Minimum payments
    debts.forEach(d => {
        if (d.balance > 0 && d.minPay > 0) {
            let monthlyRate = (d.apr / 100) / 12;
            let interest = d.balance * monthlyRate;
            let payment = Math.min(d.minPay, d.balance + interest);
            
            plan.push({ target: d.name, action: "Baseline Minimum Payment", amount: payment });
            availableCash -= payment;
        }
    });

    // 2. Base investments
    investments.forEach(i => {
        if (i.monthly > 0 && availableCash >= i.monthly) {
            plan.push({ target: i.name, action: "Standard Contribution Target", amount: i.monthly });
            availableCash -= i.monthly;
        } else if (i.monthly > 0 && availableCash > 0) {
            plan.push({ target: i.name, action: "Partial Contribution (Capital Constrained)", amount: availableCash });
            availableCash = 0;
        }
    });

    // 3. Avalanche extra debt payments (using custom Threshold)
    if (availableCash > 0) {
        let highInterestDebts = [...debts]
            .filter(d => d.apr >= settings.threshold && d.balance > 0)
            .sort((a, b) => b.apr - a.apr);

        for (let targetDebt of highInterestDebts) {
            if (availableCash > 0) {
                let remainderToPay = targetDebt.balance - targetDebt.minPay; 
                if (remainderToPay > 0) {
                    let avalanchePayment = Math.min(availableCash, remainderToPay);
                    plan.push({ target: targetDebt.name, action: `Avalanche Deployment (APR ≥ ${settings.threshold}%)`, amount: avalanchePayment });
                    availableCash -= avalanchePayment;
                }
            }
        }
    }

    // 4. Surplus to remaining investments
    if (availableCash > 0 && investments.length > 0) {
        let sortedInvestments = [...investments].sort((a, b) => b.roi - a.roi);
        let optimalAsset = sortedInvestments[0];
        plan.push({ target: optimalAsset.name, action: "Surplus Capital Injection", amount: availableCash });
        availableCash = 0;
    }

    // Output to table
    plan.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td style="color: var(--text-primary); font-weight: 500;">${item.target}</td>
            <td style="color: var(--text-muted);">${item.action}</td>
            <td style="text-align: right; color: var(--accent-blue); font-weight: 600;">
                $${item.amount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
            </td>
        `;
        planBody.appendChild(row);
    });
}

function recalculate() {
    if (isInitializing) return;

    const { debts, investments, settings } = extractData();
    
    const incomeInput = document.getElementById('income-input');
    const incomeSlider = document.getElementById('income-slider');
    const allocationSlider = document.getElementById('allocation-slider');
    
    // Sync Income UI
    if (document.activeElement === incomeInput || document.activeElement === incomeSlider) {
        if (document.activeElement === incomeInput) {
            incomeSlider.value = unformatCurrency(incomeInput.value);
        } else {
            if(incomeInput.type === 'number') incomeInput.value = incomeSlider.value;
            else incomeInput.value = formatCurrency(incomeSlider.value);
        }
    }
    
    let income = parseFloat(incomeSlider.value) || 0;
    const minDebtPayments = debts.reduce((sum, d) => sum + d.minPay, 0);

    allocationSlider.max = income;
    allocationSlider.min = minDebtPayments; 
    
    let allocation = parseFloat(allocationSlider.value);

    if (allocation > income) {
        allocation = income;
        allocationSlider.value = allocation;
    }
    if (allocation < minDebtPayments) {
        allocation = minDebtPayments;
        allocationSlider.value = allocation;
    }

    // Update Text Displays
    document.getElementById('income-slider-label').innerText = `$${income.toLocaleString()}`;
    document.getElementById('allocation-display').innerText = `$${allocation.toLocaleString()} / mo`;
    document.getElementById('allocation-slider-label').innerText = `$${allocation.toLocaleString()}`;

    // Auto-Routed
    const autoRouted = allocation - minDebtPayments;
    const routedElement = document.getElementById('routed-display');
    routedElement.innerText = `$${autoRouted.toLocaleString()} / mo`;
    routedElement.style.color = autoRouted === 0 ? 'var(--text-muted)' : 'var(--accent-green)';

    // Update Settings UI
    document.getElementById('threshold-display').innerText = `${settings.threshold}%`;
    document.getElementById('inflation-display').innerText = `${settings.inflation}%`;
    document.getElementById('tax-display').innerText = `${settings.taxRate}%`;

    // Execution & Charting
    const { labels, optimalNetWorth } = runSimulation(allocation, debts, investments, settings);
    renderChart(labels, optimalNetWorth, settings.inflation);
    generateAllocationDirective(allocation, debts, investments, settings);

    // Persist
    triggerSave(debts, investments, settings);
}

function triggerRecalculation() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(recalculate, 15);
}

function renderChart(labels, netWorthSeries, inflation) {
    const ctx = document.getElementById('projectionChart').getContext('2d');
    
    const chartLabel = inflation > 0 ? 'Real Net Worth (Inflation Adjusted)' : 'Nominal Net Worth';

    if (chartInstance) {
        chartInstance.data.labels = labels;
        chartInstance.data.datasets[0].data = netWorthSeries;
        chartInstance.data.datasets[0].label = chartLabel;
        chartInstance.update();
        return;
    }

    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: chartLabel,
                data: netWorthSeries,
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.08)',
                borderWidth: 2,
                fill: true,
                tension: 0.2,
                pointRadius: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            plugins: {
                legend: {
                    labels: { color: '#8b949e', font: { size: 12 } }
                }
            },
            scales: {
                x: {
                    grid: { color: '#21262d' },
                    ticks: { color: '#8b949e' }
                },
                y: {
                    grid: { color: '#21262d' },
                    ticks: {
                        color: '#8b949e',
                        callback: value => `$${value.toLocaleString()}`
                    }
                }
            }
        }
    });
}

// --- Listeners ---
document.getElementById('income-slider').addEventListener('input', triggerRecalculation);
document.getElementById('allocation-slider').addEventListener('input', triggerRecalculation);
document.getElementById('threshold-input').addEventListener('input', triggerRecalculation);
document.getElementById('inflation-input').addEventListener('input', triggerRecalculation);
document.getElementById('tax-input').addEventListener('input', triggerRecalculation);

const mainIncomeInput = document.getElementById('income-input');
setupCurrencyFormatting(mainIncomeInput);
mainIncomeInput.addEventListener('input', triggerRecalculation);

document.addEventListener('input', (e) => {
    // We already attached formatters to the dynamic rows, just trigger recalc
    if (e.target.matches('table input')) {
        triggerRecalculation();
    }
});

window.onload = loadData;
