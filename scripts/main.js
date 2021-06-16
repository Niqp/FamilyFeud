const getRandomInteger = (min, max) => {
  if (min >= max) {
    return max;
  }
  if (min < 0 || max < 0) {
    throw new Error("Ошибка: отрицательные значения не принимаются!");
  }
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const feudMachine = (questions) => {
  const CURRENT_QUESTION = document.querySelector(".currentQuestion");
  const NEXT_QUESTION = document.querySelector(".nextQuestion");
  const FAST_MONEY_NEXT = document.querySelector(".fastMoneyNextQuestion");
  NEXT_QUESTION.classList.remove("hidden");

  const ANSWER_TEMPLATE = document.querySelector("#answer-template").content;
  const FAST_MONEY_TEMPLATE = document.querySelector(
    "#fastMoney-template"
  ).content;
  const FAST_MONEY_ANSWERS_TEMPLATE = document.querySelector(
    "#fastMoneyAnswers-template"
  ).content;
  const ANSWERS = document.querySelector(".answers");

  const NORMAL_QUESTIONS_MAX = 3;
  const FAST_MONEY_MAX = 5;
  const FAST_MONEY_PLAYERS = 2;
  const FAST_MONEY_TIMER = 15; //in seconds
  const REGULAR_TIMER = 30;
  const QUESTIONS_PER_GAME = 8;
  const TIME_PER_LETTER = 100; //in ms
  const POINTS_CURRENT = document.querySelector(".pointsCurrent");
  const POINTS_RED = document.querySelector(".pointsRed");
  const POINTS_BLUE = document.querySelector(".pointsBlue");
  const APPEND_TO_RED = document.querySelector(".appendToRed");
  const APPEND_TO_BLUE = document.querySelector(".appendToBlue");
  const END_GAME = document.querySelector(".endGame");

  const CROSSES = document.querySelectorAll(".cross");
  const REMOVE_CROSS = document.querySelector(".removeCross");

  const CURRENT_TEAM_COLOR = document.querySelector(".currentColor");
  const DETERMINE_CURRENT_TEAM = document.querySelector(".determineTeam");
  const WRONG_SOUND = new Audio(window.location.href + "/sound/wrong.mp3");

  let pointsBlueCounter = 0;
  let pointsRedCounter = 0;
  let pointsCurrentCounter = 0;
  let currentPlayer = 0;
  let newGame = true;
  let crossDefaultCount = 3;
  let chosenTeam = 0;
  let answerInput = 0;
  let timer = 0;
  let timerId = 0;
  let isPlayerChosen = 0;
  let fastMoneyRedScore = 0;
  let fastMoneyBlueScore = 0;

  let normalQuestionCurrentCount = 0;
  let fastMoneyCurrentCount = 0;

  let questionList = Object.keys(questions.questionList);

  const getRandomQuestion = () => {
    const randomSeed = getRandomInteger(0, questionList.length - 1);
    let selectedQuestion = questionList[randomSeed];
    questionList.splice(randomSeed, 1);
    return selectedQuestion;
  };

  const printQuestion = (text,container) => {
    let index = 0;
    const printLetter = () => {
      if (index < text.length) {
        if (isPlayerChosen === 0) {
          let char = text[index];
          container.append(char);
          index++;
          }
        timer = setTimeout(printLetter, TIME_PER_LETTER);
      }
    };
    printLetter();
  };

  const getNormalQuestion = () => {
    let randomQuestion = getRandomQuestion();
    console.log(questionList.length);
    crossDefaultCount = 3;
    CROSSES.forEach((value) => (value.style.opacity = 0.5));
    let questionSelected = questions.questionList[randomQuestion];
    CURRENT_QUESTION.textContent = '';
    printQuestion(questionSelected.Question,CURRENT_QUESTION);
    ANSWERS.textContent = "";
    questionSelected.Answers.forEach((_, index) => {
      let clonedTemplate = ANSWER_TEMPLATE.cloneNode(true);
      let answerText = clonedTemplate.querySelector(".answerText");
      let answerPoints = clonedTemplate.querySelector(".answerPoints");
      let answerButton = clonedTemplate.querySelector(".answerButton");

      answerText.textContent = "---";
      answerPoints.textContent = "---";

      answerButton.addEventListener("click", function () {
        answerText.textContent = questionSelected.Answers[index].Answer;
        answerPoints.textContent = questionSelected.Answers[index].Points;
        if (normalQuestionCurrentCount<=1) {
          pointsCurrentCounter += Number(questionSelected.Answers[index].Points);
        }
        if (normalQuestionCurrentCount>1) {
          pointsCurrentCounter += Number(questionSelected.Answers[index].Points)*2;
        }
        POINTS_CURRENT.textContent = pointsCurrentCounter;

        answerButton.classList.add("hidden");
      });
      ANSWERS.appendChild(clonedTemplate);
    });
    pointsCurrentCounter = 0;
    POINTS_CURRENT.textContent = pointsCurrentCounter;
  };

  const getFastMoneyQuestion = () => {
    pointsRedCounter >= pointsBlueCounter ? (chosenTeam = 1) : (chosenTeam = 2);
    currentPlayer = 0;
    fastMoneyCurrentCount = 0;
    CROSSES.forEach((value) => (value.style.opacity = 1));
    console.log("Первой играет команда" + chosenTeam);
    const randomQuestionPool = new Array(FAST_MONEY_MAX)
      .fill("")
      .map(() => questions.questionList[getRandomQuestion()]);
    console.log(randomQuestionPool);
    console.log(questionList.length);
    let playerAnswers = new Array(FAST_MONEY_PLAYERS).fill(null).map(() => []);
    NEXT_QUESTION.classList.add("hidden");
    FAST_MONEY_NEXT.classList.remove("hidden");

    let clonedTemplate = FAST_MONEY_TEMPLATE.cloneNode(true);
    answerInput = clonedTemplate.querySelector(".fastMoneyAnswer");
    let timer = clonedTemplate.querySelector(".timer");
    timerId = 0;

    const addNewQuestion = () => {
      clonedTemplate = FAST_MONEY_TEMPLATE.cloneNode(true);
      answerInput = clonedTemplate.querySelector(".fastMoneyAnswer");
      timer = clonedTemplate.querySelector(".timer");
      console.log("Счетчик " + fastMoneyCurrentCount);
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
          fastMoneyNext();
        }
      }, 1000);

      answerInput.addEventListener("keydown", (evt) => {
        if (evt.code === "Enter") {
          fastMoneyNext();
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

      playerAnswers[0].forEach((value, index) => {
        const currentIndex = index;
        const questionBlock = document.createElement("div");
        questionBlock.className = "questionBlock";
        questionBlock.textContent = randomQuestionPool[index].Question;
        playersBlock.append(questionBlock);
        const answerBlock = document.createElement("div");
        answerBlock.className = "answerBlock";
        playersBlock.append(answerBlock);
        playerAnswers.forEach((value, index) => {
          const clonedTemplate = FAST_MONEY_ANSWERS_TEMPLATE.cloneNode(true);
          const answer = clonedTemplate.querySelector(".answerText");
          answer.textContent = playerAnswers[index][currentIndex];
          if (chosenTeam === 1) {
            if (index === 0) {
              answer.classList.add("redColor");
            }
            if (index === 1) {
              answer.classList.add("blueColor");
            }
          }
          if (chosenTeam === 2) {
            if (index === 0) {
              answer.classList.add("blueColor");
            }
            if (index === 1) {
              answer.classList.add("redColor");
            }
          }
          answerBlock.appendChild(clonedTemplate);
        });
        const revealButton = document.createElement("button");
        revealButton.className = "revealButton";
        const answers = answerBlock.querySelectorAll(".fastMoneyPoints");
        console.log(answers);
        revealButton.addEventListener("click", () => {
          answers.forEach((value) => {
            value.type = "text";
          });
          if (chosenTeam === 1) {
            fastMoneyRedScore += (parseInt(answers[0].value))*3;
            pointsRedCounter += fastMoneyRedScore;
            POINTS_RED.textContent = pointsRedCounter;
            fastMoneyBlueScore += (parseInt(answers[1].value))*3;
            pointsBlueCounter += fastMoneyBlueScore;
            POINTS_BLUE.textContent = pointsBlueCounter;
            fastMoneyRedScore = 0;
            fastMoneyBlueScore = 0;
          }
          if (chosenTeam === 2) {
            fastMoneyRedScore += (parseInt(answers[1].value))*3;
            pointsRedCounter += fastMoneyRedScore;
            POINTS_RED.textContent = pointsRedCounter;
            fastMoneyBlueScore += (parseInt(answers[0].value))*3;
            pointsBlueCounter += fastMoneyBlueScore;
            POINTS_BLUE.textContent = pointsBlueCounter;
            fastMoneyRedScore = 0;
            fastMoneyBlueScore = 0;
          }
        });
        answerBlock.append(revealButton);
      });
    };

    const checkQuestion = () => {
      if (fastMoneyCurrentCount < FAST_MONEY_MAX) {
        addNewQuestion();
      }
      if (fastMoneyCurrentCount === FAST_MONEY_MAX) {
        currentPlayer++;
        fastMoneyCurrentCount = 0;
        if (currentPlayer === FAST_MONEY_PLAYERS) {
          getFastMoneyAnswers();
          FAST_MONEY_NEXT.classList.add("hidden");
          FAST_MONEY_NEXT.removeEventListener("click", fastMoneyNext);
          END_GAME.classList.remove("hidden");
          return;
        }
        ANSWERS.textContent = "";
        CURRENT_QUESTION.textContent = "Отвечает следующая команда";
        FAST_MONEY_NEXT.removeEventListener("click", fastMoneyNext);
        FAST_MONEY_NEXT.addEventListener("click", nextPlayer);
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

    function nextPlayer() {
      checkQuestion();
      FAST_MONEY_NEXT.removeEventListener("click", nextPlayer);
      FAST_MONEY_NEXT.addEventListener("click", fastMoneyNext);
    }

    FAST_MONEY_NEXT.addEventListener("click", fastMoneyNext);
  };

  END_GAME.addEventListener("click", () => {
    ANSWERS.textContent = "";
    console.log(pointsBlueCounter);
    console.log(pointsRedCounter);
    if (pointsBlueCounter > pointsRedCounter) {
      CURRENT_QUESTION.textContent = "Победила СИНЯЯ команда!";
    }
    if (pointsRedCounter > pointsBlueCounter) {
      CURRENT_QUESTION.textContent = "Победила КРАСНАЯ команда!";
    }
    if (pointsBlueCounter === pointsRedCounter) {
      CURRENT_QUESTION.textContent = "НИЧЬЯ! ЛОЛ КЕК!";
    }
    END_GAME.classList.add("hidden");
    if (questionList.length >= QUESTIONS_PER_GAME) {
      NEXT_QUESTION.classList.remove("hidden");
      NEXT_QUESTION.textContent = "Новая игра";
      newGame = true;
    }
  });

  NEXT_QUESTION.addEventListener("click", () => {
    if (newGame) {
      normalQuestionCurrentCount = 0;
      pointsCurrentCounter = 0;
      POINTS_CURRENT.textContent = pointsCurrentCounter;
      pointsRedCounter = 0;
      POINTS_RED.textContent = pointsRedCounter;
      pointsBlueCounter = 0;
      POINTS_BLUE.textContent = pointsBlueCounter;
      newGame = false;
      NEXT_QUESTION.textContent = "Следующий вопрос";
    }

    if (normalQuestionCurrentCount < NORMAL_QUESTIONS_MAX) {
      clearTimeout(timer);
      NEXT_QUESTION.blur();
      getNormalQuestion();
      normalQuestionCurrentCount++;
      if (normalQuestionCurrentCount === NORMAL_QUESTIONS_MAX) {
        NEXT_QUESTION.textContent = "Начать Fast Money";
      }
      console.log(normalQuestionCurrentCount);
      return;
    }

    if ((normalQuestionCurrentCount = NORMAL_QUESTIONS_MAX)) {
      clearTimeout(timer);
      getFastMoneyQuestion();
    }
  });

  APPEND_TO_RED.addEventListener("click", function () {
    pointsRedCounter += pointsCurrentCounter;
    POINTS_RED.textContent = pointsRedCounter;
    pointsCurrentCounter = 0;
    POINTS_CURRENT.textContent = pointsCurrentCounter;
  });

  APPEND_TO_BLUE.addEventListener("click", function () {
    pointsBlueCounter += pointsCurrentCounter;
    POINTS_BLUE.textContent = pointsBlueCounter;
    pointsCurrentCounter = 0;
    POINTS_CURRENT.textContent = pointsCurrentCounter;
  });

  const crossRemover = () => {
    crossDefaultCount--;
    WRONG_SOUND.play();
    if (answerInput) {
      answerInput.focus();
    }
    if (crossDefaultCount >= 0) {
      CROSSES[crossDefaultCount].style.opacity = 1;
    }
  };

  REMOVE_CROSS.addEventListener("click", crossRemover);

  document.addEventListener('keydown', (evt) => {
    if (evt.code === "Space") {
      crossRemover();
    }
  });

  DETERMINE_CURRENT_TEAM.addEventListener("click", function determine() {
    let currentTimer = REGULAR_TIMER;
    DETERMINE_CURRENT_TEAM.textContent = "Определяю...";
    CURRENT_TEAM_COLOR.style.backgroundColor = "white";
    CURRENT_TEAM_COLOR.textContent = currentTimer;
    if (timerId !== 0) {
      clearInterval(timerId);
    }

    const startTimer = () => {
      isPlayerChosen = 1;
      DETERMINE_CURRENT_TEAM.textContent = "Остановить таймер";
      DETERMINE_CURRENT_TEAM.removeEventListener("click", determine);
      function stopTimer() {
        clearInterval(timerId);
        DETERMINE_CURRENT_TEAM.removeEventListener("click", stopTimer);
        DETERMINE_CURRENT_TEAM.textContent = "Отвечающая команда";
        DETERMINE_CURRENT_TEAM.addEventListener("click", determine);
        CURRENT_TEAM_COLOR.textContent = "";
        isPlayerChosen = 0
      }
      DETERMINE_CURRENT_TEAM.addEventListener("click", stopTimer);
      timerId = setInterval(() => {
        currentTimer--;
        CURRENT_TEAM_COLOR.textContent = currentTimer;
        if (currentTimer <= 0) {
          clearInterval(timerId);
          WRONG_SOUND.play();
          stopTimer();
        }
      }, 1000);
    };

    document.addEventListener("keydown", function listener(evt) {
      DETERMINE_CURRENT_TEAM.blur();
      if (evt.code === "ControlLeft") {
        CURRENT_TEAM_COLOR.style.backgroundColor = "red";
        document.removeEventListener("keydown", listener);
        startTimer();
        return;
      }
      if (evt.code === "NumpadEnter") {
        CURRENT_TEAM_COLOR.style.backgroundColor = "blue";
        document.removeEventListener("keydown", listener);
        startTimer();
        return;
      }
      document.removeEventListener("keydown", listener);
      DETERMINE_CURRENT_TEAM.textContent = "Отвечающая команда";
      CURRENT_TEAM_COLOR.textContent = "";
    });
  });
};

fetch(window.location.href + "/data/data.json")
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    let questions = data;
    console.log(questions);
    feudMachine(questions);
  });
