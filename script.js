document.addEventListener('DOMContentLoaded', function() { // These are the events that will be triggered when the page has finished loading
    const budgetForm = document.getElementById('budget-form');
    const expenseForm = document.getElementById('expense-form');
    const addExpenseBtn = document.getElementById('add-expense-btn');
    const doneBtn = document.getElementById('done-btn');
    const monthlyBudgetInfo = document.getElementById('monthly-budget-info');
    const totalExpenses = document.getElementById('total-expenses');
    const remainingBudget = document.getElementById('remaining-budget');
    const chartCanvas = document.getElementById('chart');
    const expenseList = document.getElementById('expense-list');
    const budgetInput = document.getElementById('monthly-budget');
   
    let monthlyBudget = 0;
    let expenses = [];


    budgetForm.addEventListener('submit', function(event) { // This Function Allows a budget to be added
        event.preventDefault();
        monthlyBudget = parseFloat(budgetInput.value); // Gets the budget from input field
        monthlyBudgetInfo.textContent = '$' + monthlyBudget.toFixed(2);
        document.getElementById('expense-form').style.display = 'block';
        budgetInput.disabled = true; // Disables the budget input field
        doneBtn.style.display = 'block';
        updateChart();
    });


    addExpenseBtn.addEventListener('click', function(event) { // This Function Allows Expenses to be added
        event.preventDefault();
        const expenseName = document.getElementById('expense-name').value;
        const expenseAmount = parseFloat(document.getElementById('expense-amount').value);
        expenses.push({ name: expenseName, amount: expenseAmount });
        updateExpenses();
        updateChart();
        updateBudgetInfo();
        document.getElementById('expense-name').value = '';
        document.getElementById('expense-amount').value = '';
    });


    doneBtn.addEventListener('click', function(event) { // This Function Allows The done button to "close" the form
        event.preventDefault();
        displayExpenseList();
        doneBtn.style.display = 'none'; // Hides the Done button
    });


    function updateExpenses() {
        let total = 0;
        expenses.forEach(function(expense) {
            total += expense.amount;
        });
        totalExpenses.textContent = '$' + total.toFixed(2);
    }


    function updateBudgetInfo() { // This Function Allows for the addedExpenses to Update  the Budget Information
        let total = 0;
        expenses.forEach(function(expense) {
            total += expense.amount;
        });
        remainingBudget.textContent = '$' + (monthlyBudget - total).toFixed(2);
    }


    function updateChart() { // This Function Allows the Expenses to be added to Chart
        const ctx = chartCanvas.getContext('2d');
        const total = expenses.reduce((acc, expense) => acc + expense.amount, 0);
       
        if (window.myChart instanceof Chart) {
            window.myChart.destroy();
        }
       
        if (total > monthlyBudget) {
            ctx.clearRect(0, 0, chartCanvas.width, chartCanvas.height);
            ctx.fillStyle = 'red';
            ctx.font = 'bold 36px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('OVERBUDGET', chartCanvas.width / 2, chartCanvas.height / 2); // OVERBUDGET ALERT
        } else {
            const labels = expenses.map(expense => expense.name);
            const amounts = expenses.map(expense => expense.amount);
            window.myChart = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Expenses',
                        data: amounts,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.5)',
                            'rgba(54, 162, 235, 0.5)',
                            'rgba(255, 206, 86, 0.5)',
                            'rgba(75, 192, 192, 0.5)',
                            'rgba(153, 102, 255, 0.5)',
                            'rgba(255, 159, 64, 0.5)'
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
        }
    }


    function displayExpenseList() { // This Function Displays the expense list container
        const expenseListContainer = document.getElementById('expense-list-container');
        expenseListContainer.style.display = 'block';
       
        const expenseList = document.getElementById('expense-list');
        expenseList.innerHTML = ''; // This clears previous content
       
       
        const headerRow = document.createElement('div');// Headers
        headerRow.classList.add('excel-row', 'header');


        expenseList.appendChild(headerRow);
       
       
        expenses.forEach(expense => { // Expense Items to List
            const row = document.createElement('div');
            row.classList.add('excel-row');
            row.innerHTML = `
                <div class="cell">${expense.name}</div>
                <div class="cell">$${expense.amount.toFixed(2)}</div>
            `;
            expenseList.appendChild(row);
        });
    }
});
