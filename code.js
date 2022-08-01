//testing calc object
let currentCalc = {
  firstNum: "20.222",
  operator: "+",
  secondNum: "80.333",
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

// operate finds the result of the calculation and saves it
function operate() {
  if ((currentCalc["operator"] === "/") && (currentCalc["secondNum"] === "0")) {
    // displayError("/0");
    currentCalc["result"] = "ERROR";
    return;
  }
  let rawResult = findResult();
  console.log(rawResult)
  let adjustedResult = checkLength(rawResult);
  if (adjustedResult === "ERROR") {
    // displayError("result-length");
    currentCalc["result"] = "ERROR (long)";
  } else {
    currentCalc["result"] = adjustedResult;
    // saveHistory();
  }
}


function changeNum() {
  screen.textContent = currentCalc["result"];
}

function test() {
  operate();
  changeNum();
}

const screen = document.querySelector(".screen-bottom");
const button = document.querySelector(".enter")
button.addEventListener("click", test);