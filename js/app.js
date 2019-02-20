/*
 * Create a list that holds all of your cards
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
const htmlDeck = document.getElementsByClassName('deck')[0];
const htmlCards = document.getElementsByClassName('card');
const htmlMoves = document.getElementsByClassName('moves')[0];
const htmlRestartBtn = document.getElementsByClassName('restart')[0];
const htmlStarScore = document.getElementsByClassName("star");
const htmlTimer = document.getElementsByClassName("timer")[0];
const htmlPopup = document.getElementsByClassName("popup")[0];
const htmlPopupMsg = document.getElementsByClassName("popup-message")[0];
const htmlPopupCloseBtn = document.getElementsByClassName("popup-close-btn")[0];
const htmlPopupRestartBtn = document.getElementsByClassName("popup-restart-btn")[0];
let timer = 0;
let matches = 0;
let openedCards = [];
let cardClickListener;
let moves;
let timerInterval;

initialize();

function initialize() {
    resetTimer();
    disableCardsClick();
    resetMoves();
    resetDeck();
    resetStarScore();
    populateDeck();
    showAllCards();
    setTimeout(() => {
        hideAllCards();
        enableCardsClick();
    }, 3000);
}

function resetTimer() {
  timer = 0;
  htmlTimer.innerHTML = formatTime(timer);
}

function startTimer() {
  timerInterval = setInterval(incrementTimer, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function formatTime(seconds) {
  let min = Math.floor(seconds/60);
  let sec = seconds % 60;

  min = min < 10 ? '0' + min : min;
  sec = sec < 10 ? '0' + sec : sec;

  console.log(min, sec);

  return min + ':' + sec;
}

function incrementTimer() {
  timer++;
  htmlTimer.innerHTML = formatTime(timer);
  testTimeOut();
}

function testTimeOut() {
  if (timer === 180) alertGameOver();
}

function alertGameOver() {
  stopTimer();
  popUp("Time out!");
}

function alertWin() {
  stopTimer();
  popUp("You win!");
}

function popUp(message) {
  htmlPopupMsg.innerHTML = message;
  htmlPopup.style.visibility = 'visible';
}

htmlPopupCloseBtn.addEventListener('click', function() {
  htmlPopup.style.visibility = 'hidden';
});

htmlRestartBtn.addEventListener('click', function() {
  htmlPopup.style.visibility = 'hidden';
  initialize();
});

function resetMoves() {
    moves = 0;
    htmlMoves.innerHTML = moves;
}

function resetDeck() {
    for (let i = 0; i < htmlCards.length; i++) {
        htmlCards[i].classList.remove('match', 'open', 'show');
    }
}

function resetStarScore() {
    for (let i = 0; i < htmlStarScore.length; i++) {
        htmlStarScore[i].innerHTML = "<i class='fa fa-star' />"
    }
}

function disableCardsClick() {
    htmlDeck.removeEventListener('click', onCardClick);
}

function enableCardsClick() {
    cardClickListener = htmlDeck.addEventListener('click', onCardClick);
}

function populateDeck() {
    const cardTypes = shuffle(cards);

    for (let i = 0; i < cardTypes.length; i++) {
        populateCard(htmlCards[i], cardTypes[i]);
    }
}

function showAllCards() {
    for (let i = 0; i < htmlCards.length; i++) {
        htmlCards[i].classList.add('show', 'add');
    }
}

function hideAllCards() {
    for (let i = 0; i < htmlCards.length; i++) {
        htmlCards[i].classList.remove('show', 'add');
    }
}

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

function populateCard(card, picture) {
    card.innerHTML = `<i class='fa ${picture}'/></i>`
}

function onCardClick(evt) {
    if (moves === 0) startTimer();

    if (evt.target.classList.contains('card') && openedCards.length < 2) {
        flipCard(evt.target);
        registerOpenedCard(evt.target);
    }
}

function flipCard(card) {
    card.classList.add('open', 'show');
    increaseMoveCounter();
}

function registerOpenedCard(card) {
    openedCards.push(card);

    if (openedCards.length === 2) {
        testCardMatch();
    }
}

function testCardMatch() {
    let cardType1 = openedCards[0].firstElementChild.classList.item(1);
    let cardType2 = openedCards[1].firstElementChild.classList.item(1);

    if (cardType1 === cardType2) matchOpenedCards();
    else closeOpenedCards();
}

function increaseMoveCounter() {
    moves++;
    setStarScore();
    htmlMoves.innerHTML = moves;
}

function matchOpenedCards() {
    setTimeout(() => {
        openedCards[0].classList.add('match');
        openedCards[1].classList.add('match');
        incrementMatches();
        openedCards = [];
    }, 320);
}

function incrementMatches() {
  matches++;
  if (matches === 8) alertWin();
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

function setStarScore() {
    if (moves > 16) htmlStarScore[2].innerHTML = "";
    if (moves > 32) htmlStarScore[1].innerHTML = "";
    if (moves > 48) htmlStarScore[0].innerHTML = "";
}

htmlRestartBtn.addEventListener('click', evt => {
    initialize();
});