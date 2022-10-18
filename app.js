//import {Incomes} from './assets/js/Incomes.js';
import {UI} from './assets/js/UI.js';
import {Storage} from './assets/js/Storage.js';
import { Charts } from './assets/js/Charts.JS';

function eventListeners() {
  const saveIncomes = document.getElementById('saveIncomes');
  const saveExpenses = document.getElementById('saveExpenses');
  const incomesMessage = document.getElementById('incomesMessage');
  const expensesMessage = document.getElementById('expensesMessage');
  const showStats = document.getElementById('showStats');
  const statsYear = document.getElementById('statsYear');
  const tableStats = document.getElementById('tableStats');


  //new instance of UI, Storage and Charts class
  const ui = new UI();
  const storage = new Storage();
  const charts = new Charts();

  //Save button in Incomes Form
  saveIncomes.addEventListener("click", (e) => {
    e.preventDefault();
    storage.saveIncomes();

    //Message indicating user that data has been saved
    incomesMessage.classList.remove('d-none');
    setTimeout(() => {
      incomesMessage.classList.add('d-none');
    }, 3000);
  });

   //Save button in Expenses Form
  saveExpenses.addEventListener("click", (e) => {
    e.preventDefault();
    storage.saveExpenses();

    //Message indicating user that data has been saved
    expensesMessage.classList.remove('d-none');
    setTimeout(() => {
      expensesMessage.classList.add('d-none');
    }, 3000);

    //Automatically go to the next month in order the user does not have to select it
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      let newMonthIndex = months.indexOf(ui.expensesMonth.value) + 1;
      ui.expensesMonth.value = months[newMonthIndex];
    });

  //Show statistics button
  showStats.addEventListener("click", () => {
    const yearSelection = statsYear.value;
    const incomes = storage.getIncomes(yearSelection); //get incomes from local storage
    let table = '';
    if(incomes === null) { // If user hasn't save incomes, show user a message to introduce them
      setTimeout( () => {
        tableStats.classList.add('d-none')
      }, 3000);
      table = `<h6 class="bg-danger text-white px-3 py-2">Please introduce incomes for selected year</h6>`;
      tableStats.innerHTML = table;
      tableStats.classList.remove('d-none');
      charts.chartStats.style.display = 'none';

    } else if(incomes) {
      tableStats.classList.remove('d-none');
      charts.chartStats.style.display = 'block';
      ui.displayStats(yearSelection);
      charts.displayCharts();
    }
  });
}

//Initialization
document.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();
  ui.displayIncomes();
  ui.displayExpenses();
  eventListeners();
});

