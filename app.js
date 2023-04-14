'use strict';

// // category buttons
// const entertainmentCat = document.querySelector('.entertainment');
// const sportsCat = document.querySelector('.sports');
// const historyCat = document.querySelector('.history');
// const geographyCat = document.querySelector('.geography');
// const generalCat = document.querySelector('.general');
// const celebritiesCat = document.querySelector('.celebrities');
// const animalsCat = document.querySelector('.animals');
// const mathCat = document.querySelector('.math');
// const scienceCat = document.querySelector('.science');
// const mythologyCat = document.querySelector('.mythology');
// const politicsCat = document.querySelector('.politics');
// const artCat = document.querySelector('.art');
// const vehiclesCat = document.querySelector('.vehicles');
///////////////////////////////////////////
//////////////////////////////////////////

const homePage = document.querySelector('.home-page');
const start = document.querySelector('.start-game');
const questionPage = document.querySelector('.question-page');
const container = document.querySelector('.container');
const gameHist = document.querySelector('.game-history');

// initalize parameters
let currentQuestionIndex = 0;
let currentScore = 0;
let questions = [];

// will change with every category
const baseUrl = `https://opentdb.com/api.php?amount=10`;

const startGame = function (url) {
	container.innerHTML = '';
	fetch(url)
		.then((response) => response.json())
		.then((data) => {
			questions = data.results;
			shuffle(questions);
			renderQuestions();
		})
		.catch((error) => console.log(error));
};

const renderQuestions = function () {
	const question = questions[currentQuestionIndex];

	// shuffle answers
	const answers = [...question.incorrect_answers, question.correct_answer];
	shuffle(answers);

	// rendering each question
	questionPage.innerHTML = `
	<h2>${question.category}</h2>
	<p>${currentQuestionIndex + 1} / 10 </p>
	<p>${question.question}</p>
	${answers
		.map(
			(answer) =>
				`<button class='answer-btn ${
					answer === question.correct_answer ? 'correct' : 'incorrect'
				}'>${answer}</button>`
		)
		.join('')}
	
`;
	// using the button presses to move through the questions array
	questionPage.querySelectorAll('.answer-btn').forEach((button) => {
		button.addEventListener('click', function () {
			if (button.innerText === question.correct_answer) {
				currentScore++;
			}
			currentQuestionIndex++;

			if (currentQuestionIndex < questions.length) {
				renderQuestions();
			} else {
				endGame();
			}
		});
	});
	container.appendChild(questionPage);
};

const endGame = function () {
	// save score to local storage
	scoreStorage();

	// render score page
	container.innerHTML = `
	<div class='game-over'>
	<h2>Game Over!</h2>
	<p>You got ${currentScore} out of 10 questions correct.</p>
	<p id='emoji'>
	${currentScore === questions.length ? '🎉' : '👍'} </p>
	<button id='restart-btn'>Play again!</button>
	</div>
	`;

	// start a new game
	const restartBtn = document.querySelector('#restart-btn');
	restartBtn.addEventListener('click', function () {
		currentQuestionIndex = 0;
		currentScore = 0;
		questions = [];
		startGame(`https://opentdb.com/api.php?amount=10`);
	});
};

const scoreStorage = function () {
	localStorage.setItem('score', currentScore);
	const gameHistory = localStorage.getItem('score');
	gameHist.innerHTML = `
		<h3>Your last game score was ${gameHistory} / 10</h3>
		`;
};

// function to shuffle the questions randomly so no two games are the same
const shuffle = function (array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
};

// event handlers
start.addEventListener('click', function () {
	startGame(`https://opentdb.com/api.php?amount=10`);
});

// entertainmentCat.addEventListener(
// 	'click',
// 	startGame(`https://opentdb.com/api.php?amount=10&category=16`)
// );
