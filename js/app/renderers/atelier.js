'use strict';
  /* ═══════════ RENDERER « atelier » — La Revue (numéro imprimé dont le sujet est Noa) ═══════════
     Ordre : Couverture+Sommaire → Article de fond (long, EN PREMIER) → Études & Figures → Nomenclature → Colophon */
  const plain=s=>s.split('|')[0];
  function renderAtelier(C,V){
    const id=C.identity, P=C.parcours, K=C.competences, CT=C.contact;

    /* — 1. COUVERTURE + SOMMAIRE — */
    const toc=[
      ['#rv-article',"L’article de fond",'02'],
      ['#rv-etudes','Études & Figures','06'],
      ['#rv-nomenclature','Nomenclature','12'],
      ['#rv-colophon','Colophon','14']
    ].map(t=>`<a href="${t[0]}"><span class="rv-toc-t">${esc(t[1])}</span><span class="rv-toc-dots" aria-hidden="true"></span><span class="rv-toc-p">p.&nbsp;${t[2]}</span></a>`).join('');
    const cover=`<section id="rv-cover" class="rv-cover">
      <div class="rv-masthead">
        <span class="rv-mast-name">Atelier</span>
        <span class="rv-issue">N°01 · Été 2026</span>
      </div>
      <div class="rv-rule"></div>
      <h1 class="rv-title">De la brigade<br/><em>au commit</em></h1>
      <p class="rv-standfirst">Comment la discipline d’une cuisine gastronomique lyonnaise est devenue une méthode de développement logiciel.</p>
      <p class="rv-cover-byline">Un portrait de <b>${esc(id.nomComplet)}</b> — ${esc(id.titre)}, ${esc(id.localisation)}</p>
      ${inviteHTML(V,'rv-invite')}
      <div class="rv-toc" role="navigation" aria-label="Sommaire du numéro">
        <div class="rv-toc-h">Sommaire</div>
        ${toc}
      </div>
    </section>`;

    /* — 2. ARTICLE DE FOND (éditorial long, 2 colonnes desktop) — */
    const lead=P.story.paras[0];
    const reperes=P.timelineLong.map(t=>`<div class="rv-rep-item"><span class="rv-rep-year">${esc(t.year)}</span><div><span class="rv-rep-role">${esc(t.role)}</span><span class="rv-rep-place">${esc(t.place.trim())}</span></div></div>`).join('');
    const article=`<section id="rv-article" class="rv-article">
      <header class="rv-art-head">
        <span class="rv-kicker">${esc(V.about)}</span>
        <h2 class="rv-art-title">La rigueur, d’une brigade à l’autre</h2>
        <p class="rv-art-dek">${esc(id.pitch)}</p>
        <span class="rv-byline">Par la rédaction — ${esc(id.localisation)}</span>
      </header>
      <div class="rv-art-body">
        <div class="rv-col">
          <p class="rv-lead"><span class="rv-dropcap">${esc(lead.charAt(0))}</span>${esc(lead.slice(1))}</p>
          <h3 class="rv-subhead">La brigade</h3>
          <p>${esc(P.about.paras[0])}</p>
          <aside class="rv-pullquote">« ${esc(P.about.quote.text)} »</aside>
          <h3 class="rv-subhead">La bascule</h3>
          <p>${esc(P.story.paras[1])}</p>
          <p>${esc(P.about.paras[1])}</p>
          <aside class="rv-pullquote">« ${esc(P.story.quote.text)} »</aside>
          <h3 class="rv-subhead">Aujourd’hui</h3>
          <p>Aujourd’hui, la brigade a laissé place au terminal. À ${esc(id.ecole)}, entre 2025 et 2027, ${esc(id.prenom)} apprend le développement web comme il a appris la cuisine : par la pratique, la répétition et l’exigence. ${esc(id.dispo.long)}.</p>
          <p class="rv-placeholder">[NOA : Pour mon premier jour dans une brigade, j'ai dû gérer le service du soir seule — nombre de clients en réservation : 500. Je ne connaissais pas le poste, j'ai gardé mon sang-froid et je l'ai réussi. C'est une des qualités que j'essaie de mettre en œuvre aujourd'hui dans le développement web.]</p>
        </div>
        <aside class="rv-margin">
          <figure class="rv-planche">
            <img class="photo-img" src="" alt="Noa Vellat" width="220" height="220"/>
            <figcaption>Planche I — Noa Vellat, ${esc(id.localisation)}.</figcaption>
          </figure>
          <div class="rv-reperes" aria-label="Repères chronologiques">
            <div class="rv-box-h">Repères</div>
            ${reperes}
          </div>
        </aside>
      </div>
    </section>`;

    /* — 3. ÉTUDES & FIGURES (projets en études de cas numérotées) — */
    const figs=C.projets.map((p,i)=>{
      const media=p.media.type==='video'
        ? `<div class="rv-fig-media" data-vid="${p.media.vid}"><video src="${p.media.src}" muted loop playsinline preload="none"></video></div>`
        : `<div class="rv-fig-media"><img src="${p.media.src}" alt="${esc(p.nom)}" loading="lazy"></div>`;
      const demo=C.demontre[p.id]?`<div class="rv-fig-demo"><span class="rv-fig-demo-h">Ce que ça démontre</span><p>${esc(C.demontre[p.id])}</p></div>`:'';
      return `<figure class="rv-fig${i%2?' rv-fig-alt':''}">
        ${media}
        <figcaption class="rv-fig-cap">
          <span class="rv-fig-num">Fig.&nbsp;${i+1}</span>
          <h3 class="rv-fig-title">${esc(p.nom)}</h3>
          <p class="rv-fig-legend">${esc(p.description)}</p>
          <p class="rv-fig-stack">${esc(p.stackLine)}</p>
          ${demo}
          <a class="rv-fig-link" href="${p.url}" target="_blank" rel="noopener">Consulter la réalisation →</a>
        </figcaption>
      </figure>`;
    }).join('');
    const etudes=`<section id="rv-etudes" class="rv-etudes">
      <header class="rv-sec-head"><span class="rv-kicker">${esc(V.projets)}</span><h2 class="rv-sec-title">Six réalisations, six démonstrations</h2></header>
      <div class="rv-figs">${figs}</div>
    </section>`;

    /* — 4. NOMENCLATURE (compétences en tableau typographique) — */
    const nomRow=(label,items)=>`<div class="rv-nom-row"><dt>${esc(label)}</dt><dd>${items.map(x=>esc(plain(x))).join(' · ')}</dd></div>`;
    const nomencl=`<section id="rv-nomenclature" class="rv-nomencl">
      <header class="rv-sec-head"><span class="rv-kicker">${esc(V.skills)}</span><h2 class="rv-sec-title">Outils &amp; matières</h2></header>
      <dl class="rv-nom">
        ${nomRow('Frontend', K.frontend.chips)}
        ${nomRow('Backend', K.backend.chips)}
        ${nomRow('DevOps & Cloud', K.devops.chips)}
        ${nomRow('Stack MERN', K.mern.chips)}
        ${nomRow('Fonds de sauce', K.transferables)}
      </dl>
    </section>`;

    /* — 5. COLOPHON (contact façon ours de publication) — */
    const colophon=`<footer id="rv-colophon" class="rv-colophon">
      <div class="rv-box-h">${esc(V.contact)}</div>
      <p class="rv-ours">Rédaction, développement &amp; mise en page : <b>${esc(id.nomComplet)}</b> — ${esc(id.ecole)}. ${esc(id.dispo.long)}.</p>
      <div class="rv-colo-links">
        <a href="mailto:${CT.email}">${esc(CT.email)}</a>
        <a href="${CT.linkedin.url}" target="_blank" rel="noopener">LinkedIn / ${esc(CT.linkedin.handle)}</a>
        <a href="${CT.github.url}" target="_blank" rel="noopener">GitHub / ${esc(CT.github.handle)}</a>
        <a href="${CT.cv}" download>Télécharger le CV (PDF)</a>
      </div>
      <p class="rv-colo-foot">© 2026 — Atelier, la revue · N°01 · composé au terminal, imprimé au pixel.</p>
    </footer>`;

    return `<article class="rv">${cover}${article}${etudes}${nomencl}${colophon}</article>`;
  }

  function initAtelierRevue(){
    setNavLinks([
      {href:'#rv-article',s:'rv-article',label:'article'},
      {href:'#rv-etudes',s:'rv-etudes',label:'études'},
      {href:'#rv-nomenclature',s:'rv-nomenclature',label:'outils'},
      {href:'#rv-colophon',s:'rv-colophon',label:'colophon'}
    ]);
    initScrollSpy();
    initVideoAutoplay();
    initFolio([['rv-cover','Couverture'],['rv-article','L’article de fond'],['rv-etudes','Études & Figures'],['rv-nomenclature','Nomenclature'],['rv-colophon','Colophon']]);
    if(!reduce){
      const els=main.querySelectorAll('.rv-fig,.rv-pullquote');
      els.forEach(el=>el.classList.add('sr'));
      const obs=new IntersectionObserver(en=>{en.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');obs.unobserve(e.target);}});},{threshold:.14});
      els.forEach(el=>obs.observe(el)); onClean(()=>obs.disconnect());
    }
  }

