// ─── VoicePage Component ───
// Hold-to-Speak with Web Speech API + text input

export function createVoicePage(container) {
  let messages = [];
  let isRecording = false;
  let recognition = null;

  // ── Setup Speech Recognition ──
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
  }

  // ── Render ──
  function render() {
    container.innerHTML = `
      <div class="page voice-page">
        <div class="voice-header">
          <h1>SWFT Voice</h1>
          <div class="subtitle">AI Assistant</div>
        </div>

        <div class="voice-thread" id="voiceThread"></div>

        <div class="voice-controls">
          <div class="voice-input-row">
            <input class="voice-input" id="textInput" type="text"
                   placeholder="Type a message..." autocomplete="off" />
            <button class="send-btn" id="sendBtn" aria-label="Send">
              <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
            </button>
          </div>

          <div class="mic-container">
            <button class="mic-btn" id="micBtn" aria-label="Hold to speak">
              <svg viewBox="0 0 24 24">
                <rect x="9" y="1" width="6" height="13" rx="3"/>
                <path d="M19 10v1a7 7 0 0 1-14 0v-1"/>
                <line x1="12" y1="19" x2="12" y2="23"/>
                <line x1="8" y1="23" x2="16" y2="23"/>
              </svg>
            </button>
            <div class="mic-ring"></div>
          </div>
          <div class="mic-label" id="micLabel">Hold to speak</div>
        </div>
      </div>
    `;
    bindEvents();
    renderMessages();
  }

  // ── Render Messages ──
  function renderMessages() {
    const thread = document.getElementById('voiceThread');
    thread.innerHTML = messages.map(m => `
      <div class="voice-bubble ${m.role}">
        ${m.text}
        <div class="timestamp">${m.time}</div>
      </div>
    `).join('');
    thread.scrollTop = thread.scrollHeight;
  }

  function addMessage(role, text) {
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    messages.push({ role, text, time });
    renderMessages();
  }

  // ── Show typing indicator then AI response ──
  function showAIResponse(userText) {
    const thread = document.getElementById('voiceThread');

    // Add typing indicator
    const typingEl = document.createElement('div');
    typingEl.className = 'typing-indicator';
    typingEl.innerHTML = '<span></span><span></span><span></span>';
    thread.appendChild(typingEl);
    thread.scrollTop = thread.scrollHeight;

    // Generate response
    const response = generateResponse(userText);

    setTimeout(() => {
      typingEl.remove();
      addMessage('ai', response);

      // Speak response
      if (window.speechSynthesis) {
        const utterance = new SpeechSynthesisUtterance(response);
        utterance.rate = 1;
        utterance.pitch = 1;
        window.speechSynthesis.speak(utterance);
      }
    }, 800 + Math.random() * 700);
  }

  function generateResponse(input) {
    const lower = input.toLowerCase();
    if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
      return "Hey there! I'm SWFT, your AI assistant. What can I help you with?";
    }
    if (lower.includes('weather')) {
      return "I'd check the forecast for you, but I'm better at conversations! Try asking me something creative.";
    }
    if (lower.includes('time')) {
      return `It's currently ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}. Anything else?`;
    }
    if (lower.includes('name')) {
      return "I'm SWFT — Simple, Smart, and Swift. Built to make your day easier.";
    }
    if (lower.includes('joke')) {
      const jokes = [
        "Why do programmers prefer dark mode? Because light attracts bugs.",
        "I told my AI a joke. It didn't laugh — it just optimized the punchline.",
        "Why was the JavaScript developer sad? Because he didn't Node how to Express himself.",
      ];
      return jokes[Math.floor(Math.random() * jokes.length)];
    }
    if (lower.includes('how are you') || lower.includes('how do you')) {
      return "I'm running at peak performance! Thanks for asking. What's on your mind?";
    }
    const defaults = [
      `Interesting — "${input}". Tell me more and I'll do my best to help!`,
      `I hear you. Let me think about "${input}"... I'd suggest exploring that idea further!`,
      `That's a great thought. Anything specific about "${input}" you want to dive into?`,
    ];
    return defaults[Math.floor(Math.random() * defaults.length)];
  }

  // ── Bind Events ──
  function bindEvents() {
    const micBtn = document.getElementById('micBtn');
    const micLabel = document.getElementById('micLabel');
    const textInput = document.getElementById('textInput');
    const sendBtn = document.getElementById('sendBtn');

    // ── Hold-to-Speak (Pointer Events) ──
    let finalTranscript = '';

    micBtn.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      micBtn.setPointerCapture(e.pointerId);
      isRecording = true;
      finalTranscript = '';
      micBtn.classList.add('recording');
      micLabel.textContent = 'Listening...';

      if (recognition) {
        recognition.onresult = (event) => {
          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            }
          }
        };
        recognition.onerror = () => {};
        try { recognition.start(); } catch(e) {}
      }
    });

    micBtn.addEventListener('pointerup', (e) => {
      e.preventDefault();
      if (!isRecording) return;
      isRecording = false;
      micBtn.classList.remove('recording');
      micLabel.textContent = 'Hold to speak';

      if (recognition) {
        recognition.stop();
      }

      // Wait briefly for final results
      setTimeout(() => {
        const text = finalTranscript.trim();
        if (text) {
          addMessage('user', text);
          showAIResponse(text);
        }
      }, 300);
    });

    micBtn.addEventListener('pointercancel', () => {
      isRecording = false;
      micBtn.classList.remove('recording');
      micLabel.textContent = 'Hold to speak';
      if (recognition) recognition.stop();
    });

    // ── Text Input ──
    sendBtn.addEventListener('click', () => {
      sendText();
    });

    textInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        sendText();
      }
    });

    function sendText() {
      const text = textInput.value.trim();
      if (!text) return;
      textInput.value = '';
      addMessage('user', text);
      showAIResponse(text);
    }
  }

  render();
}
