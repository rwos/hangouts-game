window.requestAnimFrame = (function(callback) {
    return window.requestAnimationFrame ||
           window.webkitRequestAnimationFrame ||
           window.mozRequestAnimationFrame ||
           window.oRequestAnimationFrame ||
           window.msRequestAnimationFrame ||
           function(callback) {
               console.log("ANIMATION FRAME FALLBACK"); 
               window.setTimeout(callback, 1000 / 30);
           };
})();

function mainloop() {
    var canvas = document.getElementById('main');
    canvas.width = canvas.scrollWidth;
    canvas.height = canvas.scrollHeight;
    game_render(canvas.getContext('2d'), canvas.width, canvas.height);
    requestAnimFrame(function() {
        mainloop();
        /** XXX
        // Send a message if you've moved.
        if (mouseDirty) {
          gapi.hangout.data.sendMessage(
              JSON.stringify([0,
                              currentColor,
                              lastTileX,
                              lastTileY]));
          mouseDirty = false;
        }
        */
    });
}

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
        game_init();
        mainloop();

      } catch (e) {
        console.log('INIT ERROR');
        console.log(e);
      }
    }
  });
}

if (typeof gadgets === 'undefined') {
    // shimshimshim
    console.log("LOCAL VERSION");
    gapi = {
        hangout: {
            onApiReady: {
                add: function(fn) { fn({isApiReady: true}); }
            },
            layout: {
                getVideoCanvas: function() {
                    return {
                        setWidth: function() {},
                        setPosition: function() {},
                        setVisible: function() {},
                    }
                }
            }
        }
    };
    gadgets = {
        util: {
            registerOnLoadHandler: function(fn) { fn(); }
        }
    };
}

gadgets.util.registerOnLoadHandler(init);
