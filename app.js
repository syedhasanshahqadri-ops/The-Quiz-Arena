(()=>{
const $=id=>document.getElementById(id),Q$=s=>document.querySelector(s),KEYS=["pre-primary","primary","secondary","intermediate","pro"],DESC=["Build your base","Sharpen your skills","Tackle harder ideas","Think like a specialist","Expert challenge"],TOTAL=200,SEC=20,screens=["welcomeScreen","quizScreen","summaryScreen"];
let si=0,locked=false,score=0,first=true,lvRight=0,lvTries=0,mode="level",streak=0,t0=0,ac,snd=localStorage.getItem("tqa-sound")!=="off";
function tone(f,d=.12,ty="sine",at=0){if(!snd)return;try{ac=ac||new(window.AudioContext||window.webkitAudioContext)();const o=ac.createOscillator(),g=ac.createGain(),n=ac.currentTime+at;o.type=ty;o.frequency.value=f;g.gain.setValueAtTime(.08,n);g.gain.exponentialRampToValueAtTime(.0001,n+d);o.connect(g);g.connect(ac.destination);o.start(n);o.stop(n+d)}catch{}}
const sfx={ok:()=>{tone(660,.12,"triangle");tone(880,.16,"triangle",.1)},no:()=>tone(160,.3,"sawtooth"),lv:()=>[523,659,784,1047].forEach((f,i)=>tone(f,.2,"triangle",i*.12))};
function show(id){screens.forEach(s=>$(s).classList.toggle("active",s===id));window.scrollTo({top:0,behavior:"smooth"})}
const R=(x,y)=>x+Math.floor(Math.random()*(y-x+1)),load=()=>{try{return JSON.parse(localStorage.getItem("tqa-prog2")||"{}")}catch{return{}}},save=p=>{try{localStorage.setItem("tqa-prog2",JSON.stringify(p))}catch{}};
const st0=i=>load()[KEYS[i]]||{s:[],m:[]},done=i=>st0(i).s.length,open=i=>i===0||done(i-1)>=TOTAL;
let G=null,cur=0,re=false;const Qs=()=>window.QUIZ_BANK[KEYS[si]];
function persist(){if(!G.persist)return;const p=load();p[KEYS[si]]={s:[...G.s],m:G.m};save(p)}
function pick(ex){const due=G.m.filter(x=>x.w<=0&&x.i!==ex).sort((a,b)=>a.w-b.w)[0];if(due)return{i:due.i,re:true};
 for(let i=0;i<Qs().length;i++)if(!G.s.has(i)&&i!==ex&&!G.m.some(x=>x.i===i))return{i};
 const r=G.m.filter(x=>x.i!==ex).sort((a,b)=>a.w-b.w)[0];if(r)return{i:r.i,re:true};
 return ex!=null&&!G.s.has(ex)?{i:ex,re:true}:null}
// game chrome
const hud=document.createElement("div");hud.className="g-hud";hud.innerHTML='<div class="g-pips" id="pips"></div><span class="g-streak" id="streak"></span><div class="g-timer"><i id="timerFill"></i></div>';Q$(".progress-panel").before(hud);
const stars=document.createElement("div");stars.className="g-stars";stars.innerHTML="<i></i><i></i><i></i>";[...stars.children].forEach((x,i)=>x.style.setProperty("--i",i));$("summaryScore").before(stars);
const sb=document.createElement("button");sb.className="icon-button";sb.id="soundToggle";Q$(".header-actions").prepend(sb);const sl=()=>sb.textContent=snd?"SOUND ON":"SOUND OFF";sl();sb.onclick=()=>{snd=!snd;localStorage.setItem("tqa-sound",snd?"on":"off");sl();if(snd)sfx.ok()};
for(let i=0;i<14;i++){const e=document.createElement("span");e.className="g-sym";e.textContent="∑π?★∞√+×≈%#&".charAt(i%12);e.style.cssText=`left:${Math.random()*96}%;font-size:${18+Math.random()*34}px;animation-duration:${22+Math.random()*30}s;animation-delay:-${Math.random()*40}s`;document.body.prepend(e)}
const setStars=n=>{[...stars.children].forEach(x=>x.classList.remove("on"));void stars.offsetWidth;[...stars.children].forEach((x,i)=>x.classList.toggle("on",i<n))};
function pop(el,txt){const r=el.getBoundingClientRect(),p=document.createElement("div");p.className="g-pop";p.textContent=txt;p.style.left=r.left+r.width/2-20+"px";p.style.top=r.top+"px";document.body.appendChild(p);setTimeout(()=>p.remove(),1000)}
function home(){const cur=KEYS.findIndex((k,i)=>open(i)&&done(i)<TOTAL);
 $("standardsGrid").innerHTML=KEYS.map((k,i)=>{const d=done(i),lock=!open(i);return `<button class="standard-card${lock?" locked":""}${i===cur?" current":""}" style="--n:${i}" data-i="${i}"${lock?" disabled":""}>${lock?'<span class="g-lock"></span>':""}<span class="standard-number">0${i+1}</span><span class="standard-mark">${lock?"LOCKED":d+"/"+TOTAL}</span><span class="standard-name">Standard-0${i+1}</span><span class="standard-desc">${DESC[i]}</span><span class="meter"><i style="width:${d/2}%"></i></span><span class="standard-enter">${lock?"FINISH STANDARD-0"+i+" TO UNLOCK":d>=TOTAL?"COMPLETED · REPLAY":d?"CONTINUE":"START"}</span></button>`}).join("");
 document.querySelectorAll("#standardsGrid [data-i]").forEach(b=>b.onclick=()=>{tone(520,.1,"triangle");start(+b.dataset.i)});show("welcomeScreen")}
function fresh(i,replay){const v=st0(i);return{s:new Set(replay?[]:v.s),m:replay?[]:v.m.map(x=>({...x})),persist:!replay}}
function start(i){si=i;G=fresh(i,done(i)>=TOTAL);score=0;streak=0;lvRight=lvTries=0;$("divisionName").textContent="STANDARD-0"+(i+1);show("quizScreen");nextQ()}
function nextQ(ex){const p=pick(ex);if(!p)return finish();cur=p.i;re=!!p.re;render()}
function timer(){const f=$("timerFill");f.style.transition="none";f.style.width="100%";void f.offsetWidth;f.style.transition=`width ${SEC}s linear`;f.style.width="0";t0=Date.now()}
function render(){locked=false;const q=Qs()[cur],n=G.s.size;
 const w=Q$(".question-wrap");w.style.animation="none";void w.offsetWidth;w.style.animation="";
 $("levelLabel").textContent=`LEVEL ${Math.floor(n/10)+1} OF 20`;$("questionNumber").textContent=`QUESTION ${n+1} OF ${TOTAL}`;$("subjectTag").textContent=q.subject.toUpperCase();$("difficultyTag").textContent=re?"REVISIT":q.difficulty.toUpperCase();$("questionText").textContent=q.question;$("progressCount").textContent=`${n} OF ${TOTAL} SOLVED`;$("progressFill").style.width=n/2+"%";$("sessionScore").textContent="SCORE "+score;$("feedback").hidden=true;
 $("pips").innerHTML=Array.from({length:10},(_,j)=>`<i class="${j<n%10?"on":j===n%10?"now":""}"></i>`).join("");$("streak").textContent=streak>1?"STREAK x"+streak:"";
 const g=$("optionsGrid");g.innerHTML="";q.options.forEach((o,i)=>{const b=document.createElement("button");b.className="option";b.style.setProperty("--i",i);b.innerHTML='<span class="option-key">'+"ABCD"[i]+"</span><span></span>";b.lastChild.textContent=o;b.onclick=()=>choose(i,q,b);g.appendChild(b)});timer()}
function celebrate(n=42){const l=document.createElement("div");l.className="celebration-layer";l.setAttribute("aria-hidden","true");for(let i=0;i<n;i++){const b=document.createElement("i");b.className="confetti-piece";b.style.left=Math.random()*100+"%";b.style.setProperty("--delay",Math.random()*.35+"s");b.style.setProperty("--drift",(Math.random()-.5)*180+"px");b.style.setProperty("--spin",(Math.random()*900-450)+"deg");l.appendChild(b)}document.body.appendChild(l);setTimeout(()=>l.remove(),1900)}
function choose(i,q,btn){if(locked)return;locked=true;lvTries++;const el=(Date.now()-t0)/1000,f=$("timerFill");f.style.width=getComputedStyle(f).width;f.style.transition="none";
 [...$("optionsGrid").children].forEach((b,j)=>{b.disabled=true;if(j===q.answer)b.classList.add("correct");if(j===i&&i!==q.answer)b.classList.add("incorrect")});
 const ok=i===q.answer;$("feedbackTitle").classList.toggle("bad",!ok);G.m.forEach(x=>x.w--);
 if(ok){streak++;const pts=10+Math.max(0,Math.ceil((SEC-el)/4))+Math.min(streak,5)*2;score+=pts;lvRight++;G.s.add(cur);G.m=G.m.filter(x=>x.i!==cur);persist();celebrate(42);sfx.ok();pop(btn,"+"+pts);$("feedbackTitle").textContent=re?"CORRECT - REVISIT CLEARED":"CORRECT";$("nextButton").innerHTML=(G.s.size>=TOTAL?"FINISH STANDARD":"NEXT QUESTION")+" <span>→</span>";$("explanationText").textContent=q.explanation||"Well done.";$("progressCount").textContent=`${G.s.size} OF ${TOTAL} SOLVED`;$("progressFill").style.width=G.s.size/2+"%"}
 else{streak=0;sfx.no();const e=G.m.find(x=>x.i===cur);if(e)e.w=R(4,7);else G.m.push({i:cur,w:R(4,7)});persist();$("feedbackTitle").textContent="NOT QUITE";$("nextButton").innerHTML="TRY ANOTHER QUESTION <span>↻</span>";$("explanationText").textContent="Correct answer: "+q.options[q.answer]+". This question will come back a little later, so remember it.";}
 $("streak").textContent=streak>1?"STREAK x"+streak:"";if(streak>1){const s=$("streak");s.classList.remove("hot");void s.offsetWidth;s.classList.add("hot")}
 $("sessionScore").textContent="SCORE "+score;$("feedback").hidden=false}
function finish(){mode="end";const n=si<4?`Standard-0${si+2} is now unlocked.`:"You have cleared every standard.";sm(`STANDARD-0${si+1} COMPLETE`,"ALL 200<br><em>SOLVED.</em>",n,score,TOTAL,"200",3);$("continueButton").innerHTML="BACK TO STANDARDS <span>→</span>"}
const sm=(k,h,s,n,a,c,st)=>{Q$(".summary-kicker").textContent=k;Q$("#summaryScreen h2").innerHTML=h;Q$("#summaryScreen .summary-card>p").textContent=s;$("summaryScore").textContent=n;$("summaryAttempted").textContent=a;$("summaryAccuracy").textContent=c;show("summaryScreen");setStars(st);sfx.lv();celebrate(70)};
$("nextButton").onclick=()=>{if($("feedbackTitle").classList.contains("bad"))return nextQ(cur);
 if(G.s.size>=TOTAL)return finish();
 if(G.s.size%10===0){mode="level";sm(`LEVEL ${G.s.size/10} CLEARED`,"WELL<br><em>PLAYED.</em>","First-try answers out of 10 in this level",lvRight,lvTries,Math.round(lvRight/Math.max(1,lvTries)*100)+"%",lvRight>=9?3:lvRight>=6?2:1);lvRight=lvTries=0;$("continueButton").innerHTML="NEXT LEVEL <span>→</span>";return}
 nextQ()};
$("continueButton").onclick=()=>{if(mode==="end")return home();show("quizScreen");nextQ()};
$("backButton").onclick=home;$("homeButton").onclick=home;$("restartButton").onclick=()=>{G=fresh(si,true);score=0;streak=0;lvRight=lvTries=0;nextQ()};
$("homeBrand").onclick=e=>{e.preventDefault();home()};
if(localStorage.getItem("tqa-theme")==="dark")document.body.classList.add("dark");
const tl=()=>{const d=document.body.classList.contains("dark");$("themeGlyph").textContent=d?"LIGHT THEME":"DARK THEME";Q$("meta[name=theme-color]").content=d?"#04202F":"#0077B6"};tl();
$("themeToggle").onclick=()=>{document.body.classList.toggle("dark");localStorage.setItem("tqa-theme",document.body.classList.contains("dark")?"dark":"light");tl()};
const net=()=>{const o=navigator.onLine;$("connectionState").textContent=o?"READY TO PLAY":"OFFLINE MODE";$("connectionState").classList.toggle("off",!o)};

// install support
let dip=null;const isInst=()=>matchMedia("(display-mode: standalone)").matches||navigator.standalone===true;
function toast(t){const e=document.createElement("div");e.className="toast";e.textContent=t;document.body.appendChild(e);setTimeout(()=>e.remove(),5500)}
async function install(){if(dip){dip.prompt();const r=await dip.userChoice;dip=null;toast(r.outcome==="accepted"?"Installing The Quiz Arena...":"Install cancelled. You can install any time from the INSTALL APP button.");return}
 toast(/iphone|ipad|ipod/i.test(navigator.userAgent)?"On iPhone or iPad: tap the Share button, then choose Add to Home Screen.":"Open your browser menu and choose Install app, or Add to Home screen.")}
addEventListener("beforeinstallprompt",e=>{e.preventDefault();dip=e});
addEventListener("appinstalled",()=>{dip=null;document.querySelectorAll(".js-install").forEach(b=>b.hidden=true);toast("Installed. Find The Quiz Arena on your home screen.")});
const ib=document.createElement("button");ib.className="icon-button install js-install";ib.textContent="INSTALL APP";ib.onclick=install;Q$(".header-actions").prepend(ib);
const cta=document.createElement("div");cta.className="hero-cta";cta.innerHTML='<button class="cta" id="playNow">START PLAYING</button><button class="cta alt js-install" id="installHero">INSTALL APP</button>';Q$(".hero-copy").after(cta);
$("installHero").onclick=install;$("playNow").onclick=()=>{const c=KEYS.findIndex((k,i)=>open(i)&&done(i)<TOTAL);tone(520,.1,"triangle");start(c<0?0:c)};
if(isInst())document.querySelectorAll(".js-install").forEach(b=>b.hidden=true);
addEventListener("online",net);addEventListener("offline",net);net();home();
if("serviceWorker"in navigator&&location.protocol!=="file:")addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
})();
