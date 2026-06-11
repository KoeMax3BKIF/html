/* ════════════════════════════════════════════
   abschluss.js – JavaScript für alle
   Abschlussprojekt-Seiten (1–4)
   ════════════════════════════════════════════ */

/* ── Gemeinsame Funktionen ─────────────────── */
function toggleSwitcher(btn) {
  btn.classList.toggle('open');
  document.getElementById('switcherMenu').classList.toggle('open');
}
document.addEventListener('click', function(e) {
  if (!e.target.closest('.switcher-inner')) {
    document.querySelectorAll('.switcher-btn').forEach(function(b) { b.classList.remove('open'); });
    document.querySelectorAll('.switcher-menu').forEach(function(m) { m.classList.remove('open'); });
  }
});
function initSwitcher(cid, label, src) {
  var icon = document.getElementById('switcherIcon');
  var lbl  = document.getElementById('switcherLabel');
  if (icon) { icon.src = src; icon.alt = label; }
  if (lbl)  lbl.textContent = label;
  document.querySelectorAll('.switcher-item').forEach(function(x) {
    if (x.dataset.id === cid) x.classList.add('active');
  });
}
function initToc() {
  document.querySelectorAll('.toc-toggle').forEach(function(btn) {
    btn.addEventListener('click', function() {
      btn.classList.toggle('open');
      btn.nextElementSibling.classList.toggle('open');
    });
  });
}
// Call initToc immediately if DOM ready, otherwise wait
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initToc);
} else {
  initToc();
}


function exportList(data, fmtId, filenameBase) {
  var fmt = document.getElementById(fmtId).value;
  var content = '', mime = '', ext = '';
  if (fmt === 'json') {
    content = JSON.stringify(data, null, 2); mime = 'application/json'; ext = 'json';
  } else if (fmt === 'xml') {
    var tag = filenameBase.replace(/[^a-z]/gi, '_');
    var rows = data.map(function(d, i) {
      var inner = Object.keys(d).map(function(k) {
        return '    <' + k + '>' + String(d[k]).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') + '</' + k + '>';
      }).join('\n');
      return '  <item index="' + (i+1) + '">\n' + inner + '\n  </item>';
    }).join('\n');
    content = '<?xml version="1.0" encoding="UTF-8"?>\n<' + tag + '>\n' + rows + '\n</' + tag + '>';
    mime = 'application/xml'; ext = 'xml';
  } else {
    content = data.map(function(d) {
      return Object.keys(d).map(function(k) { return k + ': ' + d[k]; }).join(' | ');
    }).join('\n');
    mime = 'text/plain'; ext = 'txt';
  }
  var blob = new Blob([content], {type: mime});
  var url  = URL.createObjectURL(blob);
  var a    = document.createElement('a');
  a.href = url; a.download = filenameBase + '.' + ext; a.click();
  URL.revokeObjectURL(url);
}
