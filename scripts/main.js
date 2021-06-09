const getRandomInteger = (min, max) => {
  if (min >= max) {
    return max;
  }
  if (min<0 || max<0) {
    throw new Error('Ошибка: отрицательные значения не принимаются!');
  }
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const feudMachine = (questions) => {
  const CURRENT_QUESTION = document.querySelector(".currentQuestion");
  const NEXT_QUESTION = document.querySelector(".nextQuestion");
  const FAST_MONEY_NEXT = document.querySelector(".fastMoneyNextQuestion")
  NEXT_QUESTION.classList.remove("hidden");

  const ANSWER_TEMPLATE = document.querySelector('#answer-template').content;
  const FAST_MONEY_TEMPLATE = document.querySelector('#fastMoney-template').content;
  const FAST_MONEY_ANSWERS_TEMPLATE = document.querySelector('#fastMoneyAnswers-template').content;
  const ANSWERS = document.querySelector(".answers");

  const NORMAL_QUESTIONS_MAX = 5;
  const FAST_MONEY_MAX = 5;
  const FAST_MONEY_PLAYERS = 2;
  const FAST_MONEY_TIMER = 30; //in seconds
  const QUESTIONS_PER_GAME = 10;

  const POINTS_CURRENT = document.querySelector(".pointsCurrent");
  const POINTS_RED = document.querySelector(".pointsRed");
  const POINTS_BLUE = document.querySelector(".pointsBlue");
  const APPEND_TO_RED = document.querySelector(".appendToRed");
  const APPEND_TO_BLUE = document.querySelector(".appendToBlue");
  const END_GAME = document.querySelector(".endGame");

  let pointsBlueCounter = 0;
  let pointsRedCounter = 0;
  let pointsCurrentCounter = 0;
  let currentPlayer = 0;
  let newGame = true;

  let chosenTeam = 0;

  let normalQuestionCurrentCount = 0;
  let fastMoneyCurrentCount = 0;

  let questionList = Object.keys(questions.questionList);

  const getRandomQuestion = () => {
    const randomSeed = getRandomInteger(0,questionList.length-1);
    let selectedQuestion = questionList[randomSeed];
    questionList.splice(randomSeed,1);
    return selectedQuestion;
  };

  const getNormalQuestion = () => {
    NEXT_QUESTION.textContent = "Следующий вопрос"
    let randomQuestion = getRandomQuestion();
    console.log(questionList.length);
    let questionSelected = questions.questionList[randomQuestion];
    CURRENT_QUESTION.textContent = questionSelected.Question;
    ANSWERS.textContent = "";
    questionSelected.Answers.forEach((_,index) => {
        let clonedTemplate = ANSWER_TEMPLATE.cloneNode(true);
        let answerText = clonedTemplate.querySelector(".answerText");
        let answerPoints = clonedTemplate.querySelector(".answerPoints");
        let answerButton = clonedTemplate.querySelector(".answerButton");

        answerText.textContent = "---";
        answerPoints.textContent = "---";

        answerButton.addEventListener('click', function () {
          answerText.textContent = questionSelected.Answers[index].Answer;
          answerPoints.textContent = questionSelected.Answers[index].Points;

          pointsCurrentCounter += Number(questionSelected.Answers[index].Points);
          POINTS_CURRENT.textContent = pointsCurrentCounter;

          answerButton.classList.add("hidden");
        });
        ANSWERS.appendChild(clonedTemplate);
    });
    pointsCurrentCounter = 0;
    POINTS_CURRENT.textContent = pointsCurrentCounter;
  };

  const getFastMoneyQuestion = () => {
    pointsRedCounter>=pointsBlueCounter?chosenTeam=1:chosenTeam=2;
    currentPlayer=0;
    fastMoneyCurrentCount = 0;
    console.log('Первой играет команда' + chosenTeam);
    const randomQuestionPool = new Array(FAST_MONEY_MAX).fill('').map(() => questions.questionList[getRandomQuestion()]);
    console.log(randomQuestionPool);
    console.log(questionList.length);
    let playerAnswers = new Array(FAST_MONEY_PLAYERS).fill(null).map(() => []);
    NEXT_QUESTION.classList.add("hidden");
    FAST_MONEY_NEXT.classList.remove("hidden");

    let clonedTemplate = FAST_MONEY_TEMPLATE.cloneNode(true);
    let answerInput = clonedTemplate.querySelector('.fastMoneyAnswer');
    let timer = clonedTemplate.querySelector('.timer');
    let timerId = 0;

    const addNewQuestion = () => {
      clonedTemplate = FAST_MONEY_TEMPLATE.cloneNode(true);
      answerInput = clonedTemplate.querySelector('.fastMoneyAnswer');
      timer = clonedTemplate.querySelector('.timer');
      console.log('Счетчик ' + fastMoneyCurrentCount);
      const questionSelected = randomQuestionPool[fastMoneyCurrentCount];
      console.log(questionSelected);
      CURRENT_QUESTION.textContent = questionSelected.Question;
      ANSWERS.textContent = "";
      let currentTimer = FAST_MONEY_TIMER;
      ANSWERS.appendChild(clonedTemplate);
      timer.textContent = currentTimer;
      answerInput.focus();

      timerId = setInterval(() => {
        currentTimer--;
        timer.textContent = currentTimer;
        if (currentTimer === 0) {
          clearInterval(timerId);
          playerAnswers[currentPlayer].push(answerInput.value);
          console.log("Получил " + answerInput.value);
          console.log(playerAnswers);
          fastMoneyCurrentCount++;
          checkQuestion();
        }
      },1000);

      answerInput.addEventListener('keydown', (evt) => {
        if (evt.code === "Enter") {
          clearInterval(timerId);
          playerAnswers[currentPlayer].push(answerInput.value);
          console.log("Получил " + answerInput.value);
          console.log(playerAnswers);
          fastMoneyCurrentCount++;
          checkQuestion();
        }
      });
    };

    addNewQuestion();

    const getFastMoneyAnswers = () => {
      CURRENT_QUESTION.textContent = "";
      ANSWERS.textContent = "";
      const playersBlock = document.createElement("div");
      playersBlock.className = "playersBlock";
      ANSWERS.append(playersBlock);

      playerAnswers[0].forEach((value,index) => {
        const currentIndex = index;
        const questionBlock = document.createElement("div");
        questionBlock.className = "questionBlock";
        questionBlock.textContent = randomQuestionPool[index].Question;
        playersBlock.append(questionBlock);
        const answerBlock = document.createElement("div");
        answerBlock.className = "answerBlock";
        playersBlock.append(answerBlock);
        playerAnswers.forEach((value,index) => {
          const clonedTemplate = FAST_MONEY_ANSWERS_TEMPLATE.cloneNode(true);
          const answer = clonedTemplate.querySelector('.answerText');
          answer.textContent = playerAnswers[index][currentIndex];
          answerBlock.appendChild(clonedTemplate);
        });
        const revealButton = document.createElement("button");
        revealButton.className = "revealButton";
        const answers = answerBlock.querySelectorAll('.fastMoneyPoints');
        console.log(answers);
        revealButton.addEventListener('click', () => {
          answers.forEach((value) => {
            value.type = "text";
          });
          if (chosenTeam===1) {
            pointsRedCounter += parseInt(answers[0].value);
            POINTS_RED.textContent = pointsRedCounter;
            pointsBlueCounter += parseInt(answers[1].value);
            POINTS_BLUE.textContent = pointsBlueCounter;
          }
          if (chosenTeam===2) {
            pointsRedCounter += parseInt(answers[1].value);
            POINTS_RED.textContent = pointsRedCounter;
            pointsBlueCounter += parseInt(answers[0].value);
            POINTS_BLUE.textContent = pointsBlueCounter;
          }

        });
        answerBlock.append(revealButton);
      });
    };
    
    const checkQuestion = () => {
      if (fastMoneyCurrentCount<FAST_MONEY_MAX) {
        addNewQuestion();
      }
      if (fastMoneyCurrentCount===FAST_MONEY_MAX) {
        currentPlayer++;
        fastMoneyCurrentCount = 0;
        if (currentPlayer===FAST_MONEY_PLAYERS) {
          getFastMoneyAnswers();
          FAST_MONEY_NEXT.classList.add('hidden');
          FAST_MONEY_NEXT.removeEventListener('click', fastMoneyNext);
          END_GAME.classList.remove("hidden");
          return;
        }
        addNewQuestion();
      }
    };
    function fastMoneyNext() {
      clearInterval(timerId);
      playerAnswers[currentPlayer].push(answerInput.value);
      console.log("Получил " + answerInput.value);
      console.log(playerAnswers);
      fastMoneyCurrentCount++;
      checkQuestion(); 
    }
    FAST_MONEY_NEXT.addEventListener('click', fastMoneyNext);

  }; 

  END_GAME.addEventListener("click", () => {
    ANSWERS.textContent = "";
    console.log(pointsBlueCounter);
    console.log(pointsRedCounter);
    if (pointsBlueCounter>pointsRedCounter) {
      CURRENT_QUESTION.textContent = "Победила СИНЯЯ команда!";
    }
    if (pointsRedCounter>pointsBlueCounter) {
      CURRENT_QUESTION.textContent = "Победила КРАСНАЯ команда!";
    }
    if (pointsBlueCounter===pointsRedCounter) {
      CURRENT_QUESTION.textContent = "НИЧЬЯ! ЛОЛ КЕК!";
    }
    END_GAME.classList.add("hidden");
    if (questionList.length>=QUESTIONS_PER_GAME) {
      NEXT_QUESTION.classList.remove("hidden");
      NEXT_QUESTION.textContent = "Новая игра";
      newGame = true;
    }
  });


  NEXT_QUESTION.addEventListener('click', () => {

    if (newGame) {
      normalQuestionCurrentCount = 0;
      pointsCurrentCounter = 0;
      POINTS_CURRENT.textContent = pointsCurrentCounter;
      pointsRedCounter = 0;
      POINTS_RED.textContent = pointsRedCounter;
      pointsBlueCounter = 0;
      POINTS_BLUE.textContent = pointsBlueCounter;
      newGame = false;
    }

    if (normalQuestionCurrentCount<NORMAL_QUESTIONS_MAX) {
      getNormalQuestion();
      normalQuestionCurrentCount++;
      console.log(normalQuestionCurrentCount);
      return;
    }

    if (normalQuestionCurrentCount = NORMAL_QUESTIONS_MAX) {
      getFastMoneyQuestion();
    }

    if (questionList.length === 0) {
      NEXT_QUESTION.classList.add("hidden");
    }
  });

  APPEND_TO_RED.addEventListener('click', function () {
    pointsRedCounter += pointsCurrentCounter;
    POINTS_RED.textContent = pointsRedCounter;
    pointsCurrentCounter = 0;
    POINTS_CURRENT.textContent = pointsCurrentCounter;
  });

  APPEND_TO_BLUE.addEventListener('click', function () {
    pointsBlueCounter += pointsCurrentCounter;
    POINTS_BLUE.textContent = pointsBlueCounter;
    pointsCurrentCounter = 0;
    POINTS_CURRENT.textContent = pointsCurrentCounter;
  });
};

fetch('data/data.json').then((response) => {
  return response.json();
}).then((data) => {
  let questions = data;
  console.log(questions);
  feudMachine(questions);
});