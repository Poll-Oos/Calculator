class Calculator {
    constructor(previousOperandElement, currentOperandElement) {
        this.previousOperandElement = previousOperandElement;
        this.currentOperandElement = currentOperandElement;
        this.clear();
        this.setupKeyboardSupport();
        this.setupThemeToggle();
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.waitingForSecondOperand = false;
    }

    delete() {
        if (this.currentOperand === '0') return;
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
        if (this.currentOperand === '') this.currentOperand = '0';
    }

    appendNumber(number) {
        if (this.waitingForSecondOperand) {
            this.currentOperand = number.toString();
            this.waitingForSecondOperand = false;
        } else {
            if (number === '.' && this.currentOperand.includes('.')) return;
            if (this.currentOperand === '0' && number !== '.') {
                this.currentOperand = number.toString();
            } else {
                this.currentOperand = this.currentOperand.toString() + number.toString();
            }
        }
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '0';
        this.waitingForSecondOperand = true;
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if (isNaN(prev) || isNaN(current)) return;

        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '÷':
                if (current === 0) {
                    alert("Cannot divide by zero!");
                    return;
                }
                computation = prev / current;
                break;
            case 'xʸ':
                computation = Math.pow(prev, current);
                break;
            default:
                return;
        }

        this.currentOperand = computation;
        this.operation = undefined;
        this.previousOperand = '';
        this.waitingForSecondOperand = true;
    }

    executeFunction(func) {
        const current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;

        let computation;
        switch (func) {
            case 'sin':
                computation = Math.sin(current * Math.PI / 180);
                break;
            case 'cos':
                computation = Math.cos(current * Math.PI / 180);
                break;
            case 'tan':
                computation = Math.tan(current * Math.PI / 180);
                break;
            case '√':
                if (current < 0) {
                    alert("Cannot calculate square root of negative number!");
                    return;
                }
                computation = Math.sqrt(current);
                break;
            case 'x²':
                computation = Math.pow(current, 2);
                break;
            case 'log':
                if (current <= 0) {
                    alert("Cannot calculate logarithm of non-positive number!");
                    return;
                }
                computation = Math.log10(current);
                break;
            case 'ln':
                if (current <= 0) {
                    alert("Cannot calculate natural logarithm of non-positive number!");
                    return;
                }
                computation = Math.log(current);
                break;
            default:
                return;
        }

        this.currentOperand = computation.toString();
        this.operation = undefined;
        this.previousOperand = '';
        this.waitingForSecondOperand = true;
    }

    getDisplayNumber(number) {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;
        
        if (isNaN(integerDigits)) {
            integerDisplay = '0';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', {
                maximumFractionDigits: 0
            });
        }

        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    updateDisplay() {
        this.currentOperandElement.innerText = this.getDisplayNumber(this.currentOperand);
        if (this.operation != null) {
            this.previousOperandElement.innerText =
                `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else {
            this.previousOperandElement.innerText = '';
        }
    }

    setupKeyboardSupport() {
        document.addEventListener('keydown', event => {
            if (event.key >= '0' && event.key <= '9' || event.key === '.') {
                this.appendNumber(event.key);
                this.updateDisplay();
            } else if (event.key === '+' || event.key === '-') {
                this.chooseOperation(event.key);
                this.updateDisplay();
            } else if (event.key === '*') {
                this.chooseOperation('×');
                this.updateDisplay();
            } else if (event.key === '/') {
                this.chooseOperation('÷');
                this.updateDisplay();
            } else if (event.key === '^') {
                this.chooseOperation('xʸ');
                this.updateDisplay();
            } else if (event.key === 'Enter' || event.key === '=') {
                this.compute();
                this.updateDisplay();
            } else if (event.key === 'Backspace') {
                this.delete();
                this.updateDisplay();
            } else if (event.key === 'Escape') {
                this.clear();
                this.updateDisplay();
            }
        });
    }

    setupThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        const body = document.body;
        
        // Check for saved theme preference
        const savedTheme = localStorage.getItem('calculatorTheme');
        if (savedTheme === 'dark') {
            body.classList.add('dark-theme');
            themeToggle.textContent = '☀️';
        }

        themeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-theme');
            const isDark = body.classList.contains('dark-theme');
            themeToggle.textContent = isDark ? '☀️' : '🌙';
            localStorage.setItem('calculatorTheme', isDark ? 'dark' : 'light');
        });
    }
}

// Initialize the calculator
document.addEventListener('DOMContentLoaded', () => {
    const calculator = new Calculator(
        document.querySelector('.previous-operand'),
        document.querySelector('.current-operand')
    );

    // Add event listeners to all number buttons
    document.querySelectorAll('.number').forEach(button => {
        button.addEventListener('click', () => {
            calculator.appendNumber(button.innerText);
            calculator.updateDisplay();
        });
    });

    // Add event listeners to all operator buttons
    document.querySelectorAll('.operator').forEach(button => {
        button.addEventListener('click', () => {
            calculator.chooseOperation(button.innerText);
            calculator.updateDisplay();
        });
    });

    // Add event listeners to all function buttons
    document.querySelectorAll('.function').forEach(button => {
        button.addEventListener('click', () => {
            if (button.innerText === 'xʸ') {
                calculator.chooseOperation(button.innerText);
            } else {
                calculator.executeFunction(button.innerText);
            }
            calculator.updateDisplay();
        });
    });

    // Add event listener to equals button
    document.querySelector('.equals').addEventListener('click', () => {
        calculator.compute();
        calculator.updateDisplay();
    });

    // Add event listener to clear button
    document.querySelector('.clear').addEventListener('click', () => {
        calculator.clear();
        calculator.updateDisplay();
    });

    // Add event listener to delete button
    document.querySelector('.delete').addEventListener('click', () => {
        calculator.delete();
        calculator.updateDisplay();
    });
}); 