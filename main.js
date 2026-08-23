/* ──────────────────────────────────────────────────────────────────────────
   network-engineers.com — main.js
   ────────────────────────────────────────────────────────────────────────── */

/* ── Edit these to update the status displays, peering button, and footer ── */
const CONCLUSIONS_COUNT = 0
const NEXT_SESSION      = 'TBA'
const LINKEDIN_URL = 'https://www.linkedin.com/company/network-engineers-com'
const GITHUB_URL   = 'https://github.com/nimentus'
const RSS_URL      = '/feed.xml'

/* ── Masthead + mini-bar status lines ───────────────────────────────────── */
;(function () {
  var text = 'conclusions: ' + CONCLUSIONS_COUNT + ' | next: ' + NEXT_SESSION
  var mhEl = document.getElementById('mh-status')
  var mbEl = document.getElementById('mini-bar-status')
  if (mhEl) mhEl.textContent = text
  if (mbEl) mbEl.textContent = text
})()

/* ── Mini-bar: appear when masthead scrolls out of view ─────────────────── */
;(function () {
  var miniBar = document.getElementById('mini-bar')
  var masthead = document.getElementById('masthead')
  if (!miniBar || !masthead) return

  var obs = new IntersectionObserver(function (entries) {
    miniBar.classList.toggle('visible', !entries[0].isIntersecting)
  }, { threshold: 0 })

  obs.observe(masthead)
})()

/* ── Peer form — AJAX submit to Formspree ───────────────────────────────── */
/* To activate: sign up at formspree.io, create a form, replace REPLACE-FORMSPREE-ID
   in index.html with your form ID (e.g. xpwzgkrb).                           */
;(function () {
  var form    = document.getElementById('peer-form')
  var btn     = document.getElementById('peer-btn')
  var status  = document.getElementById('peer-status')
  var success = document.getElementById('peer-success')
  if (!form || !btn || !status) return

  form.addEventListener('submit', function (e) {
    e.preventDefault()

    var nameVal  = form.querySelector('#peer-name').value.trim()
    var emailVal = form.querySelector('#peer-email').value.trim()

    if (!nameVal || !emailVal) {
      status.textContent  = '%ERR: neighbor.name and neighbor.email required'
      status.style.color  = 'var(--t1)'
      return
    }

    btn.disabled        = true
    btn.textContent     = 'peering...'
    status.textContent  = '%BGP-5-ADJCHANGE: neighbor pending, establishing...'
    status.style.color  = ''

    fetch(form.action, {
      method:  'POST',
      headers: { 'Accept': 'application/json' },
      body:    new FormData(form),
    })
    .then(function (r) { return r.json() })
    .then(function (data) {
      if (data.ok) {
        form.hidden = true
        if (success) success.hidden = false
      } else {
        status.textContent = '%BGP-3-NOTIFICATION: submission error — try again'
        status.style.color = 'var(--t1)'
        btn.disabled       = false
        btn.textContent    = 'peer now'
      }
    })
    .catch(function () {
      status.textContent = '%BGP-3-NOTIFICATION: network error — try again'
      status.style.color = 'var(--t1)'
      btn.disabled       = false
      btn.textContent    = 'peer now'
    })
  })
})()

/* ── Keyboard shortcuts: 1–4 scroll to sections ────────────────────────── */
;(function () {
  var targets = { '1': '#home', '2': '#join', '3': '#about' }
  document.addEventListener('keydown', function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return
    var tag = document.activeElement && document.activeElement.tagName
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
    var sel = targets[e.key]
    if (!sel) return
    var el = document.querySelector(sel)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  })
})()

/* ── aria-current: mark active section in bottom bar ───────────────────── */
;(function () {
  var ids   = ['home', 'join', 'about']
  var links = {}
  ids.forEach(function (id) {
    links[id] = document.querySelector('#bottom-bar a[href="#' + id + '"]')
  })

  var visible = new Set()

  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      e.isIntersecting ? visible.add(e.target.id) : visible.delete(e.target.id)
    })
    var found = false
    ids.forEach(function (id) {
      var link = links[id]
      if (!link) return
      if (!found && visible.has(id)) {
        link.setAttribute('aria-current', 'true')
        found = true
      } else {
        link.removeAttribute('aria-current')
      }
    })
  }, { rootMargin: '-10% 0px -10% 0px' })

  ids.forEach(function (id) {
    var el = document.getElementById(id)
    if (el) obs.observe(el)
  })
})()

