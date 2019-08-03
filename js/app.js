/*
 *Creating an array called allCards to hold all the damn cards!
 *Using only document.querySelectorAll() returns a NodeList
 *putting that inside array-braces creates an array with a single element which is the NodeList
 *using the ... prefix transfers the NodeList into individual items in the array.
 */
let allCards = [ ...document.querySelectorAll('.deck li') ];

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// createHTML to shuffle and reset cards
function shuffleAndResetHTML() {
	// create array of existing cards from the present deck
	let allCards = [ ...document.querySelectorAll('.deck li') ];

	// shuffle it
	let shuffledCards = shuffle(allCards);

	// convert it into HTML to display it
	let newDeck = shuffledCards[0].outerHTML;
	shuffledCards.forEach(function(el, index) {
		if (index < 1) return;
		newDeck += `${el.outerHTML}`;
	});
	document.querySelector('.deck').innerHTML = newDeck;

	// turn cards OFF
	resetCards();
}

// reset cards in the existing deck
function resetCards() {
	let cardsToReset = [ ...document.querySelectorAll('.deck li') ];
	cardsToReset.forEach(function(el) {
		el.classList.remove('open', 'show', 'match');
	});
}

//function to show all cards in the existing deck
function showAllCards() {
	let cardsToShow = [ ...document.querySelectorAll('.deck li') ];
	cardsToShow.forEach(function(el) {
		el.classList.add('show', 'open');
	});
}

// show clicked card
var clickedCard = [];
function showClickedCard(evt) {
	clickedCard.push(evt.target);
	console.log(clickedCard);
	if (clickedCard.length <= 2) {
		clickedCard[`${clickedCard.length - 1}`].classList.add('show', 'open');
	} else if (clickedCard.length > 2) {
		timeOut();
		clickedCard = [];
	}
}
function timeOut() {
	console.log(clickedCard);
	clickedCard[0].classList.remove('show', 'open');
	clickedCard[1].classList.remove('show', 'open');
}

shuffleAndResetHTML();
setTimeout(showAllCards, 2000);
setTimeout(resetCards, 5000);
var listenForClicks = document.querySelectorAll('.deck li:not(.show):not(.open):not(.match)');
listenForClicks.forEach(function(el) {
	el.addEventListener('click', showClickedCard);
});

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
	var currentIndex = array.length,
		temporaryValue,
		randomIndex;

	while (currentIndex !== 0) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
