class CalcController {

    constructor() {

        this._audio = new Audio('click.mp3')
        this._audioOnOff = false;
        this._lastOperator = '';
        this._lastNumber = '';
        this._operation = [];
        this._locale = 'pt-BR';
        this._displayCalcEl = document.querySelector("#display");
        this._dateEl = document.querySelector("#data");
        this._timeEl = document.querySelector("#hora");
        this._currentDate;
        this.initialize();
        this.initButtonsEvents();
        this.initKeyboard();

    }

    initialize() {

        /* RELOGIO */
        // ---- atualização dos primeitos segundos ----
        this.setDisplayDateTime()
        // ---- atualização dos segundos ----
        setInterval(() => {
            this.setDisplayDateTime();
        }, 1000);

        this.setLastNumberToDisplay();

        document.querySelectorAll('.btn-ac').forEach(btn => {
            btn.addEventListener('dblclick', e => {
                this.toggleAudio();
            })
        })
    }

    toggleAudio() {
        // ---modelos de "ifs"  ---
        /*  ###### MODELO ANTIGO #####
        if (this._audioOnOff) {
                    this._audioOnOff =false
                }else{
                    this._audioOnOff = true
                }*/

        /*  ###### MODELO TERNÁRIO #####
        this._audioOnOff = (this._audioOnOff) ? false : true */

        /*  ###### MODELO BOOLEAN ##### */
        this._audioOnOff = !this._audioOnOff

    }

    playAudio() {
        if (this._audioOnOff) {
            this._audio.currentTime = 0;
            this._audio.play();
        }
    }

    // ---- eventos de teclado ----
    initKeyboard() {
        document.addEventListener('keyup', e => {
            this.playAudio();
            switch (e.key) {

                case 'Escape':
                    this.clearAll();
                    break;

                case 'Backspace':
                    this.clearEntry();
                    break;

                case '+':
                case '-':
                case '/':
                case '*':
                case '%':
                    this.addOperation(e.key);
                    break;
                case 'Enter':
                case '=':
                    this.calc()
                    break;

                case '.':
                case ',':
                    this.addDot();
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
                    this.addOperation(parseInt(e.key));
                    break;


            }
        })
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
        this._lastNumber = '';
        this._lastOperator = '';
        this.setLastNumberToDisplay();
    }

    // ---- função limpar a ultima entrada ----
    clearEntry() {
        this._operation.pop();
        this.setLastNumberToDisplay();
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

    pushOperation(value) {
        this._operation.push(value);
        if (this._operation.length > 3) {


            this.calc();
            console.log(this._operation)
        }
    }

    getResult() {
        try {
            return eval(this._operation.join(""))
        } catch (e) {
            setInterval(()=>{
                this.setError()
            },10
            )
        }

    }

    calc() {
        let last = '';
        this._lastOperator = this.getLastItem()

        if (this._operation.length < 3) {
            let firstItem = this._operation[0]
            this._operation = [firstItem, this._lastOperator, this._lastNumber]
        }

        if (this._operation.length > 3) {

            last = this._operation.pop()
            this._lastNumber = this.getResult()
        }

        else if (this._operation.length == 3) {

            this._lastNumber = this.getLastItem(false)
        }

        let result = this.getResult()

        // configurar a porcentagem "%"
        if (last == "%") {
            result /= 100

            this._operation = [result]
        } else {

            this._operation = [result]
            if (last) this._operation.push(last)
        }

        this.setLastNumberToDisplay();
    }
    getLastItem(isOperator = true) {
        let lastItem;
        for (let i = this._operation.length - 1; i >= 0; i--) {
            if (this.isOperator(this._operation[i]) == isOperator) {
                lastItem = this._operation[i]
                break;
            }

        }
        if (!lastItem) {
            // operador ternário
            lastItem = (isOperator) ? this._lastOperator : this._lastNumber
        }
        return lastItem
    }
    setLastNumberToDisplay() {
        let lastNunber = this.getLastItem(false);

        if (!lastNunber) lastNunber = 0
        this.displayCalc = lastNunber;
    }
    // ---- Realizar operação ----
    addOperation(value) {
        //--- (isNaN) determina se é numero ou string ---
        //---- Tratar formato da operação ---- 
        if (isNaN(this.getLastOperation())) {
            // Se String
            if (this.isOperator(value)) {
                //trocar o ultimo operador
                this.setLastOperation(value);

                // isso é um numero?
            } else {
                // Se Numero
                this.pushOperation(value);
                this.setLastNumberToDisplay();
            }

        } else {
            // ---- adicionar operador ----
            if (this.isOperator(value)) {
                this.pushOperation(value);
            } else {

                let newValue = this.getLastOperation().toString() + value.toString();
                this.setLastOperation(newValue);

                this.setLastNumberToDisplay();
            }
        }

    }
    // ---- função mostrar "erro" na tela ----
    setError() {
        this.displayCalc = "Error";
    }
    addDot() {
        let lastOperation = this.getLastOperation();
        if (typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > -1) return;

        if (this.isOperator(lastOperation) || !lastOperation) {
            this.pushOperation('0.')
        } else {
            this.setLastOperation(lastOperation.toString() + '.')
        }
        this.setLastNumberToDisplay();
    }

    //---- tratamento de botões ----
    execBtn(value) {

        this.playAudio()

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
                this.calc()
                break;

            case 'ponto':
                this.addDot();
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
        if (value.toString().length > 10) {
            this.setError()
            return
        }
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