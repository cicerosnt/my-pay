import "./css/index.css"
import IMask from  'imask';

// ">" pega o primeiro nivel (primeiro que encontrar)
const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path");
const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path");
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img");




function setCardType(type){
  const colors = {
    visa: ["#436d99", "#2d57f2"],
    mastercard: ["#df6f29", "#c69347"],
    default: ["black", "gray"],
  }
  
  ccBgColor01.setAttribute("fill", colors[type][0]);
  ccBgColor02.setAttribute("fill", colors[type][1]);
  ccLogo.setAttribute("src", `cc-${type}.svg`);
}

//setCardType("visa");


//disponibilizando como função global
globalThis.setCardType = setCardType;


//utilizando o IMask
const securityCode = document.querySelector("#security-code");
const securityCodePatter = {
  mask: "0000",
}
const securityCodeMasked = IMask(securityCode, securityCodePatter);

///masked for date
const expiretionDate = document.querySelector("#expiration-date")
const expiretionDatePatter = {
  mask: "MM{/}YY",
  blocks: {
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2),
    },

    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12,
    },
  },
}
const expiretionDateMask = IMask(expiretionDate, expiretionDatePatter);


const cardNumber = document.querySelector("#card-number")
const cardNumberPattern = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex:/^4\d{0,15}/,
      cardType: "visa",
    },
    {
      mask: "0000 0000 0000 0000",
      regex:/(^5[1,5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardType: "mastercard",
    },
    {
      mask: "0000 0000 0000 0000",
      cardType: "default",
    },
  ],
  dispatch: function(appended, dynamicMasked){
    const number = (dynamicMasked.value + appended.value).replace(/\D/g, "");
    
    const foundMask = dynamicMasked.compiledMasks.find(function(item){
      return number.match(item.regex);
    })
    
    return foundMask;
  },
}
const cardNumberMasked = IMask(cardNumber, cardNumberPattern);


const addButton = document.querySelector("#add-card");
addButton.addEventListener("click", () => {
  alert("Parabéns!!!\n\nCartão adicionando com sucesso!");
});

document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault();
});
const cardHolder = document.querySelector("#card-holder")
cardHolder.addEventListener("input", () => {
  const ccHolder = document.querySelector(".cc-holder .value");
  
  ccHolder.innerText =
    cardHolder.value.length === 0 ? "FULANO DA SILVA" : cardHolder.value;
});

securityCodeMasked.on("accept", () => {
  updateSecurityCode(securityCodeMasked.value);
});

function updateSecurityCode(code){
  const ccSecurity = document.querySelector(".cc-security .value");
  ccSecurity.innerText = code.length === 0 ? "123" : code;
}

cardNumberMasked.on("accept", () => {
  const cardType = cardNumberMasked.masked.currentMask.cardType;
  setCardType(cardType);
  updateCardNumber(cardNumberMasked.value);
});

function updateCardNumber(cardNumber){
  const ccNumber = document.querySelector(".cc-number");
  ccNumber.innerText = cardNumber.length === 0 ? "1234 5678 1011 1213" : cardNumber;
}

expiretionDateMask.on("accept", () => {
  updateExpiration(expiretionDate.value);
});

function updateExpiration(date){
  const ccExpiration = document.querySelector(".cc-expiration .value")
  ccExpiration.innerText = date.length === 0 ? "02/32" : date;
}