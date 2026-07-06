'use strict';
  /* ═══════════ 1. CONTENU — SOURCE DE VÉRITÉ UNIQUE ═══════════ */
  const CONTENT={
    identity:{
      prenom:'Noa', nom:'Vellat', nomComplet:'Noa Vellat',
      titre:'Développeur Web',
      role:'// Développeur Web — Alternance 2025→2027',
      pitch:"De la brigade gastronomique au terminal. Épitechien en reconversion, je construis des solutions web rigoureuses, structurées et fiables.",
      localisation:'Lyon, France',
      ville:'Lyon, FR',
      ecole:'Epitech Lyon',
      dispo:{ court:'Disponible en alternance', date:'septembre 2026', long:'Disponible en alternance dès septembre 2026' },
      status:[
        {txt:'Disponible en alternance', dot:''},
        {txt:'Lyon, France', dot:'b'},
        {txt:'Epitech 2025-2027', dot:'a'}
      ],
      // Bloc terminal du hero (noa.config.js) — conservé tel quel
      config:[
        ['<span class="k">const</span> dev = {',''],
        ['<span class="k">name</span>: <span class="s">"Noa Vellat"</span>,','d'],
        ['<span class="k">role</span>: <span class="s">"Alternant Dev Web"</span>,','d'],
        ['<span class="k">school</span>: <span class="s">"Epitech Lyon"</span>,','d'],
        ['<span class="k">stack</span>: [<span class="s">"MERN"</span>, <span class="s">"Docker"</span>, <span class="s">"Laravel"</span>],','d'],
        ['<span class="k">dispo</span>: <span class="v">true</span>,','d'],
        ['<span class="c">// ex-chef de partie 🍳</span>','d'],
        ['};','']
      ]
    },

    // Storytelling brut — cuisine → reconversion → epitech
    parcours:{
      about:{
        paras:[
          "Mon parcours est atypique : plusieurs années en restauration gastronomique lyonnaise, de commis à chef de partie. La brigade m'a forgé — rigueur absolue, gestion sous pression, zéro place à l'approximatif.",
          "Aujourd'hui je transpose cette discipline dans le dev. Chaque fonction doit être propre. Chaque pipeline doit être stable. Chaque livraison doit être fiable. Même philosophie, autre outil."
        ],
        quote:{ text:"Un plat raté ne s'envoie pas. Du code cassé ne se déploie pas. L'exigence, c'est la même.", cite:'— Noa Vellat' },
        tags:['Rigueur','Autonomie',"Esprit d'équipe",'Adaptabilité','Curiosité']
      },
      story:{
        paras:[
          "Avant le terminal, il y avait la brigade. Des années à travailler sous pression dans des cuisines gastronomiques — chaque assiette envoyée devait être parfaite. Pas presque parfaite. Parfaite.",
          "Cette culture du travail irréprochable, je la retrouve chaque jour dans le code. La structure d'un pipeline CI/CD me parle autant qu'une mise en place soignée. La logique d'une API REST, c'est la même que celle d'une recette : précise, répétable, testable."
        ],
        quote:{ text:"Une assiette bâclée déçoit un client. Un code bâclé en déçoit des milliers. Dans les deux cas, la qualité fait la différence.", cite:'— Noa Vellat' }
      },
      // Timeline courte (bloc « about ») — 4 jalons condensés
      timelineCourt:[
        {year:'2025 →', title:'Epitech Web Academie', sub:'Alternant Dev Web · Lyon'},
        {year:'2024', title:'Chef de partie', sub:'Les Cinq Mains · Lyon'},
        {year:'2023', title:'Demi-chef de partie', sub:'Le Théodore · Lyon'},
        {year:'2020', title:'Bac Pro TISSEC', sub:'Lyon'}
      ],
      // Timeline longue (bloc « story ») — 5 jalons détaillés
      timelineLong:[
        {year:'2025 →', role:'Epitech Web Academie', place:'Lyon · Alternance dev web ', detail:'HTML/CSS, JS, PHP/Laravel, Java/Spring Boot, Docker, CI/CD, AWS Cloud, Stack MERN, WordPress', tags:['Dev Web','Alternance']},
        {year:'2024–25', role:'Chef de partie', place:'Les Cinq Mains · Lyon ', detail:"Cuisine gastronomique, pâtisserie, gestion d'équipe", tags:['Management','Gastronomie']},
        {year:'2023–24', role:'Demi-chef de partie', place:'Le Théodore · Lyon ', detail:'Cuisine avec le Chef Pâtissier, encadrement commis', tags:[]},
        {year:'2020', role:'Bac Pro TISSEC', place:'Institut des Ressources Industrielles · Lyon', detail:'', tags:[]},
        {year:'2019', role:'Bac ES', place:'Lycée Colbert · Lyon', detail:'', tags:[]}
      ]
    },

    // Projets — id, nom, stack, rôle « plat » (data-course), note du chef (data-note)
    projets:[
      {
        id:'jeux-videops', num:'01', nom:'Jeux_Videops',
        url:'https://noavellat.github.io/Jeux_Videops/', media:{type:'video', src:'assets/videos/devops.mp4', vid:'0'},
        tagline:'DevOps · CI/CD · Docker · GitHub Actions',
        stackLine:'DevOps · CI/CD · Docker · GitHub Actions',
        course:'Le plat de résistance',
        note:"Rien ne quitte le passe sans contrôle : lint, tests, audit — puis on envoie.",
        description:"Plateforme de jeux conteneurisée avec pipeline CI/CD complet — linting Google Style, tests unitaires & fonctionnels, npm audit, déploiement Docker automatisé via GitHub Actions.",
        chips:['Docker|a','GitHub Actions|a','CI/CD|a','Node.js','npm']
      },
      {
        id:'klivio', num:'02', nom:'Klivio',
        url:'https://noavellat.github.io/Klivio/', media:{type:'video', src:'assets/videos/klivio.mp4', vid:'1'},
        tagline:'HTML · CSS · Tailwind',
        stackLine:'HTML · CSS · Tailwind',
        course:'Amuse-bouche',
        note:'Reproduit au gramme près, dressé au cordeau.',
        description:"Reproduction pixel-perfect d'une maquette de plateforme de formations en développement personnel — intégration responsive avec Tailwind CSS, animations et interactions fidèles.",
        chips:['HTML5','CSS3','Tailwind|b','Responsive|b']
      },
      {
        id:'my-video-club', num:'03', nom:'My Video Club',
        url:'https://github.com/NoaVellat', media:{type:'video', src:'assets/videos/my-video-club.mp4', vid:'2'},
        tagline:'PHP · SQL · HTML · CSS',
        stackLine:'PHP · SQL · HTML · CSS',
        course:'Plat mijoté',
        note:'Mijoté côté serveur, servi sans accroc en salle.',
        description:"Dashboard complet pour un gérant de cinéma — gestion des films, des réservations et du catalogue. Interface admin avec base de données SQL, back-end PHP et affichage dynamique.",
        chips:['PHP|b','SQL|b','HTML5','CSS3']
      },
      {
        id:'generateur-cv', num:'04', nom:'Générateur de CV',
        url:'https://noavellat.github.io/My_CV_generator/', media:{type:'video', src:'assets/videos/generateur-cv.mp4', vid:'3'},
        tagline:'HTML · CSS · JavaScript',
        stackLine:'HTML · CSS · JavaScript',
        course:'Entrée express',
        note:'Minute : saisie, aperçu, dressage — prêt en quelques gestes.',
        description:"Application web permettant de créer son CV en quelques clics — saisie dynamique des informations, aperçu en temps réel et export du résultat dans une interface simple et intuitive.",
        chips:['HTML5','CSS3','JavaScript|a']
      },
      {
        id:'my-notion', num:'05', nom:'My Notion',
        url:'https://my-notion-pcwl.vercel.app/', media:{type:'video', src:'assets/videos/my-notion.mp4', vid:'4'},
        tagline:'Next.js · React · Prisma · PostgreSQL',
        stackLine:'Next.js · React · Prisma · PostgreSQL',
        course:'La signature du chef',
        note:'Ma pièce de démonstration : base solide, dressage WebGL.',
        description:"Clone minimaliste de Notion — création et édition de pages via un éditeur de blocs riche avec autosave, tableau Kanban en glisser-déposer, gestion des statuts et suppression en lot. Architecture Next.js 16 (App Router & Server Actions), persistance Prisma/PostgreSQL et fond animé en WebGL.",
        chips:['Next.js 16|a','React 19|a','TypeScript|b','Prisma|b','Three.js']
      },
      {
        id:'core-lab', num:'06', nom:'Core_Lab',
        url:'https://github.com/NoaVellat/Core_Lab', media:{type:'image', src:'assets/images/core_lab_vignette.png'},
        tagline:'MongoDB · Express · React · Node.js',
        stackLine:'MongoDB · Express · React · Node.js',
        course:'Spécialité de la maison',
        note:'Plat complet, stack MERN, pédagogie servie chaude.',
        description:"Plateforme LMS (Learning Management System) de formation en ligne développée avec la stack MERN — pour des formations passionnantes, rapides et ludiques. Gestion des cours, des utilisateurs et du suivi pédagogique.",
        chips:['MongoDB|a','Express|a','React|b','Node.js|b']
      }
    ],
    // « Ce que ça démontre » — glose éditoriale (restatement honnête du réel), utilisée par le thème atelier
    demontre:{
      'jeux-videops':"Maîtrise d'un pipeline CI/CD de bout en bout : lint Google Style, tests unitaires & fonctionnels, npm audit et déploiement Docker automatisé via GitHub Actions.",
      'klivio':"Rigueur du détail : intégration fidèle au pixel, responsive et animée avec Tailwind CSS.",
      'my-video-club':"Application data-driven complète : modélisation SQL, back-end PHP et interface d'administration dynamique.",
      'generateur-cv':"Interactivité côté client : saisie dynamique, aperçu temps réel et export.",
      'my-notion':"Architecture full-stack moderne : Next.js 16 (App Router & Server Actions), persistance Prisma/PostgreSQL, fond WebGL.",
      'core-lab':"Produit full-stack MERN de bout en bout : gestion des cours, des utilisateurs et du suivi pédagogique."
    },
    projetsCTA:{ url:'https://github.com/NoaVellat', label:'Voir tous mes projets', sub:'github.com/NoaVellat →' },

    // Compétences — front / back / devops / mern / transférables (soft)
    competences:{
      tabs:[
        {id:'frontend', label:'Frontend'},
        {id:'backend', label:'Backend'},
        {id:'devops', label:'DevOps & Cloud'},
        {id:'mern', label:'Stack MERN'},
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
          {icons:['fa-solid fa-vial'], name:'Tests unitaires / fonctionnels'},
          {icons:['devicon-linux-plain colored','devicon-bash-plain colored'], name:'Linux / Bash'}
        ],
        chips:['Docker|a','Docker Compose|a','GitHub Actions|a','CI/CD Pipeline|a','AWS (Piscine Cloud)','npm audit','Linter Google Style','Linux','Git']
      },
      mern:{
        intro:'Stack full-stack JavaScript apprise à Epitech — API REST + front React.',
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
          {icons:['fa-solid fa-users'], name:'Travail en équipe'},
          {icons:['fa-solid fa-bullseye'], name:'Rigueur & précision'},
          {icons:['fa-solid fa-heart-pulse'], name:'Gestion du stress'},
          {icons:['fa-solid fa-compass'], name:'Autonomie'},
          {icons:['fa-solid fa-arrows-rotate'], name:'Adaptabilité'},
          {icons:['fa-solid fa-lightbulb'], name:'Curiosité / apprentissage'}
        ]
      },
      // « fonds de sauce » : transférables cuisine (base de tout) — pour thèmes bespoke
      transferables:['Gestion de la pression','Priorisation','Travail en brigade','Rigueur du dressage','Sens du service'],
      stats:[
        {n:6, l:'Projets'},
        {n:5, l:'Langages'},
        {n:3, l:'Ans gastro'},
        {n:2027, l:'Diplôme'}
      ]
    },

    contact:{
      titreA:'En recherche', titreB:"d'alternance",
      pitch:"Je construis des solutions web rigoureuses et je cherche une équipe pour progresser. Vous avez un projet ou une opportunité ? Parlons-en.",
      email:'noa.vellat@epitech.eu',
      tel:'06 29 62 66 89', telHref:'0629626689',
      linkedin:{ url:'https://www.linkedin.com/in/noa-vellat-04594a207/', handle:'noa-vellat' },
      github:{ url:'https://github.com/NoaVellat', handle:'NoaVellat' },
      cv:'assets/docs/CV_Noa_Vellat.pdf',
      site:'https://noa-vellat.netlify.app/'
    },
    footer:['© 2026 Noa Vellat — dev web · Epitech Lyon']
  };

  /* ═══════════ 2. VOICE — microcopie par thème ═══════════
     Chaque concept traduit dans la langue de l'univers.
     (chaque libellé visible passe par cette table dans les renderers) */
  const VOICE={
    terminal:{ site:'session', about:'whoami', skills:'ls skills/', projets:'ls projects/', contact:'./contact.sh', dispo:'[READY] alternance sept. 2026',
      invite:'Ce site a 5 ambiances — 5 facettes de ma personnalité. Essayez-les !', invitePath:'bouton « Ambiance », en haut à droite' },
    'mise-en-place':{ site:'La Carte', about:'Le Chef', skills:'Les Ingrédients', projets:'Plats Signatures', contact:'Réservations', dispo:'Table disponible dès septembre 2026',
      invite:'La maison se visite sous cinq ambiances — chacune un trait du chef.', invitePath:'la carte des ambiances, en haut à droite' },
    compile:{ site:'le repo', about:'README.md', skills:'package.json', projets:'src/projects/', contact:'CONTRIBUTING.md', dispo:'hiring: open',
      invite:'Cinq thèmes d’interface pour un même dépôt — cinq facettes du dev.', invitePath:'sélecteur « Ambiance »' },
    fluid:{ site:'la galerie', about:"Cartel d'artiste", skills:'medium', projets:'Les Œuvres', contact:"Livre d'or", dispo:'Disponible en alternance — septembre 2026',
      invite:'Une exposition, cinq accrochages — chacun une humeur de l’artiste.', invitePath:'bouton « Ambiance », en haut à droite' },
    atelier:{ site:'la revue', about:'L’article de fond', skills:'Nomenclature', projets:'Études & Figures', contact:'Colophon', dispo:'Appel à collaboration — disponible en alternance dès septembre 2026',
      invite:'Ce numéro paraît en cinq éditions — une par facette de l’auteur.', invitePath:'sélecteur « Ambiance », en haut à droite' }
  };
  /* petite ligne d'invitation à changer d'ambiance, déclinée par récit */
  const inviteHTML=(V,cls)=>`<p class="${cls} da-invite"><span class="inv-star" aria-hidden="true">✦</span> ${esc(V.invite)} <span class="inv-path">(${esc(V.invitePath)})</span></p>`;
  /* teaser des 4 autres ambiances — chacune une parcelle de la vie de Noa (affiché sur le thème d'accueil) */
  const THEME_TEASER=[
    {da:'mise-en-place', sw:'mise',    name:'Mise en Place', tag:'mes années de brigade'},
    {da:'compile',       sw:'compile', name:'Compile',       tag:'l’ingénieur en moi'},
    {da:'fluid',         sw:'fluid',   name:'Fluid',         tag:'ma part créative'},
    {da:'atelier',       sw:'atelier', name:'Atelier',       tag:'mon histoire, racontée'}
  ];

  /* ═══════════ 3. HELPERS ═══════════ */
  const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const mlSplit=str=>str.split('').map(ch=>'<span class="ml">'+esc(ch)+'</span>').join('');
  function chip(spec, base){
    const i=spec.indexOf('|'); const label=i<0?spec:spec.slice(0,i); const kind=i<0?'':spec.slice(i+1);
    return '<span class="'+base+(kind?' '+kind:'')+'">'+esc(label)+'</span>';
  }

