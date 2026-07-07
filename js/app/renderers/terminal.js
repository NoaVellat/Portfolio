'use strict';
  /* ═══════════ 4. RENDERER CLASSIQUE — thème terminal (layout d'origine, piloté par CONTENT) ═══════════ */
  function renderClassic(C,V){
    const id=C.identity, P=C.parcours, K=C.competences, CT=C.contact;

    /* — HERO — */
    const heroConfig=id.config.map(l=>'<div class="tl'+(l[1]?' '+l[1]:'')+'">'+l[0]+'</div>').join('');
    const heroStatus=id.status.map(s=>'<span class="status-item"><span class="s-dot'+(s.dot?' '+s.dot:'')+'"></span>'+esc(s.txt)+'</span>').join('');
    const hero=`<section id="hero">
  <canvas id="hero-canvas"></canvas>
  <div class="hero-grid">
    <div class="hero-left">
      <div class="hero-prompt">
        <span class="ps1">noa@epitech-lyon:~$</span>
        <span id="typed-hero"></span>
        <span class="hero-caret"></span>
      </div>
      <h1 class="hero-name" id="heroName">${mlSplit(id.prenom)}<br/><span class="green">${mlSplit(id.nom)}</span></h1>
      <p class="hero-role">// <span class="hl">${L('Développeur Web','Web Developer')}</span> — ${L('Alternance','Apprenticeship')} 2025→2027</p>
      <p class="hero-desc">${esc(id.pitch)}</p>
      <div class="hero-btns">
        <a href="#projects" class="btn-primary">${L('./voir-projets','./view-projects')}</a>
        <a href="#contact" class="btn-outline">./contact</a>
      </div>
      <div class="hero-status">${heroStatus}</div>
      <div class="hero-themes">
        <p class="ht-head"><span class="inv-star" aria-hidden="true">✦</span> <b>${L('Un site, cinq ambiances','One site, five moods')}</b> — ${L('chacune une parcelle de ma vie. Cliquez, tout change :','each one a piece of my life. Click, and everything changes:')}</p>
        <div class="ht-pills">${THEME_TEASER.map(t=>`<button type="button" class="ht-pill" data-set-da="${t.da}" title="${L('Basculer vers l’ambiance','Switch to the mood')} ${esc(t.name)}"><span class="sw sw-${t.sw}" aria-hidden="true"></span><span class="ht-txt"><span class="ht-name">${esc(t.name)}</span><span class="ht-tag">${esc(t.tag)}</span></span></button>`).join('')}</div>
        <p class="ht-path">${L('(ou à tout moment via le bouton « Ambiance », en haut à droite)','(or anytime via the “Ambiance” button, top right)')}</p>
      </div>
    </div>
    <div class="hero-right">
      <div class="photo-wrap">
        <img class="photo-img" src="" alt="Noa Vellat"/>
        <div class="photo-ring"></div>
        <div class="photo-badge">
          <span class="badge-l">${L('Basé à','Based in')}</span>
          <span class="badge-v">${esc(id.ville)}</span>
        </div>
      </div>
      <div class="hero-terminal">
        <div class="term-bar">
          <div class="td" style="background:#FF5F57"></div>
          <div class="td" style="background:#FEBC2E"></div>
          <div class="td" style="background:#28C840"></div>
          <span class="term-title">noa.config.js</span>
        </div>
        <div class="term-body">${heroConfig}</div>
      </div>
    </div>
  </div>
</section>`;

    /* — ABOUT — */
    const aboutParas=P.about.paras.map(p=>'<p>'+esc(p)+'</p>').join('\n      ');
    const aboutTags=P.about.tags.map(t=>'<span class="atag">'+esc(t)+'</span>').join('');
    const miniTl=P.timelineCourt.map(t=>'<div class="mt-item"><span class="mt-year">'+esc(t.year)+'</span><div class="mt-body"><span class="mt-title">'+esc(t.title)+'</span><span class="mt-sub">'+esc(t.sub)+'</span></div></div>').join('\n      ');
    const about=`<section id="about">
  <div class="about-inner">
    <div class="about-text">
      <div class="section-tag">about_me</div>
      <h2 class="section-title">${L('De la cuisine','From the kitchen')}<br/>${L('au','to')} <span class="accent">code</span></h2>
      ${aboutParas}
      <div class="about-quote">
        <p>"${esc(P.about.quote.text)}"</p>
        <cite>${esc(P.about.quote.cite)}</cite>
      </div>
      <div class="about-tags">${aboutTags}</div>
    </div>
    <div>
      <div class="section-tag" style="margin-bottom:1.75rem">timeline</div>
      ${miniTl}
    </div>
  </div>
</section>`;

    /* — SKILLS — */
    const cardHTML=c=>'<div class="skill-card"><div class="skill-card-icons">'+c.icons.map(ic=>'<i class="'+ic+'"></i>').join('')+'</div><span class="skill-card-name">'+esc(c.name)+'</span></div>';
    const cardsHTML=arr=>arr.map(cardHTML).join('\n        ');
    const chipsHTML=arr=>arr.map(s=>chip(s,'chip')).join('');
    const tabsHTML=K.tabs.map((t,i)=>'<button class="skill-tab'+(i===0?' active':'')+'" data-tab="'+t.id+'">'+esc(t.label).replace('&amp;','&amp;')+'</button>').join('\n      ');
    const mernIntro=`<div style="margin-bottom:1.75rem;padding:1.35rem;background:var(--bg2);border:1px solid var(--border)">
        <p style="font-family:var(--mono);font-size:.78rem;color:var(--muted);line-height:1.85">
          <span style="color:var(--green)">$</span> cat stack-mern.md<br/>
          <span style="color:var(--text)"># MongoDB · Express · React · Node.js</span><br/>
          <span style="color:rgba(var(--text-rgb),.35)">${esc(K.mern.intro)}</span>
        </p>
      </div>`;
    const statsHTML=K.stats.map(s=>'<div class="stat-box"><span class="stat-n" data-count="'+s.n+'">0</span><span class="stat-l">'+esc(s.l)+'</span></div>').join('\n      ');
    const skills=`<section id="skills">
  <div class="skills-inner">
    <div class="section-tag">skills.json</div>
    <h2 class="section-title">${L('Stack','Tech')} <span class="accent">${L('technique','stack')}</span></h2>
    <div class="skill-tabs" id="skillTabs">
      ${tabsHTML}
    </div>
    <div class="skill-panel active" id="panel-frontend">
      <div class="skill-cards">
        ${cardsHTML(K.frontend.cards)}
      </div>
      <div class="chips">${chipsHTML(K.frontend.chips)}</div>
    </div>
    <div class="skill-panel" id="panel-backend">
      <div class="skill-cards">
        ${cardsHTML(K.backend.cards)}
      </div>
      <div class="chips">${chipsHTML(K.backend.chips)}</div>
    </div>
    <div class="skill-panel" id="panel-devops">
      <div class="skill-cards">
        ${cardsHTML(K.devops.cards)}
      </div>
      <div class="chips">${chipsHTML(K.devops.chips)}</div>
    </div>
    <div class="skill-panel" id="panel-mern">
      ${mernIntro}
      <div class="skill-cards">
        ${cardsHTML(K.mern.cards)}
      </div>
      <div class="chips">${chipsHTML(K.mern.chips)}</div>
    </div>
    <div class="skill-panel" id="panel-soft">
      <div class="skill-cards">
        ${cardsHTML(K.soft.cards)}
      </div>
    </div>
    <div class="stat-row">
      ${statsHTML}
    </div>
  </div>
</section>`;

    /* — PROJECTS — */
    const projCard=p=>{
      const media=p.media.type==='video'
        ? '<video src="'+p.media.src+'" muted loop playsinline preload="none"></video>'
        : '<img src="'+p.media.src+'" alt="'+esc(p.nom)+'" loading="lazy">';
      const vidAttr=p.media.type==='video'?' data-vid="'+p.media.vid+'"':'';
      const playBadge=p.media.type==='video'?'\n          <div class="proj-play-badge"><i class="fas fa-play"></i></div>':'';
      const chips=p.chips.map(s=>chip(s,'proj-chip')).join('');
      return `<a href="${p.url}" target="_blank" class="proj-card-clean"${vidAttr}>
        <div class="proj-vid-wrap">
          ${media}
          <div class="proj-vid-overlay"></div>
          <div class="proj-scan"></div>
          <span class="proj-num-badge">${esc(p.num)}</span>
          <span class="proj-ext-icon"><i class="fas fa-arrow-up-right-from-square"></i></span>${playBadge}
        </div>
        <div class="proj-text" data-course="${esc(p.course)}" data-note="${esc(p.note)}">
          <span class="proj-tag-line">${esc(p.tagline)}</span>
          <span class="proj-title-big">${esc(p.nom)}</span>
          <span class="proj-desc-text">${esc(p.description)}</span>
          <div class="proj-tech-chips">${chips}</div>
        </div>
      </a>`;
    };
    const projCards=C.projets.map(projCard).join('\n\n      ');
    const cta=C.projetsCTA;
    const projects=`<section id="projects">
  <div class="projects-inner">
    <div class="section-tag">projects/</div>
    <h2 class="section-title">${L('Mes','My')} <span class="accent">${L('réalisations','work')}</span></h2>
    <div class="proj-grid-clean">

      ${projCards}

      <a href="${cta.url}" target="_blank" class="proj-cta-card">
        <i class="fab fa-github"></i>
        <span style="font-family:var(--display);font-size:1.25rem;font-weight:700;color:var(--text)">${esc(cta.label)}</span>
        <span>${esc(cta.sub)}</span>
      </a>

    </div>
  </div>
</section>`;

    /* — STORY — */
    const storyParas=P.story.paras.map(p=>'<p>'+esc(p)+'</p>').join('\n      ');
    const longTl=P.timelineLong.map(t=>{
      const tags=t.tags&&t.tags.length?'<div class="tl-ttags">'+t.tags.map(x=>'<span class="tl-ttag">'+esc(x)+'</span>').join('')+'</div>':'';
      const detail=t.detail?'<span class="tl-detail">'+esc(t.detail)+'</span>':'';
      return '<div class="tl-item"><span class="tl-year">'+esc(t.year)+'</span><div class="tl-content"><span class="tl-role">'+esc(t.role)+'</span><span class="tl-place">'+esc(t.place)+'</span>'+detail+tags+'</div></div>';
    }).join('\n      ');
    const story=`<section id="story">
  <div class="story-inner">
    <div class="story-text">
      <div class="section-tag">history.log</div>
      <h2 class="section-title">${L("L'exigence,",'High standards,')}<br/><span class="accent">${L('ma signature','my signature')}</span></h2>
      ${storyParas}
      <div class="story-quote">
        <blockquote>"${esc(P.story.quote.text)}"</blockquote>
        <cite>${esc(P.story.quote.cite)}</cite>
      </div>
      <div style="display:flex;gap:1rem;flex-wrap:wrap;margin-top:1.75rem">
        <a href="${CT.cv}" download class="btn-primary"><i class="fas fa-download"></i>./CV.pdf</a>
        <a href="#contact" class="btn-outline">./contact</a>
      </div>
    </div>
    <div>
      <div class="section-tag" style="margin-bottom:1.75rem">${L('parcours','journey')}</div>
      ${longTl}
    </div>
  </div>
</section>`;

    /* — CONTACT — */
    const contact=`<section id="contact">
  <div class="contact-inner">
    <div class="section-tag" style="justify-content:center;display:flex">contact.sh</div>
    <h2>${esc(CT.titreA)}<br/><span class="green">${esc(CT.titreB)}</span></h2>
    <p>${esc(CONTENT.contact.pitch)}</p>
    <div class="contact-grid">
      <a href="mailto:${CT.email}" class="cc"><i class="fas fa-envelope"></i><strong>Email</strong><span>${esc(CT.email)}</span></a>
      <a href="tel:${CT.telHref}" class="cc"><i class="fas fa-phone"></i><strong>${L('Téléphone','Phone')}</strong><span>${esc(CT.tel)}</span></a>
      <a href="${CT.linkedin.url}" target="_blank" class="cc"><i class="fab fa-linkedin"></i><strong>LinkedIn</strong><span>${esc(CT.linkedin.handle)}</span></a>
      <a href="${CT.github.url}" target="_blank" class="cc"><i class="fab fa-github"></i><strong>GitHub</strong><span>${esc(CT.github.handle)}</span></a>
    </div>
    <div class="social-row">
      <a href="${CT.cv}" download class="soc"><i class="fas fa-file-alt"></i></a>
      <a href="${CT.site}" target="_blank" class="soc"><i class="fas fa-globe"></i></a>
    </div>
    <a href="mailto:${CT.email}" class="btn-primary"><i class="fas fa-paper-plane"></i>./send-message</a>
  </div>
</section>`;

    /* — FOOTER — */
    const footer=`<footer>
  <p>${esc(CONTENT.footer[0])}</p>
  <p style="color:var(--green)">noa@epitech-lyon:~$ <span style="color:rgba(var(--text-rgb),.25)">_</span></p>
</footer>`;

    return hero+'\n'+about+'\n'+skills+'\n'+projects+'\n'+story+'\n'+contact+'\n'+footer;
  }

