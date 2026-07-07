'use strict';
  /* ═══════════ 1. CONTENU — SOURCE DE VÉRITÉ UNIQUE ═══════════
     Bilingue : chaque libellé passe par L(fr,en) — voir i18n.js */
  const CONTENT={
    identity:{
      prenom:'Noa', nom:'Vellat', nomComplet:'Noa Vellat',
      titre:L('Développeur Web','Web Developer'),
      role:L('// Développeur Web — Alternance 2025→2027','// Web Developer — Apprenticeship 2025→2027'),
      pitch:L("De la brigade gastronomique au terminal. Épitechien en reconversion, je construis des solutions web rigoureuses, structurées et fiables.",
              "From a fine-dining kitchen brigade to the terminal. Epitech student in career change, I build rigorous, structured and reliable web solutions."),
      localisation:'Lyon, France',
      ville:'Lyon, FR',
      ecole:'Epitech Lyon',
      dispo:{ court:L('Disponible en alternance','Available for an apprenticeship'), date:L('septembre 2026','September 2026'), long:L('Disponible en alternance dès septembre 2026','Available for an apprenticeship from September 2026') },
      status:[
        {txt:L('Disponible en alternance','Available for apprenticeship'), dot:''},
        {txt:'Lyon, France', dot:'b'},
        {txt:'Epitech 2025-2027', dot:'a'}
      ],
      // Bloc terminal du hero (noa.config.js) — conservé tel quel
      config:[
        ['<span class="k">const</span> dev = {',''],
        ['<span class="k">name</span>: <span class="s">"Noa Vellat"</span>,','d'],
        ['<span class="k">role</span>: <span class="s">"'+L('Alternant Dev Web','Web Dev Apprentice')+'"</span>,','d'],
        ['<span class="k">school</span>: <span class="s">"Epitech Lyon"</span>,','d'],
        ['<span class="k">stack</span>: [<span class="s">"MERN"</span>, <span class="s">"Docker"</span>, <span class="s">"Laravel"</span>],','d'],
        ['<span class="k">dispo</span>: <span class="v">true</span>,','d'],
        ['<span class="c">// '+L('ex-chef de partie','former chef de partie')+' 🍳</span>','d'],
        ['};','']
      ]
    },

    // Storytelling brut — cuisine → reconversion → epitech
    parcours:{
      about:{
        paras:[
          L("Mon parcours est atypique : plusieurs années en restauration gastronomique lyonnaise, de commis à chef de partie. La brigade m'a forgé — rigueur absolue, gestion sous pression, zéro place à l'approximatif.",
            "My path is unusual: several years in Lyon fine-dining kitchens, from commis to chef de partie. The brigade forged me — absolute rigor, working under pressure, zero room for approximation."),
          L("Aujourd'hui je transpose cette discipline dans le dev. Chaque fonction doit être propre. Chaque pipeline doit être stable. Chaque livraison doit être fiable. Même philosophie, autre outil.",
            "Today I bring that discipline to development. Every function has to be clean. Every pipeline has to be stable. Every delivery has to be reliable. Same philosophy, different tool.")
        ],
        quote:{ text:L("Un plat raté ne s'envoie pas. Du code cassé ne se déploie pas. L'exigence, c'est la même.",
                       "A failed dish doesn't leave the pass. Broken code doesn't get deployed. The standard is the same."), cite:'— Noa Vellat' },
        tags:[L('Rigueur','Rigor'),L('Autonomie','Autonomy'),L("Esprit d'équipe",'Team spirit'),L('Adaptabilité','Adaptability'),L('Curiosité','Curiosity')]
      },
      story:{
        paras:[
          L("Avant le terminal, il y avait la brigade. Des années à travailler sous pression dans des cuisines gastronomiques — chaque assiette envoyée devait être parfaite. Pas presque parfaite. Parfaite.",
            "Before the terminal, there was the brigade. Years of working under pressure in fine-dining kitchens — every plate sent out had to be perfect. Not almost perfect. Perfect."),
          L("Cette culture du travail irréprochable, je la retrouve chaque jour dans le code. La structure d'un pipeline CI/CD me parle autant qu'une mise en place soignée. La logique d'une API REST, c'est la même que celle d'une recette : précise, répétable, testable.",
            "I find that culture of impeccable work in code every day. The structure of a CI/CD pipeline speaks to me as much as a well-kept mise en place. The logic of a REST API is the same as a recipe's: precise, repeatable, testable.")
        ],
        quote:{ text:L("Une assiette bâclée déçoit un client. Un code bâclé en déçoit des milliers. Dans les deux cas, la qualité fait la différence.",
                       "A sloppy plate disappoints one customer. Sloppy code disappoints thousands. In both cases, quality makes the difference."), cite:'— Noa Vellat' }
      },
      // Timeline courte (bloc « about ») — 4 jalons condensés
      timelineCourt:[
        {year:'2025 →', title:'Epitech Web Academie', sub:L('Alternant Dev Web · Lyon','Web Dev Apprentice · Lyon')},
        {year:'2024', title:L('Chef de partie','Chef de partie'), sub:'Les Cinq Mains · Lyon'},
        {year:'2023', title:L('Demi-chef de partie','Demi-chef de partie'), sub:'Le Théodore · Lyon'},
        {year:'2020', title:'Bac Pro TISSEC', sub:'Lyon'}
      ],
      // Timeline longue (bloc « story ») — 5 jalons détaillés
      timelineLong:[
        {year:'2025 →', role:'Epitech Web Academie', place:L('Lyon · Alternance dev web ','Lyon · Web dev apprenticeship '), detail:'HTML/CSS, JS, PHP/Laravel, Java/Spring Boot, Docker, CI/CD, AWS Cloud, Stack MERN, WordPress', tags:[L('Dev Web','Web Dev'),L('Alternance','Apprenticeship')]},
        {year:'2024–25', role:'Chef de partie', place:'Les Cinq Mains · Lyon ', detail:L("Cuisine gastronomique, pâtisserie, gestion d'équipe",'Fine dining, pastry, team management'), tags:['Management',L('Gastronomie','Gastronomy')]},
        {year:'2023–24', role:'Demi-chef de partie', place:'Le Théodore · Lyon ', detail:L('Cuisine avec le Chef Pâtissier, encadrement commis','Cooking with the Head Pastry Chef, supervising commis'), tags:[]},
        {year:'2020', role:'Bac Pro TISSEC', place:L('Institut des Ressources Industrielles · Lyon','Institut des Ressources Industrielles · Lyon'), detail:'', tags:[]},
        {year:'2019', role:L('Bac ES','Baccalauréat (economics)'), place:'Lycée Colbert · Lyon', detail:'', tags:[]}
      ]
    },

    // Projets — id, nom, stack, rôle « plat » (data-course), note du chef (data-note)
    projets:[
      {
        id:'jeux-videops', num:'01', nom:'Jeux_Videops',
        url:'https://noavellat.github.io/Jeux_Videops/', media:{type:'video', src:'assets/videos/devops.mp4', vid:'0'},
        tagline:'DevOps · CI/CD · Docker · GitHub Actions',
        stackLine:'DevOps · CI/CD · Docker · GitHub Actions',
        course:L('Le plat de résistance','The main course'),
        note:L("Rien ne quitte le passe sans contrôle : lint, tests, audit — puis on envoie.",
               "Nothing leaves the pass unchecked: lint, tests, audit — then we send."),
        description:L("Plateforme de jeux conteneurisée avec pipeline CI/CD complet — linting Google Style, tests unitaires & fonctionnels, npm audit, déploiement Docker automatisé via GitHub Actions.",
                      "Containerized games platform with a full CI/CD pipeline — Google Style linting, unit & functional tests, npm audit, automated Docker deployment via GitHub Actions."),
        chips:['Docker|a','GitHub Actions|a','CI/CD|a','Node.js','npm']
      },
      {
        id:'klivio', num:'02', nom:'Klivio',
        url:'https://noavellat.github.io/Klivio/', media:{type:'video', src:'assets/videos/klivio.mp4', vid:'1'},
        tagline:'HTML · CSS · Tailwind',
        stackLine:'HTML · CSS · Tailwind',
        course:L('Amuse-bouche','Amuse-bouche'),
        note:L('Reproduit au gramme près, dressé au cordeau.','Reproduced to the gram, plated with a straightedge.'),
        description:L("Reproduction pixel-perfect d'une maquette de plateforme de formations en développement personnel — intégration responsive avec Tailwind CSS, animations et interactions fidèles.",
                      "Pixel-perfect reproduction of a personal-development training platform mockup — responsive build with Tailwind CSS, faithful animations and interactions."),
        chips:['HTML5','CSS3','Tailwind|b','Responsive|b']
      },
      {
        id:'my-video-club', num:'03', nom:'My Video Club',
        url:'https://github.com/NoaVellat', media:{type:'video', src:'assets/videos/my-video-club.mp4', vid:'2'},
        tagline:'PHP · SQL · HTML · CSS',
        stackLine:'PHP · SQL · HTML · CSS',
        course:L('Plat mijoté','Slow-cooked dish'),
        note:L('Mijoté côté serveur, servi sans accroc en salle.','Simmered server-side, served front-of-house without a hitch.'),
        description:L("Dashboard complet pour un gérant de cinéma — gestion des films, des réservations et du catalogue. Interface admin avec base de données SQL, back-end PHP et affichage dynamique.",
                      "Full dashboard for a cinema manager — films, bookings and catalogue management. Admin interface with a SQL database, PHP back end and dynamic display."),
        chips:['PHP|b','SQL|b','HTML5','CSS3']
      },
      {
        id:'generateur-cv', num:'04', nom:L('Générateur de CV','CV Generator'),
        url:'https://noavellat.github.io/My_CV_generator/', media:{type:'video', src:'assets/videos/generateur-cv.mp4', vid:'3'},
        tagline:'HTML · CSS · JavaScript',
        stackLine:'HTML · CSS · JavaScript',
        course:L('Entrée express','Express starter'),
        note:L('Minute : saisie, aperçu, dressage — prêt en quelques gestes.','À la minute: input, preview, plating — ready in a few moves.'),
        description:L("Application web permettant de créer son CV en quelques clics — saisie dynamique des informations, aperçu en temps réel et export du résultat dans une interface simple et intuitive.",
                      "Web app to build a CV in a few clicks — dynamic form input, real-time preview and export, all in a simple, intuitive interface."),
        chips:['HTML5','CSS3','JavaScript|a']
      },
      {
        id:'my-notion', num:'05', nom:'My Notion',
        url:'https://my-notion-pcwl.vercel.app/', media:{type:'video', src:'assets/videos/my-notion.mp4', vid:'4'},
        tagline:'Next.js · React · Prisma · PostgreSQL',
        stackLine:'Next.js · React · Prisma · PostgreSQL',
        course:L('La signature du chef',"The chef's signature"),
        note:L('Ma pièce de démonstration : base solide, dressage WebGL.','My showpiece: solid base, WebGL plating.'),
        description:L("Clone minimaliste de Notion — création et édition de pages via un éditeur de blocs riche avec autosave, tableau Kanban en glisser-déposer, gestion des statuts et suppression en lot. Architecture Next.js 16 (App Router & Server Actions), persistance Prisma/PostgreSQL et fond animé en WebGL.",
                      "Minimalist Notion clone — page creation and editing through a rich block editor with autosave, drag-and-drop Kanban board, status management and bulk delete. Next.js 16 architecture (App Router & Server Actions), Prisma/PostgreSQL persistence and an animated WebGL background."),
        chips:['Next.js 16|a','React 19|a','TypeScript|b','Prisma|b','Three.js']
      },
      {
        id:'core-lab', num:'06', nom:'Core_Lab',
        url:'https://github.com/NoaVellat/Core_Lab', media:{type:'image', src:'assets/images/core_lab_vignette.png'},
        tagline:'MongoDB · Express · React · Node.js',
        stackLine:'MongoDB · Express · React · Node.js',
        course:L('Spécialité de la maison','House specialty'),
        note:L('Plat complet, stack MERN, pédagogie servie chaude.','A complete dish, MERN stack, pedagogy served hot.'),
        description:L("Plateforme LMS (Learning Management System) de formation en ligne développée avec la stack MERN — pour des formations passionnantes, rapides et ludiques. Gestion des cours, des utilisateurs et du suivi pédagogique.",
                      "Online-learning LMS platform built with the MERN stack — for engaging, fast and playful courses. Course, user and learning-progress management."),
        chips:['MongoDB|a','Express|a','React|b','Node.js|b']
      }
    ],
    // « Ce que ça démontre » — glose éditoriale (restatement honnête du réel), utilisée par le thème atelier
    demontre:{
      'jeux-videops':L("Maîtrise d'un pipeline CI/CD de bout en bout : lint Google Style, tests unitaires & fonctionnels, npm audit et déploiement Docker automatisé via GitHub Actions.",
                       "Command of an end-to-end CI/CD pipeline: Google Style linting, unit & functional tests, npm audit and automated Docker deployment via GitHub Actions."),
      'klivio':L("Rigueur du détail : intégration fidèle au pixel, responsive et animée avec Tailwind CSS.",
                 "Rigor in the details: pixel-faithful, responsive, animated build with Tailwind CSS."),
      'my-video-club':L("Application data-driven complète : modélisation SQL, back-end PHP et interface d'administration dynamique.",
                        "A complete data-driven application: SQL modelling, PHP back end and dynamic admin interface."),
      'generateur-cv':L("Interactivité côté client : saisie dynamique, aperçu temps réel et export.",
                        "Client-side interactivity: dynamic input, real-time preview and export."),
      'my-notion':L("Architecture full-stack moderne : Next.js 16 (App Router & Server Actions), persistance Prisma/PostgreSQL, fond WebGL.",
                    "Modern full-stack architecture: Next.js 16 (App Router & Server Actions), Prisma/PostgreSQL persistence, WebGL background."),
      'core-lab':L("Produit full-stack MERN de bout en bout : gestion des cours, des utilisateurs et du suivi pédagogique.",
                   "End-to-end MERN full-stack product: course, user and learning-progress management.")
    },
    projetsCTA:{ url:'https://github.com/NoaVellat', label:L('Voir tous mes projets','See all my projects'), sub:'github.com/NoaVellat →' },

    // Compétences — front / back / devops / mern / transférables (soft)
    competences:{
      tabs:[
        {id:'frontend', label:'Frontend'},
        {id:'backend', label:'Backend'},
        {id:'devops', label:'DevOps & Cloud'},
        {id:'mern', label:L('Stack MERN','MERN Stack')},
        {id:'soft', label:'Soft Skills'}
      ],
      frontend:{
        cards:[
          {icons:['devicon-html5-plain colored','devicon-css3-plain colored'], name:'HTML / CSS'},
          {icons:['devicon-tailwindcss-plain colored'], name:'Tailwind CSS'},
          {icons:['devicon-javascript-plain colored'], name:'JavaScript'},
          {icons:['devicon-bootstrap-plain colored'], name:'Bootstrap'},
          {icons:['devicon-react-original colored'], name:'React'},
          {icons:['devicon-wordpress-plain colored'], name:'WordPress'}
        ],
        chips:['HTML5','CSS3','JavaScript ES6+','Tailwind','Bootstrap','React','WordPress','Responsive Design']
      },
      backend:{
        cards:[
          {icons:['devicon-php-plain colored','devicon-laravel-plain colored'], name:'PHP / Laravel'},
          {icons:['devicon-java-plain colored','devicon-spring-plain colored'], name:'Java / Spring Boot'},
          {icons:['devicon-mysql-plain colored'], name:'SQL / MySQL'},
          {icons:['fa-solid fa-network-wired'], name:'API REST'},
          {icons:['devicon-nodejs-plain colored'], name:'Node.js'},
          {icons:['devicon-mongodb-plain colored'], name:'MongoDB'}
        ],
        chips:['PHP','Laravel','Java','Spring Boot|b','SQL|b','MySQL|b','Node.js','MongoDB','API REST']
      },
      devops:{
        cards:[
          {icons:['devicon-docker-plain colored'], name:'Docker'},
          {icons:['devicon-githubactions-plain colored'], name:'GitHub Actions CI/CD'},
          {icons:['devicon-git-plain colored','devicon-github-original colored'], name:'Git / GitHub'},
          {icons:['devicon-amazonwebservices-original colored'], name:'AWS Cloud'},
          {icons:['fa-solid fa-vial'], name:L('Tests unitaires / fonctionnels','Unit / functional tests')},
          {icons:['devicon-linux-plain colored','devicon-bash-plain colored'], name:'Linux / Bash'}
        ],
        chips:['Docker|a','Docker Compose|a','GitHub Actions|a','CI/CD Pipeline|a',L('AWS (Piscine Cloud)','AWS (Cloud bootcamp)'),'npm audit',L('Linter Google Style','Google Style linter'),'Linux','Git']
      },
      mern:{
        intro:L('Stack full-stack JavaScript apprise à Epitech — API REST + front React.','Full-stack JavaScript stack learned at Epitech — REST API + React front end.'),
        cards:[
          {icons:['devicon-mongodb-plain colored'], name:'MongoDB'},
          {icons:['devicon-express-original colored'], name:'Express.js'},
          {icons:['devicon-react-original colored'], name:'React'},
          {icons:['devicon-nodejs-plain colored'], name:'Node.js'}
        ],
        chips:['MongoDB','Mongoose','Express.js|b','REST API|b','React','React Hooks','Node.js|a','npm|a']
      },
      soft:{
        cards:[
          {icons:['fa-solid fa-users'], name:L('Travail en équipe','Teamwork')},
          {icons:['fa-solid fa-bullseye'], name:L('Rigueur & précision','Rigor & precision')},
          {icons:['fa-solid fa-heart-pulse'], name:L('Gestion du stress','Stress management')},
          {icons:['fa-solid fa-compass'], name:L('Autonomie','Autonomy')},
          {icons:['fa-solid fa-arrows-rotate'], name:L('Adaptabilité','Adaptability')},
          {icons:['fa-solid fa-lightbulb'], name:L('Curiosité / apprentissage','Curiosity / learning')}
        ]
      },
      // « fonds de sauce » : transférables cuisine (base de tout) — pour thèmes bespoke
      transferables:[L('Gestion de la pression','Grace under pressure'),L('Priorisation','Prioritisation'),L('Travail en brigade','Brigade teamwork'),L('Rigueur du dressage','Plating-level rigor'),L('Sens du service','Sense of service')],
      stats:[
        {n:6, l:L('Projets','Projects')},
        {n:5, l:L('Langages','Languages')},
        {n:3, l:L('Ans gastro','Yrs fine dining')},
        {n:2027, l:L('Diplôme','Degree')}
      ]
    },

    contact:{
      titreA:L('En recherche','Looking for'), titreB:L("d'alternance",'an apprenticeship'),
      pitch:L("Je construis des solutions web rigoureuses et je cherche une équipe pour progresser. Vous avez un projet ou une opportunité ? Parlons-en.",
              "I build rigorous web solutions and I'm looking for a team to grow with. Got a project or an opportunity? Let's talk."),
      email:'noa.vellat@epitech.eu',
      tel:'06 29 62 66 89', telHref:'0629626689',
      linkedin:{ url:'https://www.linkedin.com/in/noa-vellat-04594a207/', handle:'noa-vellat' },
      github:{ url:'https://github.com/NoaVellat', handle:'NoaVellat' },
      cv:'assets/docs/CV_Noa_Vellat.pdf',
      site:'https://noa-vellat.netlify.app/'
    },
    footer:[L('© 2026 Noa Vellat — dev web · Epitech Lyon','© 2026 Noa Vellat — web dev · Epitech Lyon')]
  };

  /* ═══════════ 2. VOICE — microcopie par thème ═══════════
     Chaque concept traduit dans la langue de l'univers.
     (chaque libellé visible passe par cette table dans les renderers) */
  const VOICE={
    terminal:{ site:'session', about:'whoami', skills:'ls skills/', projets:'ls projects/', contact:'./contact.sh', dispo:L('[READY] alternance sept. 2026','[READY] apprenticeship Sept 2026'),
      invite:L('Ce site a 5 ambiances — 5 facettes de ma personnalité. Essayez-les !','This site has 5 moods — 5 facets of my personality. Try them!'), invitePath:L('bouton « Ambiance », en haut à droite','“Ambiance” button, top right') },
    'mise-en-place':{ site:L('La Carte','The Menu'), about:L('Le Chef','The Chef'), skills:L('Les Ingrédients','The Ingredients'), projets:L('Plats Signatures','Signature Dishes'), contact:L('Réservations','Reservations'), dispo:L('Table disponible dès septembre 2026','A table is available from September 2026'),
      invite:L('La maison se visite sous cinq ambiances — chacune un trait du chef.','The house can be visited in five moods — each one a trait of the chef.'), invitePath:L('la carte des ambiances, en haut à droite','the mood menu, top right') },
    compile:{ site:L('le repo','the repo'), about:'README.md', skills:'package.json', projets:'src/projects/', contact:'CONTRIBUTING.md', dispo:'hiring: open',
      invite:L('Cinq thèmes d’interface pour un même dépôt — cinq facettes du dev.','Five UI themes for one repository — five facets of the dev.'), invitePath:L('sélecteur « Ambiance »','“Ambiance” selector') },
    fluid:{ site:L('la galerie','the gallery'), about:L("Cartel d'artiste",'Artist statement'), skills:'medium', projets:L('Les Œuvres','The Works'), contact:L("Livre d'or",'Guest book'), dispo:L('Disponible en alternance — septembre 2026','Available for an apprenticeship — September 2026'),
      invite:L('Une exposition, cinq accrochages — chacun une humeur de l’artiste.','One exhibition, five hangings — each one a mood of the artist.'), invitePath:L('bouton « Ambiance », en haut à droite','“Ambiance” button, top right') },
    atelier:{ site:L('la revue','the review'), about:L('L’article de fond','The feature story'), skills:'Nomenclature', projets:L('Études & Figures','Studies & Figures'), contact:'Colophon', dispo:L('Appel à collaboration — disponible en alternance dès septembre 2026','Call for collaboration — available for an apprenticeship from September 2026'),
      invite:L('Ce numéro paraît en cinq éditions — une par facette de l’auteur.','This issue comes in five editions — one per facet of the author.'), invitePath:L('sélecteur « Ambiance », en haut à droite','“Ambiance” selector, top right') }
  };
  /* petite ligne d'invitation à changer d'ambiance, déclinée par récit */
  const inviteHTML=(V,cls)=>`<p class="${cls} da-invite"><span class="inv-star" aria-hidden="true">✦</span> ${esc(V.invite)} <span class="inv-path">(${esc(V.invitePath)})</span></p>`;
  /* teaser des 4 autres ambiances — chacune une parcelle de la vie de Noa (affiché sur le thème d'accueil) */
  const THEME_TEASER=[
    {da:'mise-en-place', sw:'mise',    name:'Mise en Place', tag:L('mes années de brigade','my brigade years')},
    {da:'compile',       sw:'compile', name:'Compile',       tag:L('l’ingénieur en moi','the engineer in me')},
    {da:'fluid',         sw:'fluid',   name:'Fluid',         tag:L('ma part créative','my creative side')},
    {da:'atelier',       sw:'atelier', name:'Atelier',       tag:L('mon histoire, racontée','my story, told')}
  ];

  /* ═══════════ 3. HELPERS ═══════════ */
  const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const mlSplit=str=>str.split('').map(ch=>'<span class="ml">'+esc(ch)+'</span>').join('');
  function chip(spec, base){
    const i=spec.indexOf('|'); const label=i<0?spec:spec.slice(0,i); const kind=i<0?'':spec.slice(i+1);
    return '<span class="'+base+(kind?' '+kind:'')+'">'+esc(label)+'</span>';
  }
