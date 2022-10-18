import {Storage} from './Storage.js'

class UI {
  constructor() {
    this.incomesForm = document.getElementById('incomesForm');
    this.incomesMonth = document.getElementById('incomesMonth');
    this.incomesYear = document.getElementById('incomesYear');
    this.saveIncomes = document.getElementById('saveIncomes');
    this.saveExpenses = document.getElementById('saveExpenses');
    this.inputAmount = document.getElementById('inputAmount');
    this.inputsIncomesAmount = document.getElementById('inputsIncomesAmount');
    this.expensesForm = document.getElementById('expensesForm');
    this.expensesMonth = document.getElementById('expensesMonth');
    this.expensesYear = document.getElementById('expensesYear');
    this.tableStats = document.getElementById('tableStats');
    this.inputsExpensesAmount = document.getElementById('inputsExpensesAmount');
    this.inputsExpenses = this.inputsExpensesAmount.querySelectorAll('input');
    this.statsMonth = document.getElementById('statsMonth');
    this.statsYear = document.getElementById('statsYear');
    this.showMessage = document.getElementById('showMessage');
    this.incomesExpenses =  this.inputsIncomesAmount.querySelectorAll('input');
    this.chartStats = document.getElementById('chartStats');
  }

  //Method to show the incomes in the UI and retrieve all data already saved in case the user wants to edit them
  displayIncomes() {
        this.getIncomesAlreadySaved();
        this.incomesYear.addEventListener("change", () => {
          this.clearIncomesInputs(this.incomesYear.value);
          this.getIncomesAlreadySaved();
      });
      }

   //Method to show the expenses in the UI and retrieve all data already saved in case the user wants to edit them
  displayExpenses() {
    this.getExpensesAlreadySaved();

    //when the user select another month, delete all the actual inputs and focus to the first input
    this.expensesMonth.addEventListener("change", () => {
          this.clearExpensesInputs(this.expensesYear.value);
          this.getExpensesAlreadySaved();
    });

    //when the user select another month, delete all the actual inputs and focus to the first input
      this.expensesYear.addEventListener("change", () => {
          this.clearExpensesInputs(this.expensesYear.value);
          this.getExpensesAlreadySaved();
    });
  }


  clearIncomesInputs(yearSelection) {
    const storage = new Storage();
    this.incomesYear.value = yearSelection;
    if(!storage.getIncomes(yearSelection)) {
      this.incomesExpenses.forEach(input => {
        input.value = '';
      this.incomesYear.value = yearSelection;
      });
    }
    this.incomesExpenses[0].focus();
  }

  clearExpensesInputs(yearSelection) {
    const storage = new Storage();
    this.expensesYear.value = yearSelection;
    if(!storage.getExpenses(yearSelection)) {
      this.inputsExpenses.forEach(input => {
        input.value = '';
      this.expensesYear.value = yearSelection;
      });
    }
    this.inputsExpenses[0].focus();
  }

  getIncomesAlreadySaved() {
      const storage = new Storage();
      let incomes = storage.getIncomes(this.incomesYear.value) ? storage.getIncomes(this.incomesYear.value) : '';
      if(incomes) {
        let{yearIncome, monthsIncome: [itemIncome]} = incomes
        //this.removeNull(itemIncome);

        let incomeValues = Object.values(itemIncome);
        //console.log(incomeValues)
        this.incomesExpenses[0].focus();
        for(let i = 0; i < this.incomesExpenses.length; i++ ) {
            incomeValues[i] === null ? incomeValues[i] = '' : incomeValues[i];
            this.incomesExpenses[i].value = incomeValues[i];
        }
    }
  }

