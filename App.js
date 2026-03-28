// ─── SWFT App Router ───
import { createVoicePage } from './components/VoicePage.js';
import { createMessagePage } from './components/MessagePage.js';

var pages = { voice: createVoicePage, messages: createMessagePage };
var current = 'voice';

var micIcon = '<svg viewBox="0 0 24 24"><rect x="9" y="1" width="6" height="13" rx="3"/><path d="M19 10v1a7 7 0 0 1-14 0v-1"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>';
var msgIcon = '<svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';

function render() {
  var app = document.getElementById('app');
  app.innerHTML =
    '<div id="page"></div>' +
    '<nav class="tab-bar">' +
      '<button class="tab-btn' + (current === 'voice' ? ' active' : '') + '" data-p="voice">' + micIcon + 'Voice</button>' +
      '<button class="tab-btn' + (current === 'messages' ? ' active' : '') + '" data-p="messages">' + msgIcon + 'Messages</button>' +
    '</nav>';

  var box = document.getElementById('page');
  box.style.cssText = 'flex:1;display:flex;flex-direction:column;overflow:hidden;min-height:0';
  pages[current](box);

  app.querySelectorAll('.tab-btn').forEach(function(b) {
    b.addEventListener('click', function() {
      if (b.dataset.p !== current) { current = b.dataset.p; render(); }
    });
  });
}

render();
