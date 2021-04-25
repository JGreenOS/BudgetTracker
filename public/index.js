let transactions = [];
let myChart;

fetch('/api/transaction')
.then((response) => response.json())
.then((data) => {
    transactions = data;
    populateTotal();
    populateTable();
    populateChart();
});  //end of fetch

function populateTotal() {
    const total = transactions
    .reduce((total, t) => {
        return total + parseFloat(t.value);
    }, 0)
        .toFixed(2);
        
    const totalEl = document.querySelector('#total');
    totalEl.textContent = total;    
}//end of populate Total function

function populateTable(){
    const tbody = document.querySelector('#tbody');
    tbody.innerHTML = '';

    transactions.forEach((transaction) => {
        const tr = document.createElement('tr');
        tr.innerHTML =
        `<td>${transaction.name}</td>
        <td>${transaction.value}</td>`;

        tbody.appendChild(tr);
    });
} //end of populate total function

function populateChart() {
    const reversed = transactions.slice().reverse();
    let sum = 0;

    const labels = reversed.map((t) => {
        const date = new Date(t.date);
        return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    });

    const data = reversed.map((t) => {
        sum += parseInt(t.value);
        return sum;
    });

    if(myChart) {
        myChart.destroy();
    }

    const ctx = document.getElementById('my-chart').getContext('2d');

    myChart = new Chart (ctx, {
        type: 'line', 
        data: {
            labels,
            datasets: [
                {
                label: 'Total over time', 
                fill: true,
                backgroundCOlor: '#6666ff',
                data,
            },
            ],
        },
    });            
} //end of populate chart function

function sendTransaction(isAdding) {
    const nameEl = document.querySelector('#t-name');
    const amountEl = document.querySelector('#t-amount');
    const errorEl = document.querySelector('form .error');

    if(nameEl.value === '' || amountEl.value === '')
    {
        errorEl.textContent = "Missing Information";
        return;
    }    else {
        errorEl.textContent='';
        }

    const transaction = {
        name: nameEl.value,
        value: amountEl.value,
        date: new Date().toISOString(),
    };
    if (!isAdding) {
        transaction.value *= -1;   
    }

    transactions.unshift(transaction);

    populateChart();
    populateTable();
    populateTotal();

    fetch('/api/transaction', {
        method: 'POST',
        body: JSON.stringify(transaction),
        headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
        },
    })  //end of fetch 
    .then((response) => response.json())
    .then((data) => {
        if(data.errors) {
            errorEl.textContent = 'Missing info';
        } else {
            nameEl.value ='';
            amountEl.value ='';
        }
    })//end of the .then 
 .catch(err => {
    saveRecord(transaction);

    nameEl.value = '';
    amountEl.value = '';
 }); //end of the catch function to store to database
    }//end of the send Tranaction function

document.querySelector('#add-btn').addEventListener('click', function (event) {
    event.preventDefault();
    sendTransaction(true);
}); //endof the event function to send add funds

document.querySelector('#sub-btn').addEventListener('click', function (event) {
    event.preventDefault();
    sendTransaction(false);
}); //end of event function to send subtract funds

    //file does not need an ending }