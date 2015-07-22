// Various constants for width and height
var tileSide = 10;
var pixelWidth = 300;
var pixelHeight = 300;
var tileWidth = pixelWidth / tileSide;
var tileHeight = pixelHeight / tileSide;

// Holds all our tile colors
var tileColor = [];

// Current drawing color
var currentColor = '#F00';

var canvas = document.getElementById('canvas');

/** Button callback for selecting a color
 * @param {string} value a hex color.
 */
function setColor(value) {
    currentColor = value;
}

// Keep track of where the mouse is and whether it's moved across a grid.
var mouseDirty = false;
var lastTileX, lastTileY;

/** Draws the tile grid.
 * @param {context} context a canvas 2d context.
 */
function render(context) {
  context.fillStyle = '#000';
  context.fillRect(0, 0, pixelWidth, pixelHeight);

  for (var j = 0; j < tileWidth; j++) {
    for (var i = 0; i < tileHeight; i++) {
      var color = tileColor[i][j];

      context.fillStyle = color;
      context.fillRect(i * tileSide + 1,
                       j * tileSide + 1,
                       tileSide - 2,
                       tileSide - 2);
    }
  }
}

/** Move mouse
 * @param {number} x x coordinate.
 * @param {number} y y coordinate.
 */
function mouseMove(x, y) {
    // Only one update per frame.
    if (mouseDirty) {
        return;
    }

    var tileX = Math.floor(x / tileSide);
    var tileY = Math.floor(y / tileSide);

    mouseDirty = (tileX != lastTileX || tileY != lastTileY);

    // Only color if you've moved a significant amount.
    if (mouseDirty) {
        tileColor[tileX][tileY] = currentColor;

        lastTileX = tileX;
        lastTileY = tileY;
    }
}

/** Standard requestAnimFrame; see paulirish.com */
window.requestAnimFrame = (
    function(callback) {
      return window.requestAnimationFrame ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame ||
          window.oRequestAnimationFrame ||
          window.msRequestAnimationFrame ||
          function(callback) {
            window.setTimeout(callback, 1000 / 30);
          };
    })();

/** Draw canvas once per frame. */
function animate() {
  // draw
  var canvas = document.getElementById('canvas');

  render(canvas.getContext('2d'));
  // request new frame
  requestAnimFrame(function() {
    animate();
    // Send a message if you've moved.
    if (mouseDirty) {
      gapi.hangout.data.sendMessage(
          JSON.stringify([0,
                          currentColor,
                          lastTileX,
                          lastTileY]));
      mouseDirty = false;
    }
  });
}

/** Builds our grid of colors */
function initColorBoxes() {
  tileColor = [];
  for (var i = 0; i < tileWidth; i++) {
    var row = [];
    for (var j = 0; j < tileHeight; j++) {
      row.push('#FFF');
    }
    tileColor.push(row);
  }
}


/** Get a message.
 * @param {MessageReceievedEvent} event An event.
 */
function onMessageReceived(event) {
  try {
    var data = JSON.parse(event.message);

    tileColor[data[2]][data[3]] = data[1];
  } catch (e) {
    console.log(e);
  }
}

/** Kick off the app. */
function init() {
  // When API is ready...
  gapi.hangout.onApiReady.add(
      function(eventObj) {
        if (eventObj.isApiReady) {
          try {
            gapi.hangout.data.onMessageReceived.add(onMessageReceived);

            document.getElementById('canvas').onmousemove = function(e) {
              var ev = e || window.event;
              mouseMove(ev.clientX - canvas.offsetLeft,
                        ev.clientY - canvas.offsetTop);
            };

            initColorBoxes();
            animate();


            var id = gapi.hangout.getLocalParticipantId();
            var canvas = gapi.hangout.layout.getVideoCanvas();

            canvas.setWidth(600);
            canvas.setPosition(0, 0);
            canvas.setVisible(true);
            console.log(canvas);

          } catch (e) {
            console.log('init:ERROR');
            console.log(e);
          }
        }
      });
}


// Wait for gadget to load.                                                       
gadgets.util.registerOnLoadHandler(init);
