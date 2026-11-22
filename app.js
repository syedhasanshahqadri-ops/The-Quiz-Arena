(() => {
const labels={"pre-primary":"PRE-PRIMARY","primary":"PRIMARY","secondary":"SECONDARY","intermediate":"INTERMEDIATE","pro":"PRO-LEVEL"};
const screens=["welcomeScreen","quizScreen","summaryScreen"];
let standard=null, deck=[], deckIndex=0, level=0, score=0, attempted=0, locked=false, sessionStart=Date.now();
const $=id=>document.getElementById(id);
function show(id){screens.forEach(s=>$(s).classList.toggle("active",s===id));window.scrollTo({top:0,behavior:"smooth"});}
function shuffle(a){const b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]];}return b;}
function getStats(){try{return JSON.parse(localStorage.getItem("tqa-stats")||"{}")}catch{return {}}}
function saveStats(){const s=getStats();s[standard]={score,attempted,level};localStorage.setItem("tqa-stats",JSON.stringify(s));}
function begin(key){standard=key;deck=shuffle(window.QUIZ_BANK[key]||[]);deckIndex=0;level=0;score=0;attempted=0;sessionStart=Date.now();$("divisionName").textContent=labels[key];show("quizScreen");renderQuestion();}
function currentQuestion(){if(deckIndex>=deck.length){deck=shuffle(window.QUIZ_BANK[standard]||[]);deckIndex=0;}return deck[deckIndex];}
function renderQuestion(advance=true){locked=false;const q=currentQuestion();if(advance)level++;$("levelLabel").textContent=`LEVEL ${level}`;$("questionNumber").textContent=`QUESTION ${String(level).padStart(2,"0")}`;$("subjectTag").textContent=q.subject.toUpperCase();$("difficultyTag").textContent=q.difficulty.toUpperCase();$("questionText").textContent=q.question;$("progressCount").textContent=`${score} CORRECT`;$("progressFill").style.width=`${Math.min(100,(score/Math.max(1,attempted))*100)}%`;$("sessionScore").textContent=`SCORE ${score}`;$("feedback").hidden=true;
const grid=$("optionsGrid");grid.innerHTML="";q.options.forEach((option,i)=>{const b=document.createElement("button");b.className="option";b.innerHTML=`<span class="option-key">${"ABCD"[i]}</span><span></span>`;b.querySelector("span:last-child").textContent=option;b.addEventListener("click",()=>choose(i,q));grid.appendChild(b);});}
function celebrate(){const layer=document.createElement("div");layer.className="celebration-layer";layer.setAttribute("aria-hidden","true");for(let i=0;i<42;i++){const bit=document.createElement("i");bit.className="confetti-piece";bit.style.left=(Math.random()*100)+"%";bit.style.setProperty("--delay",(Math.random()*.35)+"s");bit.style.setProperty("--drift",((Math.random()-.5)*180)+"px");bit.style.setProperty("--spin",(Math.random()*900-450)+"deg");layer.appendChild(bit);}document.body.appendChild(layer);setTimeout(()=>layer.remove(),1900);}
function choose(index,q){if(locked)return;locked=true;const buttons=[...$("optionsGrid").children];buttons.forEach((b,i)=>{b.disabled=true;if(i===q.answer)b.classList.add("correct");if(i===index&&index!==q.answer)b.classList.add("incorrect");});const right=index===q.answer;if(right){attempted++;score++;$("feedbackTitle").textContent="CORRECT — LEVEL CLEARED";$("feedbackTitle").classList.remove("bad");$("nextButton").innerHTML="NEXT LEVEL <span>→</span>";deckIndex++;celebrate();}else{$("feedbackTitle").textContent="NOT QUITE — TRY AGAIN";$("feedbackTitle").classList.add("bad");$("nextButton").innerHTML="TRY THIS LEVEL AGAIN <span>↻</span>";} $("explanationText").textContent=right?q.explanation:"That is not the correct option. Review the choices and try this same level again. You must answer correctly to unlock the next level.";$("feedback").hidden=false;$("progressCount").textContent=`${score} LEVELS CLEARED`;$("progressFill").style.width=`${Math.min(100,(score/Math.max(1,level))*100)}%`;$("sessionScore").textContent=`SCORE ${score}`;saveStats();}
function summary(){ $("summaryScore").textContent=score;$("summaryAttempted").textContent=attempted;$("summaryAccuracy").textContent=attempted?Math.round(score/attempted*100)+"%":"0%";show("summaryScreen");}
document.querySelectorAll("[data-standard]").forEach(b=>b.addEventListener("click",()=>begin(b.dataset.standard)));
$("nextButton").addEventListener("click",()=>{if(locked && $("feedbackTitle").classList.contains("bad")){renderQuestion(false);return;}if(level>0&&level%10===0)summary();else renderQuestion();});
$("continueButton").addEventListener("click",()=>{show("quizScreen");renderQuestion();});
$("backButton").addEventListener("click",()=>{saveStats();show("welcomeScreen");});
$("homeButton").addEventListener("click",()=>show("welcomeScreen"));
$("restartButton").addEventListener("click",()=>begin(standard));
$("homeBrand").addEventListener("click",e=>{e.preventDefault();show("welcomeScreen");});
const theme=localStorage.getItem("tqa-theme");if(theme==="light")document.body.classList.add("light");
function themeLabel(){$("themeGlyph").textContent=document.body.classList.contains("light")?"DARK":"LIGHT";}
themeLabel();$("themeToggle").addEventListener("click",()=>{document.body.classList.toggle("light");localStorage.setItem("tqa-theme",document.body.classList.contains("light")?"light":"dark");themeLabel();});
function network(){const online=navigator.onLine;$("connectionState").textContent=online?"READY TO PLAY":"OFFLINE MODE";$("connectionState").style.color=online?"var(--gold-strong)":"var(--correct)";}
window.addEventListener("online",network);window.addEventListener("offline",network);network();
if("serviceWorker" in navigator && location.protocol!=="file:"){window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));}
})();