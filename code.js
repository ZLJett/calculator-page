const errorDisplay = document.querySelector(".error-display");
const topDisplay = document.querySelector(".top-display");
const bottomDisplay = document.querySelector(".bottom-display");
const enterButton = document.querySelector(".enter");
const clearAllButton = document.querySelector(".clear-all");
const operatorButtons = document.querySelectorAll(".operator");
const operandButtons = document.querySelectorAll(".operand");

//testing calc object
let currentCalc = {
  firstNum: "4500001000",
  operator: "*",
  secondNum: "-4501000000",
  result: "",
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
    // saveHistory();
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


function test() {
  operate();
  updateDisplay();
}

function testTwo() {
  removeError("all");
}

// NOTE hooked to test function as a placeholder
enterButton.addEventListener("click", test);
clearAllButton.addEventListener("click", testTwo);
operatorButtons.forEach(button => button.addEventListener("click", test));
operandButtons.forEach(button => button.addEventListener("click", test));