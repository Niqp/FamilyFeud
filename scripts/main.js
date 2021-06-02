let questions;
let currentQuestionNumber = 0;
let currentQuestion = document.querySelector(".currentQuestion");

let answerTemplate = document.querySelector('#answer-template').content;
let answers = document.querySelector(".answers");

let pointsCurrent = document.querySelector(".pointsCurrent");
let pointsCurrentCounter = 0;
let pointsRed = document.querySelector(".pointsRed");
let pointsRedCounter = 0;
let pointsBlue = document.querySelector(".pointsBlue");
let pointsBlueCounter = 0;

let nextQuestion = document.querySelector(".nextQuestion");
let appendToRed = document.querySelector(".appendToRed");
let appendToBlue = document.querySelector(".appendToBlue");


fetch('data/data.json')
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    questions = data;
    console.log(questions);
  });

nextQuestion.addEventListener('click', function () {
  let questionSelected = questions.questionList[currentQuestionNumber];
  currentQuestion.textContent = questionSelected.Question;
  answers.textContent = "";
  for (let index = 0; index < questionSelected.Answers.length; index++) {
      let clonedTemplate = answerTemplate.cloneNode(true);
      let answerText = clonedTemplate.querySelector(".answerText");
      let answerPoints = clonedTemplate.querySelector(".answerPoints");
      let answerButton = clonedTemplate.querySelector(".answerButton");

      answerText.textContent = "---";
      answerPoints.textContent = "---";

      answerButton.addEventListener('click', function () {
        answerText.textContent = questionSelected.Answers[index].Answer;
        answerPoints.textContent = questionSelected.Answers[index].Points;

        pointsCurrentCounter += Number(questionSelected.Answers[index].Points);
        pointsCurrent.textContent = pointsCurrentCounter;

        answerButton.classList.add("hidden");
      });

      answers.appendChild(clonedTemplate);
  }
  currentQuestionNumber++;
  });

appendToRed.addEventListener('click', function () {
  pointsRedCounter += pointsCurrentCounter;
  pointsRed.textContent = pointsRedCounter;
  pointsCurrentCounter = 0;
  pointsCurrent.textContent = pointsCurrentCounter;
})

appendToBlue.addEventListener('click', function () {
  pointsBlueCounter += pointsCurrentCounter;
  pointsBlue.textContent = pointsBlueCounter;
  pointsCurrentCounter = 0;
  pointsCurrent.textContent = pointsCurrentCounter;
})
