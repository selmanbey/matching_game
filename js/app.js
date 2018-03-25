/******************************************************************************
                         CONSTANTS AND VARIABLES
*******************************************************************************/

const startButton = document.querySelector(".start-button");
const restartButton = document.querySelector(".restart");
const deckUl = document.querySelector(".deck");
const starsUl = document.querySelector(".stars")
const guessCounter = document.querySelector(".guesses");
const timeCounter = document.querySelector(".time");
const gameOnDiv = document.querySelector(".gameon");
const gameOverDiv = document.querySelector(".gameover");
const guessResult = document.querySelector(".guess-result");
const starResult = document.querySelector(".star-result");
const timeResult = document.querySelector(".time-result");
const replayButton = document.querySelector(".replay");

let cards = ["fa-diamond", "fa-diamond", "fa-paper-plane-o", "fa-paper-plane-o",
"fa-anchor", "fa-anchor", "fa-bolt", "fa-bolt", "fa-cube", "fa-cube", "fa-leaf",
"fa-leaf", "fa-bicycle", "fa-bicycle", "fa-bomb", "fa-bomb"]
let correctlyGuessedCards = 0; // to determine when the game ends
let clickCount = 0; // to keep track of the first and second clicks in a guess
let totalGuesses = 0; /* to keep track of how much guess it takes the player
                         to finish the game */
let card1 = null; // to temporarily save the first clicked card in a guess
let card2 = null; // to temporarily save the second clicked card in a guess
let TimeoutID; /* to let the player see the cards for a bit while in incorrect
                  guesses, before they are turned down */
let gameStartTime;
let gameFinishTime;
let gameTime; // to keep a timer for each game

let screenTimer; // to display a timer in screen


/******************************************************************************
                              FUNCTIONS
*******************************************************************************/


// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

function setStartTime() {
  gameStartTime = Date.now()
  return gameStartTime
}

function stopStartTime() {
  gameFinishTime = Date.now()
  return gameFinishTime
}

function startTheGame(startButton) {
  startButton.style.display = "none";
  createDeck(cards, deckUl);
  gameStartTime = setStartTime()
  screenTimer = setInterval(function(){
    displayTime(gameStartTime)
  }, 1000);
};

function restartTheStarRating(starsUl) {
  starsUl.innerHTML = ""
  let starLi = `<li><i class="fa fa-star"></i></li>`
  for(let i = 0; i < 5; i++) {
    starsUl.innerHTML += starLi;
  }
};

function restartTheGame(deckUl) {
  // clears the old deck
  while(deckUl.firstChild) {
    deckUl.removeChild(deckUl.firstChild);
  };
  // creates a new deck and refreshes the game variables
  createDeck(cards, deckUl);
  correctlyGuessedCards = 0;
  clickCount = 0;
  totalGuesses = 0;
  guessCounter.textContent = totalGuesses;
  card1 = null;
  card2 = null;
  TimeoutID;
  restartTheStarRating(starsUl);
  gameStartTime = setStartTime();
}

function createACard(classname) {
  // creates a li element with a given classname (a card in the game)
  // a function to be used in createDeck() function
  let li = document.createElement("li");
  let i = document.createElement("i");
  li.classList.add("card");
  i.classList.add("fa", classname);
  li.innerHTML = i.outerHTML;
  return li;
};

function createDeck(cards, deckUl) {
  // creates a new deck and adds it to DOM
  cards = shuffle(cards);
  let deck = document.createDocumentFragment();
  for (card of cards) {
    li = createACard(card);
    deck.appendChild(li);
  };
  deckUl.appendChild(deck);
}

function displayCard(card) {
  card.classList.toggle("show")
  card.classList.toggle("open")
};

function turnDownCards(card1, card2) {
  card1.classList.toggle("open");
  card1.classList.toggle("show");
  card2.classList.toggle("open");
  card2.classList.toggle("show");
};

function checkMatch(card1, card2) {
  if (card1.innerHTML == card2.innerHTML) {
    card1.classList.toggle("match");
    card2.classList.toggle("match");
    correctlyGuessedCards += 2;
    clickCount = 0;
  } else {
    TimeoutID = window.setTimeout(function() {
      turnDownCards(card1, card2);
      clickCount = 0;
    }, 500)
  }
};

