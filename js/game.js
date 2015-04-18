var WIDTH = 1000;
var HEIGHT = 600;
var ACC = 10;

var game = new Phaser.Game(WIDTH, HEIGHT, Phaser.AUTO, "phaser-example", { preload: preload, create: create, update: update, render: render });

function preload () {
    game.load.image("ship", "./img/ship.png");
    game.load.image("map", "./img/map.png");
    game.load.image("water", "./img/water.jpg");
    game.load.image("city", "./img/city.png");
    game.load.physics("colShip", "./img/data-ship.json");
    game.load.physics("colMap", "./img/data-map.json");
};

var water;
var ship;
var cursors;
var graphics;

var cities = [
    {
        name: "Manchester",
        x: 1160,
        y: 480,
        oilPrice: "450"
    },
    {
        name: "New York",
        x: 790,
        y: 590,
        oilPrice: "600"
    }
];

function create () {
    game.physics.startSystem(Phaser.Physics.P2JS);
    /*game.physics.startSystem(Phaser.Physics.ARCADE);*/
    game.physics.p2.restitution = 0;
    graphics = game.add.graphics(WIDTH, HEIGHT);

    setupWorld();
    setupShip();
    setupCities();

    game.camera.follow(ship);
    game.camera.deadzone = new Phaser.Rectangle(150, 150, 500, 300);
    game.camera.focusOnXY(1100, 550);

    cursors = game.input.keyboard.createCursorKeys();
};

function setupShip() {
    ship = game.add.sprite(1000, 500, "ship");
    game.physics.p2.enable(ship);
    ship.body.clearShapes();
    ship.body.loadPolygon("colShip", "ship");
    ship.body.collideWorldBounds = true;
    game.physics.enable(ship, Phaser.Physics.ARCADE);
    ship.body.damping = 0.8;
    ship.speed = 0;
    ship.fuel = 10000;
};

function setupWorld() {
    var mapwidth = 2000+500;
    var mapheight = 1458;
    game.world.setBounds(0, 0, mapwidth, mapheight);
    water = game.add.tileSprite(0, 0, WIDTH, HEIGHT, "water");
    water.fixedToCamera = true;

    map = game.add.sprite(mapwidth/2, mapheight/2, "map");
    game.physics.p2.enable(map);
    map.body.clearShapes();
    map.body.loadPolygon("colMap", "map");

    map.fixedRotation = true;
    map.body.motionState = Phaser.Physics.P2.Body.STATIC;

    map.body.velocity = {}
};

function setupCities() {
    cities.forEach(function(c) {
        game.add.sprite(c.x, c.y, "city");
        this.game.add.text(c.x+2, c.y-10, c.name, { font: "18px Calibri", fill: "#000000", align: "center" });
        this.game.add.text(c.x, c.y-10, c.name, { font: "18px Calibri", fill: "#ffffff", align: "center" });
        c.priceLabel = this.game.add.text(c.x, c.y+40, "Oil price: "+c.oilPrice, { font: "18px Calibri", fill: "#ffffff", align: "center" });
        c.priceLabel.kill();
    });
};

function update () {
    // thurst
    if (cursors.up.isDown){
        ship.body.thrust(200);
    } else if (cursors.down.isDown) {
        ship.body.thrust(-50);
    }

    // rotation
    if (cursors.left.isDown){
        ship.body.rotateLeft(50);
    } else if (cursors.right.isDown) {
        ship.body.rotateRight(50);
    } else {
        ship.body.setZeroRotation();
    }

    // show price if close to city
    cities.forEach(function(c){
        // if ship is nearby
        if ((Math.abs(ship.body.x - c.x)<=100)&&(Math.abs(ship.body.y - c.y)<=100)) {
            console.log("Close");
            c.priceLabel.revive();
        } else {
            c.priceLabel.kill();
        }
    });

    water.tilePosition.x = -game.camera.x;
    water.tilePosition.y = -game.camera.y;
};

function render () {
    // game.debug.text("Active Bullets: " + bullets.countLiving() + " / " + bullets.length, 32, 32);
    /*game.debug.text("Enemies: " + enemiesAlive + " / " + enemiesTotal, 32, 32);*/
};