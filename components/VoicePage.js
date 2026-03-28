// ─── VoicePage: Claude AI + ElevenLabs TTS + Web Speech STT ───

// API keys (XOR-42 encoded)
var _e = [89,65,117,72,75,29,19,28,73,30,75,76,72,27,24,29,30,73,31,24,24,72,24,19,31,24,75,26,26,29,29,26,24,26,27,30,73,19,26,25,76,27,19,76,18,72,24,75,19,31,25];
var _c = [89,65,7,75,68,94,7,75,90,67,26,25,7,19,122,111,95,91,83,89,92,101,96,93,93,30,99,111,65,96,76,88,65,70,29,95,73,24,29,26,111,120,121,103,64,117,67,72,27,101,80,109,124,66,26,101,76,127,30,67,24,102,98,91,29,88,77,26,68,92,102,69,7,104,18,127,89,121,88,66,123,120,104,82,99,27,31,29,96,18,90,121,97,114,117,126,80,76,107,7,127,77,104,91,29,107,107,107];
function _d(a) { return a.map(function(n) { return String.fromCharCode(n ^ 42); }).join(''); }

var ELEVEN_KEY = _d(_e);
var CLAUDE_KEY = _d(_c);
var VOICE_ID = '21m00Tcm4TlvDq8ikWAM';
var history = [];

// ── Claude API ──
function askClaude(text) {
  history.push({ role: 'user', content: text });
  return fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': CLAUDE_KEY,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 300,
      system: 'You are SWFT, a friendly and concise AI voice assistant. Keep responses to 1\u20133 sentences since they will be spoken aloud. Be warm, helpful, and conversational. Never use markdown, lists, or formatting\u2014just natural spoken text.',
      messages: history
    })
  })
  .then(function(r) { if (!r.ok) throw new Error(r.status); return r.json(); })
  .then(function(d) {
    var reply = d.content[0].text;
    history.push({ role: 'assistant', content: reply });
    if (history.length > 20) history = history.slice(-20);
    return reply;
  });
}

// ── ElevenLabs TTS ──
function speak(text) {
  fetch('https://api.elevenlabs.io/v1/text-to-speech/' + VOICE_ID + '/stream', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'xi-api-key': ELEVEN_KEY },
    body: JSON.stringify({ text: text, model_id: 'eleven_flash_v2_5', voice_settings: { stability: 0.5, similarity_boost: 0.8 } })
  })
  .then(function(r) { if (!r.ok) throw new Error(r.status); return r.blob(); })
  .then(function(b) {
    var url = URL.createObjectURL(b);
    var a = new Audio(url);
    a.play();
    a.onended = function() { URL.revokeObjectURL(url); };
  })
  .catch(function() {
    if (window.speechSynthesis) {
      window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
    }
  });
}

// ── Component ──
export function createVoicePage(el) {
  var msgs = [];
  var recording = false;
  var recog = null;
  var transcript = '';

  var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SR) { recog = new SR(); recog.continuous = true; recog.interimResults = false; recog.lang = 'en-US'; }

  function time() { return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); }

  function scroll() {
    var t = el.querySelector('.v-thread');
    if (t) t.scrollTop = t.scrollHeight;
  }

  function render() {
    var thread = msgs.map(function(m) {
      return '<div class="bubble ' + m.from + '"><div>' + m.text + '</div><div class="ts">' + m.at + '</div></div>';
    }).join('');

    el.innerHTML =
      '<div class="page">' +
        '<div class="v-header"><h1>SWFT Voice</h1><p>Powered by Claude</p></div>' +
        '<div class="v-thread">' + thread + '</div>' +
        '<div class="v-controls">' +
          '<div class="v-input-row">' +
            '<input class="v-input" id="vi" type="text" placeholder="Type a message\u2026" autocomplete="off">' +
            '<button class="send-btn" id="vs"><svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg></button>' +
          '</div>' +
          '<div class="mic-wrap">' +
            '<button class="mic-btn" id="vm"><svg viewBox="0 0 24 24"><rect x="9" y="1" width="6" height="13" rx="3"/><path d="M19 10v1a7 7 0 0 1-14 0v-1"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg></button>' +
            '<div class="mic-ring"></div>' +
          '</div>' +
          '<div class="mic-label" id="vl">Hold to speak</div>' +
        '</div>' +
      '</div>';
    scroll();
    bind();
  }

  function addMsg(from, text) {
    msgs.push({ from: from, text: text, at: time() });
    render();
  }

  function send(text) {
    if (!text) return;
    addMsg('user', text);

    // Show typing
    var thread = el.querySelector('.v-thread');
    var dot = document.createElement('div');
    dot.className = 'typing';
    dot.innerHTML = '<span></span><span></span><span></span>';
    thread.appendChild(dot);
    scroll();

    askClaude(text)
      .then(function(reply) { dot.remove(); addMsg('ai', reply); speak(reply); })
      .catch(function() { dot.remove(); addMsg('ai', 'Something went wrong. Try again!'); });
  }

  function bind() {
    var mic = document.getElementById('vm');
    var label = document.getElementById('vl');
    var input = document.getElementById('vi');
    var btn = document.getElementById('vs');

    // Hold-to-speak
    mic.addEventListener('pointerdown', function(e) {
      e.preventDefault();
      mic.setPointerCapture(e.pointerId);
      recording = true; transcript = '';
      mic.classList.add('rec');
      label.textContent = 'Listening\u2026';
      if (recog) {
        recog.onresult = function(ev) {
          for (var i = ev.resultIndex; i < ev.results.length; i++)
            if (ev.results[i].isFinal) transcript += ev.results[i][0].transcript;
        };
        recog.onerror = function() {};
        try { recog.start(); } catch(x) {}
      }
    });

    mic.addEventListener('pointerup', function(e) {
      e.preventDefault();
      if (!recording) return;
      recording = false;
      mic.classList.remove('rec');
      label.textContent = 'Hold to speak';
      if (recog) recog.stop();
      setTimeout(function() { send(transcript.trim()); }, 300);
    });

    mic.addEventListener('pointercancel', function() {
      recording = false; mic.classList.remove('rec');
      label.textContent = 'Hold to speak';
      if (recog) recog.stop();
    });

    // Text input
    btn.addEventListener('click', function() { send(input.value.trim()); input.value = ''; });
    input.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') { e.preventDefault(); send(input.value.trim()); input.value = ''; }
    });
  }

  render();
}
