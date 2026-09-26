/* SIGNAL SOCIETY — v8 interactions */
(function(){
  var header=document.getElementById('siteHeader');
  function onScroll(){ if(header) header.classList.toggle('site-header--scrolled',window.scrollY>16); }
  window.addEventListener('scroll',onScroll,{passive:true}); onScroll();

  var toggle=document.getElementById('navToggle'), menu=document.getElementById('mobileMenu');
  if(toggle&&menu){
    toggle.addEventListener('click',function(){
      var open=menu.classList.toggle('active'); toggle.classList.toggle('active',open);
      menu.setAttribute('aria-hidden',String(!open)); document.body.style.overflow=open?'hidden':'';
    });
    menu.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){menu.classList.remove('active');toggle.classList.remove('active');document.body.style.overflow='';});});
  }

  var io=('IntersectionObserver' in window)?new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target);}});},{threshold:.08,rootMargin:'0px 0px -30px 0px'}):null;
  document.querySelectorAll('.reveal').forEach(function(el,i){ if(io) io.observe(el); else el.classList.add('visible'); });

  document.querySelectorAll('.faq-item').forEach(function(item){
    var btn=item.querySelector('.faq-item__q'), body=item.querySelector('.faq-item__body');
    if(!btn||!body) return;
    btn.addEventListener('click',function(){
      var was=item.classList.contains('active');
      document.querySelectorAll('.faq-item.active').forEach(function(o){o.classList.remove('active');o.querySelector('.faq-item__q').setAttribute('aria-expanded','false');o.querySelector('.faq-item__body').style.maxHeight='';});
      if(!was){item.classList.add('active');btn.setAttribute('aria-expanded','true');body.style.maxHeight=body.scrollHeight+'px';}
    });
  });

  var form=document.getElementById('contactForm'), btn=document.getElementById('submitBtn'), msg=document.getElementById('formMessage');
  if(form){
    form.addEventListener('submit',async function(e){
      e.preventDefault();
      var fd=new FormData(form), label=btn?btn.querySelector('.btn__text'):null;
      if(btn) btn.disabled=true; if(label) label.textContent='Sending...';
      if(msg){msg.innerHTML='';msg.className='form__message';}
      try{
        var res=await fetch('https://api.web3forms.com/submit',{method:'POST',body:fd});
        var json=await res.json();
        if(json.success){ if(label) label.textContent='Sent ✓'; if(msg){msg.innerHTML='<strong>Message sent successfully.</strong> We\'ll get back to you shortly.';msg.classList.add('form__message--success');} form.reset(); setTimeout(function(){if(label)label.innerHTML='Send message <span class="arrow">→</span>';},5000);}
        else throw new Error(json.message||'failed');
      }catch(err){ if(label)label.innerHTML='Send message <span class="arrow">→</span>'; if(msg){msg.innerHTML='<strong>Something went wrong.</strong> Please email us directly at <a href="mailto:signalssoc@gmail.com" style="text-decoration:underline">signalssoc@gmail.com</a>.';msg.classList.add('form__message--error');} }
      if(btn) btn.disabled=false;
    });
  }
  /* CTA glass-tile mosaic (decorative, content untouched) */
  var CTA_TILES=[
    {l:'-3%',t:'6%',s:100,o:.9,r:'26%',d:'7s',dl:'-2s'},
    {l:'6%',t:'40%',s:64,o:.8,r:'24%',d:'8s',dl:'-4s'},
    {l:'1%',t:'68%',s:124,o:.85,r:'26%',d:'9s',dl:'-1s'},
    {l:'12%',t:'2%',s:52,o:.7,r:'24%',d:'6.5s',dl:'-3s'},
    {l:'14%',t:'58%',s:74,o:.8,r:'26%',d:'7.5s',dl:'-5s'},
    {l:'22%',t:'82%',s:56,o:.65,r:'24%',d:'6s',dl:'-2.5s'},
    {l:'27%',t:'16%',s:44,o:.6,r:'24%',d:'8.5s',dl:'-6s'},
    {r:'5%',t:'10%',s:88,o:.85,r:'26%',d:'7.2s',dl:'-3.5s'},
    {r:'1%',t:'54%',s:60,o:.7,r:'24%',d:'6.8s',dl:'-1.5s'},
    {r:'11%',b:'5%',s:106,o:.8,r:'26%',d:'8.2s',dl:'-4.5s'},
    {l:'38%',b:'-7%',s:144,o:.55,r:'26%',d:'9s',dl:'-2.2s'},
    {r:'30%',t:'-5%',s:72,o:.6,r:'24%',d:'7.8s',dl:'-5.5s'},
    {l:'48%',t:'10%',s:48,o:.55,r:'24%',d:'6.2s',dl:'-0.8s'},
    {r:'22%',b:'16%',s:52,o:.6,r:'24%',d:'7.4s',dl:'-3.2s'}
  ];
  document.querySelectorAll('.cta-band').forEach(function(band){
    if(band.querySelector('.cta-tiles')) return;
    var wrap=document.createElement('div');
    wrap.className='cta-tiles'; wrap.setAttribute('aria-hidden','true');
    CTA_TILES.forEach(function(t,i){
      var s=document.createElement('span');
      s.className='cta-tile'+(i%3===2?' cta-tile--soft':'');
      if(t.l) s.style.left=t.l; if(t.r) s.style.right=t.r;
      if(t.t) s.style.top=t.t; if(t.b) s.style.bottom=t.b;
      s.style.width=t.s+'px'; s.style.height=t.s+'px';
      s.style.opacity=t.o; s.style.borderRadius=t.r;
      s.style.animationDuration=t.d; s.style.animationDelay=t.dl;
      wrap.appendChild(s);
    });
    band.appendChild(wrap);
  });
  /* Process rail — vanilla scroll-driven horizontal journey */
  var rail=document.querySelector('.process-rail');
  if(rail){
    var track=rail.querySelector('.rail__track'),
        steps=Array.prototype.slice.call(rail.querySelectorAll('.step')),
        countNum=rail.querySelector('.rail__count-num'),
        mqMobile=window.matchMedia('(max-width:768px)'),
        mqReduce=window.matchMedia('(prefers-reduced-motion: reduce)'),
        railTop=0, railH=1, ticking=false;
    function staticMode(){ return mqMobile.matches||mqReduce.matches; }
    if(mqReduce.matches) rail.classList.add('rail--static');
    function measure(){ railTop=rail.getBoundingClientRect().top+window.scrollY; railH=Math.max(1,rail.offsetHeight-window.innerHeight); }
    function update(){
      ticking=false;
      if(staticMode()) return;
      var p=(window.scrollY-railTop)/railH;
      p=Math.max(0,Math.min(1,p));
      var maxShift=Math.max(0,track.scrollWidth-document.documentElement.clientWidth);
      track.style.transform='translate3d('+(-p*maxShift).toFixed(1)+'px,0,0)';
      rail.style.setProperty('--p',p.toFixed(4));
      var idx=Math.min(steps.length-1,Math.floor(p*steps.length));
      steps.forEach(function(s,i){ s.classList.toggle('is-active',i<=idx); });
      if(countNum) countNum.textContent=('0'+(idx+1)).slice(-2)+' / '+('0'+steps.length).slice(-2);
    }
    function requestUpdate(){ if(!ticking){ ticking=true; requestAnimationFrame(update); } }
    measure(); update();
    window.addEventListener('scroll',requestUpdate,{passive:true});
    window.addEventListener('resize',function(){ measure(); requestUpdate(); });
  }

  /* Flow carousel — vanilla coverflow */
  var flow=document.getElementById('svcFlow');
  if(flow){
    var viewport=flow.querySelector('.flow__viewport'),
        trackEl=flow.querySelector('.flow__track'),
        cards=Array.prototype.slice.call(trackEl.children),
        dots=Array.prototype.slice.call(flow.querySelectorAll('.flow__dot')),
        reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        fTick=false;
    function centerCard(card,behavior){ viewport.scrollTo({left:card.offsetLeft-viewport.clientWidth/2+card.clientWidth/2,behavior:behavior}); }
    function markCenter(){
      fTick=false;
      var vc=viewport.scrollLeft+viewport.clientWidth/2, best=0, bestD=1e9;
      cards.forEach(function(c,i){ var d=Math.abs(c.offsetLeft+c.clientWidth/2-vc); if(d<bestD){bestD=d;best=i;} });
      cards.forEach(function(c,i){ c.classList.toggle('is-center',i===best); });
      dots.forEach(function(dt,i){ dt.classList.toggle('is-on',i===best); });
    }
    function onFlowScroll(){ if(!fTick){ fTick=true; requestAnimationFrame(markCenter); } }
    viewport.addEventListener('scroll',onFlowScroll,{passive:true});
    window.addEventListener('resize',onFlowScroll);
    flow.querySelector('.flow__prev').addEventListener('click',function(){ var i=cards.findIndex(function(c){return c.classList.contains('is-center');}); centerCard(cards[(i-1+cards.length)%cards.length],reduceMotion?'auto':'smooth'); });
    flow.querySelector('.flow__next').addEventListener('click',function(){ var i=cards.findIndex(function(c){return c.classList.contains('is-center');}); centerCard(cards[(i+1)%cards.length],reduceMotion?'auto':'smooth'); });
    markCenter();
    function initCenter(){ centerCard(cards[0],'auto'); markCenter(); }
    if(document.fonts&&document.fonts.ready){ document.fonts.ready.then(function(){ requestAnimationFrame(initCenter); }); }
    requestAnimationFrame(initCenter);
  }

  /* WhatsApp floating button */
  if(!document.querySelector('.wa-float')){
    var wa=document.createElement('a');
    wa.className='wa-float';
    wa.href='https://wa.me/628214642769?text=Hello%2C%20Signal';
    wa.target='_blank'; wa.rel='noopener'; wa.setAttribute('aria-label','Chat via WhatsApp');
    wa.innerHTML='<svg viewBox="0 0 448 512" aria-hidden="true"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/></svg>';
    document.body.appendChild(wa);
  }

  /* Mini steps — auto-cycling process preview */
  var mini=document.getElementById('miniSteps');
  if(mini){
    var mSteps=Array.prototype.slice.call(mini.querySelectorAll('.mini-step')),
        mFill=mini.querySelector('.mini-steps__fill'),
        mIdx=0, mTimer=null,
        mReduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        mVisible=false;
    function paint(){ mSteps.forEach(function(s,i){ s.classList.toggle('is-on',i===mIdx); }); if(mFill) mFill.style.width=((mIdx+1)/mSteps.length*100)+'%'; }
    function cycle(){ mIdx=(mIdx+1)%mSteps.length; paint(); }
    function start(){ if(mTimer||mReduce) return; mTimer=setInterval(function(){ if(mVisible&&!document.hidden) cycle(); },1800); }
    function stop(){ if(mTimer){ clearInterval(mTimer); mTimer=null; } }
    if('IntersectionObserver' in window){ new IntersectionObserver(function(es){ mVisible=es[0].isIntersecting; },{threshold:.2}).observe(mini); } else { mVisible=true; }
    mini.addEventListener('mouseenter',stop);
    mini.addEventListener('mouseleave',start);
    paint(); start();
  }

  /* Decorative tile fields (hero breathing tiles + work twinkles) */
  function injectTiles(selector,wrapClass,tileClass,tiles){
    document.querySelectorAll(selector).forEach(function(host){
      if(host.querySelector('.'+wrapClass)) return;
      var wrap=document.createElement('div');
      wrap.className=wrapClass; wrap.setAttribute('aria-hidden','true');
      tiles.forEach(function(t,i){
        var s=document.createElement('span');
        s.className=tileClass+(i%3===2?' '+tileClass+'--soft':'');
        if(t.l)s.style.left=t.l; if(t.r)s.style.right=t.r;
        if(t.t)s.style.top=t.t; if(t.b)s.style.bottom=t.b;
        s.style.width=t.s+'px'; s.style.height=t.s+'px';
        if(t.o)s.style.opacity=t.o; if(t.bw)s.style.borderRadius=t.bw;
        s.style.animationDuration=t.d; s.style.animationDelay=t.dl;
        wrap.appendChild(s);
      });
      host.appendChild(wrap);
    });
  }
  var HERO_TILES=[
    {l:'4%',t:'12%',s:72,d:'6s',dl:'-2s'},{l:'12%',t:'58%',s:52,d:'7.5s',dl:'-4s'},
    {l:'2%',b:'8%',s:88,d:'8s',dl:'-1s'},{l:'20%',t:'30%',s:44,d:'5.5s',dl:'-3s'},
    {l:'30%',b:'14%',s:60,d:'7s',dl:'-5s'},{l:'44%',t:'8%',s:48,d:'6.2s',dl:'-.8s'},
    {r:'24%',t:'14%',s:64,d:'7.8s',dl:'-3.5s'},{r:'14%',b:'20%',s:56,d:'6.8s',dl:'-1.5s'},
    {r:'34%',b:'8%',s:44,d:'5.8s',dl:'-4.5s'},{l:'56%',b:'24%',s:52,d:'7.2s',dl:'-2.5s'},
    {l:'64%',t:'20%',s:40,d:'6s',dl:'-5.5s'},{r:'6%',t:'44%',s:68,d:'8.4s',dl:'-2.2s'}
  ];
  var TWINKLES=[
    {l:'6%',t:'18%',s:26,d:'5s',dl:'-1s'},{l:'16%',t:'64%',s:18,d:'6s',dl:'-3s'},
    {l:'28%',t:'30%',s:32,d:'5.5s',dl:'-.5s'},{l:'42%',t:'72%',s:22,d:'6.5s',dl:'-2s'},
    {l:'55%',t:'22%',s:28,d:'5.2s',dl:'-4s'},{l:'68%',t:'58%',s:20,d:'6.2s',dl:'-1.2s'},
    {l:'80%',t:'28%',s:30,d:'5.8s',dl:'-2.8s'},{l:'90%',t:'66%',s:24,d:'6.8s',dl:'-.8s'},
    {l:'36%',t:'48%',s:16,d:'5.4s',dl:'-3.6s'},{l:'74%',t:'82%',s:18,d:'6.4s',dl:'-2.4s'}
  ];
  injectTiles('.hero-atmos','hero-tiles','hero-tile',HERO_TILES);
  injectTiles('.tint','twinkles','twinkle-dot',TWINKLES);

  /* Page transitions — fade out on internal navigation */
  if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    document.addEventListener('click',function(e){
      if(e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey) return;
      var a=e.target&&e.target.closest?e.target.closest('a[href]'):null;
      if(!a) return;
      var href=a.getAttribute('href');
      if(!href||href.charAt(0)==='#') return;
      if(a.target==='_blank'||a.hasAttribute('download')) return;
      var url;
      try{ url=new URL(href,location.href); }catch(err){ return; }
      if(url.origin!==location.origin) return;
      if(url.pathname===location.pathname&&url.search===location.search) return;
      e.preventDefault();
      document.body.classList.add('is-leaving');
      setTimeout(function(){ location.href=url.href; },300);
    });
    window.addEventListener('pageshow',function(){ document.body.classList.remove('is-leaving'); });
  }
})();
