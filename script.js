let expression = "";
let answer = 0;
let angleMode = "DEG";

const display = document.getElementById("display");
const history = document.getElementById("history");
const angleButton = document.getElementById("angle");

function updateDisplay() {
  display.textContent = expression || "0";
}

function add(value) {
  expression += value;
  updateDisplay();
}

function clearAll() {
  expression = "";
  history.textContent = "";
  updateDisplay();
}

function backspace() {
  expression = expression.slice(0, -1);
  updateDisplay();
}

function changeSign() {
  if (!expression) return;

  if (expression.startsWith("-(") && expression.endsWith(")")) {
    expression = expression.slice(2, -1);
  } else {
    expression = "-(" + expression + ")";
  }

  updateDisplay();
}

function factorial(n) {
  if (n < 0 || !Number.isInteger(n)) {
    throw new Error("Invalid factorial");
  }

  let result = 1;

  for (let i = 2; i <= n; i++) {
    result *= i;
  }

  return result;
}

function toRadians(x) {
  return angleMode === "DEG"
    ? x * Math.PI / 180
    : x;
}

function sin(x) {
  return Math.sin(toRadians(x));
}

function cos(x) {
  return Math.cos(toRadians(x));
}

function tan(x) {
  return Math.tan(toRadians(x));
}

function prepareExpression(expr) {

  let e = expr;

  e = e.replaceAll("×", "*");
  e = e.replaceAll("÷", "/");
  e = e.replaceAll("−", "-");

  e = e.replaceAll("π", "Math.PI");
  e = e.replaceAll("Ans", "answer");
  e = e.replaceAll("√", "Math.sqrt");

  e = e.replaceAll("sin", "sin");
  e = e.replaceAll("cos", "cos");
  e = e.replaceAll("tan", "tan");

  e = e.replaceAll("log", "Math.log10");
  e = e.replaceAll("ln", "Math.log");

  e = e.replace(/(\d+)!/g, "factorial($1)");

  e = e.replace(/(\d+)%/g, "($1/100)");

  e = e.replace(/\^/g, "**");

  return e;
}

function calculate() {

  if (!expression) return;

  try {

    const original = expression;

    const prepared = prepareExpression(expression);

    const result = Function(
      "answer",
      "sin",
      "cos",
      "tan",
      "factorial",
      "return " + prepared
    )(
      answer,
      sin,
      cos,
      tan,
      factorial
    );

    if (!Number.isFinite(result)) {
      throw new Error("Math error");
    }

    answer = result;

    history.textContent = original + " =";

    expression = formatResult(result);

    updateDisplay();

  } catch (error) {

    history.textContent = "Error";

    expression = "";

    updateDisplay();
  }
}

function formatResult(number) {

  if (Math.abs(number) >= 1e12 ||
      (Math.abs(number) > 0 && Math.abs(number) < 1e-9)) {

    return number.toExponential(8);
  }

  return Number(number.toFixed(12)).toString();
}

function copyResult() {

  navigator.clipboard.writeText(display.textContent);

  history.textContent = "Copied!";

  setTimeout(() => {
    history.textContent = "";
  }, 1000);
}

angleButton.addEventListener("click", () => {

  if (angleMode === "DEG") {
    angleMode = "RAD";
  } else {
    angleMode = "DEG";
  }

  angleButton.textContent = angleMode;
});

document.addEventListener("keydown", (event) => {

  const key = event.key;

  if (/[0-9.]/.test(key)) {
    add(key);
  }

  else if (key === "+") {
    add("+");
  }

  else if (key === "-") {
    add("−");
  }

  else if (key === "*") {
    add("×");
  }

  else if (key === "/") {
    add("÷");
  }

  else if (key === "(" || key === ")") {
    add(key);
  }

  else if (key === "%") {
    add("%");
  }

  else if (key === "^") {
    add("^");
  }

  else if (key === "Enter" || key === "=") {
    calculate();
  }

  else if (key === "Backspace") {
    backspace();
  }

  else if (key === "Escape") {
    clearAll();
  }
});

updateDisplay();