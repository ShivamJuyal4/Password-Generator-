const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numberCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox");
const Symbol = "~#$%^&*()_-=+[{]}|/*-,<.>/?;:";

let password = "";
let passwordLength = 10;
let checkcount = 0;
// set strength circle to grey
handleSlider();

setIndicator("#ccc");

// set password
function handleSlider() {
  inputSlider.value = passwordLength;
  lengthDisplay.innerText = passwordLength;
  const min = inputSlider.min;
  const max = inputSlider.max;
  inputSlider.style.backgroundSize =
    ((passwordLength - min) * 100) / (max - min) + "% 100%";
}

function setIndicator(color) {
  indicator.style.background = color;
  indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
  // shadow
}

function getRndInteger(min, max) {
  return Math.round(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
  return getRndInteger(0, 9);
}

function generateLowerCase() {
  return String.fromCharCode(getRndInteger(97, 123));
}

function generateUpperCase() {
  return String.fromCharCode(getRndInteger(65, 91));
}

function generateSymbols() {
  let random = getRndInteger(0, Symbol.length);
  return Symbol.charAt(random);
}

function calcStrength() {
  let hasUpper = false;
  let hasLower = false;
  let hasNum = false;
  let hasSym = false;

  if (uppercaseCheck.checked) hasUpper = true;
  if (lowercaseCheck.checked) hasLower = true;
  if (numberCheck.checked) hasNum = true;
  if (symbolsCheck.checked) hasSym = true;

  if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 0) {
    setIndicator("#0f0");
  } else if (
    (hasLower || hasUpper) &&
    (hasNum || hasSym) &&
    passwordLength >= 6
  ) {
    setIndicator("#ff0");
  } else {
    setIndicator("#f00");
  }
}

function shufflePassword(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  let str = "";
  array.forEach((el) => (str += el));
  return str;
}

async function copyContent() {
  try {
    await navigator.clipboard.writeText(passwordDisplay.value);
    copyMsg.innerText = "copied";
  } catch (error) {
    copyMsg.innerText = "failed";
  }

  copyMsg.classList.add("active");

  setTimeout(() => {
    copyMsg.classList.remove("active");
  }, 2000);
}

function handleCheckBoxChange() {
  checkcount = 0;
  allCheckBox.forEach((checkbox) => {
    if (checkbox.checked) {
      checkcount++;
    }
  });

  // Special condition
  if (passwordLength < checkcount) {
    passwordLength = checkcount;
    handleSlider();
  }
}
allCheckBox.forEach((checkbox) => {
  checkbox.addEventListener("change", handleCheckBoxChange);
});

inputSlider.addEventListener("input", (e) => {
  passwordLength = e.target.value;
  handleSlider();
});

copyBtn.addEventListener("click", () => {
  if (passwordDisplay.value) copyContent();
});

generateBtn.addEventListener("click", () => {
  if (passwordLength == 0) {
    return;
  }

  if (passwordLength < checkcount) {
    checkcount = passwordLength;
    handleSlider();
  }

  password = "";

  // if (uppercaseCheck.checked) {
  //   password += generateUpperCase();
  // }
  // if (lowercaseCheck.checked) {
  //   password += generateLowerCase();
  // }
  // if (numberCheck.checked) {
  //   password += generateRandomNumber();
  // }
  // if (symbolsCheck.checked) {
  //   password += generateSymbols();
  // }

  const funcArr = [];

  if (uppercaseCheck.checked) {
    funcArr.push(generateUpperCase);
  }
  if (lowercaseCheck.checked) {
    funcArr.push(generateLowerCase);
  }
  if (numberCheck.checked) {
    funcArr.push(generateRandomNumber);
  }
  if (symbolsCheck.checked) {
    funcArr.push(generateSymbols);
  }
  // console.log(funcArr);

  for (let i = 0; i < funcArr.length; i++) {
    // console.log(funcArr[i]());

    password += funcArr[i]();
  }

  for (let i = 0; i < passwordLength - funcArr.length; i++) {
    let randIndex = Math.abs(Math.floor(Math.random() * funcArr.length));
    password += funcArr[randIndex]();
  }

  password = shufflePassword(Array.from(password));

  passwordDisplay.value = password;

  calcStrength();
});