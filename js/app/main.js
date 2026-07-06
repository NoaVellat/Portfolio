'use strict';
  /* ═══════════ 7. ORCHESTRATEUR DE RENDU ═══════════ */
  function applyPhoto(){ if(!window.__PHOTO)return; main.querySelectorAll('.photo-img').forEach(img=>{img.src=window.__PHOTO;}); }
  function renderMain(da){
    if(!RENDERERS[da])da='terminal';
    teardown();
    const V=VOICE[da]||VOICE.terminal;
    main.innerHTML=RENDERERS[da](CONTENT,V);
    applyPhoto();
    POST_INIT[da]();
  }

  /* Hook global appelé par setDA (au pic du voile) + reset scroll */
  window.NOA={ render:renderMain, CONTENT, VOICE };
  window.NOA.renderAtSwitch=function(da){ renderMain(da); window.scrollTo(0,0); };

  /* ═══════════ 8. CHROME PERSISTANT (bind once) ═══════════ */
  // nav : classe "scrolled" + smooth-scroll délégué (survit aux re-renders)
  (function(){
    const nav=document.getElementById('nav');
    if(nav)window.addEventListener('scroll',()=>nav.classList.toggle('scrolled',scrollY>50),{passive:true});
    document.addEventListener('click',e=>{
      const a=e.target.closest('a[href^="#"]'); if(!a)return;
      const href=a.getAttribute('href'); if(href.length<2)return;
      const el=main.querySelector(href)||document.getElementById(href.slice(1));
      if(el){e.preventDefault();el.scrollIntoView({behavior:reduce?'auto':'smooth'});}
    });
  })();

  // style d'apparition (scroll-reveal) injecté une seule fois
  (function(){ const s=document.createElement('style');
    s.textContent='.sr{opacity:0;transform:translateY(22px);transition:opacity .65s cubic-bezier(.16,1,.3,1),transform .65s cubic-bezier(.16,1,.3,1)}.sr.in{opacity:1;transform:none}';
    document.head.appendChild(s); })();

  /* ═══════════ 9. BOOT ═══════════ */
  let cur=root.getAttribute('data-da'); if(!RENDERERS[cur])cur='terminal';
  renderMain(cur);
