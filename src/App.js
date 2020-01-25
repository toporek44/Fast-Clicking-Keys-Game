// Created and invented by Maciej Topor all rights reserved 2020
// Keyboard Fast Click Game
//Enjoy!

const allKeys = [...document.querySelectorAll(".key")];
const score = document.querySelector(".score__counter");
const rainbowBtn = document.querySelector(".rainbow__switch");
const lifes = [...document.querySelectorAll(".life")];
const playBtn = document.querySelector(".play");
const rankBtn = document.querySelector(".rank");
const menuContainerDiv = document.querySelector(".menu__container");
const containerDiv = document.querySelector(".container");
const startTimerDiv = document.querySelector(".start__timer");
const menuScore = document.querySelector(".menu__score");
const menuText = document.querySelector(".menu__text");
const pauseBtn = document.querySelector(".pause__container");
const unpause = document.querySelector(".unpause");

let scoreHandler = 0;
let rainbowInterval;
let startTimerInterval;
let randomKeyIndex;
let timer = 2000;
let startTimer = 3;
let rainbowFlag = false;
let stopRandIndexFlag = false;
let pauseFlag = true;
let lives = [1, 1, 1];
let randKeyIndexTimeout;
let rmvKeyActiveTimeout;
let checkTimeTimeout;

const Colors = {
  r: 0,
  g: 0,
  b: 0
};

// Couting 3.. 2.. 1.. 0.. fnc

const timerIntervalFnc = () => {
  startTimerInterval = setInterval(() => {
    startTimerDiv.style.opacity = 1;
    if (startTimer === 0) {
      clearInterval(startTimerInterval);
      startTimerDiv.style.opacity = 0;
      setTimeout(() => {
        stopRandIndexFlag = true;
        randKeyIndexFnc();
      }, 500);
    }
    startTimerDiv.textContent = startTimer--;
  }, 1000);
};

const startGame = () => {
  menuContainerDiv.style.transform = "translate(-50%,-200%)";
  containerDiv.style.filter = "blur(0)";
  scoreHandler = 0;
  score.textContent = `Your score: ${scoreHandler}`;
  startTimer = 3;
  timer = 2000;
  lifes.forEach(life => life.classList.remove("life--dead"));
  lives = [1, 1, 1];
  timerIntervalFnc();
};

// timeout that can be paused or resumed

const Timer = function(callback, delay) {
  var timerId,
    start,
    remaining = delay;

  this.pause = function() {
    window.clearTimeout(timerId);
    remaining -= Date.now() - start;
  };

  this.resume = function() {
    start = Date.now();
    window.clearTimeout(timerId);
    timerId = window.setTimeout(callback, remaining);
  };

  this.resume();
};

const pauseGame = () => {
  if (stopRandIndexFlag) {
    containerDiv.style.filter = "blur(4px)";
    unpause.style.visibility = "visible";
    stopRandIndexFlag = false;
    pauseFlag = false;
    rmvKeyActiveTimeout.pause();
    randKeyIndexTimeout.pause();
    checkTimeTimeout.pause();
  }
};

// unpausing the game

const unPause = () => {
  if (!stopRandIndexFlag) {
    containerDiv.style.filter = "blur(0)";
    unpause.style.visibility = "hidden";
    pauseFlag = true;
    stopRandIndexFlag = true;
    rmvKeyActiveTimeout.resume();
    randKeyIndexTimeout.resume();
    checkTimeTimeout.resume();
  }
};

const startStopRainbow = () => {
  if (rainbowFlag) {
    rainbowStop();
    return;
  }
  rainbowBtn.textContent = "OFF";
  rainbowBtn.classList.add("button--active");
  rainbowFlag = true;
  doRainbowInterval();
};

//keyboard rainbow funcion

const doRainbowInterval = () => {
  if (rainbowFlag) {
    Colors.r = Math.floor(Math.random() * 254);
    Colors.g = Math.floor(Math.random() * 254);
    Colors.b = Math.floor(Math.random() * 254);

    allKeys.forEach(key => {
      key.style.background = `rgb(${Colors.r},${Colors.g},${Colors.b})`;
    });
    setTimeout(doRainbowInterval, 1000);
  }
};

