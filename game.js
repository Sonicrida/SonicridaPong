var game = new Phaser.Game(480, 640, Phaser.AUTO, 'game-div', { preload: preload, create: create, update: update });

var playerBet;
var computerBet;
var ball;

var computerBetSpeed = 190;
var ballSpeed = 300;

var ballReleased = false;

var music;

function preload() {
    game.load.image('bet', 'assets/bet.png');
    game.load.image('ball', 'assets/ball.png');
    game.load.image('background', 'assets/background.jpg');

    //Load the game's music file. The .ogg file required for firefox.
    game.load.audio('TryTryAgain', ['assets/audio/TryTryAgain.mp3', 'assets/audio/TryTryAgain.ogg']);

}
function create() {
    game.add.tileSprite(0, 0, 480, 640, 'background');

    playerBet = createBet(game.world.centerX, 600);
    computerBet = createBet(game.world.centerX, 20);

    ball = game.add.sprite(game.world.centerX, game.world.centerY, 'ball');
    ball.anchor.setTo(0.5, 0.5);
    ball.body.collideWorldBounds = true;
    ball.body.bounce.setTo(1, 1);

    music = game.add.audio('TryTryAgain');
    music.play();

    game.input.onDown.add(releaseBall, this);
}

function update () {
    //Control the player's racket
    playerBet.x = game.input.x;

    var playerBetHalfWidth = playerBet.width / 2;

    if (playerBet.x < playerBetHalfWidth) {
        playerBet.x = playerBetHalfWidth;
    } else if (playerBet.x > game.width - playerBetHalfWidth) {
        playerBet.x = game.width - playerBetHalfWidth;
    }

    //Control the computer's racket
    if (computerBet.x - ball.x < -15) {
        computerBet.body.velocity.x = computerBetSpeed;
    } else if (computerBet.x - ball.x > 15) {
        computerBet.body.velocity.x = -computerBetSpeed;
    } else {
        computerBet.body.velocity.x = 0;
    }

    //Check and process the collision ball and racket
    game.physics.collide(ball, playerBet, ballHitsBet, null, this);
    game.physics.collide(ball, computerBet, ballHitsBet, null, this);

    //Check to see if someone has scored a goal
    checkGoal();

    //game.stage.scaleMode = Phaser.StageScaleMode.SHOW_ALL; //resize your window to see the stage resize too
    //game.stage.scale.setShowAll();
    //game.stage.scale.refresh();
}

function createBet(x, y) {
    var bet = game.add.sprite(x, y, 'bet');
    bet.anchor.setTo(0.5, 0.5);
    bet.body.collideWorldBounds = true;
    bet.body.bounce.setTo(1, 1);
    bet.body.immovable = true;

    return bet;
}

function releaseBall() {
    if (!ballReleased) {
        ball.body.velocity.x = ballSpeed;
        ball.body.velocity.y = -ballSpeed;
        ballReleased = true;
    }
}

function ballHitsBet (_ball, _bet) {
    var diff = 0;

    if (_ball.x < _bet.x) {
        //If ball is in the left hand side on the racket
        diff = _bet.x - _ball.x;
        _ball.body.velocity.x = (-10 * diff);
    } else if (_ball.x > _bet.x) {
        //If ball is in the right hand side of the racket
        diff - _ball.x - _bet.x;
        _ball.body.velocity.x = (10 * diff);
    } else {
        //The ball hit the center of the racket, let's add a little bit of a tragic accident(random) to his movement
        _ball.body.velocity.x = 2 + Math.random() * 8;
    }
}

function checkGoal() {
    if (ball.y < 15) {
        setBall();
    } else if (ball.y > 625) {
        setBall();
    }
}

function setBall() {
    if (ballReleased) {
        ball.x = game.world.centerX;
        ball.y = game.world.centerY;
        ball.body.velocity.x = 0;
        ball.body.velocity.y = 0;
        ballReleased = false;
    }
}