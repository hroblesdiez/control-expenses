
import {UI} from './UI.js';
import {Storage} from './Storage.js';

class Charts {
  constructor () {
    this.statsMonth = document.getElementById('statsMonth');
    this.statsYear = document.getElementById('statsYear');
    this.chartStats = document.getElementById('chartStats');
  }

  displayCharts() {
    const ui = new UI();
    const storage = new Storage();
    const incomes = storage.getIncomes(this.statsYear.value)['monthsIncome'][0];

    const incomesArray =[];
    for(let value of Object.values(incomes)) {
        incomesArray.push(value);
    }
    incomesArray.unshift('Incomes');
    console.log(incomesArray)
    const expenses = storage.getExpenses(statsYear.value, statsMonth.value);//get expenses from local storage
    const expensesArray = [];


    if(this.statsMonth.value !== 'All') { //If the user selects any month, but not all
        if(expenses === null) { // if the month selected  has no expenses saved
            return;

        } else if(expenses !== null) { // if the month selected  has expenses saved, I show the stats nad chart
            this.chartStats.style.display = 'block';
            let {yearExpense, monthExpense, amountsExpense:[expensesObject]} = expenses; // destructuring expenses Object
        for(let value of Object.values(expensesObject)) {
            expensesArray.push(value);
        }
        expensesArray.unshift('Expenses'); // include at the beginning of the expenses array this item to show in the chart (c3.js requirement)

    let chart = c3.generate({

        bindto: '#allChart',
        size: {
                height:500,
            },
        data: {
          x: 'x',
          columns: [
            ['x', 'Mortgage/Rental', 'Electricity', 'Heating', 'Feeding', 'Leisure', 'Others'],
            expensesArray,
          ],
          type: 'bar',
        },
        axis: {
            x: {
                type: 'category' // this needed to load string x value
            },
            y: {
              label: {
                text: 'Expenses: ' + this.statsMonth.value + ' ' + this.statsYear.value,
                position: 'outer-center'
              }
            }
        }
        });
  }
} else if(this.statsMonth.value === 'All') {//If the user selects all months
        this.chartStats.style.display = 'block';
        const allMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        const expenses = [];

        allMonths.forEach( item => {
        expenses.push(storage.getExpenses(statsYear.value, item));//get expenses for each month in the year selected from local storage
      });

        const expensesObjectFiltered = expenses.filter(item => item !== null); //If a month has no expenses saved, remove it from the item
        let expensesArray =[];
        expensesObjectFiltered.forEach(item =>  expensesArray.push(ui.expensesPerMonth(item))); // save in the array the expenses amount
        expensesArray.unshift('Expenses');// include at the beginning of the expenses array this item to show in the chart (c3.js requirement)
        let chart = c3.generate({

            bindto: '#allChart',
            size: {
                    height:500,
                },
            data: {
              x: 'x',
              columns: [
                ['x', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                incomesArray,
                expensesArray,
              ],
              type: 'bar',
            },
            axis: {
                x: {
                    type: 'category' // this needed to load string x value
                },
                y: {
                  label: {
                    text: 'Incomes / Expenses ' + this.statsYear.value,
                    position: 'outer-center'
                  }
                }
            }
        });

}
}
}

export {Charts}