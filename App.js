// ─── SWFT App — State-Based Router ───
import { createVoicePage } from './components/VoicePage.js';
import { createMessagePage } from './components/MessagePage.js';

const pages = { voice: createVoicePage, messages: createMessagePage };
let currentPage = 'voice';

function renderApp() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div id="pageContainer"></div>
    <nav class="tab-bar">
      <button class="tab-btn ${currentPage === 'voice' ? 'active' : ''}" data-page="voice">
        <svg viewBox="0 0 24 24">
          <rect x="9" y="1" width="6" height="13" rx="3"/>
          <path d="M19 10v1a7 7 0 0 1-14 0v-1"/>
          <line x1="12" y1="19" x2="12" y2="23"/>
          <line x1="8" y1="23" x2="16" y2="23"/>
        </svg>
        Voice
      </button>
      <button class="tab-btn ${currentPage === 'messages' ? 'active' : ''}" data-page="messages">
        <svg viewBox="0 0 24 24">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
        Messages
      </button>
    </nav>
  `;

  const container = document.getElementById('pageContainer');
  container.style.cssText = 'flex:1;display:flex;flex-direction:column;overflow:hidden;min-height:0;';
  pages[currentPage](container);

  // Tab navigation
  app.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const page = btn.dataset.page;
      if (page !== currentPage) {
        currentPage = page;
        renderApp();
      }
    });
  });
}

renderApp();
