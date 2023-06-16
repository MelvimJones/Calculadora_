class CalcController {

    constructor() {

        this._operation = [];
        this._locale = 'pt-BR';
        this._displayCalcEl = document.querySelector("#display");
        this._dateEl = document.querySelector("#data");
        this._timeEl = document.querySelector("#hora");
        this._currentDate;
        this.initialize();
        this.initButtonsEvents();

    }

    initialize() {

        /* RELOGIO */
        // ---- atualização dos primeitos segundos ----
        this.setDisplayDateTime()
        // ---- atualização dos segundos ----
        setInterval(() => {
            this.setDisplayDateTime();
        }, 1000);

    }

    // ---- criando um evento para cada botão ---
    addEventListenerAll(element, events, fn) {
        events.split(' ').forEach(event => {

            element.addEventListener(event, fn, false);

        })
    }

    /*----------------------------------------------
               Configuração dos Botões
    ----------------------------------------------*/

    //---- função limpar tudo ----
    clearAll() {
        this._operation = [];
    }

    // ---- função limpar a ultima entrada ----
    clearEntry() {
        this._operation.pop();
    }

    //---- buscar o ultimo digito ----
    getLastOperation() {
        return this._operation[this._operation.length - 1];
    }

    //---- subistituir o ultimo valor da array (nao ficar duplicado)----
    setLastOperation(value) {
        this._operation[this._operation.length - 1] = value;
    }

    //---- receber Operador ----
    isOperator(value) {
        return (['+', '-', '*', '%', '/'].indexOf(value) > -1);
    }

    // ---- Realizar operação ----
    addOperation(value) {
        //--- (isNaN) determina se é numero ou string ---
        console.log('A', value, isNaN(this.getLastOperation()));
        //---- Tratar formato da operação ---- 
        if (isNaN(this.getLastOperation())) {
            // Se String
            if (this.isOperator(value)) {
                //trocar o ultimo operador
                this.setLastOperation(value);

                // isso é um numero?
            } else if (isNaN(value)) {
                //outra coisa
                console.log(value);

            } else {
                // Se Numero
                this._operation.push(value);

            }

        } else {

            if (this.isOperator(value)) {
                this._operation.push(value);
            } else {
                let newValue = this.getLastOperation().toString() + value.toString();
                this.setLastOperation(parseInt(newValue));
            }

        }
        console.log(this._operation);

    }
    // ---- função mostrar "erro" na tela ----
    setError() {
        this.displayCalc = "Error";
    }

    //---- tratamento de botões ----
    execBtn(value) {

        switch (value) {

            case 'ac':
                this.clearAll();
                break;

            case 'ce':
                this.clearEntry();
                break;

            case 'soma':
                this.addOperation('+');
                break;

            case 'subtracao':
                this.addOperation('-');
                break;

            case 'divisao':
                this.addOperation('/');
                break;

            case 'multiplicacao':
                this.addOperation('*');
                break;

            case 'porcento':
                this.addOperation('%');
                break;

            case 'igual':

                break;

            case 'ponto':
                this.addOperation('.');
                break;

            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(parseInt(value));
                break;

            default:
                this.setError();
                break;

        }

    }

    initButtonsEvents() {
        // ---- buscar botoes com "class buttons e parts" iniciados com g ----
        let buttons = document.querySelectorAll("#buttons > g, #parts > g");

        // ---- percorrer a array e aplicar o evento em cada botão ---
        buttons.forEach((btn, index) => {

            this.addEventListenerAll(btn, "click drag", e => {
                //---- Extrair o texto do botão ----
                let textBtn = btn.className.baseVal.replace("btn-", "");
                this.execBtn(textBtn);
            })

            // ---- modificar cursor -----
            this.addEventListenerAll(btn, "mouseover mouseup mousedown", e => {

                btn.style.cursor = "pointer";

            })

        })

    }
    //---- Dados da Data e Hora ----
    setDisplayDateTime() {

        this.displayDate = this.currentDate.toLocaleDateString(this._locale, {
            /* day: "2-digit",
            month: "long",
            year: "numeric" */
        });
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale);

    }
    // ---- relogio ----
    get displayTime() {
        return this._timeEl.innerHTML;
    }

    set displayTime(value) {
        return this._timeEl.innerHTML = value;
    }

    // ---- Data ----
    get displayDate() {
        return this._dateEl.innerHTML;
    }
    set displayDate(value) {
        return this._dateEl.innerHTML = value;
    }

    // ---- Display ----
    get displayCalc() {
        return this._displayCalcEl.innerHTML;
    }
    set displayCalc(value) {
        this._displayCalcEl.innerHTML = value;
    }

    // ---- CONSTRUTOR DATA ----
    get currentDate() {
        return new Date();
    }
    set currentDate(value) {
        this._currentDate = value;
    }

}