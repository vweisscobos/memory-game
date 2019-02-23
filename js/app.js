/*
 * Create a list that holds all cards
 */
const cards = [
    'fa-diamond',
    'fa-diamond',
    'fa-paper-plane-o',
    'fa-paper-plane-o',
    'fa-anchor',
    'fa-anchor',
    'fa-bolt',
    'fa-bolt',
    'fa-cube',
    'fa-cube',
    'fa-leaf',
    'fa-leaf',
    'fa-bicycle',
    'fa-bicycle',
    'fa-bomb',
    'fa-bomb'
];

//  create references to all html elements we need to handle with
const htmlDeck = document.getElementsByClassName('deck')[0];
const htmlCards = document.getElementsByClassName('card');
const htmlMoves = document.getElementsByClassName('moves')[0];
const htmlRestartBtn = document.getElementsByClassName('restart')[0];
const htmlStarRating = document.getElementsByClassName("star");
const htmlScorePanel = document.getElementsByClassName("score-panel")[0];
const htmlTimer = document.getElementsByClassName("timer")[0];
const htmlPopup = document.getElementsByClassName("popup")[0];
const htmlPopupMsg = document.getElementsByClassName("popup-message")[0];
const htmlPopupCloseBtn = document.getElementsByClassName("popup-close-btn")[0];
const htmlPopupRestartBtn = document.getElementsByClassName("popup-restart-btn")[0];
const htmlPopupStarRating = document.getElementsByClassName("popup-star-rating")[0];
const htmlPopupTime = document.getElementsByClassName("popup-time")[0];
const htmlPopupMoves = document.getElementsByClassName("popup-moves")[0];

const MOVES_TO_ZERO_STARS = 36;
const MOVES_TO_ONE_STARS = 28;
const MOVES_TO_TWO_STARS = 20;
const MEMORIZATION_TIME = 5000;
const GAME_DURATION = 90;

let timer = GAME_DURATION;
let matches = 0;
let openedCards = [];
let cardClickListener;
let moves;
let timerInterval;

initialize();

htmlPopupCloseBtn.addEventListener('click', () => {
  htmlPopup.style.visibility = 'hidden';
});

htmlPopupRestartBtn.addEventListener('click', () => {
  htmlPopup.style.visibility = 'hidden';
  initialize();
});

htmlRestartBtn.addEventListener('click', () => {
  initialize();
});

//  Set and reset game functions

function initialize() {
  resetTimer();
  resetMatches();
  resetOpenedCards();
  disableCardsClickHandler();
  resetMoves();
  resetDeck();
  resetStarRating();
  populateDeck();
  revealAllCards();
  setTimeout(() => {
    hideAllCards();
    enableCardsClickHandler();
  }, MEMORIZATION_TIME);
}

function resetTimer() {
  timer = GAME_DURATION;
  htmlTimer.innerHTML = formatTime(timer);
  stopTimer();
}

function resetOpenedCards() {
  openedCards = [];
}

function startTimer() {
  timerInterval = setInterval(decrementTimer, 1000);
}

function resetMatches() {
  matches = 0;
}

function stopTimer() {
  clearInterval(timerInterval);
}

function resetDeck() {
  for (let i = 0; i < htmlCards.length; i++) {
    htmlCards[i].classList.remove('match', 'open', 'show');
  }
}

function resetStarRating() {
  for (let i = 0; i < htmlStarRating.length; i++) {
    htmlStarRating[i].innerHTML = "<i class='fa fa-star' />"
  }
}

function resetMoves() {
  moves = 0;
  htmlMoves.innerHTML = moves || 0;
}

function populateDeck() {
  const cardTypes = shuffle(cards);

  for (let i = 0; i < cardTypes.length; i++) {
    populateCard(htmlCards[i], cardTypes[i]);
  }
}

function populateCard(card, picture) {
  card.innerHTML = `<i class='fa ${picture}'/></i>`
}

//  game behavior functions

function incrementMatches() {
  matches++;
  if (matches === 8) alertWin();
}