/* ── Footer links ───────────────────────────────────────────────────────── */
;(function () {
  var map = {
    'ft-linkedin': LINKEDIN_URL,
    'ft-github':   GITHUB_URL,
    'ft-rss':      RSS_URL,
  }
  Object.keys(map).forEach(function (id) {
    var el = document.getElementById(id)
    if (el) el.href = map[id]
  })
})()

/* ── Terminal typewriter animation ──────────────────────────────────────── */
;(function () {

  /*
   * isSmall: long hero lines (46 chars) must not wrap on mobile.
   * Available width at 360px: 360 − 2×16px body pad − 2×24px pane pad = 280px.
   * At 14px JetBrains Mono: 46 × 8.4px = 386px > 280px → use short form.
   * Long form fits when viewport ≥ 386 + 80 = 466px → threshold 468px.
   */
  var isSmall = window.innerWidth < 468

  var LINES = [
    { text: 'ne# configure terminal',                                                       cls: 'dim', instant: false              },
    { text: 'ne(config)# interface Brain0/0',                                               cls: 'wh',  instant: false              },
    { text: 'ne(config-if)# no shutdown',                                                   cls: 'wh',  instant: false              },
    { text: isSmall ? '%LINK-3-UPDOWN: Brain0/0 → up'
                    : '%LINK-3-UPDOWN: Brain0/0, changed state to up',                      cls: 'gr',  instant: true               },
    { text: 'ne(config-if)# ip address topic/32',                                           cls: 'wh',  instant: false              },
    { text: 'ne(config-if)# exec-timeout 30 0',                                             cls: 'wh',  instant: false              },
    { text: '! -- 30 minutes of discussion --',                                             cls: 'dim', instant: false, pauseAfter: 1400 },
    { text: 'ne(config-if)# shutdown',                                                      cls: 'wh',  instant: false              },
    { text: 'ne# write memory',                                                             cls: 'wh',  instant: false              },
    { text: 'Building configuration... [OK]',                                               cls: 'dim', instant: true               },
    { text: isSmall ? '%Conclusion published.'
                    : '%Conclusion published. See you in two weeks.',                        cls: 'gr',  instant: true               },
  ]

  var anim    = document.getElementById('t-anim')
  var linesEl = document.getElementById('t-lines')
  var curEl   = document.getElementById('t-cur')

  if (!anim || !linesEl || !curEl) return

  anim.style.display = ''

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  var sleep   = function (ms) { return new Promise(function (r) { setTimeout(r, ms) }) }
  var rand    = function (lo, hi) { return Math.floor(Math.random() * (hi - lo + 1)) + lo }

  function makeLine(text, cls) {
    var d = document.createElement('div')
    d.className   = 't-' + cls
    d.textContent = text
    return d
  }

  function renderStatic() {
    LINES.forEach(function (l) { linesEl.appendChild(makeLine(l.text, l.cls)) })
    curEl.textContent    = ''
    curEl.style.display  = 'none'
  }

  async function runLoop() {
    curEl.textContent   = ''
    curEl.className     = 't-wh'
    curEl.style.display = ''

    for (var i = 0; i < LINES.length; i++) {
      var line = LINES[i]
      if (line.instant) {
        await sleep(55)
        linesEl.appendChild(makeLine(line.text, line.cls))
      } else {
        curEl.className = 't-' + line.cls
        for (var j = 0; j < line.text.length; j++) {
          curEl.textContent += line.text[j]
          await sleep(rand(28, 68))
        }
        await sleep(rand(100, 200))
        linesEl.appendChild(makeLine(line.text, line.cls))
        curEl.textContent = ''
      }
      await sleep(line.pauseAfter !== undefined ? line.pauseAfter : rand(70, 200))
    }

    curEl.style.display = 'none'
  }

  if (reduced) { renderStatic() } else { runLoop() }

})()
