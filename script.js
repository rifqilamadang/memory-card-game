const moves = document.getElementById("moves-count");
const timeValue = document.getElementById("time");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const restartButton = document.getElementById("restart");
const gameContainer = document.querySelector(".game-container");
const result = document.querySelector(".result");
const resultMoves = document.getElementById("result-moves");
const resultTime = document.getElementById("result-time");
const winMsg = document.querySelector(".win-msg");
const newGameButton = document.getElementById("new-game");

let cards;
let interval;
let firstCard = false;
let secondCard = false;
let firstCardValue;
let secondCardValue;
let movesCount = 0;
let timeLeft = 0;
let matchedCards = 0;
let disableDeck = false;

const items = [
    { name: "heart", icon: "fas fa-heart" },
    { name: "star", icon: "fas fa-star" },
    { name: "smile", icon: "fas fa-smile" },
    { name: "sun", icon: "fas fa-sun" },
    { name: "moon", icon: "fas fa-moon" },
    { name: "bell", icon: "fas fa-bell" },
    { name: "leaf", icon: "fas fa-leaf" },
    { name: "music", icon: "fas fa-music" },
];

let timeGenerator = () => {
    timeLeft += 1;
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    timeValue.innerHTML = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

let movesCounter = () => {
    movesCount += 1;
    moves.innerHTML = movesCount;
};

const generateRandom = (size = 4) => {
    let tempArray = [...items, ...items];
    let cardValues = [];
    size = (size * size) / 2;
    for (let i = 0; i < size; i++) {
        const randomIndex = Math.floor(Math.random() * tempArray.length);
        cardValues.push(tempArray[randomIndex]);
        tempArray.splice(randomIndex, 1);
    }
    return cardValues;
};

const matrixGenerator = (cardValues, size = 4) => {
    gameContainer.innerHTML = "";
    cardValues = [...cardValues, ...cardValues];
    cardValues.sort(() => Math.random() - 0.5);
    for (let i = 0; i < size * size; i++) {
        gameContainer.innerHTML += `
            <div class="card" data-card-value="${cardValues[i].name}">
                <div class="card-front">
                    <i class="${cardValues[i].icon}"></i>
                </div>
                <div class="card-back">
                    <i class="fas fa-question"></i>
                </div>
            </div>
        `;
    }
    gameContainer.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    cards = document.querySelectorAll(".card");
    cards.forEach((card) => {
        card.addEventListener("click", () => {
            if (!card.classList.contains("matched") && !disableDeck && !card.classList.contains("flipped")) {
                card.classList.add("flipped");
                if (!firstCard) {
                    firstCard = card;
                    firstCardValue = card.getAttribute("data-card-value");
                } else {
                    movesCounter();
                    secondCard = card;
                    secondCardValue = card.getAttribute("data-card-value");
                    disableDeck = true;
                    if (firstCardValue === secondCardValue) {
                        matchedCards++;
                        if (matchedCards === Math.floor(cardValues.length / 2)) {
                            stopGame("Congratulations! You Won!");
                        }
                        firstCard.classList.add("matched");
                        secondCard.classList.add("matched");
                        firstCard = false;
                        disableDeck = false;
                    } else {
                        let [tempFirst, tempSecond] = [firstCard, secondCard];
                        firstCard = false;
                        setTimeout(() => {
                            tempFirst.classList.remove("flipped");
                            tempSecond.classList.remove("flipped");
                            disableDeck = false;
                        }, 900);
                    }
                }
            }
        });
    });
};

startButton.addEventListener("click", () => {
    movesCount = 0;
    timeLeft = 0;
    matchedCards = 0;
    disableDeck = false;
    firstCard = false;
    secondCard = false;
    result.classList.add("hide");
    stopButton.classList.remove("hide");
    startButton.classList.add("hide");
    interval = setInterval(timeGenerator, 1000);
    moves.innerHTML = movesCount;
    initializer();
});

stopButton.addEventListener("click", () => {
    stopGame("Game Stopped!");
});

restartButton.addEventListener("click", () => {
    startButton.click();
});

newGameButton.addEventListener("click", () => {
    startButton.click();
});

const stopGame = (msg) => {
    clearInterval(interval);
    winMsg.innerHTML = msg;
    resultMoves.innerHTML = movesCount;
    resultTime.innerHTML = timeValue.innerHTML;
    result.classList.remove("hide");
    stopButton.classList.add("hide");
    startButton.classList.remove("hide");
};

const initializer = () => {
    let cardValues = generateRandom();
    matrixGenerator(cardValues);
};
