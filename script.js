const Modal = {
    open(){
        //abrir o modal
        //colocar o active no modal
        document.querySelector(".modal-overlay")
            .classList
            .add("active")
    },
    close(){
        //fechar o modal    
        //tirar o active do modal
        document.querySelector(".modal-overlay")    
            .classList
            .remove("active")
    }
}

const Storage = {
    get() {
        return JSON.parse(localStorage.getItem("dev.finances:transactions")) || []
    },

    set(transactions) {
        localStorage.setItem("dev.finances:transactions", JSON.stringify(transactions))
    }
}

const Transaction = {
    all: Storage.get(),
    
    add(transaction){
        Transaction.all.push(transaction)
        App.reload()
    },
    remove(index){
        Transaction.all.splice(index, 1)
        App.reload()
    },

    incomes() {
        let sumIncomes = 0
        Transaction.all.forEach(function(transaction){
            if(transaction.amount > 0){
                sumIncomes += transaction.amount;
            }
        })
        return sumIncomes
    },

    expenses() {
        let sumExpenses = 0
        Transaction.all.forEach(function(transaction){
            if(transaction.amount < 0){
                sumExpenses += transaction.amount;
            }
        })
        return sumExpenses  
    },

    total() {
        let sumTotal = 0
        Transaction.all.forEach(function(transaction){
                sumTotal += transaction.amount;
        })
        if (sumTotal > 0){
            document.querySelector(".card.total").classList.add("income")
        }else{
            document.querySelector(".card.total").classList.add("expense")
        }
        
        return sumTotal
    }
}

const DOM = {
    transactionContainer: document.querySelector('#data-table tbody'),

    addTransaction(transaction, index) {
        const tr = document.createElement("tr")
        tr.innerHTML = DOM.innerHTMLTransaction(transaction,index)
        tr.dataset.index = index

        DOM.transactionContainer.appendChild(tr)
    },

    innerHTMLTransaction(transaction, index){
        const CSSclass = transaction.amount > 0 ? "income" : "expenses"
        const amount = Utils.formatCurrency(transaction.amount)

        const html = `
            <td class="description">${transaction.description}</td>
            <td class="${CSSclass}">${amount}</td>
            <td class="date">${transaction.date}</td>
            <td><img src="assets/minus.svg" alt="Imagem para remover Transações" onclick = "Transaction.remove(${index})"></td>
        `
        return html
    },

    updateBalance(){
        // let incomeDisplay = document.querySelector("#incomeDisplay")
        // incomeDisplay.innerHTML = ("Testando")
        document.querySelector("#incomeDisplay")
            .innerHTML = Utils.formatCurrency(Transaction.incomes())
        document.querySelector("#expenseDisplay")
            .innerHTML = Utils.formatCurrency(Transaction.expenses())
        document.querySelector("#totalDisplay")
            .innerHTML = Utils.formatCurrency(Transaction.total())
    },

    clearTransactions () {
        DOM.transactionContainer.innerHTML = ""
    }
}

const Utils = {
    formatCurrency(value){
        const signal = Number(value) < 0 ? "-" : ""
        value = String(value).replace(/\D/g, "")
        value = Number(value) / 100
        value = Number(value).toLocaleString("pt-BR",{
            style: "currency",
            currency: "BRL"
        })
        return signal + value
    },

    formatAmount(value){
        value = value * 100
        return Math.round(value)
    },

    formatDate(date){
        const splittedDate = date.split("-")
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    }
}

const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),
    getValues(){
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },

    validateFields(){
        const { description, amount, date } = Form.getValues()
        if (description.trim() === "" || amount.trim() === "" || date.trim() === ""){
            throw new Error("[INCOMPLETO] Por favor preencha todos os campos!")
        }  
    },

    formatFields(){
        let {description, amount, date} = Form.getValues()
        amount = Utils.formatAmount(amount) 
        date = Utils.formatDate(date)

        return {
            description, //description: description,
            amount, //amount: amount,
            date //date: date
        }
    },

    clearFields(){
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""
    },
   
    submit(event) {
        event.preventDefault()

        try {
            Form.validateFields()
            //ver se os campos estao preenchidos
            const transaction = Form.formatFields()
            //formatar os dados
            Transaction.add(transaction)
            //salvar
            Form.clearFields()
            //apagar os dados no modal p/ utilizar novamente
            Modal.close()
            //fechar o modal
            //atualizar, ja esta no add transaction
        } catch (error) {
           alert(error.message) 
        }
    }  
}

const App = {
    init() {
        // Transaction.all.forEach(function(transaction, index){
        //     DOM.addTransaction(transaction, index)
        // })
        //Outra forma de escrever, quando os parametros são iguais
        Transaction.all.forEach(DOM.addTransaction)
        DOM.updateBalance()

        Storage.set(Transaction.all)
    },
    reload (){
        DOM.clearTransactions()
        App.init()
    }
} 

App.init()












