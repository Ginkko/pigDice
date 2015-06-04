function Game(playerOne, playerTwo) {
  this.playerOne = new Player(playerOne);
  this.playerTwo = new Player(playerTwo);
  this.roundScore = 0;
  this.activePlayer = this.playerOne;
  this.diceOne = 0;
  this.diceTwo = 0;
  var pigMessage; // pig response after roll
}

function Player(playerName, score) {
  this.playerName = playerName;
  this.score = 0;
}

Game.prototype.endRound = function() {
  if (this.activePlayer === this.playerOne) {
    this.playerOne.score += this.roundScore;
      this.activePlayer = this.playerTwo;
  } else {
    this.playerTwo.score += this.roundScore;
    this.activePlayer = this.playerOne;
  }
  this.roundScore = 0;
};

Game.prototype.playRound = function() {
  var diceOne = 1 + Math.floor(Math.random() * 6);
  this.diceOne = diceOne;
  var diceTwo = 1 + Math.floor(Math.random() * 6);
  this.diceTwo = diceTwo;
  if (diceOne === 1 && diceTwo === 1) {
    pigMessage = "> Rolled two ONES! Back to ZERO! <";

    if (this.playerOne === this.activePlayer) {
      this.playerOne.score = 0;
    } else {
      this.playerTwo.score = 0;
    }
  } else if (diceOne === 1 || diceTwo === 1) {
    pigMessage = "> Rolled a ONE. NEXT! <";
    this.roundScore = 0;
    this.endRound();
  } else {
    this.roundScore += (diceOne + diceTwo);
    pigMessage = "> More points! OINK <";
  }
};

// Dice animation
// Refactored argument names
// Number of rolls now static
// Changed to prototype function to have access to dice rolls
Game.prototype.throwAnimatedDice = function(element, index) {
  if (index === 0) {
    displayDice(15, this.diceOne, $(element));
  } else {
    displayDice(15, this.diceTwo, $(element));
  }
}
//random dice roll now connected to final dice output
function displayDice(times, final, element) {
    if (times > 1) {
      element.removeClass();
      element.addClass('dice dice_' + (Math.floor(Math.random() * 6) + 1 ));
        setTimeout(function () {
            displayDice(times - 1, final, element);
        }, 100);
      }

      setTimeout(function () {
        setDiceFinal(element, final);
      }, 1600);

}

function setDiceFinal(element, final) {
  element.removeClass();
  element.addClass('dice dice_' + final);
}


$(function() {
  $("form#player-form").submit(function(event) {
    event.preventDefault();
    var playerOneName = $("input#player-one-name").val();
    var playerTwoName = $("input#player-two-name").val();
    var newGame = new Game(playerOneName, playerTwoName);

    // start new game
    $("#main-pig").fadeOut(750);
    $("#new-game").fadeOut(750);
    $("#live-game").delay(750).fadeIn(1000);
    $("#player-one-name").val("");
    $("#player-two-name").val("");
    $("#live-game h2").text(newGame.activePlayer.playerName + "'s turn");

    // Player one setup
    $("#player-one-score").text(newGame.playerOne.score);
    $("#player-one h3").text(newGame.playerOne.playerName);

    // Player two setup
    $("#player-two-score").text(newGame.playerTwo.score);
    $("#player-two h3").text(newGame.playerTwo.playerName);

    // Scoreboard setup
    $("#roundScore").text(newGame.roundScore);

    // Roll-dice button
    $("#play-round").click(function() {
      $("#rolling").text("Rolling...");

      // setTimeout(function() { // adds delay to simulate rolling
      $(".game-buttons").slideUp(500);
      $(".piggie").slideUp(500);

      newGame.playRound();

      $("#dice-1").text(newGame.diceOne);
      $("#dice-2").text(newGame.diceTwo);
      $("#roundScore").text(newGame.roundScore);
      $("#player-two-score").text(newGame.playerTwo.score);
      $("#player-one-score").text(newGame.playerOne.score);
      $("#scoreboard h2").text(newGame.activePlayer.playerName + "'s turn");
      $("#rolling").text(pigMessage);
      // setTimeout(function() { // delays prompt after roll results
        $("#rolling").text("Oink. What do you want to do?");
      // }, 2000);
      $(".game-buttons").fadeIn(1000);
      $(".piggie").fadeIn(300);
    // }, 1200);

      $('.dice').each(function(index) {

          newGame.throwAnimatedDice(this, index);

      });



    });

    // End-turn button
    $("#end-turn").click(function() {
      newGame.endRound();

      $("#roundScore").text(newGame.roundScore);
      $("#player-two-score").text(newGame.playerTwo.score);
      $("#player-one-score").text(newGame.playerOne.score);
      $("#scoreboard h2").text(newGame.activePlayer.playerName + "'s turn");

      // Checks for WIN scenario
      if (newGame.playerOne.score >= 100) {
        $("#live-game").fadeOut();
        $("#win-screen").delay(750).fadeIn();
        $("#win-screen h1").text(newGame.playerOne.playerName + " wins!");
        $("#win-screen").delay(4000).fadeOut();
        $("#new-game").delay(6000).fadeIn();

      } else if (newGame.playerTwo.score >= 100) {
        $("#live-game").fadeOut();
        $("#win-screen").delay(750).fadeIn();
        $("#win-screen h1").text(newGame.playerTwo.playerName + "wins!");
        $("#win-screen").delay(4000).fadeOut();
        $("#new-game").delay(6000).fadeIn();
      }


    });
  });
});
