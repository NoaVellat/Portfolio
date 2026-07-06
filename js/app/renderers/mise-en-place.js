'use strict';
  /* ═══════════ RENDERER « mise-en-place » — Le Menu Dégustation (ordre imposé par le chef) ═══════════
     Couverture → Mise en bouche → Ingrédients → Plats Signatures → Le Chef (APRÈS les plats) → Réservations.
     Tout typographie et filets — aucune grille de cartes. */
  function renderMise(C,V){
    const id=C.identity, P=C.parcours, K=C.competences, CT=C.contact;
    const orn='<div class="mn-orn" aria-hidden="true">❦</div>';
    const service=(n,t)=>`<div class="mn-service"><span class="mn-service-line" aria-hidden="true"></span><span class="mn-service-t">${n} service — ${esc(t)}</span><span class="mn-service-line" aria-hidden="true"></span></div>`;

    const couverture=`<header class="mn-cover" id="mn-couverture">
      ${orn}
      <p class="mn-house-k">La maison</p>
      <h1 class="mn-house">Vellat</h1>
      <p class="mn-tag">Cuisine de code — depuis 2024</p>
      <p class="mn-place">${esc(id.localisation)} · ${esc(id.ecole)}</p>
      ${inviteHTML(V,'mn-invite')}
      <div class="mn-filet" aria-hidden="true"></div>
    </header>`;

    const bouche=`<section class="mn-sec" id="mn-bouche" aria-label="Mise en bouche">
      ${service('Ier','Mise en bouche')}
      <p class="mn-amuse">${esc(P.about.paras[0])}</p>
      <p class="mn-amuse-note">« ${esc(P.about.quote.text)} »</p>
    </section>`;

    const pantry=(t,items)=>`<div class="mn-pantry-col"><h3 class="mn-pantry-h">${esc(t)}</h3><ul class="mn-pantry-ul">${items.map(x=>'<li>'+esc(plain(x))+'</li>').join('')}</ul></div>`;
    const ingredients=`<section class="mn-sec" id="mn-ingredients" aria-label="${esc(V.skills)}">
      ${service('IIe',V.skills)}
      <p class="mn-sec-intro">Le garde-manger : produits travaillés en ce moment, sélection courte et de saison.</p>
      <div class="mn-pantry">
        ${pantry('Salle & dressage',K.frontend.chips)}
        ${pantry('Fourneaux',K.backend.chips)}
        ${pantry('La plonge & l’envoi',K.devops.chips)}
      </div>
      <div class="mn-fonds">
        <h3 class="mn-pantry-h">Les fonds de sauce <span class="mn-pantry-sub">— base de tout, ramenés de la brigade</span></h3>
        <p class="mn-fonds-p">${K.transferables.map(esc).join(' · ')}</p>
      </div>
    </section>`;

    const plat=p=>`<article class="mn-plat">
      <p class="mn-plat-course">${esc(p.course)}</p>
      <div class="mn-plat-line">
        <a class="mn-plat-name" href="${p.url}" target="_blank" rel="noopener">${esc(p.nom)}</a>
        <span class="mn-dots" aria-hidden="true"></span>
        <span class="mn-plat-stack">${esc(p.stackLine)}</span>
      </div>
      <p class="mn-plat-desc">${esc(p.description)}</p>
      <p class="mn-plat-note"><span class="mn-note-k">Note du chef</span> — ${esc(p.note)}</p>
    </article>`;
    const plats=`<section class="mn-sec" id="mn-plats" aria-label="${esc(V.projets)}">
      ${service('IIIe',V.projets)}
      <div class="mn-plats">${C.projets.map(plat).join('')}</div>
      <p class="mn-github"><a href="${C.projetsCTA.url}" target="_blank" rel="noopener">La carte complète est à consulter en cuisine — ${esc(C.projetsCTA.sub)}</a></p>
    </section>`;

    const chefTl=P.timelineLong.map(t=>`<div class="mn-chef-tl"><span class="mn-chef-year">${esc(t.year)}</span><span class="mn-chef-role">${esc(t.role)}</span><span class="mn-chef-place">${esc(t.place.trim())}</span></div>`).join('');
    const chef=`<section class="mn-sec" id="mn-chef" aria-label="${esc(V.about)}">
      ${service('IVe',V.about)}
      <div class="mn-medaillon"><img class="photo-img" src="" alt="Noa Vellat, le chef" width="150" height="150"/></div>
      ${P.story.paras.map(p=>'<p class="mn-chef-p">'+esc(p)+'</p>').join('')}
      <p class="mn-chef-p">${esc(P.about.paras[1])}</p>
      <blockquote class="mn-chef-quote">« ${esc(P.story.quote.text)} »<cite>${esc(P.story.quote.cite)}</cite></blockquote>
      <div class="mn-chef-chrono">${chefTl}</div>
    </section>`;

    const resa=`<section class="mn-sec" id="mn-resa" aria-label="${esc(V.contact)}">
      ${service('Ve',V.contact)}
      <p class="mn-resa-dispo">Table disponible à partir de <b>septembre 2026</b> — service en alternance.</p>
      <div class="mn-resa-lines">
        <div class="mn-plat-line"><span class="mn-resa-k">Écrire</span><span class="mn-dots" aria-hidden="true"></span><a href="mailto:${CT.email}">${esc(CT.email)}</a></div>
        <div class="mn-plat-line"><span class="mn-resa-k">Téléphoner</span><span class="mn-dots" aria-hidden="true"></span><a href="tel:${CT.telHref}">${esc(CT.tel)}</a></div>
        <div class="mn-plat-line"><span class="mn-resa-k">LinkedIn</span><span class="mn-dots" aria-hidden="true"></span><a href="${CT.linkedin.url}" target="_blank" rel="noopener">${esc(CT.linkedin.handle)}</a></div>
        <div class="mn-plat-line"><span class="mn-resa-k">GitHub</span><span class="mn-dots" aria-hidden="true"></span><a href="${CT.github.url}" target="_blank" rel="noopener">${esc(CT.github.handle)}</a></div>
        <div class="mn-plat-line"><span class="mn-resa-k">La carte à emporter</span><span class="mn-dots" aria-hidden="true"></span><a href="${CT.cv}" download>CV_Noa_Vellat.pdf</a></div>
      </div>
      ${orn}
      <p class="mn-foot">Maison Vellat — ${esc(id.localisation)} · service continu, sept. 2026 →</p>
    </section>`;

    return `<div class="mn"><div class="mn-card">${couverture}${bouche}${ingredients}${plats}${chef}${resa}</div></div>`;
  }

  function initMiseCarte(){
    setNavLinks([
      {href:'#mn-bouche',s:'mn-bouche',label:'mise en bouche'},
      {href:'#mn-ingredients',s:'mn-ingredients',label:'ingrédients'},
      {href:'#mn-plats',s:'mn-plats',label:'plats'},
      {href:'#mn-chef',s:'mn-chef',label:'le chef'},
      {href:'#mn-resa',s:'mn-resa',label:'réservations'}
    ]);
    initScrollSpy();
    if(!reduce){
      const els=main.querySelectorAll('.mn-plat,.mn-sec>.mn-service,.mn-pantry-col');
      els.forEach(el=>el.classList.add('sr'));
      const obs=new IntersectionObserver(en=>{en.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');obs.unobserve(e.target);}});},{threshold:.12});
      els.forEach(el=>obs.observe(el)); onClean(()=>obs.disconnect());
    }
  }

