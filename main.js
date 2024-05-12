
const inputSlider = document.querySelector("[data-lengthSlider]");
const displayLength = document.querySelector("[data-lengthNumber]");

const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const generateBtn = document.querySelector(".generateButton");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const indicator = document.querySelector("[data-indicator]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
setIndicator("#ccc");

function handleSlider(){
    inputSlider.value = passwordLength;
    displayLength.innerHTML = passwordLength;

    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%";
}

function handleCheckBoxChange(){
    checkCount = 0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked)
        {
            checkCount++;
        }
    });
    console.log(checkCount);
    if(passwordLength < checkCount ) {
        passwordLength = checkCount;
        handleSlider();
    }

}

allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
    
})

inputSlider.addEventListener('input', (event)=>{
    passwordLength = event.target.value;
    handleSlider();
})

function getRndInteger(min, max){
    return Math.floor(Math.random()*(max - min))  + min;
}

function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97,123));
}

function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65,91));
    // return String.fromCharCode(67);

}

function generateRandomNumber(){
    return getRndInteger(0,9);
}

function generateSymbol(){
    // return symbols[getRndInteger(0,symbols.length)];
    const randNum = getRndInteger(0, symbols.length);
    return symbols.charAt(randNum);
}


async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerHTML = "copied";
    }
    catch(e){
        copyMsg.innerHTML = "failed";
    }

    copyMsg.classList.add("active");

    setInterval(()=>{
        copyMsg.classList.remove("active");
    },2000);
    

}

copyBtn.addEventListener('click', ()=>{
    if(passwordDisplay.value)
    {
        copyContent();
    }
});

function shufflePassword(array) {
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;
  
    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
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

// function setIndicator(color) {
//     indicator.style.backgroundColor = color;
//     //shadow - HW
// }

generateBtn.addEventListener('click', ()=>{

    if(checkCount == 0)
    return ;
    password = "";
    let funcArr = [];

    if(passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    if(uppercaseCheck.checked){
        funcArr.push(generateUpperCase);
    }
    if(lowercaseCheck.checked){
        funcArr.push(generateLowerCase);
    }
    if(numbersCheck.checked){
        funcArr.push(generateRandomNumber);
    }
    if(symbolsCheck.checked){
        funcArr.push(generateSymbol);
    }

    // console.log(funcArr);

    for(let i=0; i<funcArr.length; i++)
    {
        password += funcArr[i]();
    }

    for(let i=0; i<passwordLength-funcArr.length; i++)
    {
        let t = getRndInteger(0,funcArr.length);
        password += funcArr[t]();
        // console.log("randIndex" + t);
        // console.log(funcArr[t]());
    }

    password = shufflePassword(Array.from(password));
    
    passwordDisplay.value = password;

    calcStrength();

});