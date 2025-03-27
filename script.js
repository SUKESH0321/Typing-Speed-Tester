const RANDOM_QUOTE_API_URL = 'http://api.quotable.io/random';
const quoteDisplayElement = document.getElementById('DispTxt');
const quoteInputElement = document.getElementById('Intxt');
const timerElement = document.getElementById('timer');
const accuracyElement = document.getElementById('accuracy');
const wpsElement = document.getElementById('wps');
const startButton = document.getElementById('start-btn');

let startTime;
let totalTyped = 0;
let correctTyped = 0;
let timerInterval;

// Disable typing until the test starts
quoteInputElement.disabled = true;

startButton.addEventListener('click', startTest);

function startTest() {
    startButton.disabled = true;
    quoteInputElement.disabled = false;
    quoteInputElement.focus();
    renderNewQuote();
}

quoteInputElement.addEventListener('input', () => {
    const arrayQuote = quoteDisplayElement.querySelectorAll('span');
    const arrayValue = quoteInputElement.value.split('');

    let correct = true;
    totalTyped = arrayValue.length;
    correctTyped = 0;

    arrayQuote.forEach((characterSpan, index) => {
        const character = arrayValue[index];
        if (character == null) {
            characterSpan.classList.remove('correct', 'incorrect');
            correct = false;
        } else if (character === characterSpan.innerText) {
            characterSpan.classList.add('correct');
            characterSpan.classList.remove('incorrect');
            correctTyped++;
        } else {
            characterSpan.classList.remove('correct');
            characterSpan.classList.add('incorrect');
            correct = false;
        }
    });

    updateStats();

    if (correct) renderNewQuote();
});

function updateStats() {
    let accuracy = totalTyped > 0 ? (correctTyped / totalTyped) * 100 : 100;
    accuracyElement.innerText = accuracy.toFixed(2);

    let timeElapsed = getTimerTime();
    let wordsTyped = totalTyped / 5;
    let wps = timeElapsed > 0 ? wordsTyped / timeElapsed : 0;
    wpsElement.innerText = wps.toFixed(2);
}

function getRandomQuote() {
    return fetch(RANDOM_QUOTE_API_URL)
        .then(response => response.json())
        .then(data => data.content);
}

async function renderNewQuote() {
    const quote = await getRandomQuote();
    quoteDisplayElement.innerHTML = '';
    quote.split('').forEach(character => {
        const characterSpan = document.createElement('span');
        characterSpan.innerText = character;
        quoteDisplayElement.appendChild(characterSpan);
    });
    quoteInputElement.value = null;
    resetStats();
    startTimer();
}

function resetStats() {
    totalTyped = 0;
    correctTyped = 0;
    accuracyElement.innerText = '100';
    wpsElement.innerText = '0';
    clearInterval(timerInterval);
}

function startTimer() {
    timerElement.innerText = 0;
    startTime = new Date();
    timerInterval = setInterval(() => {
        timerElement.innerText = getTimerTime();
        updateStats();
    }, 1000);
}

function getTimerTime() {
    return Math.floor((new Date() - startTime) / 1000);
}
