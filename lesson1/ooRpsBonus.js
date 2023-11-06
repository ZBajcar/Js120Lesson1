const readline = require('readline-sync');
const MAX_SCORE = 5;
const START_SCORE = 0;

const WINNING_MOVES = {
  rock: ['scissors', 'lizard'],
  paper: ['rock', 'spock'],
  scissors: ['paper', 'lizard'],
  lizard: ['spock', 'paper'],
  spock: ['rock', 'scissors']
};

const CHOICES_LIST = Object.keys(WINNING_MOVES);

function joinOr(arr, delimiter = ', ', word = 'or') {
  switch (arr.length) {
    case 0:
      return '';
    case 1:
      return `${arr[0]}`;
    case 2:
      return arr.join(` ${word} `);
    default:
      return arr.slice(0,-1).join(delimiter) + `${delimiter}${word} ${arr.slice(-1)}`;
  }
}

function createPlayer() {
  return {
    move: null,
    score: START_SCORE,
    history: [],

    addMoveToHistory(move) {
      this.history.push(move);
    }
  };
}

// eslint-disable-next-line max-lines-per-function
function createComputer() {
  let playerObject = createPlayer();

  let computerObject = {

    choices: CHOICES_LIST,
    loss: null,

    choose() {
      let randomIndex = Math.floor(Math.random() * this.choices.length);
      this.move = this.choices[randomIndex];
      this.addMoveToHistory(this.move);
    },

    modChoice() {
      let finalChoice = [];

      CHOICES_LIST.forEach(move => {
        if (!this.loss.includes(move)) {
          finalChoice.push(move);
        }
      });

      return this.choices.concat(finalChoice);
    },

    lastLoss(humanMove) {
      this.loss = WINNING_MOVES[humanMove];
    },
  };
  return Object.assign(playerObject, computerObject);
}

// eslint-disable-next-line max-lines-per-function
function createHuman() {
  let playerObject = createPlayer();

  let humanObject = {

    choose() {
      let choice;

      while (true) {
        console.log(`Please choose ${joinOr(CHOICES_LIST)}:`);
        choice = this.convertMove(readline.question());
        if (CHOICES_LIST.includes(choice)) break;
        console.log('Sorry, invalid choice.');
      }
      this.move = choice;
      this.addMoveToHistory(this.move);
    },

    convertMove(move) {
      if (move.toLowerCase() === 'sp') {
        return 'spock';
      } else {
        switch (move.toLowerCase()) {
          case 'r': return 'rock';
          case 'p': return 'paper';
          case 's': return 'scissors';
          case 'l': return 'lizard';
          default: return move.toLowerCase();
        }
      }
    },
  };
  return Object.assign(playerObject, humanObject);
}

const RPSGame = {
  human: createHuman(),
  computer: createComputer(),

  displayWelcomeMessage() {
    console.clear();
    console.log(`Welcome to ${CHOICES_LIST.join(', ')}!`);
  },

  displayGoodbyeMessage() {
    console.log(`Thanks for playing ${CHOICES_LIST.join(', ')}. Goodbye!`);
  },

  displayLineBreak() {
    console.log('----------------------------------');
  },

  displayRules() {
    console.log(`The rules are simple!\nPick between the choices we provide you and if your choice beats the computers you win the round.\nThe first to win 5 rounds will win the game, good luck!`);
  },

  displayWinner() {
    let result = this.getWinner();

    console.log(`You chose: ${this.human.move}`);
    console.log(`The computer chose: ${this.computer.move}`);

    if (result === 'human') {
      console.log('You win!');
    } else if (result === 'computer') {
      console.log('Computer wins!');
    } else {
      console.log("It's a tie");
    }
  },

  getWinner() {
    let humanMove = this.human.move;
    let computerMove = this.computer.move;

    if (WINNING_MOVES[humanMove].includes(computerMove)) {
      return 'human';
    } else if (WINNING_MOVES[computerMove].includes(humanMove)) {
      return 'computer';
    } else {
      return 'tie';
    }
  },

  modComputerChoices() {
    let humanMove = this.human.move;
    let computerMove = this.computer.move;

    if (WINNING_MOVES[humanMove].includes(computerMove)) {
      this.computer.lastLoss(humanMove);
      if (this.computer.loss !== null) {
        this.computer.choices = this.computer.modChoice();
      }
    }
  },

  trackScore() {
    let result = this.getWinner();

    if (result === 'human') {
      this.human.score += 1;
    } else if (result === 'computer') {
      this.computer.score += 1;
    }
  },

  displayScore() {
    console.log(`The score is human: ${this.human.score}. Computer: ${this.computer.score}`);
  },

  playAgain() {
    let answer;
    while (true) {
      console.log('Would you like to play again? (y/n)');
      answer = readline.question().toLowerCase();
      if (['yes','y','no','n'].includes(answer)) break;
      console.log('Invalid answer!');
    }
    return answer.toLowerCase()[0] === 'y';
  },

  resetGameState() {
    this.human.score = START_SCORE;
    this.computer.score = START_SCORE;
    this.human.history = [];
    this.computer.history = [];
    this.computer.choices = CHOICES_LIST;
  },

  playGame() {
    this.human.choose();
    this.computer.choose();
    this.displayWinner();
    this.modComputerChoices();
    this.trackScore();
    this.displayScore();
    this.displayLineBreak();
  },

  play() {
    this.displayWelcomeMessage();
    this.displayRules();
    this.displayLineBreak();
    while (true) {
      this.resetGameState();
      while (this.human.score < MAX_SCORE && this.computer.score < MAX_SCORE) {
        this.playGame();
      }
      if (!this.playAgain()) break;
      console.clear();
    }
    this.displayGoodbyeMessage();
  },
};

RPSGame.play();