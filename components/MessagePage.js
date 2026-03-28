// ─── MessagePage: iMessage-style conversation list ───

var threads = [
  { name: 'Sarah Chen',    ini: 'SC', bg: '#5856d6', msg: 'Sounds good! See you at 7',                    time: '2:14 PM',   unread: true,  ai: false },
  { name: 'SWFT AI',       ini: '\u26A1', bg: '#1a1a1a', msg: 'Here\u2019s a summary of your meeting notes\u2026', time: '1:48 PM',   unread: true,  ai: true, ring: '#c8f400' },
  { name: 'Mike Torres',   ini: 'MT', bg: '#ff9500', msg: 'Did you see the game last night?',             time: '12:30 PM',  unread: false, ai: false },
  { name: 'Design Team',   ini: 'DT', bg: '#30d158', msg: 'Alex: Updated the Figma file with new flows',  time: '11:15 AM',  unread: false, ai: false },
  { name: 'SWFT Drafts',   ini: '\u2726', bg: '#1a1a1a', msg: 'Draft: Follow-up email for client meeting',   time: '10:02 AM',  unread: false, ai: true, ring: '#c8f400' },
  { name: 'Jordan Blake',  ini: 'JB', bg: '#ff375f', msg: 'Thanks for the recommendation!',               time: '9:45 AM',   unread: false, ai: false },
  { name: 'Mom',           ini: 'M',  bg: '#af52de', msg: 'Call me when you get a chance honey',           time: 'Yesterday', unread: false, ai: false },
  { name: 'Priya Patel',   ini: 'PP', bg: '#007aff', msg: 'The report is attached. Let me know!',         time: 'Yesterday', unread: false, ai: false },
  { name: 'SWFT AI',       ini: '\u26A1', bg: '#1a1a1a', msg: 'Reminder: Your flight is at 6:30 AM tomorrow', time: 'Yesterday', unread: false, ai: true, ring: '#c8f400' },
  { name: 'Running Club',  ini: 'RC', bg: '#00c7be', msg: 'Next run is Saturday at 8am, Lake Trail',      time: 'Monday',    unread: false, ai: false },
  { name: 'David Kim',     ini: 'DK', bg: '#ff6482', msg: 'Let\u2019s catch up over coffee this week?',       time: 'Monday',    unread: false, ai: false },
];

function row(t) {
  var style = t.ring ? 'background:' + t.bg + ';border:2px solid ' + t.ring : 'background:' + t.bg;
  var tag = t.ai ? '<span class="badge"><svg viewBox="0 0 12 12"><polygon points="6,0 7.5,4.5 12,4.5 8.25,7.5 9.75,12 6,9 2.25,12 3.75,7.5 0,4.5 4.5,4.5"/></svg>SWFT</span>' : '';
  var dot = t.unread ? '<div class="dot"></div>' : '';
  return '<div class="m-row">' +
    '<div class="avatar" style="' + style + '">' + t.ini + '</div>' +
    '<div class="m-info">' +
      '<div class="m-top"><span class="m-name">' + t.name + tag + '</span><span class="m-time">' + t.time + '</span></div>' +
      '<div class="m-preview">' + t.msg + '</div>' +
    '</div>' + dot +
  '</div>';
}

export function createMessagePage(el) {
  el.innerHTML =
    '<div class="page">' +
      '<div class="m-header"><button>Edit</button><h1>Messages</h1><button style="font-size:20px">\u270E</button></div>' +
      '<input class="m-search" type="text" placeholder="Search">' +
      '<div class="m-list">' + threads.map(row).join('') + '</div>' +
    '</div>';
}
