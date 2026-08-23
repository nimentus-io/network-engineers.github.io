/* ──────────────────────────────────────────────────────────────────────────
   network-engineers.com — cli.js
   IOS-style interactive terminal for /cli.html
   ────────────────────────────────────────────────────────────────────────── */

const FORMSPREE_URL = 'https://formspree.io/f/mzepqpdb'

var outputEl   = document.getElementById('cli-output')
var inputEl    = document.getElementById('cli-input')
var promptEl   = document.getElementById('cli-prompt-text')
var mainEl     = document.getElementById('cli-main')

var cmdHistory = []
var histCursor = -1
var mode       = 'normal'   /* 'normal' | 'peer-name' | 'peer-email' */
var peerName   = ''

/* Full command list — used for Tab completion */
var ALL_COMMANDS = [
  'help',
  'show run',
  'show version',
  'show archive',
  'peer',
  'configure peer',
  'clear',
  'exit',
  'quit',
  'home',
]

/* ── Boot ─────────────────────────────────────────────────────────────────── */

;(function () {
  println('dim', 'network-engineers.com — interactive terminal')
  println('dim', 'IOS-style CLI. Type ? for help, Tab to complete.')
  println('dim', '')

  /* Mobile advisory — shown only when CSS .cli-mobile-note is display:block */
  var note = document.createElement('div')
  note.className = 'cli-line t-t1 cli-mobile-note'
  note.textContent = '% Best experienced with a physical keyboard.'
  outputEl.appendChild(note)

  inputEl.focus()
})()

/* Click anywhere in terminal to (re)focus the input */
mainEl.addEventListener('click', function () { inputEl.focus() })

/* ── Keyboard ─────────────────────────────────────────────────────────────── */

inputEl.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') {
    e.preventDefault()
    var raw = inputEl.value
    inputEl.value = ''
    handleInput(raw)

  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    if (!cmdHistory.length) return
    if (histCursor === -1) histCursor = cmdHistory.length - 1
    else if (histCursor > 0) histCursor--
    inputEl.value = cmdHistory[histCursor]

  } else if (e.key === 'ArrowDown') {
    e.preventDefault()
    if (histCursor === -1) return
    histCursor++
    if (histCursor >= cmdHistory.length) { histCursor = -1; inputEl.value = ''; return }
    inputEl.value = cmdHistory[histCursor]

  } else if (e.key === 'Tab') {
    e.preventDefault()
    if (mode === 'normal') tabComplete()

  } else if (e.ctrlKey && e.key === 'c') {
    e.preventDefault()
    if (mode !== 'normal') {
      inputEl.value = ''
      mode = 'normal'
      promptEl.textContent = 'ne#'
      println('dim', '^C')
      println('dim', '')
      scrollBottom()
    }

  } else if (e.ctrlKey && e.key === 'l') {
    e.preventDefault()
    outputEl.innerHTML = ''
  }
})

/* ── Input dispatch ───────────────────────────────────────────────────────── */

function handleInput(raw) {
  var trimmed = raw.trim()
  echoCmd(promptEl.textContent, raw)

  if (trimmed && cmdHistory[cmdHistory.length - 1] !== trimmed) {
    cmdHistory.push(trimmed)
  }
  histCursor = -1

  /* Multi-step peer flow */
  if (mode === 'peer-name') {
    if (!trimmed) { println('t1', '%ERR: name cannot be empty'); scrollBottom(); return }
    peerName = trimmed
    mode = 'peer-email'
    promptEl.textContent = 'ne(peer)#'
    println('dim', '  set neighbor.email:')
    scrollBottom()
    return
  }

  if (mode === 'peer-email') {
    if (!trimmed || !trimmed.includes('@')) {
      println('t1', '%ERR: valid email address required')
      scrollBottom()
      return
    }
    var email = trimmed
    mode = 'normal'
    promptEl.textContent = 'ne#'
    submitPeer(peerName, email)
    return
  }

  /* Normal mode */
  var cmd = trimmed.toLowerCase()

  switch (cmd) {
    case '':                                  break
    case '?':
    case 'help':          cmdHelp();          break
    case 'show run':      cmdShowRun();       break
    case 'show version':  cmdShowVersion();   break
    case 'show archive':  cmdShowArchive();   break
    case 'peer':
    case 'configure peer':cmdStartPeer();     break
    case 'clear':         outputEl.innerHTML = ''; break
    case 'exit':
    case 'quit':
    case 'home':          window.location.href = './'; return
    default:
      if (cmd === 'show') {
        println('t1', '% Incomplete command. Try: show run | show version | show archive')
      } else {
        println('t1', '% Unknown command: "' + trimmed + '". Type ? for help.')
      }
  }

  scrollBottom()
}

/* ── Commands ─────────────────────────────────────────────────────────────── */

function cmdHelp() {
  println('dim', '')
  println('ch',  '  Command              Description')
  println('dim', '  ' + '─'.repeat(48))
  printRow('?  /  help',          'show this help')
  printRow('show run',            'display community configuration')
  printRow('show version',        'display site information')
  printRow('show archive',        'list published conclusions')
  printRow('peer',                'join the founding circle (interactive)')
  printRow('clear',               'clear terminal output')
  printRow('exit  /  home',       'return to main site')
  println('dim', '')
  println('dim', '  Keyboard shortcuts:')
  println('dim', '  Tab        complete command (press twice if ambiguous)')
  println('dim', '  ↑ / ↓      command history')
  println('dim', '  Ctrl+C     cancel current input')
  println('dim', '  Ctrl+L     clear screen')
  println('dim', '')
}