  getExpensesAlreadySaved() {
    const storage = new Storage();
    let expenses = storage.getExpenses(this.expensesYear.value, this.expensesMonth.value) ? storage.getExpenses(this.expensesYear.value, this.expensesMonth.value) : '';
    if(expenses) {
      let{yearExpense, monthExpense, amountsExpense: [itemExpense]} = expenses;
      let expenseValues = Object.values(itemExpense);
      //console.log(expenseValues);
      this.inputsExpenses[0].focus();
        for(let i = 0; i < this.inputsExpenses.length; i++ ) {
            expenseValues[i] === null ? expenseValues[i] = '' : expenseValues[i];
            this.inputsExpenses[i].value = expenseValues[i];
        }
    }
  }

  //Method to remove all the items with null values
  removeNull(obj) {
    Object.keys(obj).forEach(key => obj[key] === null ? delete obj[key] : {});
  }

  totalIncomes(obj) {
    return Object.values(obj).reduce((a, b) => a + b, 0);
  }

  expensesPerMonth(obj) {
      let{yearExpense, monthExpense, amountsExpense:[item]} = obj;
      return Object.values(item).reduce((acc, sum) => acc + sum, 0);
  }

  totalAnualExpenses(arr) {
    return arr.reduce((a,b) => a + b, 0);
  }

