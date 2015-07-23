var MAPW = 200;
var MAPH = 200;
var MAPFILL = 10;

var ENEMIES = [];
var MAP = [];

/// utils

function rand(a, b) { return Math.floor(Math.random() * (b - a)) + a; }
function randommappoint() { return [rand(0, MAPW), rand(0, MAPH)]; }

/// main

function game_init() {
    ENEMIES = [];
    MAP = [];

    var i, p;

    for (i = 0; i < MAPW; i++) {
        MAP.push(new Array(MAPH));
    }
    for (i = 0; i < MAPW*MAPH / MAPFILL; i++) {
        p = randommappoint();
        MAP[p[0]][p[1]] = 'X';
    }
}

function game_mapdebug(c, W, H) {
    c.fillStyle = 'green';
    var pw = W/MAPW;
    var ph = H/MAPH;
    for (var x = 0; x < MAPW; x++) {
    for (var y = 0; y < MAPW; y++) {
        if (MAP[x][y] === 'X') {
            c.fillRect(x*pw, y*ph, pw, ph);
        }
    }}
}

function game_renderhighscores(el) {
    // XXX TODO
}

function game_render(c, W, H) {
    game_mapdebug(c, W, H);
}
