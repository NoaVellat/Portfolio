'use strict';
  /* ═══════════ 5. TABLE DES RENDERERS ═══════════ */
  const RENDERERS={
    terminal:renderClassic,
    'mise-en-place':renderMise,
    compile:renderCompile,
    fluid:renderFluid,
    atelier:renderAtelier
  };

  /* ═══════════ 6. ENHANCERS RE-RUNNABLES (registre de cleanup) ═══════════ */
  let cleanups=[];
  const onClean=fn=>cleanups.push(fn);
  function teardown(){ for(const f of cleanups){ try{f();}catch(e){} } cleanups=[]; }

  function initTyped(){
    const el=main.querySelector('#typed-hero'); if(!el)return;
    const lines=['./portfolio --open','git log --oneline','docker ps -a','npm run dev'];
    let li=0,ci=0,del=false,timer=0,alive=true;
    function tick(){ if(!alive)return; const s=lines[li];
      if(!del){ el.textContent=s.slice(0,++ci); if(ci===s.length){del=true;timer=setTimeout(tick,1600);return;} }
      else{ el.textContent=s.slice(0,--ci); if(ci===0){del=false;li=(li+1)%lines.length;} }
      timer=setTimeout(tick,del?35:75); }
    tick();
    onClean(()=>{alive=false;clearTimeout(timer);});
  }

  function initSkillTabs(){
    const tabs=main.querySelectorAll('.skill-tab');
    const panels=main.querySelectorAll('.skill-panel');
    tabs.forEach(tab=>tab.addEventListener('click',()=>{
      tabs.forEach(t=>t.classList.remove('active'));panels.forEach(p=>p.classList.remove('active'));
      tab.classList.add('active');const p=main.querySelector('#panel-'+tab.dataset.tab);
      if(p)p.classList.add('active');
    }));
  }

  function initCounters(){
    if(reduce){ main.querySelectorAll('[data-count]').forEach(el=>{el.textContent=el.dataset.count;}); return; }
    const obs=new IntersectionObserver(entries=>{ entries.forEach(entry=>{
      if(!entry.isIntersecting)return; const el=entry.target; obs.unobserve(el);
      const target=+el.dataset.count,dur=1200,start=performance.now();
      (function step(now){const p=Math.min((now-start)/dur,1),e=1-Math.pow(1-p,3);el.textContent=Math.round(e*target);if(p<1)requestAnimationFrame(step);else el.textContent=target;})(performance.now());
    }); },{threshold:.5});
    main.querySelectorAll('[data-count]').forEach(el=>obs.observe(el));
    onClean(()=>obs.disconnect());
  }

  function initReveal(){
    const els=main.querySelectorAll('#about .about-inner>*,#skills .stat-box,#projects .proj-card-clean,#projects .proj-cta-card,#story .tl-item,#contact .cc');
    if(reduce){ els.forEach(el=>el.classList.add('in')); return; }
    els.forEach(el=>el.classList.add('sr'));
    const obs=new IntersectionObserver(entries=>{entries.forEach((e,i)=>{if(e.isIntersecting){setTimeout(()=>e.target.classList.add('in'),i*60);obs.unobserve(e.target);}});},{threshold:.1});
    els.forEach(el=>obs.observe(el));
    onClean(()=>obs.disconnect());
  }

  function initVideoAutoplay(){
    const cards=main.querySelectorAll('[data-vid]');
    if(!cards.length)return;
    const obs=new IntersectionObserver(entries=>{ entries.forEach(entry=>{
      const video=entry.target.querySelector('video'); if(!video)return;
      if(entry.isIntersecting){ if(video.readyState===0)video.load(); video.play().catch(()=>{}); entry.target.classList.add('playing'); }
      else{ video.pause(); entry.target.classList.remove('playing'); }
    }); },{threshold:0.35});
    cards.forEach(c=>obs.observe(c));
    onClean(()=>obs.disconnect());
  }

  function initMagneticTitle(){
    const host=main.querySelector('#heroName'); if(!host)return;
    const letters=[].slice.call(host.querySelectorAll('.ml')); if(!letters.length)return;
    if(reduce||window.matchMedia('(pointer:coarse)').matches)return;
    const RAD=165,MAX=24; let px=0,py=0,active=false,raf=0,alive=true;
    function step(){ if(!alive)return; let near=false;
      for(let i=0;i<letters.length;i++){ const L=letters[i],r=L.getBoundingClientRect();
        const cx=r.left+r.width/2,cy=r.top+r.height/2; const dx=px-cx,dy=py-cy,d=Math.hypot(dx,dy);
        if(d<RAD){ near=true; const k=(1-d/RAD),kk=k*k; const tx=(dx/(d||1))*MAX*kk,ty=(dy/(d||1))*MAX*kk;
          L.style.transform='translate('+tx.toFixed(2)+'px,'+ty.toFixed(2)+'px) scale('+(1+.16*kk).toFixed(3)+')'; L.style.zIndex='2';
        }else if(L.style.transform){L.style.transform='';L.style.zIndex='';} }
      if(near){raf=requestAnimationFrame(step);}else{active=false;} }
    const onMove=e=>{px=e.clientX;py=e.clientY;if(!active&&alive){active=true;raf=requestAnimationFrame(step);}};
    window.addEventListener('mousemove',onMove,{passive:true});
    onClean(()=>{alive=false;cancelAnimationFrame(raf);window.removeEventListener('mousemove',onMove);});
  }

  /* Nav pilotée par thème : chaque récit réécrit ses entrées de menu */
  function setNavLinks(items){
    const ul=document.querySelector('.nav-links'); if(!ul)return;
    ul.innerHTML=items.map(it=>'<li><a href="'+(it.href||'#')+'" data-s="'+(it.s||'')+'"'+(it.file?' data-file="'+it.file+'"':'')+'>'+esc(it.label)+'</a></li>').join('');
  }
  /* Scroll-spy nav — observe les sections pointées par le menu courant */
  function initScrollSpy(){
    const links=[].slice.call(document.querySelectorAll('.nav-links a'));
    const obs=new IntersectionObserver(e=>{e.forEach(en=>{if(en.isIntersecting)links.forEach(l=>l.classList.toggle('active',l.dataset.s===en.target.id));});},{threshold:.4});
    links.map(l=>l.dataset.s).filter(Boolean).forEach(id=>{const el=main.querySelector('#'+id);if(el)obs.observe(el);});
    onClean(()=>obs.disconnect());
  }

  /* Atelier — folio + progression (dépend des sections rendues) */
  let atlProg=null, atlFolio=null;
  /* Fluid — compteur d'exposition + rail de points */
  let glCounter=null, glRail=null;
  function initFolio(pages){
    if(!atlProg){ atlProg=document.createElement('div');atlProg.id='atl-prog';atlProg.setAttribute('aria-hidden','true');document.body.appendChild(atlProg); }
    if(!atlFolio){ atlFolio=document.createElement('div');atlFolio.id='atl-folio';atlFolio.setAttribute('aria-hidden','true');document.body.appendChild(atlFolio); }
    let cur=-1;
    function setPage(id){var i=-1;for(var k=0;k<pages.length;k++){if(pages[k][0]===id){i=k;break;}}if(i<0||i===cur)return;cur=i;
      var n=('0'+(i+1)).slice(-2); atlFolio.innerHTML='— &nbsp;<b>'+n+'</b>&nbsp; — &nbsp;&nbsp;'+pages[i][1];}
    const obs=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting)setPage(e.target.id);});},{threshold:.35});
    pages.forEach(function(p){var el=main.querySelector('#'+p[0]);if(el)obs.observe(el);});
    setPage('hero');
    let ticking=false;
    function upd(){ticking=false;var h=document.documentElement;var max=h.scrollHeight-h.clientHeight;var p=max>0?Math.min(h.scrollTop/max,1):0;atlProg.style.transform='scaleX('+p+')';}
    const onScroll=function(){if(!ticking){ticking=true;requestAnimationFrame(upd);}};
    window.addEventListener('scroll',onScroll,{passive:true});
    upd();
    onClean(()=>{obs.disconnect();window.removeEventListener('scroll',onScroll);});
  }

  const NAV_CLASSIC=[{href:'#about',s:'about',label:'about'},{href:'#skills',s:'skills',label:'skills'},{href:'#projects',s:'projects',label:'projects'},{href:'#story',s:'story',label:'history'},{href:'#contact',s:'contact',label:'contact'}];
  function initClassicEnhancers(){
    setNavLinks(NAV_CLASSIC);
    initTyped(); initSkillTabs(); initCounters(); initReveal(); initVideoAutoplay(); initMagneticTitle(); initScrollSpy();
    /* pastilles du teaser d'ambiances → bascule directe */
    const onTeaser=e=>{const b=e.target.closest('[data-set-da]');if(b&&window.__setDA)window.__setDA(b.dataset.setDa);};
    main.addEventListener('click',onTeaser);
    onClean(()=>main.removeEventListener('click',onTeaser));
  }

  const POST_INIT={
    terminal:initClassicEnhancers,
    'mise-en-place':initMiseCarte,
    compile:initCompileRepo,
    fluid:initFluidGalerie,
    atelier:initAtelierRevue
  };