function decrementTimer() {
  if (timer > 0) timer--;
  else alertGameOver();
  htmlTimer.innerHTML = formatTime(timer);
}

function alertGameOver() {
  stopTimer();
  htmlPopupMsg.innerHTML = "<h2>You Loose! Time out!</h2>";
  htmlPopupStarRating.innerHTML = "";
  htmlPopupMoves.innerHTML = "";
  htmlPopupTime.innerHTML = "";
  htmlPopup.style.visibility = 'visible';
}

function alertWin() {
  let starRating = new Array(htmlScorePanel.getElementsByClassName('fa-star').length).fill(1);

  stopTimer();
  htmlPopupMsg.innerHTML = "<h2>You Won!</h2>";
  htmlPopupStarRating.innerHTML = starRating.reduce((acc) => {
    return acc + "<span class='star'><i class='fa fa-star'></i></span>"
  }, '');
  htmlPopupMoves.innerHTML = moves + ' moves';
  htmlPopupTime.innerHTML = 90 - timer + ' seconds';
  htmlPopup.style.visibility = 'visible';
}

function increaseMoveCounter() {
  moves++;
  updateStarRating();
  htmlMoves.innerHTML = moves;
}

function updateStarRating() {
  if (moves === MOVES_TO_TWO_STARS) htmlStarRating[2].innerHTML = "";
  if (moves === MOVES_TO_ONE_STARS) htmlStarRating[1].innerHTML = "";
  if (moves === MOVES_TO_ZERO_STARS) htmlStarRating[0].innerHTML = "";
}

//  cards behavior functions

function disableCardsClickHandler() {
    htmlDeck.removeEventListener('click', onCardClick);
}

function enableCardsClickHandler() {
    cardClickListener = htmlDeck.addEventListener('click', onCardClick);
}

function revealAllCards() {
    for (let i = 0; i < htmlCards.length; i++) {
        htmlCards[i].classList.add('show', 'add');
    }
}

function hideAllCards() {
    for (let i = 0; i < htmlCards.length; i++) {
        htmlCards[i].classList.remove('show', 'add');
    }
}

function onCardClick(evt) {
  if (!evt.target.classList.contains("card")) return; //  secure that just cards propagate click events
  if (moves === 0) startTimer();  //  if none card was revealed yet, initialize timer
  if (openedCards[0] && openedCards[0] === evt.target) return;  //  prevent register the same card as revealed twice
  if (evt.target.classList.contains('match')) return; //  prevent matched cards to be register as revealed
  if (openedCards.length < 2) {
    revealCard(evt.target);
    registerRevealedCard(evt.target);
  }
}

function revealCard(card) {
  card.classList.add('open', 'show');
  increaseMoveCounter();
}

function closeOpenedCards() {
  setTimeout(() => {
    openedCards[0].classList.add('unmatch');
    openedCards[1].classList.add('unmatch');
  }, 320);

  setTimeout(() => {
    openedCards[0].classList.remove('open', 'show', 'unmatch');
    openedCards[1].classList.remove('open', 'show', 'unmatch');
    openedCards = [];
  }, 1000);
}

//  helper functions
function formatTime(seconds) {
  let min = Math.floor(seconds/60);
  let sec = seconds % 60;

  min = min < 10 ? '0' + min : min;
  sec = sec < 10 ? '0' + sec : sec;

  return min + ':' + sec;
}

function registerRevealedCard(card) {
  openedCards.push(card);

  if (openedCards.length === 2) {
    testCardMatch();
  }
}

function testCardMatch() {
  let cardType1 = openedCards[0].firstElementChild.classList.item(1);
  let cardType2 = openedCards[1].firstElementChild.classList.item(1);

  if (cardType1 === cardType2) matchRevealedCards();
  else closeOpenedCards();
}

function matchRevealedCards() {
  setTimeout(() => {
    openedCards[0].classList.add('match');
    openedCards[1].classList.add('match');
    incrementMatches();
    openedCards = [];
  }, 320);
}

// Shuffle a given array
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