'use strict';
  /* ═══════════ RENDERER « fluid » — La Galerie (exposition : les œuvres d'abord, l'artiste après) ═══════════
     Ordre inversé : projets plein écran (scroll-snap) → cartel d'artiste → livre d'or. Le vide EST le design. */
  const snip=d=>{ let s=String(d).split(' — ')[0].split('. ')[0]; if(s.length>96){s=s.slice(0,96).replace(/\s+\S*$/,'')+'…';} return s; };
  function renderFluid(C,V){
    const id=C.identity, P=C.parcours, CT=C.contact;
    const total=C.projets.length+3; // ouverture + œuvres + cartel + livre d'or
    const pad=n=>('0'+n).slice(-2);

    const open=`<section class="gl-screen gl-open" id="gl-open">
      <span class="gl-counter-in">${pad(1)} / ${pad(total)}</span>
      <h1 class="gl-open-name">${esc(id.prenom)}<br/><em>${esc(id.nom)}</em></h1>
      <p class="gl-open-line">Sélection de travaux — 2024–2026</p>
      ${inviteHTML(V,'gl-open-invite')}
      <span class="gl-scroll-cue" aria-hidden="true">défiler ↓</span>
    </section>`;

    const works=C.projets.map((p,i)=>{
      const media=p.media.type==='video'
        ? `<div class="gl-work-media" data-vid="${p.media.vid}"><video src="${p.media.src}" muted loop playsinline preload="none"></video></div>`
        : `<div class="gl-work-media"><img src="${p.media.src}" alt="${esc(p.nom)}" loading="lazy"></div>`;
      return `<section class="gl-screen gl-work" id="gl-w${i}">
        <span class="gl-counter-in">${pad(i+2)} / ${pad(total)}</span>
        <div class="gl-work-inner">
          ${media}
          <div class="gl-cartel">
            <span class="gl-cartel-idx" aria-hidden="true">Œuvre n°${pad(i+1)}</span>
            <h2 class="gl-work-name">${esc(p.nom)}</h2>
            <div class="gl-cartel-med"><span class="gl-cartel-k">Médium</span> ${esc(p.stackLine)}</div>
            <p class="gl-cartel-phrase">${esc(snip(p.description))}</p>
            <button type="button" class="gl-more" data-idx="${i}" aria-haspopup="dialog">Notice de l’œuvre →</button>
          </div>
        </div>
      </section>`;
    }).join('');

    const cartel=`<section class="gl-screen gl-artiste" id="gl-cartel">
      <span class="gl-counter-in">${pad(total-1)} / ${pad(total)}</span>
      <div class="gl-artiste-inner">
        <span class="gl-kicker">${esc(V.about)}</span>
        <p class="gl-artiste-bio">Formé en cuisine gastronomique lyonnaise, <b>${esc(id.nomComplet)}</b> transpose la rigueur du dressage et la gestion de la brigade dans le développement web.</p>
        <p class="gl-artiste-sub">${esc(id.ecole)}, 2025–2027 · ${esc(id.localisation)}</p>
      </div>
    </section>`;

    const livre=`<section class="gl-screen gl-livredor" id="gl-livredor">
      <span class="gl-counter-in">${pad(total)} / ${pad(total)}</span>
      <div class="gl-livredor-inner">
        <span class="gl-kicker">${esc(V.contact)}</span>
        <div class="gl-livredor-links">
          <a href="mailto:${CT.email}">${esc(CT.email)}</a>
          <a href="${CT.linkedin.url}" target="_blank" rel="noopener">LinkedIn</a>
          <a href="${CT.github.url}" target="_blank" rel="noopener">GitHub</a>
        </div>
        <p class="gl-livredor-dispo">${esc(id.dispo.long)}.</p>
        <a class="gl-livredor-cv" href="${CT.cv}" download>Télécharger le CV (PDF) ↓</a>
      </div>
    </section>`;

    /* Notice — overlay sobre (détail complet au clic) */
    const overlay=`<div class="gl-overlay" id="gl-overlay" role="dialog" aria-modal="true" aria-labelledby="gl-ov-title" hidden>
      <div class="gl-overlay-panel">
        <button type="button" class="gl-overlay-close" aria-label="Fermer la notice">✕</button>
        <span class="gl-ov-idx" id="gl-ov-idx"></span>
        <h3 class="gl-ov-title" id="gl-ov-title"></h3>
        <p class="gl-ov-med" id="gl-ov-med"></p>
        <p class="gl-ov-desc" id="gl-ov-desc"></p>
        <a class="gl-ov-link" id="gl-ov-link" target="_blank" rel="noopener">Consulter la réalisation →</a>
      </div>
    </div>`;

    return `<div class="gl">${open}${works}${cartel}${livre}${overlay}</div>`;
  }

  function initFluidGalerie(){
    setNavLinks([
      {href:'#gl-w0',s:'gl-w0',label:'œuvres'},
      {href:'#gl-cartel',s:'gl-cartel',label:'l’artiste'},
      {href:'#gl-livredor',s:'gl-livredor',label:'contact'}
    ]);
    initScrollSpy();
    initVideoAutoplay();

    const screens=[].slice.call(main.querySelectorAll('.gl-screen'));
    /* compteur + rail de points (progression liée au snap) */
    if(!glCounter){ glCounter=document.createElement('div');glCounter.id='gl-counter';glCounter.setAttribute('aria-hidden','true');document.body.appendChild(glCounter); }
    if(!glRail){ glRail=document.createElement('div');glRail.id='gl-rail';glRail.setAttribute('role','navigation');glRail.setAttribute('aria-label','Écrans de l’exposition');document.body.appendChild(glRail); }
    glRail.innerHTML=screens.map((s,i)=>'<button type="button" data-i="'+i+'" aria-label="Aller à l’écran '+(i+1)+' sur '+screens.length+'"></button>').join('');
    const dots=[].slice.call(glRail.querySelectorAll('button'));
    const pad=n=>('0'+n).slice(-2);
    function setActive(i){ glCounter.textContent=pad(i+1)+' / '+pad(screens.length); dots.forEach((d,k)=>d.classList.toggle('on',k===i)); }
    setActive(0);
    const cObs=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){const i=screens.indexOf(e.target);if(i>=0)setActive(i);}});},{threshold:.55});
    screens.forEach(s=>cObs.observe(s));
    const onDot=e=>{const b=e.target.closest('button[data-i]');if(!b)return;const s=screens[+b.dataset.i];if(s)s.scrollIntoView({behavior:reduce?'auto':'smooth'});};
    glRail.addEventListener('click',onDot);
    onClean(()=>{cObs.disconnect();glRail.removeEventListener('click',onDot);});

    /* Notice overlay (détail au clic) */
    const ov=main.querySelector('#gl-overlay');
    let lastFocus=null;
    function openOv(idx){
      const p=CONTENT.projets[idx]; if(!p||!ov)return;
      ov.querySelector('#gl-ov-idx').textContent='Œuvre n°'+pad(idx+1)+' · Médium';
      ov.querySelector('#gl-ov-title').textContent=p.nom;
      ov.querySelector('#gl-ov-med').textContent=p.stackLine;
      ov.querySelector('#gl-ov-desc').textContent=p.description;
      const lk=ov.querySelector('#gl-ov-link'); lk.href=p.url;
      lastFocus=document.activeElement; ov.hidden=false; document.body.classList.add('gl-lock');
      ov.querySelector('.gl-overlay-close').focus();
    }
    function closeOv(){ if(!ov)return; ov.hidden=true; document.body.classList.remove('gl-lock'); if(lastFocus&&lastFocus.focus)lastFocus.focus(); }
    const onMoreClick=e=>{ const b=e.target.closest('.gl-more'); if(b){openOv(+b.dataset.idx);return;} if(e.target.closest('.gl-overlay-close')||e.target===ov)closeOv(); };
    main.addEventListener('click',onMoreClick);
    const onKey=e=>{ if(e.key==='Escape'&&ov&&!ov.hidden)closeOv(); };
    document.addEventListener('keydown',onKey);
    onClean(()=>{ main.removeEventListener('click',onMoreClick); document.removeEventListener('keydown',onKey); document.body.classList.remove('gl-lock'); });
  }

