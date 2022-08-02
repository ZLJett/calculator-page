const errorDisplay = document.querySelector(".error-display");
const topDisplay = document.querySelector(".top-display");
const bottomDisplay = document.querySelector(".bottom-display");
const enterButton = document.querySelector(".enter");
const clearAllButton = document.querySelector(".clear-all");
const operatorButtons = document.querySelectorAll(".operator");
const operandButtons = document.querySelectorAll(".operand");

//testing calc object
let currentCalc = {
  firstNum: "2012424234213423423423423",
  operator: "*",
  secondNum: "802314234213424214234234",
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
  return result.toString()                        // also removes any trailing zeros
}

function checkLength(rawResult) {
  let adjustedResult = ""
  let cleanedResult = Number(rawResult).toString();
  let resultNum = Number(cleanedResult);
  let maxLength = cleanedResult.includes("-") ? 16 : 15;
  if (cleanedResult.length > maxLength) {
    switch (true) {
      case cleanedResult.includes("."):
        let splitNum = cleanedResult.split(".");
        let wholeNums = splitNum[0].length;
        let roundTo = maxLength - (wholeNums + 1);   // +1 is to account for decimal
        if (roundTo >= 3) {
          adjustedResult = resultNum.toFixed(roundTo);
          return adjustedResult;
        }
      default:
        adjustedResult = "ERROR";
        return adjustedResult;
    }
  }
  adjustedResult = cleanedResult;
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


function test() {
  operate();
  updateDisplay();
}

// NOTE hooked to test function as a placeholder
enterButton.addEventListener("click", test);
clearAllButton.addEventListener("click", test);
operatorButtons.forEach(button => button.addEventListener("click", test));
operandButtons.forEach(button => button.addEventListener("click", test));