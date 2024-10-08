const errorDisplay = document.querySelector(".error-display");
const topDisplay = document.querySelector(".top-display");
const bottomDisplay = document.querySelector(".bottom-display");
const enterButton = document.querySelector(".enter");
const clearAllButton = document.querySelector(".clear-all");
const operatorButtons = document.querySelectorAll(".operator");
const operandButtons = document.querySelectorAll(".operand");
const historyDisplay = document.querySelector(".history-display");


function calculation() {
  this.firstNum = "";
  this.operator = "";
  this.secondNum = "";
  this.result = "";
}

function newCalc() {
  currentCalc = new calculation;
}

function findResult() {
  let result = 0;
  let firstOperand = new Big(currentCalc["firstNum"]);
  let secondOperand = new Big(currentCalc["secondNum"]);
  switch (currentCalc["operator"]) {
    case "+":
      result = firstOperand.plus(secondOperand);
      break;
    case "-":
      result = firstOperand.minus(secondOperand);
      break;
    case "*":
      result = firstOperand.times(secondOperand);
      break;
    case "/":
      result = firstOperand.div(secondOperand);
      break;
  }
  return result.toString();    // Converts from Big object to string
}

function checkLength(rawResult) {
  let adjustedResult = ""
  let resultNum = Number(rawResult);
  let maxLength = rawResult.includes("-") ? 16 : 15;
  if (rawResult.length > maxLength) {
    switch (true) {
      case rawResult.includes("e"):
        adjustedResult = "ERROR";
        return adjustedResult;
      case rawResult.includes("."):
        let splitNum = rawResult.split(".");
        let wholeNums = splitNum[0].length;
        let roundTo = maxLength - (wholeNums + 1);    // +1 is to account for decimal
        if (roundTo >= 3) {    // If rounding would take number to less than three decimal places then fall through to "ERROR"
          adjustedResult = resultNum.toFixed(roundTo);    // toFixed also coverts to string
          return Number(adjustedResult).toString();    // Deals with edge cases where toFixed improper rounding produces a result with trailing zeros
        }
      default:
        adjustedResult = "ERROR";
        return adjustedResult;
    }
  }
  adjustedResult = rawResult;
  return adjustedResult;
}

function saveHistory() {
  if (calcHistory.length === 10) {
    calcHistory.shift();
  }
  let oldCalc = Object.assign({}, currentCalc);
  calcHistory.push(oldCalc);
}

function operate() {
  if ((currentCalc["operator"] === "/") && (currentCalc["secondNum"] === "0")) {
    displayError("/0");
    currentCalc["result"] = "ERROR";
    return;
  }
  let rawResult = findResult();
  let adjustedResult = checkLength(rawResult);
  if (adjustedResult === "ERROR") {
    displayError("result-length");
    currentCalc["result"] = "ERROR";
  } else {
    currentCalc["result"] = adjustedResult;
    saveHistory();
    displayHistory();
  }
}