function cmdShowRun() {
  println('dim', '')
  println('wh',  'community network-engineers.com')
  println('wh',  ' description vendor-neutral, bi-weekly')
  println('wh',  ' session-length 30')
  println('wh',  ' topic-selection community-vote')
  println('wh',  ' guest-policy practitioner-only')
  println('gr',  ' output written conclusion, published here')
  println('gr',  ' sponsors none')
  println('gr',  ' fees none')
  println('wh',  ' exec-timeout hard-stop')
  println('dim', '')
}

function cmdShowVersion() {
  println('dim', '')
  println('wh',  'network-engineers.com, version 0.1.0')
  println('wh',  ' platform         github-pages')
  println('wh',  ' sessions         0')
  println('wh',  ' next-session     TBA')
  println('wh',  ' founding-circle  open')
  println('dim', '')
}

function cmdShowArchive() {
  println('dim', '')
  println('dim', '% No conclusions published yet.')
  println('dim', '% Check back after the first session.')
  println('dim', '')
}

function cmdStartPeer() {
  println('dim', '')
  println('dim', 'Entering peer configuration. Ctrl+C to cancel.')
  println('dim', '')
  mode = 'peer-name'
  promptEl.textContent = 'ne(peer)#'
  println('dim', '  set neighbor.name:')
}

function submitPeer(name, email) {
  println('dim', '')
  println('dim', '%BGP-5-ADJCHANGE: neighbor ' + name + ', establishing...')
  inputEl.disabled = true

  var fd = new FormData()
  fd.append('name', name)
  fd.append('email', email)

  fetch(FORMSPREE_URL, {
    method:  'POST',
    headers: { 'Accept': 'application/json' },
    body:    fd,
  })
  .then(function (r) { return r.json() })
  .then(function (data) {
    inputEl.disabled = false
    inputEl.focus()
    if (data.ok) {
      println('gr',  '%BGP-5-ADJCHANGE: neighbor ' + name + ', state Established')
      println('dim', "%BGP-6-NOTIFICATION: we'll be in touch before the first session")
    } else {
      println('t1', '%BGP-3-NOTIFICATION: submission error — try again')
    }
    println('dim', '')
    scrollBottom()
  })
  .catch(function () {
    inputEl.disabled = false
    inputEl.focus()
    println('t1', '%BGP-3-NOTIFICATION: network error — check connection and try again')
    println('dim', '')
    scrollBottom()
  })
}

/* ── Tab completion ───────────────────────────────────────────────────────── */

function tabComplete() {
  var val = inputEl.value.toLowerCase()

  /* Empty input: list everything */
  if (!val.trim()) {
    println('dim', '')
    ALL_COMMANDS.forEach(function (cmd) { println('ch', '  ' + cmd) })
    println('dim', '')
    scrollBottom()
    return
  }

  var matches = ALL_COMMANDS.filter(function (cmd) { return cmd.startsWith(val) })

  if (matches.length === 0) {
    /* No match — Cisco behaviour: print nothing, don't advance */
    return
  }

  if (matches.length === 1) {
    /* Unambiguous — complete the full command */
    inputEl.value = matches[0]
    return
  }

  /* Ambiguous — complete to longest common prefix */
  var lcp = longestCommonPrefix(matches)

  if (lcp.length > val.length) {
    /* Advance as far as we can without ambiguity */
    inputEl.value = lcp
  } else {
    /* Already at LCP — show options (second Tab press, or `show ` etc.) */
    println('dim', '')
    matches.forEach(function (cmd) { println('ch', '  ' + cmd) })
    println('dim', '')
    scrollBottom()
  }
}

function longestCommonPrefix(strs) {
  if (!strs.length) return ''
  var prefix = strs[0]
  for (var i = 1; i < strs.length; i++) {
    while (strs[i].indexOf(prefix) !== 0) {
      prefix = prefix.slice(0, -1)
      if (!prefix) return ''
    }
  }
  return prefix
}

/* ── Output helpers ───────────────────────────────────────────────────────── */

function println(cls, text) {
  var d = document.createElement('div')
  d.className = 'cli-line t-' + cls
  d.textContent = text
  outputEl.appendChild(d)
  scrollBottom()
}

function echoCmd(prompt, text) {
  var d  = document.createElement('div')
  d.className = 'cli-line'
  var ps = document.createElement('span')
  ps.className = 't-dim'
  ps.textContent = prompt + ' '
  var ts = document.createElement('span')
  ts.className = 't-wh'
  ts.textContent = text
  d.appendChild(ps)
  d.appendChild(ts)
  outputEl.appendChild(d)
}

function printRow(cmd, desc) {
  var d = document.createElement('div')
  d.className = 'cli-line t-ch'
  d.textContent = ('  ' + cmd).padEnd(24) + desc
  outputEl.appendChild(d)
}

function scrollBottom() {
  mainEl.scrollTop = mainEl.scrollHeight
}