// Turning Off rainbow keyboard colors

const rainbowStop = () => {
  rainbowBtn.textContent = "ON";
  rainbowBtn.classList.remove("button--active");
  allKeys.forEach(key => {
    key.style.background = `rgb(${0},${0},${0})`;
  });
  rainbowFlag = false;
};

const checkTime = e => {
  if (allKeys[randomKeyIndex].classList.contains("key--active")) {
    checkTimeTimeout = new Timer(() => {
      if (allKeys[randomKeyIndex].classList.contains("key--active")) {
        renderLives();
      }
    }, timer - 20);
  }
};
const checkLifes = () => {
  if (pauseFlag) {
    if (!lives.includes(1)) {
      rmvKeyActiveTimeout.pause();
      randKeyIndexTimeout.pause();
      checkTimeTimeout.pause();
      menuContainerDiv.style.transform = "translate(-50%,-50%)";
      containerDiv.style.filter = "blur(3px)";
      menuScore.style.visibility = "visible";
      menuText.style.visibility = "visible";
      menuScore.textContent = `Score: ${scoreHandler}`;
      playBtn.textContent = "PLAY AGAIN";
      rankBtn.style.display = "none";
      stopRandIndexFlag = false;
      startTimer = 3;
    }
  }
};

const renderLives = () => {
  lives = lives.map((e, i, a) => {
    if (a[i + 1]) {
      return a[i + 1] == 0 ? 0 : 1;
    } else {
      return 0;
    }
  });
  for (let i = 0; i < lives.length; i++) {
    if (lives[i] == 0) {
      lifes[i].classList.add("life--dead");
    }
  }
};
const randKeyIndexFnc = () => {
  if (stopRandIndexFlag) {
    checkLifes();
    // speed up system
    if (scoreHandler % 5 == 0 && scoreHandler != 0) {
      timer -= 100;
      if (timer === 250) {
        timer = 250;
      }
    }
    // random key index generator
    randomKeyIndex = Math.floor(Math.random() * allKeys.length);
    allKeys[randomKeyIndex].classList.add("key--active");
    rmvKeyActiveTimeout = new Timer(() => {
      allKeys[randomKeyIndex].classList.remove("key--active");
    }, timer - 10);
    checkTime();

    randKeyIndexTimeout = new Timer(randKeyIndexFnc, timer);
  }
};

const pickRandomKey = e => {
  e.preventDefault();
  if (pauseFlag) {
    if (startTimer === -1) {
      const drawnKey = allKeys[randomKeyIndex].dataset.key;
      const pressedCorrectKey = document.querySelector(
        `.key[data-key="${drawnKey}"]`
      );
      const pressedWrongKey = document.querySelector(
        `.key[data-key="${e.keyCode}"]`
      );
      // Adding point to score
      if (drawnKey == e.keyCode) {
        if (!pressedCorrectKey.classList.contains("key--correct")) {
          scoreHandler++;
          score.textContent = `Your score: ${scoreHandler}`;
          pressedCorrectKey.classList.remove("key--active");
        }
      } else {
        // Checking number of lifes
        checkLifes();
        //Taking one life
        renderLives();
        // Removing gold border from key
        allKeys[randomKeyIndex].classList.remove("key--active");
        // Array with keys that contains red border
        const containsClassKeyWrong = allKeys.filter(key =>
          key.classList.contains("key--wrong")
        );
        // showing wrong clicked key with red border
        if (containsClassKeyWrong.length === 0) {
          pressedWrongKey.classList.add("key--wrong");
          setTimeout(() => pressedWrongKey.classList.remove("key--wrong"), 400);
        }
        rainbowBtn.disabled = true;
        rainbowStop();
      }
    }
  }
};

window.addEventListener("keydown", pickRandomKey);
playBtn.addEventListener("click", startGame);
pauseBtn.addEventListener("click", pauseGame);
unpause.addEventListener("click", unPause);
rainbowBtn.addEventListener("click", startStopRainbow);
