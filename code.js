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
  currentCalc = new calculation
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
  return result.toString()    // converts from Big object to string
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
        let roundTo = maxLength - (wholeNums + 1);   // +1 is to account for decimal
        if (roundTo >= 3) {    // If rounding would take number to less than three decimal places then fall through to "ERROR"
          adjustedResult = resultNum.toFixed(roundTo);    // Also coverts to string
          return adjustedResult;
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

// Finds the result of the calculation and saves it - !!!rewrite this, see below!!!
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
  }
}

// Formats and displays current state of the calculation
function updateDisplay() {
  let topLine = "";
  let bottomLine = "";
  let spacedOperator = " " + currentCalc["operator"] + " ";
  let equalSign = " = ";
  if (currentCalc["result"] !== "") {
    topLine = currentCalc["firstNum"] + spacedOperator + currentCalc["secondNum"] + equalSign;
    bottomLine = currentCalc["result"];
  } else if (currentCalc["secondNum"] !== "") {
    topLine = currentCalc["firstNum"] + spacedOperator;
    bottomLine = currentCalc["secondNum"];
  } else if (currentCalc["operator"] !== "") {
    topLine = currentCalc["firstNum"];
    bottomLine = currentCalc["operator"];
  } else {
    bottomLine = currentCalc["firstNum"];
  }
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

function displayHistory() {
  let recentHistory = calcHistory.reverse();
  let equalSign = " = ";
  for (oldCalc of recentHistory) {
    let spacedOperator = " " + oldCalc["operator"] + " ";
    let topLine = oldCalc["firstNum"] +
      spacedOperator +
      oldCalc["secondNum"] +
      equalSign;
    let bottomLine = oldCalc["result"];
    // add to history-display
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
  updateDisplay()
}

function enter() {
  if ((currentCalc["secondNum"] !== "") && (currentCalc["result"] === "")) {
    removeError("operand-length");
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
    return;
  } else if (inputValue === "clear-last") {
    removeError("operand-length");
    currentCalc[operand] = "";
    return;
  } else if ((inputValue === "0") && (currentCalc[operand] === "0")) {
    return
  } else if (inputValue === "+/-") {
    removeError("operand-length");
    if (currentCalc[operand].includes("-")) {
      currentCalc[operand] = currentCalc[operand].replace("-", "");
    } else {
      maxLength = 16;
      currentCalc[operand] = "-" + currentCalc[operand]
    }
    return;
  } else if ((inputValue === ".") && (currentCalc[operand].includes("."))) {
    return;
  } else if (currentCalc[operand].length >= maxLength) {
    displayError("operand-length");
    return;
  } else if ((inputValue === ".") && (currentCalc[operand].length === 0)) {
    inputValue = "0."
  }
  currentCalc[operand] += inputValue;
  updateDisplay();
}

function updateOperator(event) {
  let inputValue = event.target.dataset.value;
  removeError("operand-length");
  if (currentCalc["firstNum"] === "") {
    return;
  } else if ((currentCalc["secondNum"] !== "") || (currentCalc["result"] !== "")) {
    runningCalc(inputValue);
  } else if (currentCalc["operator" !== ""]) {
    return;
  } else {
    currentCalc["operator"] = inputValue;
  }
}

// ADD IN COMMENT
function runningCalc(inputValue) {
  if (currentCalc["result"] === "") {
    operate();
  }
  let lastResult = currentCalc["result"];

  updateDisplay();
}



function test() {
  operate();
  updateDisplay();
}

function testTwo() {
  removeError("all");
}


let currentCalc = new calculation;
let calcHistory = [];

// NOTE hooked to test function as a placeholder
enterButton.addEventListener("click", enter);
clearAllButton.addEventListener("click", clearAll);
operatorButtons.forEach(button => button.addEventListener("click", test));
operandButtons.forEach(button => button.addEventListener("click", updateOperand));