function updateStars(totalGuesses, starsUl) {
  switch(totalGuesses) {
    case 15:
      starsUl.removeChild(starsUl.firstElementChild)
      break;
    case 19:
      starsUl.removeChild(starsUl.firstElementChild)
      break;
    case 26:
      starsUl.removeChild(starsUl.firstElementChild)
      break;
    case 30:
      starsUl.removeChild(starsUl.firstElementChild)
      break;
    case 35:
      starsUl.removeChild(starsUl.firstElementChild)
      break;
  }
}

function showGuessResult(guessResult, totalGuesses) {
  guessResult.textContent = totalGuesses;
}

function showStarResult(starResult, starsUl) {
  starResult.innerHTML = starsUl.innerHTML;
  //To style the li elements properly
  let childNodes = starResult.childNodes
  for (child of childNodes) {
    if (child.nodeName == "LI") {
      child.style.cssText = "list-style: none; display: inline-block";
    }
  }
  // to make the string grammatically correct: "X star(s)" or "no stars"
  let numberOfStars = starsUl.childElementCount;
  if (numberOfStars > 1) {
    starResult.innerHTML += "stars";
  } else if (numberOfStars == 1) {
    starResult.innerHTML += "star";
  } else {
    starResult.textContent = "no stars";
  };
}

function showTimeResult(timeResult, gameTime) {
  timeResult.textContent = gameTime;
}

function gameOver() {
  gameOnDiv.style.display = "none";
  gameFinishTime = stopStartTime();
  gameTime = calculateGameTime();
  showGuessResult(guessResult, totalGuesses);
  showStarResult(starResult, starsUl);
  showTimeResult(timeResult, gameTime);
  gameOverDiv.style.display = "block";
}

function checkEndGame() {
  if (correctlyGuessedCards == 16) {
    gameOver();
  }
}

function calculateGameTime() {
  let totalGameTime = gameFinishTime - gameStartTime;
  let minutes = Math.floor(totalGameTime / 60000);
  let seconds = Math.floor((totalGameTime % 60000) / 1000);
  return `${(minutes < 10) ? ("0" + minutes) : minutes}:${(seconds < 10) ? ("0" + seconds) : seconds}`
}

function displayTime(gameStartTime) {
  let now = Date.now();
  let passedTime = now - gameStartTime;
  let minutes = Math.floor(passedTime / 60000);
  let seconds = Math.floor((passedTime % 60000) / 1000);
  passedTime = `${(minutes < 10) ? ("0" + minutes) : minutes}:${(seconds < 10) ? ("0" + seconds) : seconds}`;
  timeCounter.textContent = passedTime;
}

// function setTimer() {
//   let timer = setInterval(function(){
//     displayTime(gameStartTime)
//   }, 1000);
//   return timer
// }


/******************************************************************************
                         EVENT LISTENERS
*******************************************************************************/


restartButton.addEventListener("click", function() {
  restartTheGame(deckUl);
});

deckUl.addEventListener("click", function(event) {
  if(event.target.classList.contains("deck")) {
    /* this is to make sure that nothing happens when an empty
    section of the deck (that is, the blanks between cards) is clicked
    */
  } else if (event.target.classList.contains("start-button")) {
    // this is only for the start button in the very beginning of the game
    startTheGame(startButton);
  } else {
    clickCount += 1;
    if (clickCount == 1) { // if it's the first click in a guess
      displayCard(event.target); //displays the clicked card
      card1 = event.target; // remembers the first card
    } else if (clickCount == 2) { // if it's the second click in a guess
      displayCard(event.target); // displays the second card
      card2 = event.target; // registers the second card
      checkMatch(card1, card2);   /* checks if the first clicked card matches
                                  with the second clicked card */
      totalGuesses += 1 // updates the number of guesses
      guessCounter.textContent = totalGuesses; // updates the page accordingly
      updateStars(totalGuesses, starsUl)   // updates the star rating
      checkEndGame(); // checks if all the cards are correctly guessed or not
    };
  };
});

replayButton.addEventListener("click", function() {
  gameOverDiv.style.display = "none";
  gameOnDiv.style.display = "flex";
  restartTheGame(deckUl);
});


/******************************************************************************
                            INITIAL SETTING
*******************************************************************************/

// createDeck(cards, deckUl);
