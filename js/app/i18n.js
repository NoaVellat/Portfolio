'use strict';
  /* ═══════════ 0. I18N — bilingue FR/EN ═══════════
     La langue est lue avant le paint (script inline du <head>) → window.__LANG.
     L(fr,en) choisit la chaîne au chargement ; changer de langue = recharger la page
     (le contenu est re-rendu de zéro, la DA est déjà persistée dans localStorage). */
  const L=(fr,en)=>window.__LANG==='en'?en:fr;

  /* Textes statiques du nav (hors renderers) — patchés une fois si EN */
  (function(){
    if(window.__LANG!=='en')return;
    const set=(sel,txt)=>{const el=document.querySelector(sel);if(el)el.textContent=txt;};
    set('#daHint','◆ Change the site’s mood');
    set('.da-menu-h','Art direction');
    set('.da-opt[data-da="terminal"] .da-opt-desc','the original · matrix · green');
    set('.da-opt[data-da="mise-en-place"] .da-opt-desc','craft · embers · copper');
    set('.da-opt[data-da="compile"] .da-opt-desc','blueprint · network · cyan');
    set('.da-opt[data-da="fluid"] .da-opt-desc','iridescent · liquid · neon');
    set('.da-opt[data-da="atelier"] .da-opt-desc','light · paper · ink');
    const tg=document.getElementById('daToggle');
    if(tg)tg.setAttribute('aria-label','Change the site’s visual mood');
    const menu=document.getElementById('daMenu');
    if(menu)menu.setAttribute('aria-label','Art directions');
  })();

  /* Bouton FR/EN : affiche la langue CIBLE, bascule + reload */
  (function(){
    const btn=document.getElementById('langToggle'); if(!btn)return;
    const en=window.__LANG==='en';
    btn.textContent=en?'FR':'EN';
    btn.setAttribute('aria-label',en?'Passer le site en français':'Switch the site to English');
    btn.setAttribute('title',en?'Version française':'English version');
    btn.addEventListener('click',()=>{
      try{localStorage.setItem('noa-lang',en?'fr':'en');}catch(e){}
      location.reload();
    });
  })();
