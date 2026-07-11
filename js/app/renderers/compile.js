'use strict';
  /* ═══════════ RENDERER « compile » — Le Repo (le portfolio EST un dépôt qu'on explore) ═══════════
     Navigation NON linéaire : explorateur de fichiers + onglets ouvrables. README.md ouvert à l'arrivée. */
  function renderCompile(C,V){
    const id=C.identity, P=C.parcours, K=C.competences, CT=C.contact;
    const EXT={'jeux-videops':'ci.yml','klivio':'index.html','my-video-club':'index.php','generateur-cv':'app.js','my-notion':'page.tsx','core-lab':'App.jsx'};
    const LANG={yml:'yaml',html:'html',php:'php',js:'javascript',tsx:'typescriptreact',jsx:'javascriptreact',json:'json',md:'markdown'};
    const extOf=fn=>fn.split('.').pop();

    /* — coloration légère — */
    const c=s=>'<span class="tk-c">'+esc(s)+'</span>';
    const s_=s=>'<span class="tk-s">'+esc(s)+'</span>';
    const kw=s=>'<span class="tk-k">'+esc(s)+'</span>';
    const kj=s=>'<span class="tk-key">"'+esc(s)+'"</span>';
    const slug=s=>s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
    /* wrap un texte en lignes ≤ w (bord de mot) avec indentation */
    function wrap(txt,w,ind){ ind=ind||''; const words=String(txt).split(/\s+/); const out=[]; let line='';
      for(const wd of words){ const t=line?line+' '+wd:wd; if((ind+t).length>w&&line){out.push(ind+line);line=wd;}else line=t; }
      if(line)out.push(ind+line); return out; }
    const codeBlock=lines=>'<div class="cm-code"><div class="cm-gutter" aria-hidden="true">'+lines.map((_,i)=>'<span>'+(i+1)+'</span>').join('')+'</div><pre class="cm-lines">'+lines.join('\n')+'</pre></div>';

    /* — Panneaux fichiers — */
    const panels=[];
    const files=[]; // {id,name,path,lang,icon}
    function addFile(f,html){ files.push(f); panels.push('<section class="cm-panel" id="cm-file-'+f.id+'" role="tabpanel" aria-label="'+esc(f.name)+'" data-name="'+esc(f.name)+'" data-lang="'+f.lang+'" hidden>'+html+'</section>'); }

    /* README.md */
    const badge=(k,v)=>'<span class="cm-badge"><span class="cm-badge-k">'+esc(k)+'</span><span class="cm-badge-v">'+esc(v)+'</span></span>';
    addFile({id:'README',name:'README.md',path:'',lang:'markdown',icon:'md'},
      '<div class="cm-md">'
      +'<h1># '+esc(id.nomComplet)+'</h1>'
      +'<div class="cm-badges">'+badge(L('alternance','apprenticeship'),'sept-2026')+badge('stack','front + devops')+badge('status','cooking')+badge('school',id.ecole)+'</div>'
      +'<blockquote>'+esc(id.pitch)+'</blockquote>'
      +'<h2>## '+L('En bref','In short')+'</h2>'
      +'<ul><li>'+L('Reconversion : cuisine gastronomique lyonnaise → développement web.','Career change: Lyon fine-dining kitchens → web development.')+'</li>'
      +'<li>'+esc(id.ecole)+' · Web Académie · 2025–2027 '+L('(alternance).','(apprenticeship).')+'</li>'
      +'<li>'+esc(id.dispo.long)+'.</li>'
      +'<li class="da-invite"><span class="inv-star" aria-hidden="true">◆</span> '+esc(V.invite)+' <span class="inv-path">('+esc(V.invitePath)+')</span></li></ul>'
      +'<h2>## '+L('Explorer ce dépôt','Explore this repo')+'</h2>'
      +'<ul class="cm-md-files">'
      +'<li><button class="cm-openlink" data-open="proj-'+C.projets[0].id+'">src/projects/</button> — '+C.projets.length+L(' réalisations, un fichier chacune.',' projects, one file each.')+'</li>'
      +'<li><button class="cm-openlink" data-open="parcours">docs/parcours.md</button> — '+L('l’histoire complète.','the full story.')+'</li>'
      +'<li><button class="cm-openlink" data-open="pkg">package.json</button> — '+L('la stack en dépendances.','the stack as dependencies.')+'</li>'
      +'<li><button class="cm-openlink" data-open="contrib">CONTRIBUTING.md</button> — '+L('comment me contacter.','how to reach me.')+'</li>'
      +'</ul></div>');

    /* package.json */
    const depFront=[].concat(K.frontend.chips,K.backend.chips).map(x=>x.split('|')[0]);
    const depDev=K.devops.chips.map(x=>x.split('|')[0]);
    const depPeer=K.transferables;
    const depBlock=(arr)=>arr.map((d,i)=>'    '+kj(slug(d))+': '+s_('*')+(i<arr.length-1?',':'')).join('\n');
    const pkgLines=[
      '<span class="tk-p">{</span>',
      '  '+kj('name')+': '+s_('noa-vellat')+',',
      '  '+kj(L('rôle','role'))+': '+s_(id.titre)+',',
      '  '+kj(L('disponibilité','availability'))+': '+s_(L('alternance — septembre 2026','apprenticeship — September 2026'))+',',
      '  '+kj('dependencies')+': <span class="tk-p">{</span>  '+c(L('// ce que je manipule au quotidien','// what I work with daily')),
      depBlock(depFront),
      '  <span class="tk-p">}</span>,',
      '  '+kj('devDependencies')+': <span class="tk-p">{</span>  '+c(L('// outillage & infra','// tooling & infra')),
      depBlock(depDev),
      '  <span class="tk-p">}</span>,',
      '  '+kj('peerDependencies')+': <span class="tk-p">{</span>  '+c(L('// acquis en cuisine — non négociables','// learned in the kitchen — non-negotiable')),
      depBlock(depPeer),
      '  <span class="tk-p">}</span>',
      '<span class="tk-p">}</span>'
    ];
    // aplatir (depBlock renvoie du multi-ligne)
    const pkgFlat=[]; pkgLines.forEach(l=>l.split('\n').forEach(x=>pkgFlat.push(x)));
    addFile({id:'pkg',name:'package.json',path:'',lang:'json',icon:'json'}, codeBlock(pkgFlat));

    /* CONTRIBUTING.md */
    addFile({id:'contrib',name:'CONTRIBUTING.md',path:'',lang:'markdown',icon:'md'},
      '<div class="cm-md">'
      +'<h1># '+L('Contribuer / me contacter','Contributing / contact me')+'</h1>'
      +'<blockquote>'+esc(id.dispo.long)+L('. Une opportunité, une question, un projet ? Ouvrez une issue (ou écrivez-moi).','. An opportunity, a question, a project? Open an issue (or just write to me).')+'</blockquote>'
      +'<h2>## '+L('Canaux','Channels')+'</h2>'
      +'<ul class="cm-contact">'
      +'<li><span class="tk-key">email</span> → <a href="mailto:'+CT.email+'">'+esc(CT.email)+'</a></li>'
      +'<li><span class="tk-key">'+L('tél','tel')+'</span> → <a href="tel:'+CT.telHref+'">'+esc(CT.tel)+'</a></li>'
      +'<li><span class="tk-key">linkedin</span> → <a href="'+CT.linkedin.url+'" target="_blank" rel="noopener">'+esc(CT.linkedin.handle)+'</a></li>'
      +'<li><span class="tk-key">github</span> → <a href="'+CT.github.url+'" target="_blank" rel="noopener">'+esc(CT.github.handle)+'</a></li>'
      +'<li><span class="tk-key">cv</span> → <a href="'+CT.cv+'" download>CV_Noa_Vellat.pdf</a></li>'
      +'</ul></div>');

    /* docs/parcours.md */
    const chrono=P.timelineLong.map(t=>'<li><b>'+esc(t.year)+'</b> — '+esc(t.role)+' · '+esc(t.place.trim())+'</li>').join('');
    addFile({id:'parcours',name:'parcours.md',path:'docs/',lang:'markdown',icon:'md'},
      '<div class="cm-md">'
      +'<h1># '+L('De la brigade au commit','From the brigade to the commit')+'</h1>'
      +P.story.paras.map(p=>'<p>'+esc(p)+'</p>').join('')
      +P.about.paras.map(p=>'<p>'+esc(p)+'</p>').join('')
      +'<blockquote>'+esc(P.about.quote.text)+'</blockquote>'
      +'<h2>## '+L('Chronologie','Timeline')+'</h2>'
      +'<ul class="cm-chrono">'+chrono+'</ul></div>');

    /* src/projects/<file> */
    C.projets.forEach(p=>{
      const fn=EXT[p.id]||'index.js'; const bar='─'.repeat(Math.max(4,34-p.nom.length));
      let lines=[
        c('/*  '+p.nom+'  '+bar),
        c(' *  stack     : '+p.stackLine),
        c(' *  '+L('rôle','role')+'      : '+p.course),
        c(' *  live      : '+p.url),
        c(' */'),
        ''
      ];
      lines.push(kw(L('résumé','summary'))+' :');
      wrap(p.description,64,'  ').forEach(l=>lines.push('  '+s_(l.slice(2))));
      lines.push('');
      lines.push(kw(L('démontre','demonstrates'))+' :');
      wrap(C.demontre[p.id],64,'  ').forEach(l=>lines.push('  '+s_(l.slice(2))));
      lines.push('');
      lines.push(kw(L('note_du_chef','chefs_note'))+' :');
      wrap(p.note,64,'  ').forEach(l=>lines.push('  '+c(l.slice(2))));
      addFile({id:'proj-'+p.id,name:fn,path:'src/projects/',lang:LANG[extOf(fn)]||'code',icon:extOf(fn)},codeBlock(lines));
    });

    /* assets/portrait.png — visionneuse d'image */
    addFile({id:'portrait',name:'portrait.png',path:'assets/',lang:'image',icon:'png'},
      '<div class="cm-imgview"><img class="photo-img" src="" alt="Noa Vellat" width="300" height="300"/>'
      +'<p class="cm-imgmeta">portrait.png · 1080×1080 · sRGB — '+esc(id.nomComplet)+', '+esc(id.localisation)+'</p></div>');

    /* — Arborescence explorateur — */
    const fileIcon=ic=>'<span class="cm-fi cm-fi-'+ic+'" aria-hidden="true"></span>';
    const treeItem=f=>'<button class="cm-tree-file" role="treeitem" data-open="'+f.id+'" data-name="'+esc(f.name)+'">'+fileIcon(f.icon)+'<span>'+esc(f.name)+'</span></button>';
    const rootFiles=files.filter(f=>!f.path);
    const projFiles=files.filter(f=>f.path==='src/projects/');
    const docFiles=files.filter(f=>f.path==='docs/');
    const assetFiles=files.filter(f=>f.path==='assets/');
    const folder=(name,items,open)=>'<div class="cm-folder'+(open?' open':'')+'"><button class="cm-tree-dir" aria-expanded="'+(open?'true':'false')+'"><span class="cm-caret" aria-hidden="true">▸</span><span class="cm-fi cm-fi-dir" aria-hidden="true"></span>'+esc(name)+'</button><div class="cm-folder-body">'+items.map(treeItem).join('')+'</div></div>';
    const tree=folder('src/projects',projFiles,true)+folder('docs',docFiles,true)+folder('assets',assetFiles,false)+rootFiles.map(treeItem).join('');

    const shell=`<div class="cm">
      <button class="cm-scrim" id="cm-scrim" aria-hidden="true" tabindex="-1"></button>
      <aside class="cm-side" id="cm-side" aria-label="${L('Explorateur de fichiers','File explorer')}">
        <div class="cm-side-h"><span>Explorer</span><span class="cm-repo-name">noa-vellat</span></div>
        <div class="cm-tree" role="tree">${tree}</div>
      </aside>
      <div class="cm-main">
        <div class="cm-tabbar">
          <button class="cm-ham" id="cm-ham" aria-label="${L("Ouvrir l'explorateur",'Open the explorer')}" aria-expanded="false"><span></span><span></span><span></span></button>
          <div class="cm-tabs" role="tablist" aria-label="${L('Onglets ouverts','Open tabs')}"></div>
        </div>
        <div class="cm-editorwrap">
          <div class="cm-editor" id="cm-editor">${panels.join('')}</div>
          <div class="cm-minimap" id="cm-minimap" aria-hidden="true"></div>
        </div>
        <div class="cm-status">
          <span class="cm-st-branch">⎇ ${L('alternance','apprenticeship')}/sept-2026</span>
          <span class="cm-st-proj">src · ${C.projets.length} projects</span>
          <span class="cm-st-spacer"></span>
          <span class="cm-st-ln" id="cm-ln">Ln 1, Col 1</span>
          <span class="cm-st-lang" id="cm-lang">markdown</span>
          <span class="cm-st-enc">UTF-8</span>
        </div>
      </div>
    </div>`;
    return shell;
  }

  function initCompileRepo(){
    setNavLinks([
      {href:'#',file:'README',label:'readme'},
      {href:'#',file:'proj-'+CONTENT.projets[0].id,label:L('projets','projects')},
      {href:'#',file:'parcours',label:L('parcours','journey')},
      {href:'#',file:'contrib',label:'contact'}
    ]);
    const side=main.querySelector('#cm-side');
    const tabsEl=main.querySelector('.cm-tabs');
    const editor=main.querySelector('#cm-editor');
    const lnEl=main.querySelector('#cm-ln');
    const langEl=main.querySelector('#cm-lang');
    const minimap=main.querySelector('#cm-minimap');
    const panels=[].slice.call(main.querySelectorAll('.cm-panel'));
    const meta={}; panels.forEach(p=>{meta[p.id.replace('cm-file-','')]={name:p.dataset.name,lang:p.dataset.lang};});
    let open=[], active=null;

    function renderTabs(){
      tabsEl.innerHTML=open.map(id=>{
        const m=meta[id]; const on=id===active;
        return '<div class="cm-tab'+(on?' on':'')+'" role="tab" tabindex="'+(on?'0':'-1')+'" aria-selected="'+(on?'true':'false')+'" data-id="'+id+'"><span class="cm-fi cm-fi-'+(m.name.split('.').pop())+'" aria-hidden="true"></span><span class="cm-tab-name">'+m.name+'</span><span class="cm-tab-x" role="button" aria-label="'+L('Fermer','Close')+'" data-close="'+id+'">✕</span></div>';
      }).join('');
    }
    function setActive(id){
      active=id;
      panels.forEach(p=>{p.hidden=(p.id!=='cm-file-'+id);});
      renderTabs();
      const m=meta[id]; if(langEl)langEl.textContent=m.lang;
      // nav active
      document.querySelectorAll('.nav-links a[data-file]').forEach(a=>a.classList.toggle('active',a.dataset.file===id));
      // minimap : nb de lignes approx
      if(minimap){ const pn=main.querySelector('#cm-file-'+id); const n=pn?Math.min(90,Math.max(24,(pn.textContent||'').split('\n').length+ (pn.querySelectorAll('p,li,h1,h2').length*2))):40;
        let seed=id.length*7; const rnd=()=>{seed=(seed*9301+49297)%233280;return seed/233280;};
        minimap.innerHTML=Array.from({length:n}).map(()=>'<i style="width:'+(20+rnd()*70)+'%"></i>').join(''); }
      if(editor)editor.scrollTop=0; updateLn();
    }
    function openFile(id){ if(!meta[id])return; if(open.indexOf(id)<0)open.push(id); setActive(id); closeSidebarMobile(); }
    function closeFile(id){ const i=open.indexOf(id); if(i<0)return; open.splice(i,1);
      if(active===id){ const next=open[i]||open[i-1]||open[open.length-1]||null; if(next)setActive(next); else{active=null;panels.forEach(p=>p.hidden=true);renderTabs();} }
      else renderTabs(); }

    /* clics : arbre, liens md, onglets, fermeture */
    const onMain=e=>{
      const dir=e.target.closest('.cm-tree-dir'); if(dir){const f=dir.closest('.cm-folder');f.classList.toggle('open');dir.setAttribute('aria-expanded',f.classList.contains('open'));return;}
      const x=e.target.closest('[data-close]'); if(x){e.stopPropagation();closeFile(x.dataset.close);return;}
      const openBtn=e.target.closest('[data-open]'); if(openBtn){openFile(openBtn.dataset.open);return;}
      const tab=e.target.closest('.cm-tab'); if(tab){setActive(tab.dataset.id);return;}
    };
    main.addEventListener('click',onMain);

    /* nav (data-file) — ouvre le fichier */
    const onNav=e=>{const a=e.target.closest('.nav-links a[data-file]');if(!a)return;e.preventDefault();openFile(a.dataset.file);};
    document.addEventListener('click',onNav);

    /* clavier tablist */
    const onTabKey=e=>{ if(!e.target.closest('.cm-tab'))return; const ids=open.slice(); const i=ids.indexOf(active);
      if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();const ni=(i+(e.key==='ArrowRight'?1:ids.length-1))%ids.length;setActive(ids[ni]);const t=tabsEl.querySelector('.cm-tab.on');if(t)t.focus();}
      else if(e.key==='Enter'||e.key===' '){e.preventDefault();} };
    tabsEl.addEventListener('keydown',onTabKey);

    /* statut : ligne fictive au scroll */
    function updateLn(){ if(!editor||!lnEl)return; const line=1+Math.round(editor.scrollTop/19); lnEl.textContent='Ln '+line+', Col 1'; }
    const onScroll=()=>{ if(!ticking){ticking=true;requestAnimationFrame(()=>{ticking=false;updateLn();});} }; let ticking=false;
    editor.addEventListener('scroll',onScroll,{passive:true});

    /* mobile : explorateur off-canvas */
    const ham=main.querySelector('#cm-ham'), scrim=main.querySelector('#cm-scrim');
    function openSidebar(){ side.classList.add('open'); if(scrim)scrim.classList.add('on'); ham.setAttribute('aria-expanded','true'); }
    function closeSidebarMobile(){ side.classList.remove('open'); if(scrim)scrim.classList.remove('on'); if(ham)ham.setAttribute('aria-expanded','false'); }
    const onHam=()=>{ side.classList.contains('open')?closeSidebarMobile():openSidebar(); };
    if(ham)ham.addEventListener('click',onHam);
    if(scrim)scrim.addEventListener('click',closeSidebarMobile);

    onClean(()=>{ main.removeEventListener('click',onMain); document.removeEventListener('click',onNav); tabsEl.removeEventListener('keydown',onTabKey); editor.removeEventListener('scroll',onScroll); if(ham)ham.removeEventListener('click',onHam); if(scrim)scrim.removeEventListener('click',closeSidebarMobile); });

    /* à l'arrivée : README ouvert */
    openFile('README');
  }

