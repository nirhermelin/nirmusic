/* nir's journeys — always-on bottom player, shared by every page.
   To change the music: edit TRACKS below (title + path to the MP3). */
(function(){
  var css = "/* now-playing persistent bar */\n.nowbar{position:fixed;left:0;right:0;bottom:0;z-index:50;display:flex;align-items:center;gap:clamp(10px,1.6vw,18px);padding:11px clamp(14px,4vw,40px);\n  background:linear-gradient(180deg,rgba(11,15,9,.6),rgba(8,11,6,.97));backdrop-filter:blur(14px);border-top:1px solid rgba(214,136,63,.25)}\n.nbctrls{display:flex;align-items:center;gap:8px;flex:0 0 auto}\n.nbbtn{width:34px;height:34px;flex:0 0 auto;border:0;background:transparent;cursor:pointer;display:flex;align-items:center;justify-content:center;border-radius:50%;transition:background .15s}\n.nbbtn:hover{background:rgba(214,136,63,.16)}\n.nbbtn svg{width:20px;height:20px;fill:var(--amber-lt);stroke:var(--amber-lt)}\n.nbplay{width:44px;height:44px;border-radius:50%;flex:0 0 auto;border:0;cursor:pointer;background:var(--amber);display:flex;align-items:center;justify-content:center;transition:background .2s}\n.nbplay:hover{background:var(--amber-lt)}\n.nbplay::before{content:\"\";border-left:13px solid #241505;border-top:8px solid transparent;border-bottom:8px solid transparent;margin-left:3px}\n.nbplay.playing::before{border:0;width:12px;height:14px;border-left:4px solid #241505;border-right:4px solid #241505;margin:0}\n.nbinfo{min-width:130px;max-width:280px;flex:0 1 auto;overflow:hidden}\n.nbt{font-size:14px;color:var(--cream);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.nbs{font-size:11px;color:var(--muted);margin-top:2px}\n.nbprog{flex:1 1 auto;min-width:60px;height:6px;border-radius:4px;background:rgba(255,255,255,.12);overflow:hidden;cursor:pointer}\n.nbfill{height:100%;width:0;background:var(--amber-lt);pointer-events:none}\n.nbtime{font-size:12px;color:var(--muted);font-variant-numeric:tabular-nums;flex:0 0 auto;white-space:nowrap}\n.nbvol{display:flex;align-items:center;gap:8px;flex:0 0 auto}\n.nbvolic{width:20px;height:20px;fill:var(--muted);stroke:var(--muted)}\n.nbvolsl{-webkit-appearance:none;appearance:none;width:84px;height:4px;border-radius:4px;background:rgba(255,255,255,.16);outline:0;cursor:pointer}\n.nbvolsl::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:13px;height:13px;border-radius:50%;background:var(--amber-lt);cursor:pointer;border:0}\n.nbvolsl::-moz-range-thumb{width:13px;height:13px;border-radius:50%;background:var(--amber-lt);cursor:pointer;border:0}\n@media(max-width:720px){.nbs{display:none}.nbvol{display:none}.nbinfo{min-width:96px}}\n";
  var st=document.createElement('style'); st.textContent=css; document.head.appendChild(st);
  var wrap=document.createElement('div');
  wrap.innerHTML = "<div class=\"nowbar\" id=\"nowbar\">\n  <div class=\"nbctrls\">\n    <button class=\"nbbtn\" id=\"nbprev\" aria-label=\"Previous\"><svg viewBox=\"0 0 24 24\"><path d=\"M7 5v14M20 5v14l-11-7z\"/></svg></button>\n    <button class=\"nbplay\" id=\"nbplay\" aria-label=\"Play/pause\"></button>\n    <button class=\"nbbtn\" id=\"nbnext\" aria-label=\"Next\"><svg viewBox=\"0 0 24 24\"><path d=\"M17 5v14M4 5v14l11-7z\"/></svg></button>\n  </div>\n  <div class=\"nbinfo\"><div class=\"nbt\" id=\"nbt\"></div><div class=\"nbs\">unreleased \u00b7 nir's journeys</div></div>\n  <div class=\"nbprog\" id=\"nbprog\"><div class=\"nbfill\" id=\"nbfill\"></div></div>\n  <div class=\"nbtime\" id=\"nbtime\">0:00 / 0:00</div>\n  <div class=\"nbvol\">\n    <svg class=\"nbvolic\" viewBox=\"0 0 24 24\"><path d=\"M4 9v6h4l5 4V5L8 9H4z\"/><path d=\"M16 8.5a4 4 0 0 1 0 7\" fill=\"none\" stroke-width=\"1.8\"/></svg>\n    <input class=\"nbvolsl\" id=\"nbvol\" type=\"range\" min=\"0\" max=\"1\" step=\"0.01\" value=\"0.9\" aria-label=\"Volume\">\n  </div>\n</div>\n<audio id=\"ap\" preload=\"metadata\"></audio>\n";
  while(wrap.firstChild) document.body.appendChild(wrap.firstChild);
  /* ALWAYS-ON bottom player — four unreleased tracks, prev/play/next, seek, volume.
     Add each track's MP3 URL to `src` below and it plays; empty src = UI only. */
  var TRACKS=[
    {title:"I Sat Down and the Journey Started",                 src:"music/i-sat-down-and-the-journey-started.mp3"},
    {title:"Abba'le",                                            src:"music/abbale.mp3"},
    {title:"Middle East Song (Original Release)",                src:"music/middle-east-song.mp3"},
    {title:"I Sat Down and the Journey Started (Extended Intro)",src:"music/i-sat-down-extended-intro.mp3"}
  ];
  var ap=document.getElementById('ap'), pb=document.getElementById('nbplay'),
      nbt=document.getElementById('nbt'), fill=document.getElementById('nbfill'),
      tm=document.getElementById('nbtime'), prog=document.getElementById('nbprog'),
      vol=document.getElementById('nbvol'), prev=document.getElementById('nbprev'), next=document.getElementById('nbnext');
  var idx=0;
  function fmt(s){s=Math.floor(s||0);return Math.floor(s/60)+':'+('0'+(s%60)).slice(-2);}
  ap.volume=parseFloat(vol.value);
  function load(i, autoplay){
    idx=(i+TRACKS.length)%TRACKS.length;
    var t=TRACKS[idx];
    nbt.textContent=t.title;
    fill.style.width='0'; tm.textContent='0:00 / '+(t.src?'…':'0:00');
    if(t.src){ ap.src=t.src; if(autoplay){ ap.play().then(playing).catch(paused); } else paused(); }
    else { ap.removeAttribute('src'); paused(); tm.textContent='0:00 / 0:00'; }
  }
  function playing(){pb.classList.add('playing');}
  function paused(){pb.classList.remove('playing');}
  pb.addEventListener('click',function(){
    if(!ap.getAttribute('src')) return;              // nothing loaded yet
    if(ap.paused){ ap.play().then(playing).catch(paused); } else { ap.pause(); paused(); }
  });
  next.addEventListener('click',function(){ load(idx+1, !ap.paused && !!ap.getAttribute('src')); });
  prev.addEventListener('click',function(){
    if(ap.currentTime>3){ ap.currentTime=0; return; }  // like most players: restart, then go back
    load(idx-1, !ap.paused && !!ap.getAttribute('src'));
  });
  vol.addEventListener('input',function(){ ap.volume=parseFloat(vol.value); });
  prog.addEventListener('click',function(e){
    if(!ap.duration) return;
    var r=prog.getBoundingClientRect();
    ap.currentTime=Math.min(1,Math.max(0,(e.clientX-r.left)/r.width))*ap.duration;
  });
  ap.addEventListener('timeupdate',function(){
    if(ap.duration){ fill.style.width=(ap.currentTime/ap.duration*100)+'%'; tm.textContent=fmt(ap.currentTime)+' / '+fmt(ap.duration); }
  });
  ap.addEventListener('play', playing);
  ap.addEventListener('pause', paused);
  ap.addEventListener('ended',function(){ load(idx+1, true); });  // auto-advance
  /* remember track + position between pages (per visitor, this tab only) */
  var saved=null; try{ saved=JSON.parse(sessionStorage.getItem('nj-player')||'null'); }catch(e){}
  load(saved&&saved.i!=null?saved.i:0, false);
  if(saved&&saved.t){ ap.addEventListener('loadedmetadata',function once(){ ap.removeEventListener('loadedmetadata',once); try{ap.currentTime=saved.t;}catch(e){} }); }
  function remember(){ try{ sessionStorage.setItem('nj-player',JSON.stringify({i:idx,t:ap.currentTime||0})); }catch(e){} }
  window.addEventListener('pagehide',remember);
  ap.addEventListener('pause',remember);
})();
