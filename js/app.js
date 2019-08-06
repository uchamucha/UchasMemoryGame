/*
 *Creating an array called allCards to hold all the cards!
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
function gameStart() {
	// create card array using existing deck
	let allCards = [ ...document.querySelectorAll('.deck li') ];

	// shuffle it
	let shuffledCards = shuffle(allCards);

	// construct HTML string of shuffled cards
	let newDeck = shuffledCards[0].outerHTML; //to add the first element
	shuffledCards.forEach(function(el, index) {
		if (index < 1) return; //to skip the first element because we already added it
		newDeck += `${el.outerHTML}`;
	});

	// Update DOM with shuffled cards
	document.querySelector('.deck').innerHTML = newDeck;

	// turn cards OFF
	resetCards();
}

gameStart();
setTimeout(showAllCards, 800);
setTimeout(resetCards, 7000);

let listenForClicks = document.querySelectorAll('.deck li:not(.show):not(.open):not(.match)');
listenForClicks.forEach(function(el) {
	el.addEventListener('click', gameLogic);
});

// reset the existing deck
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

// main game logic
let saveStarArray = [];
saveStarArray = document.querySelectorAll('.stars li');
var saveStarHTML = saveStarArray[0].outerHTML;
saveStarArray.forEach(function(el, index) {
	if (index < 1) return;
	saveStarHTML += el.outerHTML;
});

let movesInnertext = document.querySelector('.moves');
movesInnertext.textContent = 0;
var moves = 0;

//declaring global varisables for main game logic
var clickedCard = [];
var cardsMatched = [];

//main game logic
function gameLogic(evt) {
	clickedCard.push(evt.target); // store clicked li element into an aray
	console.log(clickedCard);

	// loops for two clicks
	if (clickedCard.length <= 2) {
		// remove eventlistener to prevent registering further clicks
		clickedCard[`${clickedCard.length - 1}`].removeEventListener('click', gameLogic);
		// reveal clicked card
		clickedCard[`${clickedCard.length - 1}`].classList.add('show', 'open');
	}

	// initiate comparison logic at second click
	if (clickedCard.length === 2) {
		//feeds li's inner HTML (which contains i element and its classes) into variables
		let cList1 = clickedCard[0].innerHTML;
		let cList2 = clickedCard[1].innerHTML;

		console.log(cList1, cList2);
		// comparison logic
		if (cList1 === cList2) {
			console.log('true');
			//add matched colour class
			clickedCard[0].classList.add('match');
			clickedCard[1].classList.add('match');
			clickedCard = []; //reset clickedCard array to initiate next cycle
			cardsMatched.push(1); //push 1 into cardsMatched to register a match count

			//logic if all cards match
			if (cardsMatched.length === 8) {
				cardsMatched = []; //reset cardsMatched for next game
				setTimeout(gameWon, 500); //call gameWon function
			}
		}

		//logic for third click
	} else if (clickedCard.length > 2) {
		//add back eventlisteners
		clickedCard[0].addEventListener('click', gameLogic);
		clickedCard[1].addEventListener('click', gameLogic);
		console.log('false');

		console.log(clickedCard);

		//reset cards back
		clickedCard[0].classList.remove('show', 'open', 'match');
		clickedCard[1].classList.remove('show', 'open', 'match');
		clickedCard = []; //reset clickedCard array to initiate next cycle if no match
	}
}

function updateStars() {
	if (moves === 26) {
		document.querySelector('.stars .five-star').remove();
	} else if (moves === 36) {
		document.querySelector('.stars .four-star').remove();
	} else if (moves === 46) {
		document.querySelector('.stars .three-star').remove();
	} else if (moves === 56) {
		document.querySelector('.stars .two-star').remove();
	}
	return;
}

function resetStars() {
	document.querySelector('.stars').innerHTML = saveStarHTML;
}

function updateMoves() {
	moves += 1;
	movesInnertext.textContent = moves;
	return;
}

function gameWon() {
	const score = 1600 / moves;
	alert(`Yay you win with a score of ${score} points! Click OK to play again!`);
	gameStart();
	setTimeout(showAllCards, 800);
	setTimeout(resetCards, 7000);

	movesInnertext.textContent = 0;
	resetStars();

	var listenForClicks = document.querySelectorAll('.deck li:not(.show):not(.open):not(.match)');
	listenForClicks.forEach(function(el) {
		el.addEventListener('click', gameLogic);
	});
}

function reset() {
	gameStart();
	setTimeout(showAllCards, 800);
	setTimeout(resetCards, 7000);

	movesInnertext.textContent = 0;
	resetStars();
}

document.querySelector('.restart').addEventListener('click', reset);
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
