//begin

//initalize timer values
var interval = null;
let seconds = 0;
let minutes = 0;
let displaySeconds = 0;
let displayMinutes = 0;

//add a click listener to reset button
document.querySelector('.restart').addEventListener('click', reset);

//save star HTML as a string
let saveStarArray = [];
saveStarArray = document.querySelectorAll('.stars li');
var saveStarHTML = saveStarArray[0].outerHTML;
saveStarArray.forEach(function(el, index) {
	if (index < 1) return;
	saveStarHTML += el.outerHTML;
});

//make moves' innertext 0;
let movesInnertext = document.querySelector('.moves');
movesInnertext.textContent = 0;
var moves = 0;

//start game
shuffleDeck(); //alert+timer+shuffle
setTimeout(showAllCards, 800);
setTimeout(resetCards, 7000);

//add click listeners to all cards
listenForClicks();

//timer function
function gameTimer() {
	seconds++;

	//Logic to determine when to increment next value
	if (seconds / 60 === 1) {
		seconds = 0;
		minutes++;
	}

	//If seconds/minutes are only one digit, add a leading 0 to the value
	if (seconds < 10) {
		displaySeconds = '0' + seconds.toString();
	} else {
		displaySeconds = seconds;
	}

	if (minutes < 10) {
		displayMinutes = '0' + minutes.toString();
	} else {
		displayMinutes = minutes;
	}

	//Display updated time values to user
	document.querySelector('.seconds').innerHTML = displayMinutes + ':' + displaySeconds;
}

// createHTML to shuffle and reset cards
function shuffleDeck() {
	alert(
		`Welcome to the Memory Mame.\n\n1. Once the cards are revealed, you'll have seven seconds to memorize them before they're yeeted out of your sight.\n\n2. Click on two cards to reveal them.\n\n3. If they don't match click elsewhere to reset them.\n\n4. Start clicking again and get the damn cards matched!`
	);

	interval = setInterval(gameTimer, 1000);

	// create card array using existing deck
	let allCards = [ ...document.querySelectorAll('.deck li') ];

	// shuffle it
	let shuffledCards = shuffle(allCards);

	// construct HTML string of shuffled deck
	let newDeck = shuffledCards[0].outerHTML; //to add the first element
	shuffledCards.forEach(function(el, index) {
		if (index < 1) return; //to skip the first element because we already added it
		newDeck += `${el.outerHTML}`;
	});

	// Update DOM with shuffled deck
	document.querySelector('.deck').innerHTML = newDeck;

	// flip deck invisible
	resetCards();
}

//main game logic
var clickedCard = [];
var cardsMatched = [];
var saveTime;
function gameLogic(evt) {
	// store clicked li element into clickedCard array
	clickedCard.push(evt.target);
	console.log(clickedCard);

	// loops for two clicks
	if (clickedCard.length <= 2) {
		// remove eventlistener to prevent registering further clicks
		clickedCard[`${clickedCard.length - 1}`].removeEventListener('click', gameLogic);
		// reveal clicked card
		clickedCard[`${clickedCard.length - 1}`].classList.add('show', 'open');
		//update moves and stars
		updateMoves();
		updateStars();
	}

	// also initiate comparison logic at second click
	if (clickedCard.length === 2) {
		//feed each li's inner HTML (which contains i element and its classes) into two variables
		let cList1 = clickedCard[0].innerHTML;
		let cList2 = clickedCard[1].innerHTML;
		console.log(cList1, cList2);

		// comparison logic
		if (cList1 === cList2) {
			console.log('true');
			//add matched colour class
			clickedCard[0].classList.add('match');
			clickedCard[1].classList.add('match');
			clickedCard = []; //reset clickedCard array for next cycle
			cardsMatched.push(1); //push 1 into cardsMatched to register matched count

			//game win logic if all cards match
			if (cardsMatched.length === 8) {
				//stop timer
				clearInterval(interval);

				//store timer data
				saveTime = document.querySelector('.seconds').innerHTML;

				//reset timer data
				document.querySelector('.seconds').innerHTML = '00:00';
				seconds = 0;
				minutes = 0;
				displaySeconds = 0;
				displayMinutes = 0;

				//reset cardsMatched for next game
				cardsMatched = [];

				//call gameWon function
				setTimeout(gameWon, 500);
			}
		}

		//logic for third click
	} else if (clickedCard.length > 2) {
		//add back click eventlisteners
		clickedCard[0].addEventListener('click', gameLogic);
		clickedCard[1].addEventListener('click', gameLogic);
		console.log('false');
		console.log(clickedCard);

		//reset open cards back to closed
		clickedCard[0].classList.remove('show', 'open', 'match');
		clickedCard[1].classList.remove('show', 'open', 'match');

		//reset clickedCard array to for next cycle if no match
		clickedCard = [];
	}
}

//function to listen for clicks and execute gameLogic
function listenForClicks() {
	var clicks = document.querySelectorAll('.deck li:not(.show):not(.open):not(.match)');
	clicks.forEach(function(el) {
		el.addEventListener('click', gameLogic);
	});
}

//function to flip existing deck invisible
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

//function to update stars
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
}

//function to reset stars
function resetStars() {
	document.querySelector('.stars').innerHTML = saveStarHTML;
}

//function to update moves
function updateMoves() {
	moves += 1;
	movesInnertext.textContent = moves;
}

//gameWon logic
function gameWon() {
	alert(`Yay you win after ${moves} moves!\nThe time you took is ${saveTime} in min:sec.\n\nClick OK to play again!`);

	shuffleDeck();
	setTimeout(showAllCards, 800);
	setTimeout(resetCards, 7000);

	//reset moves and stars
	movesInnertext.textContent = 0;
	moves = 0;
	resetStars();

	listenForClicks();
}

//function for reset button
function reset() {
	//stop timer
	clearInterval(interval);
	//clear timer data
	document.querySelector('.seconds').innerHTML = '00:00';
	seconds = 0;
	minutes = 0;
	displaySeconds = 0;
	displayMinutes = 0;

	shuffleDeck();
	setTimeout(showAllCards, 800);
	setTimeout(resetCards, 7000);

	//to clear clickedCard and cardsMatched if game is reset midway
	clickedCard = [];
	cardsMatched = [];
	listenForClicks();

	//reset moves and stars
	movesInnertext.textContent = 0;
	moves = 0;
	resetStars();
}

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
