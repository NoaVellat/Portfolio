/* ══════════ MOTEUR DE FONDS v5 — traînées distinctes + ambiance claire "Atelier" ══════════ */
(function(){
  const glCanvas=document.getElementById('da-bg');
  const c2d=document.getElementById('da-2d');
  const veil=document.getElementById('da-veil');
  const blurEl=document.getElementById('da-blur');
  const curEl=document.getElementById('da-cursor');
  const dotEl=document.getElementById('da-cursor-dot');
  const root=document.documentElement;
  const reduce=window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  const isMobile=window.matchMedia('(max-width:820px)').matches;
  const DAS=['terminal','mise-en-place','compile','fluid','atelier'];
  const NAMES={'terminal':'Terminal','mise-en-place':'Mise en Place','compile':'Compile','fluid':'Fluid','atelier':'Atelier'};
  const GLDA={'mise-en-place':1,'compile':1,'fluid':1,'atelier':1};
  const MODE={'mise-en-place':0.0,'compile':1.0,'fluid':2.0,'atelier':4.0};
  const LIGHT={'atelier':1};

  /* ---------- GLSL ---------- */
  const VERT='attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
  const NP='float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}'
    +'float noise(vec2 p){vec2 i=floor(p),f=fract(p);float a=hash(i),b=hash(i+vec2(1,0)),c=hash(i+vec2(0,1)),d=hash(i+vec2(1,1));vec2 u=f*f*(3.-2.*f);return mix(a,b,u.x)+(c-a)*u.y*(1.-u.x)+(d-b)*u.x*u.y;}'
    +'float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<6;i++){v+=a*noise(p);p=p*2.03+1.7;a*=.5;}return v;}';
  const HEAD='precision highp float;'
    +'uniform vec2 u_res;uniform float u_time;uniform vec2 u_mouse;uniform vec3 u_ripple;uniform sampler2D u_ink;'
    +NP
    +'float rip(vec2 nuv){float ph=u_ripple.z;if(ph<=0.001)return 0.;vec2 q=nuv-u_ripple.xy;q.x*=u_res.x/u_res.y;float d=length(q);float r=ph*1.4;return smoothstep(.05,0.,abs(d-r))*(1.-ph);}';

  /* Encre — comportement PAR DA via u_mode :
     0 Mise = monte (buoyancy forte) + très turbulent → fumée qui billboe
     1 Compile = quasi pas d'advection, décroît très vite → base d'étincelles courtes
     2 Fluid = diffuse (blur) + swirl → nappe liquide
     4 Atelier = diffuse beaucoup + décroît lentement → encre qui imbibe le papier */
  const INK='precision highp float;uniform sampler2D u_prev;uniform vec2 u_res;uniform vec2 u_mouse;uniform vec2 u_mvel;uniform float u_time;uniform float u_burst;uniform float u_mode;'
    +NP
    +'vec2 curl(vec2 p){float e=.08;float a=fbm(p+vec2(0.,e));float b=fbm(p-vec2(0.,e));float c=fbm(p+vec2(e,0.));float d=fbm(p-vec2(e,0.));return vec2(a-b,d-c)/(2.*e);}'
    +'void main(){vec2 uv=gl_FragCoord.xy/u_res;vec2 px=1.0/u_res;'
    +'float turb=(u_mode<0.5)?2.6:1.0;'
    +'vec2 flow=curl(uv*3.0+u_time*0.06)*0.0019*turb;'
    +'float up=(u_mode<0.5)?0.0062:0.0008;flow.y+=up;'
    +'float decay=(u_mode<0.5)?0.988:((u_mode<1.5)?0.895:((u_mode>3.5)?0.955:0.972));'
    +'vec3 prev=texture2D(u_prev,uv-flow).rgb;'
    +'if(u_mode>1.5){float s=(u_mode>3.5)?1.7:1.0;vec2 e=px*s;prev=(prev*2.0+texture2D(u_prev,uv-flow+vec2(e.x,0.)).rgb+texture2D(u_prev,uv-flow-vec2(e.x,0.)).rgb+texture2D(u_prev,uv-flow+vec2(0.,e.y)).rgb+texture2D(u_prev,uv-flow-vec2(0.,e.y)).rgb)/6.0;}'
    +'prev*=decay;'
    +'vec2 d=(uv-u_mouse);d.x*=u_res.x/u_res.y;float dist=length(d);'
    +'float spd=clamp(length(u_mvel)*30.,0.,2.0);'
    +'float rad=(u_mode<0.5)?0.05:((u_mode<1.5)?0.024:((u_mode>3.5)?0.05:0.062));'
    +'float splat=smoothstep(rad,0.0,dist)*(0.20+spd*0.95);'
    +'splat+=smoothstep(rad*2.8,0.0,dist)*u_burst;'
    +'vec3 col=prev+vec3(splat);gl_FragColor=vec4(min(col,1.7),1.0);}';

  /* Fluid — metaballs iridescents + traînée liquide qui coule */
  const F_FLUID=HEAD+`
  void main(){vec2 R=u_res;float asp=R.x/R.y;
    vec2 nuv=gl_FragCoord.xy/R;
    vec2 uv=(gl_FragCoord.xy-.5*R)/R.y;
    vec2 mo=(u_mouse-.5)*vec2(asp,1.0);
    float t=u_time*.32;
    vec2 warp=vec2(fbm(uv*1.4+t*.3),fbm(uv*1.4-t*.24+7.))-.5;
    vec2 quv=uv+warp*.38;
    float field=0.;
    for(int i=0;i<7;i++){float fi=float(i);
      vec2 c=vec2(sin(t*.6+fi*1.7)*.6*asp*.55,cos(t*.55+fi*2.3)*.46);
      c+=.14*vec2(sin(t*1.2+fi*3.1),cos(t*1.0+fi));
      float r=.17+.05*sin(t*.8+fi*2.);
      field+=r*r/(dot(quv-c,quv-c)+.002);}
    field+=.10/(dot(quv-mo,quv-mo)+.006);
    float f=field;
    vec3 a=vec3(.5,.32,.55),b=vec3(.5,.45,.5),cc=vec3(1.,.85,.75),d=vec3(0.,.2,.5);
    vec3 col=a+b*cos(6.2831*(cc*(f*.16+t*.06+length(warp)*.3)+d));
    float edge=smoothstep(.75,1.9,f);
    col=mix(vec3(.03,.015,.07),col,edge);
    col+=pow(edge,3.)*.4*vec3(1.,.7,1.);
    col+=smoothstep(1.8,4.,f)*vec3(.4,.95,.9)*.22;
    float ink=texture2D(u_ink,nuv).r;
    vec3 itint=.5+.5*cos(6.2831*(vec3(0.,.33,.66)+ink*1.4+t*.4));
    col+=ink*itint*1.35+ink*ink*vec3(1.,.92,1.)*.45;
    col+=rip(nuv)*vec3(1.,.8,1.);
    col*=1.0-.32*length(uv);
    gl_FragColor=vec4(max(col,0.),1.0);}`;

  /* Mise en Place — braises + traînée FUMÉE : échantillon déplacé par bruit → volutes qui montent */
  const F_MISE=HEAD+`
  void main(){vec2 R=u_res;vec2 nuv=gl_FragCoord.xy/R;
    vec2 uv=nuv;vec2 p=vec2(uv.x*(R.x/R.y),uv.y);
    vec2 mo=vec2(u_mouse.x*(R.x/R.y),u_mouse.y);
    float t=u_time*.18;
    vec2 q=vec2(p.x*2.0,p.y*2.2-t*1.3);
    float w=fbm(q*.6+vec2(0.,t));
    float haze=fbm(q+vec2(w*.8,-w*.5));
    float heat=fbm(vec2(p.x*3.2,p.y*4.6-t*2.4));
    float base=1.0-uv.y;
    float ember=smoothstep(0.,.95,base)*(.45+.55*haze);
    ember+=pow(base,3.0)*.7*(.55+.55*sin(t*4.0+uv.x*7.0+heat*4.0));
    float md=length((p-mo)*vec2(1.,.6));
    ember+=.5*exp(-md*4.0)*(.6+.4*sin(t*8.+md*10.));
    vec3 col=vec3(.09,.065,.05);
    col=mix(col,vec3(.72,.45,.20),clamp(ember*.7,0.,1.));
    col=mix(col,vec3(1.,.35,.10),clamp(pow(ember,2.0)*.95,0.,1.));
    vec2 sp=vec2(p.x*8.,p.y*8.-t*6.);
    float sc=hash(floor(sp));
    float spark=step(.992,sc)*smoothstep(.4,1.,fract(sc*7.+t))*base;
    col+=spark*vec3(1.,.65,.25)*(.6+.4*sin(t*20.+sc*30.));
    vec2 disp=vec2(fbm(nuv*5.0+u_time*.3)-.5,fbm(nuv*5.0-u_time*.25+3.)-.5)*0.022;
    float ink=texture2D(u_ink,nuv+disp).r;
    vec3 hot=vec3(1.,.5,.12),smoke=vec3(.55,.46,.42);
    col+=ink*mix(smoke,hot,clamp(ink*1.6,0.,1.))*1.2+ink*ink*vec3(1.,.8,.35)*.45;
    col+=haze*.04*vec3(.9,.6,.4);
    col+=rip(nuv)*vec3(1.,.5,.2);
    col*=1.0-.24*pow(length(uv-vec2(.5)),2.0);
    gl_FragColor=vec4(max(col,0.),1.0);}`;

  /* Compile — constellation + traînée GLITCH : encre quantifiée en blocs qui clignotent */
  const F_COMPILE=HEAD+`
  void main(){vec2 R=u_res;float asp=R.x/R.y;
    vec2 nuv=gl_FragCoord.xy/R;
    vec2 uv=(gl_FragCoord.xy-.5*R)/R.y;
    vec2 mo=(u_mouse-.5)*vec2(asp,1.0);
    float t=u_time*.14;vec3 col=vec3(.02,.06,.13);
    vec2 gp=(uv+mo*.06)*8.0;
    vec2 g=abs(fract(gp)-.5);
    col+=smoothstep(.48,.5,max(g.x,g.y))*.03*vec3(.3,.6,1.);
    vec2 g2=abs(fract(gp*.25)-.5);
    col+=smoothstep(.49,.5,max(g2.x,g2.y))*.05*vec3(.35,.65,1.);
    const int N=10;vec2 pts[10];
    for(int i=0;i<N;i++){float fi=float(i);
      vec2 pp=vec2(sin(t+fi*2.1)*.98*asp*.62,cos(t*.8+fi*1.7)*.56);
      vec2 dif=pp-mo;float dl=length(dif)+1e-4;
      pp+=(dif/dl)*(.10/(dl*dl+.35));
      pts[i]=pp;}
    for(int i=0;i<N;i++){for(int j=0;j<N;j++){if(j<=i)continue;
      vec2 A=pts[i],B=pts[j];float dd=length(B-A);
      if(dd<0.82){vec2 pa=uv-A,ba=B-A;float h=clamp(dot(pa,ba)/dot(ba,ba),0.,1.);
        float dist=length(pa-ba*h);float str=(1.-dd/0.82);
        col+=smoothstep(.005,0.,dist)*str*vec3(.28,.55,.9)*.6;
        float pk=fract(t*2.0+float(i)*.31+float(j)*.13);
        float dp=length(uv-mix(A,B,pk));
        col+=smoothstep(.018,0.,dp)*str*vec3(.5,.95,.85)*.9;}}}
    for(int i=0;i<N;i++){float d=length(uv-pts[i]);
      float pulse=.6+.4*sin(t*6.+float(i));
      col+=(.005*pulse/(d+.004))*vec3(.35,.92,.82);}
    col+=(.006/(length(uv-mo)+.005))*vec3(1.,.66,.15);
    vec2 gsz=vec2(30.0,17.0);
    vec2 gc=(floor(nuv*gsz)+0.5)/gsz;
    float raw=texture2D(u_ink,gc).r;
    float fl=step(0.4,fract(sin(dot(floor(nuv*gsz),vec2(12.9,78.2)))*43758.5453+u_time*3.5));
    float ink=step(0.10,raw)*raw*(0.35+0.65*fl);
    col+=ink*vec3(.35,.85,1.)*1.45+ink*ink*vec3(.75,1.,1.)*.6;
    col+=rip(nuv)*vec3(.4,.9,1.);
    col*=1.0-.28*length(uv);
    gl_FragColor=vec4(max(col,0.),1.0);}`;

  /* Atelier — thème CLAIR : papier + lignes topographiques encre + traînée = encre qui imbibe */
  const F_ATELIER=HEAD+`
  void main(){vec2 R=u_res;vec2 nuv=gl_FragCoord.xy/R;
    vec2 uv=(gl_FragCoord.xy-.5*R)/R.y;
    vec2 mo=(u_mouse-.5)*vec2(R.x/R.y,1.0);
    float t=u_time*.05;
    vec3 paper=vec3(.945,.915,.855);
    float grain=fbm(nuv*220.0)*0.035;
    vec3 col=paper-grain;
    float field=fbm(uv*1.6+vec2(t,t*.7)+mo*0.12);
    float c=fract(field*7.0);
    float line=smoothstep(0.0,0.07,c)*smoothstep(0.14,0.07,c);
    col-=line*0.11*vec3(.45,.5,.62);
    float field2=fbm(uv*3.4-vec2(t*.6,t)+mo*0.05);
    float c2=fract(field2*11.0);
    col-=(smoothstep(0.0,0.05,c2)*smoothstep(0.1,0.05,c2))*0.04*vec3(.5,.4,.35);
    col+=0.06*exp(-length(uv-mo)*2.4)*vec3(.95,.85,.65);
    float ink=texture2D(u_ink,nuv).r;
    vec3 inkc=vec3(.12,.14,.22);
    col=mix(col,inkc,clamp(ink*0.65,0.,0.5));
    col-=rip(nuv)*vec3(.22,.24,.30);
    col*=1.0-.12*length(uv);
    gl_FragColor=vec4(clamp(col,0.,1.),1.0);}`;

  /* Composite — CA + bloom(désactivable) + grain + vignette */
  const COMP='precision highp float;uniform sampler2D u_scene;uniform vec2 u_res;uniform float u_time;uniform float u_bloom;'
    +'float h21(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}'
    +'void main(){vec2 uv=gl_FragCoord.xy/u_res;vec2 dir=uv-0.5;'
    +'float ca=0.006*dot(dir,dir);'
    +'vec3 col;col.r=texture2D(u_scene,uv+dir*ca).r;col.g=texture2D(u_scene,uv).g;col.b=texture2D(u_scene,uv-dir*ca).b;'
    +'if(u_bloom>0.5){vec3 bl=vec3(0.);for(int i=0;i<16;i++){float a=float(i)*0.3926991;vec2 o=vec2(cos(a),sin(a));'
    +'bl+=max(texture2D(u_scene,uv+o*0.010).rgb-0.32,0.0);bl+=max(texture2D(u_scene,uv+o*0.023).rgb-0.38,0.0)*0.55;}'
    +'bl/=16.0;col+=bl*0.95;}'
    +'col+=(h21(uv*u_res+fract(u_time))-0.5)*(u_bloom>0.5?0.035:0.02);'
    +'col*=1.0-0.42*dot(dir,dir)*(u_bloom>0.5?1.0:0.4);'
    +'gl_FragColor=vec4(col,1.0);}';

  const FRAG={'fluid':F_FLUID,'mise-en-place':F_MISE,'compile':F_COMPILE,'atelier':F_ATELIER};

  /* ---------- Init WebGL ---------- */
  function sh(gl,type,src){const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);
    if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)){console.warn('[DA] shader',gl.getShaderInfoLog(s));return null;}return s;}
  function makeGL(){
    let gl=null;
    try{gl=glCanvas.getContext('webgl',{antialias:false,alpha:false,powerPreference:'high-performance'})||glCanvas.getContext('experimental-webgl');}catch(e){}
    if(!gl)return null;
    const vs=sh(gl,gl.VERTEX_SHADER,VERT);if(!vs)return null;
    const quad=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,quad);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
    function prog(src,names){const fs=sh(gl,gl.FRAGMENT_SHADER,src);if(!fs)return null;
      const pr=gl.createProgram();gl.attachShader(pr,vs);gl.attachShader(pr,fs);gl.linkProgram(pr);
      if(!gl.getProgramParameter(pr,gl.LINK_STATUS)){console.warn('[DA] link',gl.getProgramInfoLog(pr));return null;}
      const u={};for(let n of names)u[n]=gl.getUniformLocation(pr,n);
      return {pr,loc:gl.getAttribLocation(pr,'p'),u};}
    const daU=['u_res','u_time','u_mouse','u_ripple','u_ink'];
    const daP={};for(const k in FRAG){const P=prog(FRAG[k],daU);if(!P)return null;daP[k]=P;}
    const inkP=prog(INK,['u_prev','u_res','u_mouse','u_mvel','u_time','u_burst','u_mode']);if(!inkP)return null;
    const compP=prog(COMP,['u_scene','u_res','u_time','u_bloom']);if(!compP)return null;
    return {gl,quad,daP,inkP,compP};
  }
  /* Trois.js d'abord : scènes 3D par DA (scenes3d.js). Sinon, shaders 2D historiques. */
  const T3=(window.DA3D&&window.DA3D.init)?window.DA3D.init(glCanvas,isMobile):null;
  const R=T3?null:makeGL();
  if(T3)GLDA.terminal=1;   /* en 3D, même Terminal a sa scène (pluie de glyphes en profondeur) */
  const POST=!!R&&!isMobile;

  /* ---------- État partagé ---------- */
  let cur=root.getAttribute('data-da');if(DAS.indexOf(cur)<0)cur='terminal';
  let mode=GLDA[cur]?'gl':'2d';
  let mx=.5,my=.5,tmx=.5,tmy=.5,pmx=.5,pmy=.5,lastMove=0;
  let rx=.5,ry=.5,ripStart=-1,burst=0;
  let cx=innerWidth/2,cy=innerHeight/2,cmx=cx,cmy=cy;
  const t0=performance.now();let running=false,rafId=0,mlast=0;
  let GW=1,GH=1;

  /* ---------- FBO ---------- */
  let inkA,inkB,inkSrc,inkDst,scene;
  function makeFBO(w,h){const gl=R.gl;const t=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,t);
    gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,w,h,0,gl.RGBA,gl.UNSIGNED_BYTE,null);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
    const f=gl.createFramebuffer();gl.bindFramebuffer(gl.FRAMEBUFFER,f);
    gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,t,0);
    return {t,f,w,h};}
  function allocFBOs(){const gl=R.gl;
    [inkA,inkB,scene].forEach(o=>{if(o){gl.deleteTexture(o.t);gl.deleteFramebuffer(o.f);}});
    scene=makeFBO(GW,GH);
    const iw=Math.max(4,Math.round(GW/2)),ih=Math.max(4,Math.round(GH/2));
    inkA=makeFBO(iw,ih);inkB=makeFBO(iw,ih);
    [inkA,inkB].forEach(o=>{gl.bindFramebuffer(gl.FRAMEBUFFER,o.f);gl.clearColor(0,0,0,1);gl.clear(gl.COLOR_BUFFER_BIT);});
    gl.bindFramebuffer(gl.FRAMEBUFFER,null);inkSrc=inkA;inkDst=inkB;}

  /* ---------- Canvas2D : la pluie matrix d'origine ---------- */
  const ctx=c2d.getContext('2d');
  const CH='01アイウエオカキクケコサシスセソ'.split('');
  const M={cols:[],pts:[]};
  for(let i=0;i<55;i++)M.pts.push({x:Math.random(),y:Math.random(),r:Math.random()*1.6+.4,vx:(Math.random()-.5)*.0003,vy:-(Math.random()*.0004+.0001),a:Math.random()*.4+.1,ph:Math.random()*Math.PI*2});
  function size2d(){const dpr=Math.min(window.devicePixelRatio||1,isMobile?1:1.5);
    c2d.width=Math.round(innerWidth*dpr);c2d.height=Math.round(innerHeight*dpr);
    c2d.style.width=innerWidth+'px';c2d.style.height=innerHeight+'px';ctx.setTransform(dpr,0,0,dpr,0,0);
    const n=Math.floor(innerWidth/22);M.cols=[];
    for(let i=0;i<n;i++)M.cols.push({x:i*22,y:Math.random()*innerHeight,spd:Math.random()*55+25,a:Math.random()*.32+.04});}
  function drawMatrix(now){const dt=Math.min(now-mlast,40);mlast=now;const tt=now*.001;const w=innerWidth,h=innerHeight;
    ctx.fillStyle='rgba(5,8,16,.07)';ctx.fillRect(0,0,w,h);ctx.font='13px JetBrains Mono,monospace';ctx.textAlign='left';
    for(let k=0;k<M.cols.length;k++){const col=M.cols[k];col.y+=col.spd*dt*.001;if(col.y>h){col.y=-(Math.random()*80);col.spd=Math.random()*55+25;}
      ctx.fillStyle='rgba(0,255,136,'+col.a+')';ctx.fillText(CH[(Math.random()*CH.length)|0],col.x,col.y);
      for(let j=1;j<4;j++){ctx.fillStyle='rgba(0,255,136,'+(col.a*(1-j/4)*.22)+')';ctx.fillText(CH[(Math.random()*CH.length)|0],col.x,col.y-j*18);}}
    for(let k=0;k<M.pts.length;k++){const pt=M.pts[k];pt.x+=pt.vx*dt+(mx-.5)*.00003;pt.y+=pt.vy*dt+((1.-my)-.5)*.00002;
      if(pt.y<-.04)pt.y=1.04;if(pt.x<-.04||pt.x>1.04)pt.vx*=-1;
      const f=Math.sin(tt*1.6+pt.ph)*.22+.78;ctx.beginPath();ctx.arc(pt.x*w,pt.y*h,pt.r,0,Math.PI*2);
      ctx.fillStyle='rgba(59,142,255,'+(pt.a*f)+')';ctx.fill();}}

  /* ---------- WebGL sizing & rendu ---------- */
  function sizeGL(){const dpr=Math.min(window.devicePixelRatio||1,isMobile?1.0:1.6);
    GW=Math.max(1,Math.round(innerWidth*dpr));GH=Math.max(1,Math.round(innerHeight*dpr));
    if(T3){T3.resize(innerWidth,innerHeight,dpr);return;}
    glCanvas.width=GW;glCanvas.height=GH;glCanvas.style.width=innerWidth+'px';glCanvas.style.height=innerHeight+'px';
    if(R)allocFBOs();}
  function bindQuad(P){const gl=R.gl;gl.bindBuffer(gl.ARRAY_BUFFER,R.quad);gl.enableVertexAttribArray(P.loc);gl.vertexAttribPointer(P.loc,2,gl.FLOAT,false,0,0);}
  function renderGL(now){
    let ph=0;if(ripStart>0){ph=(now-ripStart)/1400;if(ph>=1){ph=0;ripStart=-1;}}
    if(T3){T3.render(now,{da:cur,mx,my,rx,ry,ph,burst});pmx=mx;pmy=my;burst*=0.90;return;}
    if(!R)return;const gl=R.gl;const P=R.daP[cur];if(!P)return;
    const time=(now-t0)*0.001;
    if(POST){
      const mvx=mx-pmx,mvy=my-pmy;
      gl.bindFramebuffer(gl.FRAMEBUFFER,inkDst.f);gl.viewport(0,0,inkDst.w,inkDst.h);
      gl.useProgram(R.inkP.pr);bindQuad(R.inkP);
      gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,inkSrc.t);gl.uniform1i(R.inkP.u.u_prev,0);
      gl.uniform2f(R.inkP.u.u_res,inkDst.w,inkDst.h);gl.uniform2f(R.inkP.u.u_mouse,mx,my);
      gl.uniform2f(R.inkP.u.u_mvel,mvx,mvy);gl.uniform1f(R.inkP.u.u_time,time);gl.uniform1f(R.inkP.u.u_burst,burst);
      gl.uniform1f(R.inkP.u.u_mode,MODE[cur]!==undefined?MODE[cur]:2.0);
      gl.drawArrays(gl.TRIANGLES,0,3);const tmp=inkSrc;inkSrc=inkDst;inkDst=tmp;
      gl.bindFramebuffer(gl.FRAMEBUFFER,scene.f);gl.viewport(0,0,scene.w,scene.h);
      gl.useProgram(P.pr);bindQuad(P);
      gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,inkSrc.t);gl.uniform1i(P.u.u_ink,0);
      gl.uniform2f(P.u.u_res,scene.w,scene.h);gl.uniform1f(P.u.u_time,time);
      gl.uniform2f(P.u.u_mouse,mx,my);gl.uniform3f(P.u.u_ripple,rx,ry,ph);
      gl.drawArrays(gl.TRIANGLES,0,3);
      gl.bindFramebuffer(gl.FRAMEBUFFER,null);gl.viewport(0,0,GW,GH);
      gl.useProgram(R.compP.pr);bindQuad(R.compP);
      gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,scene.t);gl.uniform1i(R.compP.u.u_scene,0);
      gl.uniform2f(R.compP.u.u_res,GW,GH);gl.uniform1f(R.compP.u.u_time,time);
      gl.uniform1f(R.compP.u.u_bloom,LIGHT[cur]?0.0:1.0);
      gl.drawArrays(gl.TRIANGLES,0,3);
    }else{
      gl.bindFramebuffer(gl.FRAMEBUFFER,null);gl.viewport(0,0,GW,GH);
      gl.useProgram(P.pr);bindQuad(P);
      gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,(inkSrc||{t:null}).t);gl.uniform1i(P.u.u_ink,0);
      gl.uniform2f(P.u.u_res,GW,GH);gl.uniform1f(P.u.u_time,time);
      gl.uniform2f(P.u.u_mouse,mx,my);gl.uniform3f(P.u.u_ripple,rx,ry,ph);
      gl.drawArrays(gl.TRIANGLES,0,3);
    }
    pmx=mx;pmy=my;burst*=0.90;
  }

  /* ---------- Boucle maîtresse ---------- */
  function frame(now){
    if(!running)return;rafId=requestAnimationFrame(frame);
    if(now-lastMove>2600){const a=(now-t0)*0.00025;tmx=.5+Math.cos(a)*.28;tmy=.5+Math.sin(a*.8)*.22;}
    mx+=(tmx-mx)*.08;my+=(tmy-my)*.08;
    if(curEl){cx+=(cmx-cx)*0.35;cy+=(cmy-cy)*0.35;curEl.style.transform='translate('+cmx+'px,'+cmy+'px)';dotEl.style.transform='translate('+cx+'px,'+cy+'px)';}
    if(mode==='gl')renderGL(now);else drawMatrix(now);
  }
  function start(){if(reduce){renderOnce();return;}if(running)return;running=true;mlast=performance.now();rafId=requestAnimationFrame(frame);}
  function stop(){running=false;cancelAnimationFrame(rafId);}
  function renderOnce(){if(mode==='gl'){renderGL(performance.now());}else{mlast=performance.now();ctx.fillStyle='#050810';ctx.fillRect(0,0,innerWidth,innerHeight);drawMatrix(performance.now());}}

  /* ---------- Interactions & pause ---------- */
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();else if(!reduce)start();});
  window.addEventListener('mousemove',e=>{tmx=e.clientX/innerWidth;tmy=1-e.clientY/innerHeight;lastMove=performance.now();
    cmx=e.clientX;cmy=e.clientY;if(curEl&&!curEl.classList.contains('ready')){curEl.classList.add('ready');dotEl.classList.add('ready');}},{passive:true});
  window.addEventListener('touchmove',e=>{if(e.touches[0]){tmx=e.touches[0].clientX/innerWidth;tmy=1-e.touches[0].clientY/innerHeight;lastMove=performance.now();}},{passive:true});
  window.addEventListener('pointerdown',e=>{rx=e.clientX/innerWidth;ry=1-e.clientY/innerHeight;ripStart=performance.now();burst=1.0;
    if(curEl)curEl.classList.add('dn');if(reduce&&mode==='gl')renderOnce();},{passive:true});
  window.addEventListener('pointerup',()=>{if(curEl)curEl.classList.remove('dn');},{passive:true});
  document.addEventListener('mouseover',e=>{if(curEl&&e.target.closest('a,button,.da-opt,input,textarea'))curEl.classList.add('hoverable');},{passive:true});
  document.addEventListener('mouseout',e=>{if(curEl&&e.target.closest('a,button,.da-opt,input,textarea'))curEl.classList.remove('hoverable');},{passive:true});
  let rz;window.addEventListener('resize',()=>{clearTimeout(rz);rz=setTimeout(()=>{sizeGL();size2d();if(reduce)renderOnce();},150);});
  glCanvas.addEventListener('webglcontextlost',e=>{e.preventDefault();stop();},false);

  /* ---------- Bascule de DA (balayage cinématique) ---------- */
  function paintUI(name){const cu=document.getElementById('daCurrent');if(cu)cu.textContent=NAMES[name];
    document.querySelectorAll('.da-opt').forEach(o=>o.setAttribute('aria-checked',o.dataset.da===name?'true':'false'));}
  let switching=false;
  function setDA(name){
    if(DAS.indexOf(name)<0||name===cur||switching)return;switching=true;
    if(!reduce){veil.classList.remove('sweep');blurEl.classList.remove('go');void veil.offsetWidth;veil.classList.add('sweep');blurEl.classList.add('go');}
    (mode==='gl'?glCanvas:c2d).classList.add('hide');
    const midi=reduce?90:430,endi=reduce?300:1340;
    setTimeout(()=>{
      root.classList.add('da-instant');
      cur=name;root.setAttribute('data-da',cur);paintUI(cur);if(window.NOA)window.NOA.renderAtSwitch(cur);
      try{localStorage.setItem('noa-da',cur);}catch(e){}
      mode=GLDA[cur]?'gl':'2d';
      if(mode==='gl'){c2d.classList.add('hide');glCanvas.classList.remove('hide');glCanvas.classList.toggle('fallback',!(R||T3));}
      else{glCanvas.classList.add('hide');c2d.classList.remove('hide');}
      void document.body.offsetWidth;                       /* snap aux nouveaux tokens */
      requestAnimationFrame(()=>root.classList.remove('da-instant'));
      if(reduce)renderOnce();},midi);
    setTimeout(()=>{veil.classList.remove('sweep');blurEl.classList.remove('go');switching=false;},endi);
  }
  window.__setDA=setDA;   /* exposé pour la ligne de commande du thème terminal (`da <nom>`) */

  /* ---------- Popover ---------- */
  const wrap=document.getElementById('daWrap'),toggle=document.getElementById('daToggle'),menu=document.getElementById('daMenu');
  function openMenu(){wrap.classList.add('open');toggle.setAttribute('aria-expanded','true');}
  function closeMenu(){wrap.classList.remove('open');toggle.setAttribute('aria-expanded','false');}
  toggle.addEventListener('click',e=>{e.stopPropagation();wrap.classList.contains('open')?closeMenu():openMenu();});
  document.querySelectorAll('.da-opt').forEach(o=>o.addEventListener('click',()=>{setDA(o.dataset.da);closeMenu();toggle.focus();}));
  document.addEventListener('click',e=>{if(!wrap.contains(e.target))closeMenu();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&wrap.classList.contains('open')){closeMenu();toggle.focus();}});
  menu.addEventListener('keydown',e=>{const opts=[...menu.querySelectorAll('.da-opt')];const i=opts.indexOf(document.activeElement);
    if(e.key==='ArrowDown'){e.preventDefault();opts[(i+1)%opts.length].focus();}
    else if(e.key==='ArrowUp'){e.preventDefault();opts[(i-1+opts.length)%opts.length].focus();}});

  /* ---------- Accroche 1re visite ---------- */
  // pulsation d'attention sur le bouton à CHAQUE chargement (pour qu'on le repère vite)
  wrap.classList.add('notice');
  setTimeout(function(){wrap.classList.remove('notice');},6500);
  toggle.addEventListener('click',function(){wrap.classList.remove('notice');},{once:true});
  // bulle d'accroche (une fois par visiteur), affichée rapidement
  try{if(!localStorage.getItem('noa-da-hinted')){
    setTimeout(function(){wrap.classList.add('hint-on');},800);
    var clr=function(){wrap.classList.remove('hint-on');try{localStorage.setItem('noa-da-hinted','1');}catch(e){}};
    toggle.addEventListener('click',clr,{once:true});
    setTimeout(clr,12000);
  }}catch(e){}

  /* ---------- Boot ---------- */
  sizeGL();size2d();
  if(mode==='gl'){c2d.classList.add('hide');glCanvas.classList.remove('hide');glCanvas.classList.toggle('fallback',!(R||T3));}
  else{glCanvas.classList.add('hide');c2d.classList.remove('hide');}
  paintUI(cur);
  start();
})();
