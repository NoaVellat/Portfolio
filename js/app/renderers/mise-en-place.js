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
      <p class="mn-house-k">${L('La maison','The house')}</p>
      <h1 class="mn-house">Vellat</h1>
      <p class="mn-tag">${L('Cuisine de code — depuis 2024','Code cuisine — since 2024')}</p>
      <p class="mn-place">${esc(id.localisation)} · ${esc(id.ecole)}</p>
      ${inviteHTML(V,'mn-invite')}
      <div class="mn-filet" aria-hidden="true"></div>
    </header>`;

    const bouche=`<section class="mn-sec" id="mn-bouche" aria-label="${L('Mise en bouche','Amuse-bouche')}">
      ${service(L('Ier','1st'),L('Mise en bouche','Amuse-bouche'))}
      <p class="mn-amuse">${esc(P.about.paras[0])}</p>
      <p class="mn-amuse-note">« ${esc(P.about.quote.text)} »</p>
    </section>`;

    const pantry=(t,items)=>`<div class="mn-pantry-col"><h3 class="mn-pantry-h">${esc(t)}</h3><ul class="mn-pantry-ul">${items.map(x=>'<li>'+esc(plain(x))+'</li>').join('')}</ul></div>`;
    const ingredients=`<section class="mn-sec" id="mn-ingredients" aria-label="${esc(V.skills)}">
      ${service(L('IIe','2nd'),V.skills)}
      <p class="mn-sec-intro">${L('Le garde-manger : produits travaillés en ce moment, sélection courte et de saison.','The pantry: what is being worked with right now — a short, seasonal selection.')}</p>
      <div class="mn-pantry">
        ${pantry(L('Salle & dressage','Front of house & plating'),K.frontend.chips)}
        ${pantry(L('Fourneaux','The stoves'),K.backend.chips)}
        ${pantry(L('La plonge & l’envoi','Dish pit & the pass'),K.devops.chips)}
      </div>
      <div class="mn-fonds">
        <h3 class="mn-pantry-h">${L('Les fonds de sauce','The mother sauces')} <span class="mn-pantry-sub">${L('— base de tout, ramenés de la brigade','— the base of everything, brought back from the brigade')}</span></h3>
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
      <p class="mn-plat-note"><span class="mn-note-k">${L('Note du chef',"Chef's note")}</span> — ${esc(p.note)}</p>
    </article>`;
    const plats=`<section class="mn-sec" id="mn-plats" aria-label="${esc(V.projets)}">
      ${service(L('IIIe','3rd'),V.projets)}
      <div class="mn-plats">${C.projets.map(plat).join('')}</div>
      <p class="mn-github"><a href="${C.projetsCTA.url}" target="_blank" rel="noopener">${L('La carte complète est à consulter en cuisine','The full menu can be seen in the kitchen')} — ${esc(C.projetsCTA.sub)}</a></p>
    </section>`;

    const chefTl=P.timelineLong.map(t=>`<div class="mn-chef-tl"><span class="mn-chef-year">${esc(t.year)}</span><span class="mn-chef-role">${esc(t.role)}</span><span class="mn-chef-place">${esc(t.place.trim())}</span></div>`).join('');
    const chef=`<section class="mn-sec" id="mn-chef" aria-label="${esc(V.about)}">
      ${service(L('IVe','4th'),V.about)}
      <div class="mn-medaillon"><img class="photo-img" src="" alt="${L('Noa Vellat, le chef','Noa Vellat, the chef')}" width="150" height="150"/></div>
      ${P.story.paras.map(p=>'<p class="mn-chef-p">'+esc(p)+'</p>').join('')}
      <p class="mn-chef-p">${esc(P.about.paras[1])}</p>
      <blockquote class="mn-chef-quote">« ${esc(P.story.quote.text)} »<cite>${esc(P.story.quote.cite)}</cite></blockquote>
      <div class="mn-chef-chrono">${chefTl}</div>
    </section>`;

    const resa=`<section class="mn-sec" id="mn-resa" aria-label="${esc(V.contact)}">
      ${service(L('Ve','5th'),V.contact)}
      <p class="mn-resa-dispo">${L('Table disponible à partir de <b>septembre 2026</b> — service en alternance.','A table is available from <b>September 2026</b> — apprenticeship service.')}</p>
      <div class="mn-resa-lines">
        <div class="mn-plat-line"><span class="mn-resa-k">${L('Écrire','Write')}</span><span class="mn-dots" aria-hidden="true"></span><a href="mailto:${CT.email}">${esc(CT.email)}</a></div>
        <div class="mn-plat-line"><span class="mn-resa-k">${L('Téléphoner','Call')}</span><span class="mn-dots" aria-hidden="true"></span><a href="tel:${CT.telHref}">${esc(CT.tel)}</a></div>
        <div class="mn-plat-line"><span class="mn-resa-k">LinkedIn</span><span class="mn-dots" aria-hidden="true"></span><a href="${CT.linkedin.url}" target="_blank" rel="noopener">${esc(CT.linkedin.handle)}</a></div>
        <div class="mn-plat-line"><span class="mn-resa-k">GitHub</span><span class="mn-dots" aria-hidden="true"></span><a href="${CT.github.url}" target="_blank" rel="noopener">${esc(CT.github.handle)}</a></div>
        <div class="mn-plat-line"><span class="mn-resa-k">${L('La carte à emporter','The takeaway menu')}</span><span class="mn-dots" aria-hidden="true"></span><a href="${CT.cv}" download>CV_Noa_Vellat.pdf</a></div>
      </div>
      ${orn}
      <p class="mn-foot">${L('Maison Vellat — ','Maison Vellat — ')}${esc(id.localisation)}${L(' · service continu, sept. 2026 →',' · continuous service, Sept 2026 →')}</p>
    </section>`;

    return `<div class="mn"><div class="mn-card">${couverture}${bouche}${ingredients}${plats}${chef}${resa}</div></div>`;
  }

  function initMiseCarte(){
    setNavLinks([
      {href:'#mn-bouche',s:'mn-bouche',label:L('mise en bouche','amuse-bouche')},
      {href:'#mn-ingredients',s:'mn-ingredients',label:L('ingrédients','ingredients')},
      {href:'#mn-plats',s:'mn-plats',label:L('plats','dishes')},
      {href:'#mn-chef',s:'mn-chef',label:L('le chef','the chef')},
      {href:'#mn-resa',s:'mn-resa',label:L('réservations','reservations')}
    ]);
    initScrollSpy();
    if(!reduce){
      const els=main.querySelectorAll('.mn-plat,.mn-sec>.mn-service,.mn-pantry-col');
      els.forEach(el=>el.classList.add('sr'));
      const obs=new IntersectionObserver(en=>{en.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');obs.unobserve(e.target);}});},{threshold:.12});
      els.forEach(el=>obs.observe(el)); onClean(()=>obs.disconnect());
    }
  }

