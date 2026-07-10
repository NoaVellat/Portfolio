/* ══════════ SCÈNES 3D (three.js) — un univers en profondeur par DA ══════════
   Exposé en window.DA3D. L'orchestrateur (engine.js) l'utilise si three.js est
   chargé et que le contexte se crée ; sinon il retombe sur ses shaders 2D
   historiques. Les scènes sont construites à la demande (1re visite de la DA). */
window.DA3D=(function(){
  if(!window.THREE)return null;
  const T=window.THREE;

  /* bruit GLSL partagé (2D + 3D) */
  const NZ=`
  float h21(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
  float n2(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.-2.*f);
    return mix(mix(h21(i),h21(i+vec2(1,0)),u.x),mix(h21(i+vec2(0,1)),h21(i+vec2(1,1)),u.x),u.y);}
  float fbm2(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*n2(p);p=p*2.03+1.7;a*=.5;}return v;}
  float h13(vec3 p){p=fract(p*.1031);p+=dot(p,p.zyx+31.32);return fract((p.x+p.y)*p.z);}
  float n3(vec3 p){vec3 i=floor(p),f=fract(p);vec3 u=f*f*(3.-2.*f);
    return mix(mix(mix(h13(i),h13(i+vec3(1,0,0)),u.x),mix(h13(i+vec3(0,1,0)),h13(i+vec3(1,1,0)),u.x),u.y),
               mix(mix(h13(i+vec3(0,0,1)),h13(i+vec3(1,0,1)),u.x),mix(h13(i+vec3(0,1,1)),h13(i+vec3(1,1,1)),u.x),u.y),u.z);}
  float fbm3(vec3 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*n3(p);p=p*2.03+1.3;a*=.5;}return v;}
  `;

  function init(canvas,isMobile){
    let rd=null;
    try{rd=new T.WebGLRenderer({canvas:canvas,antialias:!isMobile,alpha:false,powerPreference:'high-performance'});}catch(e){}
    if(!rd)return null;
    let ASP=innerWidth/Math.max(1,innerHeight);
    const DPR={value:Math.min(window.devicePixelRatio||1,isMobile?1.0:1.6)};
    const built={},t0=performance.now();

    function cam(z,y){const c=new T.PerspectiveCamera(60,ASP,.1,300);c.position.set(0,y||0,z);return c;}
    function attr(n,arr){return new T.BufferAttribute(new Float32Array(arr),n);}
    /* texture radiale générée (halo / lueur / fumée) */
    function radialTex(inner,outer){const c=document.createElement('canvas');c.width=c.height=256;
      const g=c.getContext('2d');const gr=g.createRadialGradient(128,128,0,128,128,128);
      gr.addColorStop(0,inner);gr.addColorStop(1,outer);g.fillStyle=gr;g.fillRect(0,0,256,256);
      return new T.CanvasTexture(c);}
    function smokeTex(){const c=document.createElement('canvas');c.width=c.height=256;const g=c.getContext('2d');
      for(let i=0;i<26;i++){const x=128+(Math.random()-.5)*150,y=128+(Math.random()-.5)*150,r=22+Math.random()*46;
        const gr=g.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,'rgba(255,255,255,.09)');gr.addColorStop(1,'rgba(255,255,255,0)');
        g.fillStyle=gr;g.beginPath();g.arc(x,y,r,0,7);g.fill();}
      return new T.CanvasTexture(c);}

    /* ─────────── TERMINAL — pluie matrix en profondeur (colonnes de glyphes 3D) ─────────── */
    function mkTerminal(){
      const scene=new T.Scene();const camera=cam(30);
      /* atlas de glyphes dessiné en canvas (katakana + binaire + symboles code) */
      const AC=document.createElement('canvas');AC.width=AC.height=512;
      const CH='01アイウエオカキクケコサシスセソタチツテトナニヌネノ<>/{}[]=+*#$&%!?;:~^|01ラリルレロ';
      function drawAtlas(){const g=AC.getContext('2d');g.fillStyle='#000';g.fillRect(0,0,512,512);
        g.font='46px "JetBrains Mono",monospace';g.textAlign='center';g.textBaseline='middle';g.fillStyle='#fff';
        for(let i=0;i<64;i++)g.fillText(CH[i%CH.length],(i%8)*64+32,((i/8)|0)*64+34);}
      drawAtlas();
      const atlas=new T.CanvasTexture(AC);
      if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>{drawAtlas();atlas.needsUpdate=true;});
      const TR=isMobile?80:200,LEN=6,N=TR*LEN;
      const pos=[],spd=[],head=[],gly=[],flick=[];
      for(let i=0;i<TR;i++){
        const x=Math.round((Math.random()*52-26)/1.6)*1.6,z=Math.random()*34-28,y0=Math.random()*46-23,s=4+Math.random()*9;
        for(let k=0;k<LEN;k++){pos.push(x,y0,z);spd.push(s);head.push(k);gly.push((Math.random()*64)|0);flick.push(1+Math.random()*5);}}
      const geo=new T.BufferGeometry();
      geo.setAttribute('position',attr(3,pos));geo.setAttribute('aSpd',attr(1,spd));
      geo.setAttribute('aHead',attr(1,head));geo.setAttribute('aGlyph',attr(1,gly));geo.setAttribute('aFlick',attr(1,flick));
      const uni={u_time:{value:0},u_boost:{value:0},u_dpr:DPR,u_atlas:{value:atlas}};
      const mat=new T.ShaderMaterial({uniforms:uni,transparent:true,depthWrite:false,blending:T.AdditiveBlending,
        vertexShader:`attribute float aSpd,aHead,aGlyph,aFlick;uniform float u_time,u_boost,u_dpr;varying float vHead,vA,vG;
        void main(){vec3 p=position;
          p.y=23.-mod(23.-position.y+u_time*aSpd*(1.+u_boost*1.4)+aHead*1.15,46.);
          vec4 mv=modelViewMatrix*vec4(p,1.);
          gl_PointSize=(aHead<.5?21.:16.)*u_dpr*(24./-mv.z);
          vG=mod(aGlyph+floor(u_time*aFlick+aHead*7.),64.);
          vHead=aHead;vA=(1.-aHead/7.)*clamp((mv.z+66.)/42.,0.,1.);
          gl_Position=projectionMatrix*mv;}`,
        fragmentShader:`uniform sampler2D u_atlas;varying float vHead,vA,vG;
        void main(){vec2 cell=vec2(mod(vG,8.),floor(vG/8.));
          vec2 uv=(cell+vec2(gl_PointCoord.x,1.-gl_PointCoord.y))/8.;
          float g=texture2D(u_atlas,uv).r;
          vec3 col=(vHead<.5)?vec3(.78,1.,.88):vec3(0.,1.,.53);
          gl_FragColor=vec4(col,g*vA);}`});
      scene.add(new T.Points(geo,mat));
      /* poussière bleue flottante */
      const P2=isMobile?30:60,p2=[],s2=[];
      for(let i=0;i<P2;i++){p2.push(Math.random()*52-26,Math.random()*44-22,Math.random()*30-26);s2.push(Math.random()*6.28);}
      const g2=new T.BufferGeometry();g2.setAttribute('position',attr(3,p2));g2.setAttribute('aSeed',attr(1,s2));
      const uni2={u_time:{value:0},u_dpr:DPR};
      const mat2=new T.ShaderMaterial({uniforms:uni2,transparent:true,depthWrite:false,blending:T.AdditiveBlending,
        vertexShader:`attribute float aSeed;uniform float u_time,u_dpr;varying float vS;
        void main(){vec3 p=position;p.y=mod(p.y+u_time*.5+22.,44.)-22.;p.x+=sin(u_time*.3+aSeed)*1.5;
          vec4 mv=modelViewMatrix*vec4(p,1.);gl_PointSize=3.5*u_dpr*(24./-mv.z);vS=aSeed;gl_Position=projectionMatrix*mv;}`,
        fragmentShader:`varying float vS;uniform float u_time;
        void main(){float d=length(gl_PointCoord-.5);float a=smoothstep(.5,.1,d)*(.35+.3*sin(u_time*1.6+vS));
          gl_FragColor=vec4(.23,.56,1.,a);}`});
      scene.add(new T.Points(g2,mat2));
      return {scene,camera,bg:new T.Color(0x050810),update(t,S){
        uni.u_time.value=t;uni.u_boost.value=S.burst;uni2.u_time.value=t;
        camera.position.set((S.mx-.5)*5,(S.my-.5)*3,30);camera.lookAt(0,0,-4);}};
    }

    /* ─────────── MISE EN PLACE — braises qui montent + fumée + lueur du foyer ─────────── */
    function mkMise(){
      const scene=new T.Scene();scene.fog=new T.Fog(0x16110e,18,60);
      const camera=cam(26,-1);
      const N=isMobile?320:750,pos=[],spd=[],seed=[],size=[];
      for(let i=0;i<N;i++){pos.push(Math.random()*52-26,Math.random()*44-22,Math.random()*26-20);
        spd.push(1.5+Math.random()*3);seed.push(Math.random()*6.28);size.push(5+Math.random()*9);}
      const geo=new T.BufferGeometry();
      geo.setAttribute('position',attr(3,pos));geo.setAttribute('aSpd',attr(1,spd));
      geo.setAttribute('aSeed',attr(1,seed));geo.setAttribute('aSize',attr(1,size));
      const uni={u_time:{value:0},u_boost:{value:0},u_dpr:DPR,u_m:{value:new T.Vector2(0,0)}};
      const mat=new T.ShaderMaterial({uniforms:uni,transparent:true,depthWrite:false,blending:T.AdditiveBlending,
        vertexShader:`attribute float aSpd,aSeed,aSize;uniform float u_time,u_boost,u_dpr;uniform vec2 u_m;varying float vLife,vSeed;
        void main(){float life=fract((position.y+22.)/44.+u_time*aSpd*(1.+u_boost)*.022+aSeed);
          vec3 p=position;p.y=-22.+life*44.;
          p.x+=sin(u_time*(.5+fract(aSeed))+aSeed*31.)*(.4+life*2.6);
          float dx=u_m.x-p.x,dy=u_m.y-p.y;
          p.x+=dx*exp(-(dx*dx+dy*dy)*.02)*.55;
          vec4 mv=modelViewMatrix*vec4(p,1.);
          gl_PointSize=aSize*(1.-life*.5)*u_dpr*(26./-mv.z);
          vLife=life;vSeed=aSeed;gl_Position=projectionMatrix*mv;}`,
        fragmentShader:`varying float vLife,vSeed;uniform float u_time;
        void main(){vec2 q=gl_PointCoord-.5;float d=length(q);
          float a=smoothstep(.5,.06,d)*(1.-vLife)*(.5+.5*sin(u_time*6.+vSeed*40.));
          vec3 col=mix(vec3(1.,.42,.10),vec3(.74,.46,.22),vLife);
          col+=(1.-vLife)*(1.-smoothstep(0.,.16,d))*vec3(1.,.8,.4)*.6;
          gl_FragColor=vec4(col,a);}`});
      scene.add(new T.Points(geo,mat));
      /* voiles de fumée (plans translucides qui montent en tournant) */
      const sTex=smokeTex(),smokes=[];
      for(let i=0;i<(isMobile?5:10);i++){
        const m=new T.Mesh(new T.PlaneGeometry(15,15),
          new T.MeshBasicMaterial({map:sTex,color:0x9a7a5f,transparent:true,opacity:.55,depthWrite:false}));
        m.userData={x:Math.random()*36-18,z:Math.random()*14-14,sp:.5+Math.random()*.8,rs:(Math.random()-.5)*.14,ph:Math.random()*30};
        scene.add(m);smokes.push(m);}
      /* lueur du foyer en contrebas */
      const glow=new T.Mesh(new T.PlaneGeometry(75,22),
        new T.MeshBasicMaterial({map:radialTex('rgba(255,120,30,.5)','rgba(255,120,30,0)'),transparent:true,depthWrite:false,blending:T.AdditiveBlending}));
      glow.position.set(0,-14,-8);glow.rotation.x=-.35;scene.add(glow);
      return {scene,camera,bg:new T.Color(0x16110e),update(t,S){
        uni.u_time.value=t;uni.u_boost.value=S.burst;
        uni.u_m.value.set((S.mx-.5)*40,(S.my-.5)*26);
        glow.material.opacity=.5+.14*Math.sin(t*2.1);
        for(const m of smokes){const u=m.userData;
          m.position.set(u.x+Math.sin(t*.1+u.ph)*2,((u.ph+t*u.sp)%30)-15,u.z);
          m.rotation.z=t*u.rs+u.ph;}
        camera.position.set((S.mx-.5)*4,-1+(S.my-.5)*2,26);camera.lookAt(0,0,-4);}};
    }

    /* ─────────── COMPILE — réseau de nœuds 3D + impulsions + grille blueprint ─────────── */
    function mkCompile(){
      const scene=new T.Scene();scene.fog=new T.Fog(0x081428,30,95);
      const camera=cam(34);
      const N=isMobile?46:80,base=[],seed=[],colA=[];
      for(let i=0;i<N;i++){base.push(new T.Vector3(Math.random()*32-16,Math.random()*18-9,Math.random()*18-9));
        seed.push(Math.random()*6.28);colA.push(Math.random()<.12?1:0);}
      /* arêtes fixées à l'init sur la distance des positions de base */
      const pairs=[];
      for(let i=0;i<N&&pairs.length<240;i++)for(let j=i+1;j<N&&pairs.length<240;j++)
        if(base[i].distanceTo(base[j])<7)pairs.push([i,j]);
      const nPos=new Float32Array(N*3);
      const nGeo=new T.BufferGeometry();nGeo.setAttribute('position',new T.BufferAttribute(nPos,3));
      nGeo.setAttribute('aSeed',attr(1,seed));nGeo.setAttribute('aCol',attr(1,colA));
      const uniN={u_time:{value:0},u_boost:{value:0},u_dpr:DPR};
      const nMat=new T.ShaderMaterial({uniforms:uniN,transparent:true,depthWrite:false,blending:T.AdditiveBlending,
        vertexShader:`attribute float aSeed,aCol;uniform float u_time,u_boost,u_dpr;varying float vC,vP;
        void main(){vec4 mv=modelViewMatrix*vec4(position,1.);
          vP=.6+.4*sin(u_time*2.2+aSeed*19.);
          gl_PointSize=(2.8+2.2*vP+u_boost*3.)*u_dpr*(42./-mv.z);
          vC=aCol;gl_Position=projectionMatrix*mv;}`,
        fragmentShader:`varying float vC,vP;
        void main(){float d=length(gl_PointCoord-.5);
          float glow=smoothstep(.5,0.,d),core=smoothstep(.16,0.,d);
          vec3 col=mix(vec3(.30,.88,.76),vec3(.96,.66,.15),vC);
          gl_FragColor=vec4(col,(glow*.45+core)*vP);}`});
      scene.add(new T.Points(nGeo,nMat));
      const ePos=new Float32Array(pairs.length*6);
      const eGeo=new T.BufferGeometry();eGeo.setAttribute('position',new T.BufferAttribute(ePos,3));
      scene.add(new T.LineSegments(eGeo,new T.LineBasicMaterial({color:0x35608f,transparent:true,opacity:.42})));
      /* impulsions qui parcourent les arêtes */
      const NP=Math.min(isMobile?24:50,pairs.length),pu=[],puCol=[];
      for(let i=0;i<NP;i++){pu.push({e:(Math.random()*pairs.length)|0,ph:Math.random(),sp:.12+Math.random()*.3});puCol.push(Math.random()<.3?1:0);}
      const pPos=new Float32Array(NP*3);
      const pGeo=new T.BufferGeometry();pGeo.setAttribute('position',new T.BufferAttribute(pPos,3));
      pGeo.setAttribute('aCol',attr(1,puCol));
      const uniP={u_dpr:DPR};
      scene.add(new T.Points(pGeo,new T.ShaderMaterial({uniforms:uniP,transparent:true,depthWrite:false,blending:T.AdditiveBlending,
        vertexShader:`attribute float aCol;uniform float u_dpr;varying float vC;
        void main(){vec4 mv=modelViewMatrix*vec4(position,1.);
          gl_PointSize=5.5*u_dpr*(42./-mv.z);vC=aCol;gl_Position=projectionMatrix*mv;}`,
        fragmentShader:`varying float vC;
        void main(){float d=length(gl_PointCoord-.5);
          vec3 col=mix(vec3(.5,.95,.85),vec3(1.,.72,.2),vC);
          gl_FragColor=vec4(col,smoothstep(.5,.05,d));}`})));
      /* grille blueprint au sol */
      const grid=new T.GridHelper(140,50,0x1c3a64,0x122943);
      grid.position.y=-13;grid.material.transparent=true;grid.material.opacity=.5;scene.add(grid);
      const v=new T.Vector3();
      return {scene,camera,bg:new T.Color(0x081428),update(t,S){
        uniN.u_time.value=t;uniN.u_boost.value=S.burst;
        const mwx=(S.mx-.5)*30,mwy=(S.my-.5)*18;
        for(let i=0;i<N;i++){const b=base[i],s=seed[i];
          v.set(b.x+Math.sin(t*.5+s)*0.9,b.y+Math.cos(t*.45+s*1.3)*0.9,b.z+Math.sin(t*.4+s*2.1)*0.9);
          const dx=mwx-v.x,dy=mwy-v.y,d2=dx*dx+dy*dy;
          v.x+=dx*2.5/(d2+16);v.y+=dy*2.5/(d2+16);
          nPos[i*3]=v.x;nPos[i*3+1]=v.y;nPos[i*3+2]=v.z;}
        for(let k=0;k<pairs.length;k++){const a=pairs[k][0]*3,b=pairs[k][1]*3;
          ePos[k*6]=nPos[a];ePos[k*6+1]=nPos[a+1];ePos[k*6+2]=nPos[a+2];
          ePos[k*6+3]=nPos[b];ePos[k*6+4]=nPos[b+1];ePos[k*6+5]=nPos[b+2];}
        for(let k=0;k<NP;k++){const q=pu[k],a=pairs[q.e][0]*3,b=pairs[q.e][1]*3,f=(t*q.sp+q.ph)%1;
          pPos[k*3]=nPos[a]+(nPos[b]-nPos[a])*f;
          pPos[k*3+1]=nPos[a+1]+(nPos[b+1]-nPos[a+1])*f;
          pPos[k*3+2]=nPos[a+2]+(nPos[b+2]-nPos[a+2])*f;}
        nGeo.attributes.position.needsUpdate=true;
        eGeo.attributes.position.needsUpdate=true;
        pGeo.attributes.position.needsUpdate=true;
        camera.position.set(Math.sin(t*.05)*4+(S.mx-.5)*6,(S.my-.5)*4,34);camera.lookAt(0,0,0);}};
    }

    /* ─────────── FLUID — blob iridescent déformé par bruit + satellites en orbite ─────────── */
    function mkFluid(){
      const scene=new T.Scene();const camera=cam(7.2);
      const FL_V=`uniform float u_time,u_burst,u_seed,u_spd;uniform vec2 u_mouse;
        varying vec3 vN,vV;varying float vD;
        void main(){vec3 n=normalize(position);
          float d=fbm3(n*2.3+vec3(u_time*u_spd)+u_seed);
          vec3 mdir=normalize(vec3((u_mouse-.5)*2.2,.8));
          float bulge=pow(max(dot(n,mdir),0.),4.)*.45;
          vec3 p=position+n*(d*(.5+u_burst*.5)+bulge);
          vD=d;vec4 mv=modelViewMatrix*vec4(p,1.);
          vN=normalMatrix*n;vV=-mv.xyz;
          gl_Position=projectionMatrix*mv;}`;
      const FL_F=`uniform float u_time;varying vec3 vN,vV;varying float vD;
        void main(){vec3 N=normalize(vN),V=normalize(vV);
          float fr=pow(1.-max(dot(N,V),0.),2.);
          float x=fr*1.35+vD*1.1+u_time*.06;
          vec3 col=vec3(.52,.36,.55)+vec3(.48,.42,.45)*cos(6.2831*(vec3(1.,.85,.7)*x+vec3(.05,.35,.62)));
          col=mix(vec3(.05,.02,.09),col,smoothstep(.02,.55,fr+vD*.25));
          col+=pow(fr,3.5)*vec3(1.,.7,1.)*.8;
          gl_FragColor=vec4(col,1.);}`;
      const mats=[];
      function fluidMat(sd,sp){const m=new T.ShaderMaterial({uniforms:{u_time:{value:0},u_burst:{value:0},u_seed:{value:sd},u_spd:{value:sp},u_mouse:{value:new T.Vector2(.5,.5)}},
        vertexShader:NZ+FL_V,fragmentShader:FL_F});mats.push(m);return m;}
      const blob=new T.Mesh(new T.IcosahedronGeometry(2.15,isMobile?4:5),fluidMat(0,.25));
      scene.add(blob);
      const sats=[];
      for(let i=0;i<3;i++){const s=new T.Mesh(new T.IcosahedronGeometry(2.15,4),fluidMat(3+i*7,.4));
        s.scale.setScalar(.22+i*.07);s.userData={r:3.3+i*.55,ph:i*2.1,inc:.5+i*.4,sp:.28-i*.05};
        scene.add(s);sats.push(s);}
      const halo=new T.Sprite(new T.SpriteMaterial({map:radialTex('rgba(190,80,200,.5)','rgba(50,15,80,0)'),
        transparent:true,depthWrite:false,blending:T.AdditiveBlending,opacity:.4}));
      halo.scale.set(13,13,1);halo.position.z=-3;scene.add(halo);
      /* poussière violette */
      const PD=isMobile?60:130,pd=[],sd2=[];
      for(let i=0;i<PD;i++){pd.push(Math.random()*22-11,Math.random()*14-7,Math.random()*10-7);sd2.push(Math.random()*6.28);}
      const dGeo=new T.BufferGeometry();dGeo.setAttribute('position',attr(3,pd));dGeo.setAttribute('aSeed',attr(1,sd2));
      const uniD={u_time:{value:0},u_dpr:DPR};
      scene.add(new T.Points(dGeo,new T.ShaderMaterial({uniforms:uniD,transparent:true,depthWrite:false,blending:T.AdditiveBlending,
        vertexShader:`attribute float aSeed;uniform float u_time,u_dpr;varying float vS;
        void main(){vec3 p=position;p.y+=sin(u_time*.25+aSeed*3.)*1.2;p.x+=cos(u_time*.2+aSeed*5.)*1.2;
          vec4 mv=modelViewMatrix*vec4(p,1.);gl_PointSize=2.6*u_dpr*(9./-mv.z);vS=aSeed;gl_Position=projectionMatrix*mv;}`,
        fragmentShader:`varying float vS;uniform float u_time;
        void main(){float d=length(gl_PointCoord-.5);
          gl_FragColor=vec4(.72,.61,1.,smoothstep(.5,.1,d)*(.3+.25*sin(u_time*2.+vS*9.)));}`})));
      return {scene,camera,bg:new T.Color(0x0B0616),update(t,S){
        for(const m of mats){m.uniforms.u_time.value=t;m.uniforms.u_burst.value=S.burst;m.uniforms.u_mouse.value.set(S.mx,S.my);}
        uniD.u_time.value=t;
        blob.rotation.set(t*.07,t*.12,0);
        for(const s of sats){const u=s.userData,a=t*u.sp+u.ph;
          s.position.set(Math.cos(a)*u.r,Math.sin(a)*Math.sin(u.inc)*u.r*.6,Math.sin(a)*Math.cos(u.inc)*u.r*.4);
          s.rotation.y=t*.5;}
        camera.position.set((S.mx-.5)*1.6,(S.my-.5)*1.2,7.2);camera.lookAt(0,0,0);}};
    }

    /* ─────────── ATELIER — terrain topographique : courbes d'encre sur papier ─────────── */
    function mkAtelier(){
      const scene=new T.Scene();const camera=cam(17,9.5);
      const geo=new T.PlaneGeometry(90,60,isMobile?110:190,isMobile?70:125);
      geo.rotateX(-Math.PI/2);
      const uni={u_time:{value:0},u_burst:{value:0},u_m:{value:new T.Vector2(0,-6)}};
      const mat=new T.ShaderMaterial({uniforms:uni,extensions:{derivatives:true},
        vertexShader:NZ+`uniform float u_time,u_burst;uniform vec2 u_m;
        varying float vH,vD;varying vec2 vXZ;
        void main(){vec3 p=position;
          float h=fbm2(p.xz*.055+vec2(u_time*.018,u_time*.011))*7.;
          float md=length(p.xz-u_m);
          h+=exp(-md*md*.012)*(1.2+u_burst*2.2);
          p.y+=h;vH=h;vXZ=p.xz;
          vec4 mv=modelViewMatrix*vec4(p,1.);vD=-mv.z;
          gl_Position=projectionMatrix*mv;}`,
        fragmentShader:NZ+`uniform float u_time,u_burst;uniform vec2 u_m;
        varying float vH,vD;varying vec2 vXZ;
        void main(){vec3 paper=vec3(.953,.945,.918);
          vec3 col=paper-fbm2(vXZ*6.5)*.045;
          float f=vH*1.5;
          float d=abs(fract(f)-.5)/max(fwidth(f),1e-4);
          col=mix(col,vec3(.13,.15,.22),(1.-smoothstep(.7,1.6,d))*.72);
          float f2=vH*6.;
          float d2=abs(fract(f2)-.5)/max(fwidth(f2),1e-4);
          col=mix(col,vec3(.36,.34,.30),(1.-smoothstep(.5,1.2,d2))*.15);
          float md=length(vXZ-u_m);
          col=mix(col,vec3(.72,.2,.13),exp(-md*md*.02)*(.13+u_burst*.4));
          col=mix(col,paper,smoothstep(26.,58.,vD));
          gl_FragColor=vec4(col,1.);}`});
      const terr=new T.Mesh(geo,mat);terr.position.y=-2;scene.add(terr);
      /* grains d'encre en suspension */
      const PD=isMobile?30:60,pd=[],sd=[];
      for(let i=0;i<PD;i++){pd.push(Math.random()*44-22,Math.random()*10-1,Math.random()*30-26);sd.push(Math.random()*6.28);}
      const dGeo=new T.BufferGeometry();dGeo.setAttribute('position',attr(3,pd));dGeo.setAttribute('aSeed',attr(1,sd));
      const uniD={u_time:{value:0},u_dpr:DPR};
      scene.add(new T.Points(dGeo,new T.ShaderMaterial({uniforms:uniD,transparent:true,depthWrite:false,
        vertexShader:`attribute float aSeed;uniform float u_time,u_dpr;varying float vS;
        void main(){vec3 p=position;p.y+=sin(u_time*.2+aSeed*4.)*.8;p.x+=cos(u_time*.16+aSeed*6.)*1.1;
          vec4 mv=modelViewMatrix*vec4(p,1.);gl_PointSize=2.2*u_dpr*(20./-mv.z);vS=aSeed;gl_Position=projectionMatrix*mv;}`,
        fragmentShader:`varying float vS;uniform float u_time;
        void main(){float d=length(gl_PointCoord-.5);
          gl_FragColor=vec4(.08,.09,.14,smoothstep(.5,.15,d)*(.16+.12*sin(u_time+vS*7.)));}`})));
      return {scene,camera,bg:new T.Color(0xF3F1EA),update(t,S){
        uni.u_time.value=t;uni.u_burst.value=S.burst;
        uni.u_m.value.set((S.mx-.5)*50,-6-(S.my-.5)*30);
        uniD.u_time.value=t;
        camera.position.set((S.mx-.5)*2.5,9.5+(S.my-.5)*1.2,17);camera.lookAt(0,0,-6);}};
    }

    const MK={'terminal':mkTerminal,'mise-en-place':mkMise,'compile':mkCompile,'fluid':mkFluid,'atelier':mkAtelier};
    function get(da){if(da in built)return built[da];const m=MK[da];
      try{built[da]=m?m():null;}catch(e){console.warn('[DA3D]',da,e);built[da]=null;}
      return built[da];}
    function render(now,S){const sc=get(S.da);if(!sc)return false;
      sc.update((now-t0)*.001,S);rd.setClearColor(sc.bg,1);rd.render(sc.scene,sc.camera);return true;}
    function resize(w,h,dpr){DPR.value=dpr;rd.setPixelRatio(dpr);rd.setSize(w,h,true);
      ASP=w/Math.max(1,h);
      for(const k in built){const sc=built[k];if(sc){sc.camera.aspect=ASP;sc.camera.updateProjectionMatrix();}}}
    resize(innerWidth,innerHeight,DPR.value);
    return {render,resize};
  }
  return {init};
})();