function addCommas(displayContent) {
  let adjustedResult = "";
  if (displayContent.includes(".")) {
    let splitNum = displayContent.split(".");
    let wholeNums = splitNum[0];
    let commasAdded = wholeNums.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    adjustedResult = commasAdded + "." + splitNum[1];
  } else {
    adjustedResult = displayContent.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  return adjustedResult;
}

function processOperator(calcOperator) {
  let padSymbols = {
    "/": "÷",
    "*": "×",
    "-": "-",
    "+": "+"
  }
  let displayOperator = padSymbols[calcOperator];
  return displayOperator;
}

// Formats and displays current state of the calculation
function updateDisplay() {
  let firstOperand = false;
  let topLine = "";
  let bottomLine = "";
  let displayOperator = processOperator(currentCalc["operator"]);
  let spacedOperator = " " + displayOperator + " ";
  let equalSign = " = ";
  if (currentCalc["result"] !== "") {
    topLine = currentCalc["firstNum"] + spacedOperator + currentCalc["secondNum"] + equalSign;
    bottomLine = currentCalc["result"];
  } else if (currentCalc["secondNum"] !== "") {
    topLine = currentCalc["firstNum"] + spacedOperator;
    bottomLine = currentCalc["secondNum"];
  } else if (currentCalc["operator"] !== "") {
    topLine = currentCalc["firstNum"];
    bottomLine = displayOperator;
  } else {
    bottomLine = currentCalc["firstNum"];
    firstOperand = true;
  }
  if ((bottomLine === "") && (firstOperand)) {
    bottomLine = "0";    // Sets first operand display of "" to display "0" instead
  }
  bottomLine = addCommas(bottomLine);
  topDisplay.textContent = topLine;
  bottomDisplay.textContent = bottomLine;
}

function displayError(type) {
  switch (type) {
    case "operand-length":
      errorDisplay.textContent = "operand-length error";
      break;
    case "/0":
      errorDisplay.textContent = "/0 error";
      break;
    case "result-length":
      errorDisplay.textContent = "result-length error";
      break;
  }
}

function removeError(type) {
  switch (true) {
    case type === "all":
      errorDisplay.textContent = "";
      break;
    case type === "operand-length":
      errorDisplay.textContent = "";
      break;
  }
}

function clearHistory() {
  let historyCards = document.querySelectorAll(".history-card");
  historyCards.forEach(card => card.remove());
}

function displayHistory() {
  clearHistory();
  let recentHistory = [...calcHistory].reverse();
  let equalSign = " = ";
  for (oldCalc of recentHistory) {
    let displayOperator = processOperator(oldCalc["operator"]);
    let spacedOperator = " " + displayOperator + " ";
    let topLine = oldCalc["firstNum"] +
      spacedOperator +
      oldCalc["secondNum"] +
      equalSign;
    let bottomLine = addCommas(oldCalc["result"]);
    // Add to history-display
    let historyCard = document.createElement("div");
    historyCard.classList.add("history-card");
    let historyTop = document.createElement("div");
    historyTop.classList.add("history-top");
    historyTop.textContent = topLine;
    historyCard.append(historyTop);
    let historyBottom = document.createElement("div");
    historyBottom.classList.add("history-bottom");
    historyBottom.textContent = bottomLine;
    historyCard.append(historyBottom);
    historyDisplay.append(historyCard);
  }
}

function clearAll() {
  newCalc();
  removeError("all");
  updateDisplay();
}

// Strips trailing zeros and changes any 0 equivalents, such as "-0." or "-0", to 0
function checkEntry(operand) {
  if (currentCalc[operand] === "-") {
    currentCalc[operand] = "0";
  } else {
    currentCalc[operand] = Number(currentCalc[operand]).toString();    // Uses to number conversion correct string
  }
}

function enter() {
  if ((currentCalc["secondNum"] !== "") && (currentCalc["result"] === "")) {
    removeError("operand-length");
    checkEntry("secondNum");    // Check if second operand is invalid equivalent of 0 and corrects if so
    operate();
    updateDisplay();
  }
}

function updateOperand(event) {
  let operand = "";
  let inputValue = event.target.dataset.value;
  // Check if need to reset the calculation before dealing with the input
  if (currentCalc["result"] !== "") {
    newCalc();
    removeError("all");
  }
  if (currentCalc["operator"] === "") {
    operand = "firstNum";
  } else {
    operand = "secondNum";
  }
  applyInput(operand, inputValue);
}

function applyInput(operand, inputValue) {
  let maxLength = currentCalc[operand].includes("-") ? 16 : 15;
  if (inputValue === "backspace") {
    removeError("operand-length");
    if (currentCalc[operand] === "0.") {
      currentCalc[operand] = "";
    } else {
      currentCalc[operand] = currentCalc[operand].slice(0, -1);
    }
    updateDisplay();
    return;
  } else if (inputValue === "clear-last") {
    removeError("operand-length");
    currentCalc[operand] = "";
    updateDisplay();
    return;
  } else if ((inputValue === "0") && (currentCalc[operand] === "0")) {
    return;
  } else if (inputValue === "+/-") {
    removeError("operand-length");
    if (currentCalc[operand].includes("-")) {
      currentCalc[operand] = currentCalc[operand].replace("-", "");
    } else {
      currentCalc[operand] = "-" + currentCalc[operand];
    }
    updateDisplay();
    return;
  } else if ((inputValue === ".") && (currentCalc[operand].includes("."))) {
    return;
  } else if (currentCalc[operand].length >= maxLength) {
    displayError("operand-length");
    return;
  } else if (currentCalc[operand] === "0") {
    currentCalc[operand] = "";    // Attempts to add numbers after a zero will remove the zero so it can be replaced by the number
  }
  if ((inputValue === ".") && (currentCalc[operand].length === 0)) {
    inputValue = "0.";
  } else if ((inputValue === ".") && (currentCalc[operand] === "-")) {
    inputValue = "0.";
  }
  currentCalc[operand] += inputValue;
  updateDisplay();
}

function updateOperator(event) {
  let inputOperator = event.target.dataset.value;
  removeError("operand-length");
  if (currentCalc["firstNum"] === "") {
    return;
  } else if ((currentCalc["secondNum"] !== "") || (currentCalc["result"] !== "")) {
    runningCalc(inputOperator);
  } else if (currentCalc["operator" !== ""]) {
    return;
  } else {
    checkEntry("firstNum");    // Check if second operand is invalid equivalent of 0 and corrects if so
    currentCalc["operator"] = inputOperator;
    updateDisplay();
  }
}

// Rolls a partial or complete calculation’s result into a new calculation when an operator is entered 
function runningCalc(inputOperator) {
  if (currentCalc["result"] === "") {
    checkEntry("secondNum");    // Check if second operand is invalid equivalent of 0 and corrects if so
    operate();
  }
  let lastResult = currentCalc["result"];
  newCalc();
  removeError("all");
  if (lastResult !== "ERROR") {
    currentCalc["firstNum"] = lastResult;
    currentCalc["operator"] = inputOperator;
  }
  updateDisplay();
}

function keyInput(event) {
  let keyValue = event.key.toLowerCase();    // Set key input case to match data-value properties
  let whiteList = ["backspace", "/", "*", "-", "+", "+/-", ".", "enter"];
  switch (keyValue) {
    case "delete":
      clearAllButton.click();
      break;
    case "=":
      enterButton.click();
      break;
    case "enter":
      event.preventDefault();    // Prevents enter button from pressing any buttons cursor is over
    default:
      if (Number.isInteger(Number(keyValue)) || whiteList.includes(keyValue)) {
        let matchedButton = document.querySelector(`button[data-value="${keyValue}"]`);
        matchedButton.click();
      }
  }
}

let currentCalc = new calculation;
let calcHistory = [];

enterButton.addEventListener("click", enter);
clearAllButton.addEventListener("click", clearAll);
operatorButtons.forEach(button => button.addEventListener("click", updateOperator));
operandButtons.forEach(button => button.addEventListener("click", updateOperand));
window.addEventListener("keydown", keyInput);