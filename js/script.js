
"use strict";

/**
 * Professional Calculator
 * -----------------------
 * Features:
 * - Addition
 * - Subtraction
 * - Multiplication
 * - Division
 * - Percentage
 * - Decimal numbers
 * - Delete
 * - Clear
 * - Keyboard support
 * - Division-by-zero protection
 */


/* =========================================
   DOM ELEMENTS
========================================= */

const display = document.getElementById("display");
const expression = document.getElementById("expression");

const numberButtons = document.querySelectorAll("[data-number]");
const operationButtons = document.querySelectorAll("[data-operation]");

const clearButton = document.querySelector('[data-action="clear"]');
const deleteButton = document.querySelector('[data-action="delete"]');
const percentageButton = document.querySelector(
    '[data-action="percentage"]'
);
const equalsButton = document.querySelector(
    '[data-action="calculate"]'
);


/* =========================================
   CALCULATOR STATE
========================================= */

const calculator = {
    currentValue: "",
    previousValue: "",
    operator: null,
    shouldResetDisplay: false
};


/* =========================================
   CONSTANTS
========================================= */

const MAX_DIGITS = 15;


/* =========================================
   DISPLAY
========================================= */

function updateDisplay() {

    display.textContent =
        calculator.currentValue || "0";

    expression.textContent =
        calculator.operator
            ? `${calculator.previousValue} ${getOperatorSymbol(calculator.operator)}`
            : "";
}


/**
 * Convert programming operator
 * into calculator display symbol.
 */
function getOperatorSymbol(operator) {

    const symbols = {
        "+": "+",
        "-": "−",
        "*": "×",
        "/": "÷"
    };

    return symbols[operator] || operator;
}


/* =========================================
   NUMBER INPUT
========================================= */

function appendNumber(value) {

    if (calculator.shouldResetDisplay) {
        calculator.currentValue = "";
        calculator.shouldResetDisplay = false;
    }

    if (value === ".") {

        if (calculator.currentValue.includes(".")) {
            return;
        }

        if (calculator.currentValue === "") {
            calculator.currentValue = "0";
        }
    }

    if (
        calculator.currentValue === "0" &&
        value !== "."
    ) {
        calculator.currentValue = value;
    } else {

        if (
            calculator.currentValue.replace(".", "").length >=
            MAX_DIGITS
        ) {
            return;
        }

        calculator.currentValue += value;
    }

    updateDisplay();
}


/* =========================================
   OPERATOR
========================================= */

function chooseOperator(operator) {

    if (calculator.currentValue === "") {
        return;
    }

    if (
        calculator.previousValue !== "" &&
        calculator.operator !== null
    ) {
        calculate();
    }

    calculator.previousValue =
        calculator.currentValue;

    calculator.currentValue = "";

    calculator.operator = operator;

    calculator.shouldResetDisplay = false;

    updateDisplay();
}


/* =========================================
   CALCULATION
========================================= */

function calculate() {

    if (
        calculator.previousValue === "" ||
        calculator.currentValue === "" ||
        calculator.operator === null
    ) {
        return;
    }

    const previous =
        Number(calculator.previousValue);

    const current =
        Number(calculator.currentValue);

    let result;


    switch (calculator.operator) {

        case "+":
            result = previous + current;
            break;

        case "-":
            result = previous - current;
            break;

        case "*":
            result = previous * current;
            break;

        case "/":

            if (current === 0) {
                showError("Cannot divide by zero");
                return;
            }

            result = previous / current;
            break;

        default:
            return;
    }


    result = formatResult(result);


    expression.textContent =
        `${calculator.previousValue} ${getOperatorSymbol(
            calculator.operator
        )} ${calculator.currentValue} =`;


    calculator.currentValue = result;

    calculator.previousValue = "";

    calculator.operator = null;

    calculator.shouldResetDisplay = true;

    display.textContent = result;
}


/* =========================================
   RESULT FORMATTING
========================================= */

function formatResult(value) {

    if (!Number.isFinite(value)) {
        return "Error";
    }

    /**
     * Prevent floating-point problems such as:
     * 0.1 + 0.2 = 0.30000000000000004
     */
    return Number.parseFloat(
        value.toPrecision(12)
    ).toString();
}


/* =========================================
   CLEAR
========================================= */

function clearCalculator() {

    calculator.currentValue = "";
    calculator.previousValue = "";
    calculator.operator = null;
    calculator.shouldResetDisplay = false;

    expression.textContent = "";

    updateDisplay();
}


/* =========================================
   DELETE
========================================= */

function deleteLastCharacter() {

    if (calculator.shouldResetDisplay) {
        return;
    }

    calculator.currentValue =
        calculator.currentValue.slice(0, -1);

    updateDisplay();
}


/* =========================================
   PERCENTAGE
========================================= */

function calculatePercentage() {

    if (calculator.currentValue === "") {
        return;
    }

    const value =
        Number(calculator.currentValue);

    calculator.currentValue =
        formatResult(value / 100);

    updateDisplay();
}


/* =========================================
   ERROR HANDLING
========================================= */

function showError(message) {

    display.textContent = message;

    expression.textContent = "";

    calculator.currentValue = "";
    calculator.previousValue = "";
    calculator.operator = null;
    calculator.shouldResetDisplay = true;
}


/* =========================================
   BUTTON EVENTS
========================================= */

numberButtons.forEach(button => {

    button.addEventListener("click", () => {

        appendNumber(button.dataset.number);

    });

});


operationButtons.forEach(button => {

    button.addEventListener("click", () => {

        chooseOperator(
            button.dataset.operation
        );

    });

});


clearButton.addEventListener(
    "click",
    clearCalculator
);


deleteButton.addEventListener(
    "click",
    deleteLastCharacter
);


percentageButton.addEventListener(
    "click",
    calculatePercentage
);


equalsButton.addEventListener(
    "click",
    calculate
);


/* =========================================
   KEYBOARD SUPPORT
========================================= */

document.addEventListener("keydown", event => {

    const key = event.key;


    // Numbers
    if (/^[0-9]$/.test(key)) {

        appendNumber(key);

        return;
    }


    // Decimal
    if (key === ".") {

        appendNumber(".");

        return;
    }


    // Operators
    if (["+", "-", "*", "/"].includes(key)) {

        event.preventDefault();

        chooseOperator(key);

        return;
    }


    // Calculate
    if (key === "Enter" || key === "=") {

        event.preventDefault();

        calculate();

        return;
    }


    // Delete
    if (key === "Backspace") {

        event.preventDefault();

        deleteLastCharacter();

        return;
    }


    // Clear
    if (
        key === "Escape" ||
        key.toLowerCase() === "c"
    ) {

        clearCalculator();

        return;
    }


    // Percentage
    if (key === "%") {

        calculatePercentage();

    }

});


/* =========================================
   INITIALIZE
========================================= */

clearCalculator();


