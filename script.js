const quoteDisplayElement = document.getElementById('DispTxt')
const quoteInputElement = document.getElementById('Intxt')
const timeLeftElement = document.getElementById('time-left')
const accuracyElement = document.getElementById('accuracy')
const wpsElement = document.getElementById('wps')
const startBtn = document.getElementById('start-btn')
const timeSelector = document.getElementById('time-selector')
const stopBtn = document.getElementById('stop-btn')
const API_URL = 'http://api.quotable.io/random'


let timer
let timeLeft = 30
let totalTyped = 0
let correctTyped = 0
let initialTime = 30

startBtn.addEventListener('click', startTest)
stopBtn.addEventListener('click', endTest)

function startTest() {
  timeLeft = parseInt(timeSelector.value)
  totalTyped = 0
  correctTyped = 0
  quoteInputElement.disabled = false
  quoteInputElement.value = ''
  quoteInputElement.focus()
  timeLeftElement.innerText = timeLeft
  accuracyElement.innerText = '100'
  wpsElement.innerText = '0'
  startBtn.disabled = true
  stopBtn.disabled = false

  renderNewQuote()
  startCountdown()
}

function startCountdown() {
  timer = setInterval(() => {
    timeLeft--
    timeLeftElement.innerText = timeLeft
    if (timeLeft === 0) {
      endTest()
    }
  }, 1000)
}

function endTest() {
  clearInterval(timer)
  quoteInputElement.disabled = true
  startBtn.disabled = false
}

function getRandomQuote() {
  return fetch(API_URL)
    .then(response => response.json())
    .then(data => data.content)
}

function endTest() {
  clearInterval(timer)
  quoteInputElement.disabled = true
  startBtn.disabled = false
  stopBtn.disabled = true
  timeSelector.disabled = false
}

async function renderNewQuote() {
  const quote = await getRandomQuote()
  quoteDisplayElement.innerHTML = ''
  quote.split('').forEach(character => {
    const span = document.createElement('span')
    span.innerText = character
    quoteDisplayElement.appendChild(span)
  })
}

quoteInputElement.addEventListener('input', () => {
  const quoteSpans = quoteDisplayElement.querySelectorAll('span')
  const userInput = quoteInputElement.value.split('')
  totalTyped++

  let correct = true
  correctTyped = 0

  quoteSpans.forEach((span, index) => {
    const char = userInput[index]

    if (char == null) {
      span.classList.remove('correct', 'incorrect')
      correct = false
    } else if (char === span.innerText) {
      span.classList.add('correct')
      span.classList.remove('incorrect')
      correctTyped++
    } else {
      span.classList.add('incorrect')
      span.classList.remove('correct')
      correct = false
    }
  })


  const accuracy = Math.round((correctTyped / totalTyped) * 100) || 0
  const timeSpent = 60 - timeLeft
  const wps = timeSpent > 0 ? Math.round((correctTyped / 5) / (timeSpent / 60)) : 0

  accuracyElement.innerText = accuracy
  wpsElement.innerText = wps

  if (correct && userInput.length === quoteSpans.length) {
    renderNewQuote()
    quoteInputElement.value = ''
  }
})
