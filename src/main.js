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

/*** XXX
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
*/


/** Get a message.
 * @param {MessageReceievedEvent} event An event.
 */
/* XXX
function onMessageReceived(event) {
  try {
    var data = JSON.parse(event.message);

    tileColor[data[2]][data[3]] = data[1];
  } catch (e) {
    console.log(e);
  }
}
*/

function init() {
  gapi.hangout.onApiReady.add(function(eventObj) {
    if (eventObj.isApiReady) {
      try {
        var canvas = gapi.hangout.layout.getVideoCanvas();
        canvas.setWidth(600);
        canvas.setPosition(0, 0);
        canvas.setVisible(true);

        /* XXX event handler here
        gapi.hangout.data.onMessageReceived.add(onMessageReceived);

        document.getElementById('canvas').onmousemove = function(e) {
          var ev = e || window.event;
          mouseMove(ev.clientX - canvas.offsetLeft,
                    ev.clientY - canvas.offsetTop);
        };
        */
        /// XXX main loop animate();

      } catch (e) {
        console.log('init:ERROR');
        console.log(e);
      }
    }
  });
}

gadgets.util.registerOnLoadHandler(init);
