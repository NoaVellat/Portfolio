/* ══════════════════════════════════════════════════════════════════════════
   ARCHITECTURE « 1 contenu, 5 récits »
   — Contenu séparé de la mise en scène. Un seul CONTENT, une VOICE par DA,
     un renderer par DA, un swap de <main> sous le voile de transition.
   ══════════════════════════════════════════════════════════════════════════ */
'use strict';

/* Photo du portrait (remplace l'ancien data-URI base64 de 1,4 Mo) */
window.__PHOTO='assets/images/photo_noa.jpg';

/* #da-main est présent statiquement dans index.html */
const main=document.getElementById('da-main');
const root=document.documentElement;
const reduce=window.matchMedia('(prefers-reduced-motion:reduce)').matches;
