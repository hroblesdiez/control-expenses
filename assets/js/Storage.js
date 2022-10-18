
class Storage {
    constructor() {
      this.incomesYear = document.getElementById('incomesYear');
      this.expensesMonth = document.getElementById('expensesMonth');
      this.expensesYear = document.getElementById('expensesYear');
      this.incomesMessage = document.getElementById('incomesMessage');
      this.inputsIncomesAmount = document.getElementById('inputsIncomesAmount');
    }

    saveIncomes(incomesStore) {
       incomesStore = {
        yearIncome: this.incomesYear.value,
        monthsIncome: []
      };

      const incomesMonths = this.inputsIncomesAmount.querySelectorAll('input');
      let obj = {};
      for(let i=0; i < incomesMonths.length; i++) {
          obj[incomesMonths[i].id] = parseInt(incomesMonths[i].value);
        }
      incomesStore.monthsIncome.push(obj);
      localStorage.setItem("incomes"+this.incomesYear.value, JSON.stringify(incomesStore));

    }

    saveExpenses(expensesStore) {
      expensesStore = {
       monthExpense: this.expensesMonth.value,
       yearExpense: this.expensesYear.value,
       amountsExpense: []
     };

     const  inputsExpensesAmount = document.getElementById('inputsExpensesAmount');
     const expensesAmounts = inputsExpensesAmount.querySelectorAll('input');
     let obj = {};
     for(let i=0; i < expensesAmounts.length; i++) {
       obj[expensesAmounts[i].id] = parseInt(expensesAmounts[i].value);
       }
     expensesStore.amountsExpense.push(obj);
     localStorage.setItem("expenses"+this.expensesYear.value+this.expensesMonth.value, JSON.stringify(expensesStore));
   }

    getIncomes(year) {
      return JSON.parse(localStorage.getItem("incomes"+year));
    }

    getExpenses(year, month) {
      return JSON.parse(localStorage.getItem("expenses"+year+month));
    }
}

export {Storage}