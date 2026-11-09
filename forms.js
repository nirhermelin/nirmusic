/* Nir Music: sends the signup and contact forms to /api/contact (which emails them via Resend). */
(function(){
  var FALLBACK = 'Something went wrong. Please email music@nirhermelin.com';
  document.querySelectorAll('form[data-form]').forEach(function(f){
    var btn = f.querySelector('button[type="submit"]'), label = btn ? btn.textContent : '';
    var status = f.querySelector('.fstatus');
    if (!status) { status = document.createElement('p'); status.className = 'fstatus'; status.setAttribute('role','status'); f.appendChild(status); }
    f.addEventListener('submit', function(e){
      e.preventDefault();
      var data = { type: f.getAttribute('data-form'), page: document.body.getAttribute('data-page') || 'home' };
      new FormData(f).forEach(function(v,k){ data[k] = v; });
      if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }
      status.textContent = '';
      fetch('/api/contact', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data) })
        .then(function(r){ return r.json().catch(function(){ return {}; }).then(function(j){ return { ok: r.ok && j.ok, j: j }; }); })
        .then(function(x){
          if (x.ok) {
            f.reset();
            status.textContent = data.type === 'signup' ? 'Thank you. You’re on the list.' : 'Thank you. Your message is on its way.';
          } else { status.textContent = (x.j && x.j.error && x.j.error !== 'Email is not set up yet.') ? x.j.error : FALLBACK; }
        })
        .catch(function(){ status.textContent = FALLBACK; })
        .then(function(){ if (btn) { btn.disabled = false; btn.textContent = label; } });
    });
  });
})();
