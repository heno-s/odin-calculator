const display = document.querySelector(".display");
const buttons = document.querySelectorAll(".buttons button");

let leftOperand = (displayValue = "0");
let operator = "";
let rightOperand = "";

buttons.forEach((button) => button.addEventListener("click", handleInput));
window.addEventListener("keydown", handleKeyInput);

function add(n1, n2) {
    return n1 + n2;
}

function subtract(n1, n2) {
    return n1 - n2;
}

function multiply(n1, n2) {
    return n1 * n2;
}

function divide(n1, n2) {
    if (n2 === 0) {
        throw new Error("Cannot divide by 0");
    }
    return n1 / n2;
}

function operate(operator, num1, num2) {
    num1 = +num1;
    num2 = +num2;
    let result;
    switch (operator) {
        case "+":
            result = add(num1, num2);
            break;
        case "-":
            result = subtract(num1, num2);
            break;
        case "*":
            result = multiply(num1, num2);
            break;
        case "/":
            result = divide(num1, num2);
            break;
        default:
            result = "UNKNOWN OPERATOR";
            break;
    }

    return result;
}

function populateDisplay(input) {
    display.textContent = input;
}

function handleKeyInput(evt) {
    const button = document.querySelector(`[data-key="${evt.key}"]`);
    if (!button) return;
    button.click();
}

function handleInput(evt) {
    try {
        if (!(evt instanceof Event)) return;
        if (this.classList.contains("number")) {
            handleNumber(this.dataset.key);
        } else if (this.classList.contains("operator")) {
            handleOperator(this.dataset.key);
        } else if (this.classList.contains("special")) {
            handleSpecial(this.dataset.key);
        }
        populateDisplay(displayValue);
    } catch (e) {
        clear();
        populateDisplay(e.message);
    }
}

function handleNumber(num) {
    if (num !== "." && (displayValue === "0" || displayValue === "-0" || (operator && !rightOperand))) {
        displayValue = "";
    }

    if (num === "." && !canAddDot(displayValue)) return;

    displayValue += num;
    if (!operator) {
        leftOperand = displayValue;
    } else {
        rightOperand = displayValue;
    }
}

function handleOperator(op) {
    if (leftOperand && operator && rightOperand) {
        leftOperand = displayValue = operate(operator, leftOperand, rightOperand) + "";
        rightOperand = "";
    }
    operator = op === "=" ? "" : op;
}

function handleSpecial(key) {
    key = key.toLowerCase();
    if (key === "delete") {
        clear();
    } else if (key === "backspace") {
        displayValue = displayValue.slice(0, -1);
        if (displayValue === "-" || displayValue === "") {
            displayValue = "0";
        }
        syncDisplayValueWithOperands();
    } else if (key === "!") {
        displayValue = displayValue[0] === "-" ? displayValue.slice(1) : "-" + displayValue;
        syncDisplayValueWithOperands();
    }
}

function clear() {
    leftOperand = displayValue = "0";
    operator = "";
    rightOperand = "";
}

function syncDisplayValueWithOperands() {
    if (rightOperand) {
        rightOperand = displayValue;
    } else {
        leftOperand = displayValue;
    }
}

function canAddDot(input) {
    const hasDot = input.includes(".");
    return !hasDot;
}

populateDisplay(displayValue);
