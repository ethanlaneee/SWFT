// ─── MessagePage Component ───
// iMessage-style conversation list

const CONVERSATIONS = [
  {
    name: 'Sarah Chen',
    initials: 'SC',
    color: '#5856d6',
    preview: 'Sounds good! See you at 7 🎉',
    time: '2:14 PM',
    unread: true,
    swft: false,
  },
  {
    name: 'SWFT AI',
    initials: '⚡',
    color: '#1a1a1a',
    preview: 'Here\'s a summary of your meeting notes...',
    time: '1:48 PM',
    unread: true,
    swft: true,
    border: '#c8f400',
  },
  {
    name: 'Mike Torres',
    initials: 'MT',
    color: '#ff9500',
    preview: 'Did you see the game last night?',
    time: '12:30 PM',
    unread: false,
    swft: false,
  },
  {
    name: 'Design Team',
    initials: 'DT',
    color: '#30d158',
    preview: 'Alex: Updated the Figma file with new flows',
    time: '11:15 AM',
    unread: false,
    swft: false,
  },
  {
    name: 'SWFT Drafts',
    initials: '✦',
    color: '#1a1a1a',
    preview: 'Draft: Follow-up email for client meeting',
    time: '10:02 AM',
    unread: false,
    swft: true,
    border: '#c8f400',
  },
  {
    name: 'Jordan Blake',
    initials: 'JB',
    color: '#ff375f',
    preview: 'Thanks for the recommendation!',
    time: '9:45 AM',
    unread: false,
    swft: false,
  },
  {
    name: 'Mom ❤️',
    initials: 'M',
    color: '#af52de',
    preview: 'Call me when you get a chance honey',
    time: 'Yesterday',
    unread: false,
    swft: false,
  },
  {
    name: 'Priya Patel',
    initials: 'PP',
    color: '#007aff',
    preview: 'The report is attached. Let me know!',
    time: 'Yesterday',
    unread: false,
    swft: false,
  },
  {
    name: 'SWFT AI',
    initials: '⚡',
    color: '#1a1a1a',
    preview: 'Reminder: Your flight is at 6:30 AM tomorrow',
    time: 'Yesterday',
    unread: false,
    swft: true,
    border: '#c8f400',
  },
  {
    name: 'Running Club 🏃',
    initials: 'RC',
    color: '#00c7be',
    preview: 'Next run is Saturday at 8am, Lake Trail',
    time: 'Monday',
    unread: false,
    swft: false,
  },
  {
    name: 'David Kim',
    initials: 'DK',
    color: '#ff6482',
    preview: 'Let\'s catch up over coffee this week?',
    time: 'Monday',
    unread: false,
    swft: false,
  },
];

export function createMessagePage(container) {
  function render() {
    container.innerHTML = `
      <div class="page messages-page">
        <div class="messages-header">
          <button class="edit-btn">Edit</button>
          <h1>Messages</h1>
          <button class="edit-btn" aria-label="Compose" style="font-size:20px;">✎</button>
        </div>

        <input class="messages-search" type="text" placeholder="🔍  Search" />

        <div class="messages-list" id="messagesList">
          ${CONVERSATIONS.map(renderRow).join('')}
        </div>
      </div>
    `;
  }

  function renderRow(c) {
    const avatarStyle = c.border
      ? `background:${c.color}; border: 2px solid ${c.border};`
      : `background:${c.color};`;

    const swftBadge = c.swft
      ? `<span class="swft-badge">
           <svg viewBox="0 0 12 12"><polygon points="6,0 7.5,4.5 12,4.5 8.25,7.5 9.75,12 6,9 2.25,12 3.75,7.5 0,4.5 4.5,4.5"/></svg>
           SWFT
         </span>`
      : '';

    return `
      <div class="message-row">
        <div class="avatar" style="${avatarStyle}">${c.initials}</div>
        <div class="message-info">
          <div class="message-top">
            <span class="message-name">${c.name}${swftBadge}</span>
            <span class="message-time">${c.time}</span>
          </div>
          <div class="message-preview">${c.preview}</div>
        </div>
        ${c.unread ? '<div class="unread-dot"></div>' : ''}
      </div>
    `;
  }

  render();
}
