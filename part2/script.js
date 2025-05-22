let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 30;
let timerId;

const questionText = document.getElementById("question");
const optionsContainer = document.getElementById("options");
const nextBtn = document.getElementById("nextBtn");
const resultBox = document.getElementById("result");

fetch("questions.json")
  .then(res => res.json())
  .then(data => {
    questions = data;
    showQuestion();
  });

function startTimer() {
  timeLeft = 30;
  const timerElement = document.createElement("div");
  timerElement.id = "timer";
  timerElement.textContent = `Temps restant : ${timeLeft}s`;
  document.querySelector(".quiz-box").insertBefore(timerElement, optionsContainer);
  timerId = setInterval(() => {
    timeLeft--;
    timerElement.textContent = `Temps restant : ${timeLeft}s`;
    if (timeLeft <= 0) {
      clearInterval(timerId);
      checkAnswer(-1);
    }
  }, 1000);
}

function showQuestion() {
  clearInterval(timerId);
  clearOptions();
  document.getElementById("question-count").textContent =
    `Question ${currentQuestionIndex + 1} of ${questions.length}`;
  const q = questions[currentQuestionIndex];
  questionText.textContent = q.question;
  startTimer();
  q.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.textContent = option;
    button.classList.add("option");
    button.onclick = () => checkAnswer(index);
    optionsContainer.appendChild(button);
  });
}

function checkAnswer(selectedIndex) {
  clearInterval(timerId);
  const correct = questions[currentQuestionIndex].answer;
  if (selectedIndex === correct) {
    score++;
  }
  nextBtn.disabled = false;
  Array.from(optionsContainer.children).forEach((btn, i) => {
    btn.disabled = true;
    if (i === correct) btn.style.backgroundColor = "#a4edba";
    if (i === selectedIndex && i !== correct) btn.style.backgroundColor = "#f5a3a3";
  });
}

function clearOptions() {
  optionsContainer.innerHTML = "";
  nextBtn.disabled = true;
  const timerElement = document.getElementById("timer");
  if (timerElement) timerElement.remove();
}

nextBtn.addEventListener("click", () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    showResult();
  }
});

function showResult() {
  clearInterval(timerId);
  document.querySelector(".quiz-box").innerHTML = `<h2>Your score: ${score} / ${questions.length}</h2>`;
}
 
