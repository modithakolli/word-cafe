/* Word Café start-up guard. This is the first script. If a file is missing or the app cannot start,
   the player sees a short message and a "Try again" button instead of a blank page.
   It changes nothing in the saved progress. */
(function () {
  'use strict';
  var shown = false;
  function recover() {
    var a = document.getElementById('app');
    if (!a || shown || a.childNodes.length) return; // the app is already on screen
    shown = true;
    var box = document.createElement('div');
    box.className = 'boot-error';
    box.setAttribute('role', 'alert');
    var h = document.createElement('h2');
    h.textContent = 'Word Café could not start';
    var p = document.createElement('p');
    p.textContent = 'Your saved progress has not been changed. Close the app and open it again. If this keeps happening, update the app.';
    var b = document.createElement('button');
    b.type = 'button';
    b.textContent = 'Try again';
    b.addEventListener('click', function () { location.reload(); });
    box.appendChild(h); box.appendChild(p); box.appendChild(b);
    a.appendChild(box);
  }
  // Errors in a script, and files that fail to load (the "true" lets us see load errors too)
  window.addEventListener('error', function () { setTimeout(recover, 0); }, true);
  window.addEventListener('load', function () { setTimeout(recover, 0); });
})();