  //Method to display the table with the statistics and charts according to user selection
  displayStats(yearSelection) {
    const storage = new Storage();
    const incomes = storage.getIncomes(yearSelection); //get incomes from local storage
    let table = '';
    //console.log(incomes);

    let{yearIncome, monthsIncome: [itemIncome]} = incomes; //destructuring incomes object

      if(this.statsMonth.value !== 'All') {

        this.removeNull(itemIncome);
        const totalAnualIncomes = this.totalIncomes(itemIncome);

        const expenses = storage.getExpenses(statsYear.value, statsMonth.value);//get expenses from local storage

        if(expenses === null) { // if the user has selected a month without expenses saved , show a message to introduce them
          setTimeout( () => {
            tableStats.classList.add('d-none')
          }, 3000);
          table = `<h6 class="bg-danger px-3 py-2">Please introduce incomes and expenses for selected year</h6>`;
          tableStats.innerHTML = table;
          tableStats.classList.remove('d-none');
          this.chartStats.style.display = 'none';

        } else if (expenses) { // if the user has selected a month with expenses saved
          let{yearExpense, monthExpense, amountsExpense: [itemExpense]} = expenses; //destructuring expenses object

        let totalExpensesPerMonth = 0;
        for(let value of Object.values(itemExpense)) {
          totalExpensesPerMonth+= value;
        }

        table = `<table>
                    <tr>
                      <th>${yearIncome}</th>
                      <th>Incomes</th>
                      <th>Expenses</th>
                      <th>Results</th>
                    </tr>
                    <tr>
                      <td>${statsMonth.value}</td>
                      <td>${itemIncome[statsMonth.value]}</td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>Mortage/Rental</td>
                      <td></td>
                      <td>${itemExpense['mortgage']}</td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>Electricity</td>
                      <td></td>
                      <td>${itemExpense['electricity']}</td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>Heating</td>
                      <td></td>
                      <td>${itemExpense['heating']}</td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>Feeding</td>
                      <td></td>
                      <td>${itemExpense['feeding']}</td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>Leisure</td>
                      <td></td>
                      <td>${itemExpense['leisure']}</td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>Others</td>
                      <td></td>
                      <td>${itemExpense['others']}</td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>TOTAL</td>
                      <td></td>
                      <td id="totalExpensesMonthly">${totalExpensesPerMonth}</td>
                      <td>${itemIncome[statsMonth.value] - totalExpensesPerMonth}</td>
                    </tr>`;

        this.tableStats.innerHTML = table;
        }


    } else if(this.statsMonth.value === 'All' ) {

      const totalAnualIncomes = this.totalIncomes(itemIncome);

      const allMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

      const expenses = [];

      allMonths.forEach( item => {
        expenses.push(storage.getExpenses(statsYear.value, item));//get expenses for each month in the year selected from local storage
      })

      let expensesArray =[];
      //console.log(expenses)
      const expensesFiltered = expenses.filter(expense => expense !== null);

      expensesFiltered.forEach(item =>  expensesArray.push(this.expensesPerMonth(item)));

      let totalAnualExpenses = this.totalAnualExpenses(expensesArray);

                table = `<table>
                            <tr>
                              <th>${yearIncome}</th>
                              <th>Incomes</th>
                              <th>Expenses</th>
                              <th>Results</th>
                            </tr>
                            <tr>
                              <td>January</td>
                              <td>${itemIncome['January']}</td>
                              <td>${expensesArray[0] ? expensesArray[0] : ''}</td>
                              <td>${itemIncome['January'] - expensesArray[0]}</td>
                            </tr>
                            <tr>
                              <td>February</td>
                              <td>${itemIncome['February']}</td>
                              <td>${expensesArray[1] ? expensesArray[1] : ''}</td>
                              <td>${itemIncome['February'] - expensesArray[1]}</td>
                            </tr>
                            <tr>
                              <td>March</td>
                              <td>${itemIncome['March']}</td>
                              <td>${expensesArray[2] ? expensesArray[2] : ''}</td>
                              <td>${itemIncome['March'] - expensesArray[2]}</td>
                            </tr>
                            <tr>
                              <td>April</td>
                              <td>${itemIncome['April']}</td>
                              <td>${expensesArray[3] ? expensesArray[3] : ''}</td>
                              <td>${itemIncome['April'] - expensesArray[3]}</td>
                            </tr>
                            <tr>
                              <td>May</td>
                              <td>${itemIncome['May']}</td>
                              <td>${expensesArray[4] ? expensesArray[4] : ''}</td>
                              <td>${itemIncome['May'] - expensesArray[4]}</td>
                            </tr>
                            <tr>
                              <td>June</td>
                              <td>${itemIncome['June']}</td>
                              <td>${expensesArray[5] ? expensesArray[5] : ''}</td>
                              <td>${itemIncome['June'] - expensesArray[5]}</td>
                            </tr>
                            <tr>
                              <td>July</td>
                              <td>${itemIncome['July']}</td>
                              <td>${expensesArray[6] ? expensesArray[6] : ''}</td>
                              <td>${itemIncome['July'] - expensesArray[6]}</td>
                            </tr>
                            <tr>
                              <td>August</td>
                              <td>${itemIncome['August']}</td>
                              <td>${expensesArray[7] ? expensesArray[7] : ''}</td>
                              <td>${itemIncome['August'] - expensesArray[7]}</td>
                            </tr>
                            <tr>
                              <td>September</td>
                              <td>${itemIncome['September']}</td>
                              <td>${expensesArray[8] ? expensesArray[8] : ''}</td>
                              <td>${itemIncome['September'] - expensesArray[8]}</td>
                            </tr>
                            <tr>
                              <td>October</td>
                              <td>${itemIncome['October']}</td>
                              <td>${expensesArray[9] ? expensesArray[9] : ''}</td>
                              <td>${itemIncome['October'] - expensesArray[9]}</td>
                            </tr>
                            <tr>
                              <td>November</td>
                              <td>${itemIncome['November']}</td>
                              <td>${expensesArray[10] ? expensesArray[10] : ''}</td>
                              <td>${itemIncome['November'] - expensesArray[10]}</td>
                            </tr>
                            <tr>
                              <td>December</td>
                              <td>${itemIncome['December']}</td>
                              <td>${expensesArray[11] ? expensesArray[11] : ''}</td>
                              <td>${itemIncome['December'] - expensesArray[11]}</td>
                            </tr>
                            <tr>
                              <td>TOTAL</td>
                              <td>${totalAnualIncomes}</td>
                              <td>${totalAnualExpenses}</td>
                              <td>${totalAnualIncomes - totalAnualExpenses}</td>
                            </tr>
                      </table>`;

          this.tableStats.innerHTML = table;
      }
    }
}

export {UI}