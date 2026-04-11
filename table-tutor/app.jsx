
const {useState,useEffect,useRef,useCallback,useMemo}=React;

/* ── Helpers ── */
function shuffle(arr){const a=[...arr];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function formatTime(s){const m=Math.floor(s/60),sec=s%60;return m>0?`${m}:${sec.toString().padStart(2,'0')}`:`${sec}s`;}
function getGrade(pct){
  if(pct>=90)return{letter:'A',cls:'grade-A',emoji:'🌟'};
  if(pct>=75)return{letter:'B',cls:'grade-B',emoji:'✨'};
  if(pct>=60)return{letter:'C',cls:'grade-C',emoji:'👍'};
  return{letter:'D',cls:'grade-D',emoji:'💪'};
}
const ALL_TABLES=Array.from({length:20},(_,i)=>i+1);

/* ── TTS Engine ── */
const tts={
  voices:[],
  loaded:false,
  load(){
    if(typeof speechSynthesis==='undefined')return;
    const set=()=>{tts.voices=speechSynthesis.getVoices();tts.loaded=true;};
    speechSynthesis.onvoiceschanged=set; set();
  },
  speak(text,cfg){
    if(!cfg.enabled||typeof speechSynthesis==='undefined')return;
    speechSynthesis.cancel();
    const u=new SpeechSynthesisUtterance(text);
    u.rate=cfg.speed||1;u.pitch=1.05;u.volume=1;
    if(cfg.voice){const v=tts.voices.find(x=>x.name===cfg.voice);if(v)u.voice=v;}
    speechSynthesis.speak(u);
  },
  cancel(){typeof speechSynthesis!=='undefined'&&speechSynthesis.cancel();}
};

/* ── Stars ── */
function initStars(){
  const c=document.getElementById('starsContainer');if(!c)return;
  for(let i=0;i<70;i++){
    const s=document.createElement('div');s.className='star';
    const sz=Math.random()*2.5+.5;
    Object.assign(s.style,{width:sz+'px',height:sz+'px',left:Math.random()*100+'%',
      top:Math.random()*100+'%','--d':(Math.random()*4+2)+'s',animationDelay:(Math.random()*5)+'s',opacity:Math.random()*.5+.1});
    c.appendChild(s);
  }
}

/* ── App Root ── */
function App(){
  const [tab,setTab]=useState('learn');
  const [selTable,setSelTable]=useState(2);
  const [opMode,setOpMode]=useState('mult');
  const [mastery,setMastery]=useState(()=>{try{return JSON.parse(localStorage.getItem('tt_mastery')||'{}')}catch(e){return{}}});
  const [ttsCfg,setTtsCfg]=useState({enabled:false,voice:'',speed:1});
  const [ttsVoices,setTtsVoices]=useState([]);

  useEffect(()=>{
    initStars();tts.load();
    const interval=setInterval(()=>{
      if(tts.voices.length){setTtsVoices(tts.voices);clearInterval(interval);}
    },300);
    return()=>clearInterval(interval);
  },[]);

  useEffect(()=>{localStorage.setItem('tt_mastery',JSON.stringify(mastery));},[mastery]);
  const markMastered=(key)=>setMastery(m=>({...m,[key]:(m[key]||0)+1}));

  const tabs=[{id:'learn',label:'📖 Learn'},{id:'rhythm',label:'🥁 Rhythm'},{id:'test',label:'✏️ Test'},{id:'progress',label:'📊 Progress'}];

  const englishVoices=ttsVoices.filter(v=>v.lang.startsWith('en'));

  return(
    <div className="app">
      <header className="header">
        <div className="logo">Seedling Table Trainer</div>
        <div className="tagline">Multiplication & Division Mastery · Tables 1–20</div>
      </header>

      {/* TTS Settings Bar */}
      <div className="tts-bar">
        <span className="tts-label">🔊 VOICE:</span>
        <button className={`tts-toggle${ttsCfg.enabled?' on':''}`}
          onClick={()=>setTtsCfg(c=>({...c,enabled:!c.enabled}))}>
          <span className="dot"/>
          {ttsCfg.enabled?'On':'Off'}
        </button>
        {ttsCfg.enabled&&<>
          <select className="tts-select" value={ttsCfg.voice}
            onChange={e=>setTtsCfg(c=>({...c,voice:e.target.value}))}>
            <option value="">Default voice</option>
            {englishVoices.map(v=><option key={v.name} value={v.name}>{v.name}</option>)}
          </select>
          <div className="tts-speed-row">
            Speed:
            <input type="range" min="0.5" max="1.8" step="0.1" value={ttsCfg.speed} className="tts-range"
              onChange={e=>setTtsCfg(c=>({...c,speed:+e.target.value}))}/>
            <span>{ttsCfg.speed}×</span>
          </div>
          <button className="op-btn" style={{padding:'4px 12px',fontSize:'.78rem'}}
            onClick={()=>tts.speak('7 times 8 equals 56',ttsCfg)}>Test</button>
        </>}
      </div>

      <div className="nav-tabs">
        {tabs.map(t=><button key={t.id} className={`nav-tab${tab===t.id?' active':''}`} onClick={()=>setTab(t.id)}>{t.label}</button>)}
      </div>

      <main className="main">
        {tab==='learn'   && <LearnMode selTable={selTable} setSelTable={setSelTable} opMode={opMode} setOpMode={setOpMode} mastery={mastery} markMastered={markMastered} ttsCfg={ttsCfg}/>}
        {tab==='rhythm'  && <RhythmMode selTable={selTable} setSelTable={setSelTable} opMode={opMode} setOpMode={setOpMode} ttsCfg={ttsCfg}/>}
        {tab==='test'    && <TestMode mastery={mastery} setMastery={setMastery} ttsCfg={ttsCfg}/>}
        {tab==='progress'&& <ProgressMode mastery={mastery}/>}
      </main>
    </div>
  );
}

/* ── Learn Mode ── */
function LearnMode({selTable,setSelTable,opMode,setOpMode,mastery,markMastered,ttsCfg}){
  const [revealed,setRevealed]=useState({});
  const [selectorOpen,setSelectorOpen]=useState(false);

  const getFact=(a,b)=>opMode==='mult'?{eq:`${a} × ${b}`,ans:a*b,speech:`${a} times ${b} equals ${a*b}`}:{eq:`${a*b} ÷ ${a}`,ans:b,speech:`${a*b} divided by ${a} equals ${b}`};

  const toggle=(key,a,b)=>{
    const f=getFact(a,b);
    const nowRevealed=!revealed[key];
    setRevealed(r=>({...r,[key]:nowRevealed}));
    markMastered(key);
    if(nowRevealed) tts.speak(f.speech,ttsCfg);
  };

  return(
    <div className="fade-in">
      <div>
        <button className={`table-selector-toggle${selectorOpen?' open':''}`}
          onClick={()=>setSelectorOpen(o=>!o)}>
          <span>📋 SELECT TABLE</span>
          <span className="tst-badge">
            <span className="tst-num">×{selTable}</span>
            <span className="tst-arrow">▼</span>
          </span>
        </button>
        <div className={`table-selector-body${selectorOpen?' open':''}`}>
          <div className="table-grid">
            {ALL_TABLES.map(n=><button key={n} className={`table-btn${selTable===n?' selected':''}`}
              onClick={()=>{setSelTable(n);setRevealed({});setSelectorOpen(false);}}>{n}</button>)}
          </div>
        </div>
      </div>
      <div className="learn-header">
        <div className="learn-title">Table of {selTable}</div>
        <div className="op-toggle">
          <button className={`op-btn${opMode==='mult'?' active':''}`} onClick={()=>setOpMode('mult')}>✕ Multiply</button>
          <button className={`op-btn${opMode==='div'?' active':''}`} onClick={()=>setOpMode('div')}>÷ Divide</button>
        </div>
      </div>
      <div className="facts-grid">
        {Array.from({length:10},(_,i)=>i+1).map(i=>{
          const key=`${selTable}x${i}`;const {eq,ans}=getFact(selTable,i);
          const isMastered=(mastery[key]||0)>=3;
          return(
            <div key={key} className={`fact-card${isMastered?' mastered':''}`}
              onClick={()=>toggle(key,selTable,i)} style={{animationDelay:`${i*.04}s`}}>
              <div className="fact-badge">✓</div>
              <div className="fact-equation">{eq} =</div>
              <div className="fact-answer" style={{opacity:revealed[key]?1:0,filter:revealed[key]?'none':'blur(10px)',transition:'all .3s'}}>{ans}</div>
              {!revealed[key]&&<div style={{color:'var(--text2)',fontSize:'.73rem',marginTop:3}}>tap to reveal</div>}
            </div>
          );
        })}
      </div>
      <div style={{marginTop:14,padding:'11px 15px',background:'var(--surface2)',borderRadius:11,color:'var(--text2)',fontSize:'.8rem',textAlign:'center'}}>
        💡 Tap each card to reveal & hear the answer. Tap 3× to mark as mastered!
      </div>
    </div>
  );
}

/* ── Rhythm Mode ── */
function RhythmMode({selTable,setSelTable,opMode,setOpMode,ttsCfg}){
  const [bpm,setBpm]=useState(60);
  const [running,setRunning]=useState(false);
  const [idx,setIdx]=useState(0);
  const [showAnswer,setShowAnswer]=useState(false);
  const [pulse,setPulse]=useState(false);
  const [beats,setBeats]=useState([false,false,false,false]);
  const [selectorOpen,setSelectorOpen]=useState(false);
  const interval=60000/bpm;
  const timerRef=useRef(null);const beatRef=useRef(0);const idxRef=useRef(0);

  const getFact=useCallback((i)=>{
    const n=i%10+1;
    if(opMode==='mult')return{eq:`${selTable} × ${n}`,ans:`${selTable*n}`,speech:`${selTable} times ${n}`};
    return{eq:`${selTable*n} ÷ ${selTable}`,ans:`${n}`,speech:`${selTable*n} divided by ${selTable}`};
  },[selTable,opMode]);

  const tick=useCallback(()=>{
    setPulse(true);setTimeout(()=>setPulse(false),150);
    const phase=beatRef.current%3;
    if(phase===0){
      setShowAnswer(false);
      const f=getFact(idxRef.current);
      tts.speak(f.speech,ttsCfg);
    } else if(phase===1){
      setShowAnswer(true);
      const f=getFact(idxRef.current);
      tts.speak(f.ans,ttsCfg);
    } else {
      idxRef.current=(idxRef.current+1)%10;
      setIdx(idxRef.current);setShowAnswer(false);
    }
    setBeats(b=>{const nb=Array(4).fill(false);nb[beatRef.current%4]=true;return nb;});
    beatRef.current++;
  },[getFact,ttsCfg]);

  useEffect(()=>{
    if(running){beatRef.current=0;timerRef.current=setInterval(tick,interval);}
    else clearInterval(timerRef.current);
    return()=>clearInterval(timerRef.current);
  },[running,interval,tick]);

  const {eq,ans}=getFact(idx);

  return(
    <div className="rhythm-container fade-in">
      <div>
        <button className={`table-selector-toggle${selectorOpen?' open':''}`}
          onClick={()=>setSelectorOpen(o=>!o)}>
          <span>📋 SELECT TABLE</span>
          <span className="tst-badge">
            <span className="tst-num">×{selTable}</span>
            <span className="tst-arrow">▼</span>
          </span>
        </button>
        <div className={`table-selector-body${selectorOpen?' open':''}`}>
          <div className="table-grid">
            {ALL_TABLES.map(n=><button key={n} className={`table-btn${selTable===n?' selected':''}`}
              onClick={()=>{setSelTable(n);setRunning(false);setIdx(0);idxRef.current=0;setSelectorOpen(false);}}>{n}</button>)}
          </div>
        </div>
      </div>
      <div className="rhythm-settings">
        <div className="op-toggle">
          <button className={`op-btn${opMode==='mult'?' active':''}`} onClick={()=>setOpMode('mult')}>✕ Multiply</button>
          <button className={`op-btn${opMode==='div'?' active':''}`} onClick={()=>setOpMode('div')}>÷ Divide</button>
        </div>
        <div className="rhythm-bpm-display">
          🥁
          <input type="range" min="30" max="120" value={bpm} className="bpm-slider"
            onChange={e=>{setBpm(+e.target.value);setRunning(false);}}/>
          <span>{bpm} BPM</span>
        </div>
      </div>
      <div className="rhythm-display">
        <div className={`rhythm-fact${pulse?' pulse':''}`}>{eq} =</div>
        <div className="rhythm-answer" style={{opacity:showAnswer?1:0,transition:'opacity .1s'}}>{ans}</div>
        <div className="rhythm-progress-bar"><div className="rhythm-progress-fill" style={{width:`${(idx/10)*100}%`}}/></div>
        <div className="rhythm-counter">{idx+1} / 10</div>
        <div className="beat-dots">{beats.map((b,i)=><div key={i} className={`beat-dot${b?' active':''}`}/>)}</div>
      </div>
      <div className="rhythm-controls">
        {!running
          ?<button className="btn-primary" onClick={()=>{setRunning(true);setIdx(0);idxRef.current=0;setShowAnswer(false);}}>▶ Start Rhythm</button>
          :<button className="btn-primary" onClick={()=>setRunning(false)}>⏸ Pause</button>}
        <button className="btn-secondary" onClick={()=>{setRunning(false);setIdx(0);idxRef.current=0;setShowAnswer(false);}}>↺ Reset</button>
      </div>
      <div style={{marginTop:18,padding:'13px',background:'var(--surface)',borderRadius:13,color:'var(--text2)',fontSize:'.8rem',textAlign:'center',border:'2px solid var(--border)'}}>
        🥁 Question → Answer → Next. Say the answer before it appears! Voice reads each fact when TTS is on.
      </div>
    </div>
  );
}

/* ──────────────────────────────
   TEST MODE
   Types: classic | mcq | missing | blitz
────────────────────────────── */
const TEST_TYPES=[
  {id:'classic', icon:'🔢', name:'Classic Fill-in',   desc:'Type the answer — auto-submits when correct digits entered'},
  {id:'mcq',     icon:'🎯', name:'Multiple Choice',   desc:'Pick from 4 options — builds fast recognition'},
  {id:'missing',  icon:'❓', name:'Missing Factor',    desc:'Find the missing number: 3 × ? = 24'},
  {id:'blitz',    icon:'⚡', name:'Speed Blitz',       desc:'Race against a per-question countdown — pure speed!'},
];

function buildQuestions(cfg){
  const qs=[];
  const ops=cfg.op==='both'?['mult','div']:cfg.op==='mult'?['mult']:['div'];
  for(let i=0;i<cfg.count;i++){
    const t=cfg.tables[Math.floor(Math.random()*cfg.tables.length)];
    const n=Math.floor(Math.random()*10)+1;
    const op=ops[Math.floor(Math.random()*ops.length)];
    if(cfg.testType==='missing'){
      // always multiplication for missing factor
      const side=Math.random()<.5?'left':'right';
      const a=t,b=n,product=a*b;
      if(side==='left') qs.push({display:`? × ${b} = ${product}`,ans:a,key:`${a}x${b}`,speech:`what times ${b} equals ${product}`});
      else              qs.push({display:`${a} × ? = ${product}`,ans:b,key:`${a}x${b}`,speech:`${a} times what equals ${product}`});
    } else if(op==='mult'){
      qs.push({display:`${t} × ${n} = ?`,ans:t*n,key:`${t}x${n}`,speech:`${t} times ${n}`});
    } else {
      qs.push({display:`${t*n} ÷ ${t} = ?`,ans:n,key:`${t}x${n}`,speech:`${t*n} divided by ${t}`});
    }
  }
  return qs;
}

function makeMCQChoices(ans){
  const s=new Set([ans]);
  const offsets=shuffle([-3,-2,-1,1,2,3,4,5,-4,6,-5,7,-6]).filter(o=>ans+o>0);
  for(const o of offsets){if(s.size===4)break;s.add(ans+o);}
  while(s.size<4){let r=Math.max(1,ans+Math.floor(Math.random()*10)-5);s.add(r);}
  return shuffle([...s].slice(0,4));
}

function digitCount(n){return Math.abs(n).toString().length;}

function TestMode({mastery,setMastery,ttsCfg}){
  const [phase,setPhase]=useState('config');
  const [config,setConfig]=useState({tables:[2,3,4,5],op:'both',count:20,timed:true,duration:120,testType:'classic'});
  const [questions,setQuestions]=useState([]);
  const [qIdx,setQIdx]=useState(0);
  const [answer,setAnswer]=useState('');
  const [results,setResults]=useState([]);
  const [elapsed,setElapsed]=useState(0);
  const [flashState,setFlashState]=useState('');
  const [floatState,setFloatState]=useState('');
  const [floatKey,setFloatKey]=useState(0);
  const [streak,setStreak]=useState(0);
  const [mcqChoices,setMcqChoices]=useState([]);
  const [mcqState,setMcqState]=useState(null); // null | {chosen, correct}
  const [blitzTime,setBlitzTime]=useState(5);
  const [blitzLeft,setBlitzLeft]=useState(5);
  const timerRef=useRef(null);
  const blitzRef=useRef(null);
  const ansRef=useRef('');

  const toggleTable=(t)=>setConfig(c=>{const ts=c.tables.includes(t)?c.tables.filter(x=>x!==t):[...c.tables,t];return{...c,tables:ts.length?ts:c.tables};});
  const toggleAll=()=>setConfig(c=>({...c,tables:c.tables.length===20?[2]:ALL_TABLES.slice()}));

  const startTest=()=>{
    const qs=buildQuestions(config);
    setQuestions(qs);setQIdx(0);setAnswer('');ansRef.current='';setResults([]);setElapsed(0);setStreak(0);
    if(config.testType==='mcq')setMcqChoices(makeMCQChoices(qs[0].ans));
    setMcqState(null);setPhase('test');
    if(config.testType==='blitz'){setBlitzTime(5);setBlitzLeft(5);}
  };

  // TTS on new question
  useEffect(()=>{
    if(phase==='test'&&questions.length&&qIdx<questions.length){
      const q=questions[qIdx];
      tts.speak(q.speech||q.display.replace('?','blank'),ttsCfg);
    }
  },[qIdx,phase,questions.length]);

  // Global timer
  useEffect(()=>{
    if(phase==='test'&&config.timed&&config.testType!=='blitz'){
      timerRef.current=setInterval(()=>{
        setElapsed(e=>{if(e+1>=config.duration){clearInterval(timerRef.current);setPhase('results');return e+1;}return e+1;});
      },1000);
    }
    return()=>clearInterval(timerRef.current);
  },[phase,config.timed,config.testType]);

  // Blitz per-question timer
  useEffect(()=>{
    if(phase!=='test'||config.testType!=='blitz')return;
    clearInterval(blitzRef.current);
    setBlitzLeft(blitzTime);
    blitzRef.current=setInterval(()=>{
      setBlitzLeft(t=>{
        if(t<=1){clearInterval(blitzRef.current);submitAnswer('',true);return blitzTime;}
        return t-1;
      });
    },1000);
    return()=>clearInterval(blitzRef.current);
  },[qIdx,phase,config.testType]);

  const finishTest=useCallback(()=>{
    clearInterval(timerRef.current);clearInterval(blitzRef.current);tts.cancel();
    setPhase('results');
  },[]);

  const submitAnswer=useCallback((overrideAns,forced=false)=>{
    const q=questions[qIdx];if(!q)return;
    const raw=overrideAns!==undefined?overrideAns:ansRef.current;
    const userAns=parseInt(raw,10);
    const correct=!forced&&userAns===q.ans;
    const newResults=[...results,{...q,userAns:isNaN(userAns)?null:userAns,correct}];
    setResults(newResults);
    setFlashState(correct?'correct-flash':'wrong-flash');
    setFloatState(correct?'show-correct':'show-wrong');
    setFloatKey(k=>k+1);
    setTimeout(()=>setFlashState(''),400);
    setTimeout(()=>setFloatState(''),600);
    setStreak(s=>correct?s+1:0);
    if(correct){setMastery(m=>({...m,[q.key]:(m[q.key]||0)+1}));tts.speak('Correct!',ttsCfg);}
    else if(!forced)tts.speak(`The answer is ${q.ans}`,ttsCfg);
    setAnswer('');ansRef.current='';
    if(qIdx+1>=questions.length){setTimeout(()=>finishTest(),350);}
    else{setQIdx(i=>i+1);if(config.testType==='mcq'){setMcqChoices(makeMCQChoices(questions[qIdx+1]?.ans||1));setMcqState(null);}}
  },[qIdx,questions,results,finishTest,setMastery,ttsCfg,config.testType]);

  // Auto-submit logic: submit when typed answer matches digit count of correct answer
  const handleDigit=useCallback((d)=>{
    const q=questions[qIdx];if(!q)return;
    const newAns=(ansRef.current+d).slice(0,4);
    setAnswer(newAns);ansRef.current=newAns;
    // auto-submit when digits entered matches or exceeds the answer's digit count
    const needed=digitCount(q.ans);
    if(newAns.length>=needed){
      // small delay so user sees their typed digit
      setTimeout(()=>submitAnswer(newAns),120);
    }
  },[qIdx,questions,submitAnswer]);

  const handleDel=useCallback(()=>{
    const newAns=ansRef.current.slice(0,-1);
    setAnswer(newAns);ansRef.current=newAns;
  },[]);

  // Keyboard for classic/missing/blitz
  useEffect(()=>{
    if(phase!=='test')return;
    const handler=(e)=>{
      if(config.testType==='mcq')return;
      if(e.key>='0'&&e.key<='9')handleDigit(e.key);
      else if(e.key==='Backspace')handleDel();
    };
    window.addEventListener('keydown',handler);
    return()=>window.removeEventListener('keydown',handler);
  },[phase,config.testType,handleDigit,handleDel]);

  if(phase==='config')return<TestConfig config={config} setConfig={setConfig} toggleTable={toggleTable} toggleAll={toggleAll} startTest={startTest}/>;
  if(phase==='results')return<TestResults results={results} elapsed={elapsed} streak={streak} onRetry={()=>setPhase('config')}/>;

  const q=questions[qIdx];
  const pct=config.timed&&config.testType!=='blitz'?(elapsed/config.duration*100):((qIdx/questions.length)*100);
  const timeLeft=config.duration-elapsed;
  const correctSoFar=results.filter(r=>r.correct).length;

  return(
    <div className="test-arena fade-in">
      {/* Float feedback */}
      <div key={floatKey} style={{
        position:'fixed',top:'45%',left:'50%',pointerEvents:'none',zIndex:999,
        fontSize:'5rem',fontFamily:"'Baloo 2',cursive",fontWeight:800,
        animation:floatState?'floatUp .6s ease forwards':'none',
        color:floatState==='show-correct'?'var(--correct)':'var(--wrong)',
        opacity:floatState?1:0,
      }}>{floatState==='show-correct'?'✓':'✗'}</div>

      <div className="test-progress-bar"><div className="test-progress-fill" style={{width:pct+'%'}}/></div>

      <div className="test-meta">
        <div className="meta-pill">Q <span>{qIdx+1}/{questions.length}</span></div>
        {config.timed&&config.testType!=='blitz'&&<div className="meta-pill timer-pill">⏱ <span>{formatTime(timeLeft)}</span></div>}
        <div className="meta-pill score-pill">✓ <span>{correctSoFar}</span></div>
        {streak>=3&&<div className="meta-pill streak-pill">🔥 <span>{streak}</span></div>}
      </div>

      {config.testType==='blitz'?(
        <BlitzQuestion q={q} flashState={flashState} blitzLeft={blitzLeft} blitzTime={blitzTime}
          answer={answer} onDigit={handleDigit} onDel={handleDel}/>
      ):config.testType==='mcq'?(
        <MCQQuestion q={q} choices={mcqChoices} flashState={flashState} onChoose={(c)=>{
          if(mcqState)return;
          const correct=c===q.ans;
          setMcqState({chosen:c,correct});
          setFlashState(correct?'correct-flash':'wrong-flash');
          setFloatState(correct?'show-correct':'show-wrong');
          setFloatKey(k=>k+1);
          setTimeout(()=>setFlashState(''),400);setTimeout(()=>setFloatState(''),600);
          setStreak(s=>correct?s+1:0);
          if(correct){setMastery(m=>({...m,[q.key]:(m[q.key]||0)+1}));tts.speak('Correct!',ttsCfg);}
          else tts.speak(`The answer is ${q.ans}`,ttsCfg);
          const newResults=[...results,{...q,userAns:c,correct}];setResults(newResults);
          setTimeout(()=>{
            if(qIdx+1>=questions.length){finishTest();}
            else{setQIdx(i=>i+1);setMcqChoices(makeMCQChoices(questions[qIdx+1]?.ans||1));setMcqState(null);}
          },700);
        }} mcqState={mcqState}/>
      ):(
        <ClassicQuestion q={q} flashState={flashState} answer={answer} onDigit={handleDigit} onDel={handleDel}/>
      )}
    </div>
  );
}

function ClassicQuestion({q,flashState,answer,onDigit,onDel}){
  const needed=digitCount(q.ans);
  return(<>
    <div className={`question-box ${flashState}`}>
      <div className="question-text">{q.display.replace('?','')} <span className="blank">{answer||'?'}</span></div>
      <div className="question-hint">Type answer — auto-submits after {needed} digit{needed>1?'s':''}</div>
    </div>
    <div className="numpad">
      {[7,8,9,4,5,6,1,2,3].map(n=><button key={n} className="numpad-btn" onClick={()=>onDigit(String(n))}>{n}</button>)}
      <button className="numpad-btn numpad-zero" onClick={()=>onDigit('0')}>0</button>
      <button className="numpad-btn numpad-del" onClick={onDel}>⌫</button>
    </div>
    <div className="auto-indicator"><span className="auto-dot"/><span>Auto-submits when answer is complete</span></div>
  </>);
}

function MCQQuestion({q,choices,flashState,onChoose,mcqState}){
  return(<>
    <div className={`question-box ${flashState}`}>
      <div className="question-text">{q.display.replace('= ?','= ')}<span className="blank">?</span></div>
    </div>
    <div className="mcq-options">
      {choices.map(c=>{
        let cls='';
        if(mcqState){
          if(c===q.ans)cls='correct-choice';
          else if(c===mcqState.chosen&&!mcqState.correct)cls='wrong-choice';
        }
        return<button key={c} className={`mcq-btn ${cls}`} onClick={()=>onChoose(c)}>{c}</button>;
      })}
    </div>
  </>);
}

function BlitzQuestion({q,flashState,blitzLeft,blitzTime,answer,onDigit,onDel}){
  const pct=(blitzLeft/blitzTime)*100;
  const color=pct>50?'var(--correct)':pct>25?'var(--accent)':'var(--wrong)';
  return(<>
    <div className={`blitz-display ${flashState}`}>
      <div className="blitz-fact">{q.display.replace('?',answer||'?')}</div>
      <div style={{color:'var(--text2)',fontSize:'.8rem',fontWeight:700}}>{blitzLeft}s</div>
      <div className="blitz-timer-bar">
        <div className="blitz-timer-fill" style={{width:pct+'%',background:`linear-gradient(90deg,${color},var(--accent))`}}/>
      </div>
    </div>
    <div className="numpad">
      {[7,8,9,4,5,6,1,2,3].map(n=><button key={n} className="numpad-btn" onClick={()=>onDigit(String(n))}>{n}</button>)}
      <button className="numpad-btn numpad-zero" onClick={()=>onDigit('0')}>0</button>
      <button className="numpad-btn numpad-del" onClick={onDel}>⌫</button>
    </div>
    <div className="auto-indicator"><span className="auto-dot"/><span>Auto-submits • answer before time runs out!</span></div>
  </>);
}

function TestConfig({config,setConfig,toggleTable,toggleAll,startTest}){
  return(
    <div className="fade-in">
      <div className="test-config">
        <h3>⚙️ Configure Your Test</h3>

        <div className="config-row">
          <span className="config-label">Test Type:</span>
          <div className="test-types" style={{flex:1,minWidth:0}}>
            {TEST_TYPES.map(t=>(
              <div key={t.id} className={`test-type-card${config.testType===t.id?' sel':''}`}
                onClick={()=>setConfig(c=>({...c,testType:t.id}))}>
                <div className="ttc-icon">{t.icon}</div>
                <div className="ttc-name">{t.name}</div>
                <div className="ttc-desc">{t.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="config-row">
          <span className="config-label">Tables:</span>
          <div className="tables-multiselect">
            <button className={`ts-chip ts-chip-all${config.tables.length===20?' sel':''}`} onClick={toggleAll}>All</button>
            {ALL_TABLES.map(t=><button key={t} className={`ts-chip${config.tables.includes(t)?' sel':''}`} onClick={()=>toggleTable(t)}>{t}</button>)}
          </div>
        </div>

        {config.testType!=='missing'&&<div className="config-row">
          <span className="config-label">Operation:</span>
          <select className="config-select" value={config.op} onChange={e=>setConfig(c=>({...c,op:e.target.value}))}>
            <option value="both">Both × ÷</option>
            <option value="mult">× Multiply only</option>
            <option value="div">÷ Divide only</option>
          </select>
        </div>}

        <div className="config-row">
          <span className="config-label">Questions:</span>
          <select className="config-select" value={config.count} onChange={e=>setConfig(c=>({...c,count:+e.target.value}))}>
            {[10,15,20,30,50].map(n=><option key={n} value={n}>{n}</option>)}
          </select>
        </div>

        {config.testType!=='blitz'&&<div className="config-row">
          <span className="config-label">Timed:</span>
          <button className={`op-btn${config.timed?' active':''}`} onClick={()=>setConfig(c=>({...c,timed:!c.timed}))}>
            {config.timed?'⏱ On':'🕐 Off'}
          </button>
          {config.timed&&<select className="config-select" value={config.duration} onChange={e=>setConfig(c=>({...c,duration:+e.target.value}))}>
            {[60,90,120,180,300].map(s=><option key={s} value={s}>{formatTime(s)}</option>)}
          </select>}
        </div>}
      </div>
      <div style={{textAlign:'center'}}>
        <button className="btn-primary" style={{fontSize:'1.05rem',padding:'13px 46px'}} onClick={startTest}>🚀 Start Test</button>
      </div>
    </div>
  );
}

function TestResults({results,elapsed,streak,onRetry}){
  const correct=results.filter(r=>r.correct).length;
  const pct=results.length?Math.round(correct/results.length*100):0;
  const grade=getGrade(pct);
  const missed=results.filter(r=>!r.correct);
  const maxStreak=results.reduce((acc,r,i)=>{
    if(r.correct)return {...acc,cur:acc.cur+1,max:Math.max(acc.max,acc.cur+1)};
    return {...acc,cur:0};
  },{cur:0,max:0}).max;

  return(
    <div className="fade-in" style={{textAlign:'center'}}>
      <div className="results-panel pop-in">
        <div className={`grade-badge ${grade.cls}`}>{grade.letter}</div>
        <div className="results-score">{pct}%</div>
        <div className="results-label">{grade.emoji} {pct>=90?'Outstanding!':pct>=75?'Great job!':pct>=60?'Good effort!':'Keep practising!'}</div>
        <div className="results-stats">
          <div className="stat-box correct-stat"><div className="stat-value">{correct}</div><div className="stat-desc">Correct</div></div>
          <div className="stat-box wrong-stat"><div className="stat-value">{results.length-correct}</div><div className="stat-desc">Missed</div></div>
          <div className="stat-box time-stat"><div className="stat-value">{formatTime(elapsed)}</div><div className="stat-desc">Time</div></div>
          {maxStreak>=3&&<div className="stat-box streak-stat"><div className="stat-value">🔥{maxStreak}</div><div className="stat-desc">Best Streak</div></div>}
        </div>
        {missed.length>0&&<div className="missed-list">
          <div className="missed-title">Review these:</div>
          {missed.map((m,i)=><span key={i} className="missed-item">{m.display.replace('?',m.ans)}</span>)}
        </div>}
      </div>
      <div style={{marginTop:22,display:'flex',gap:12,justifyContent:'center'}}>
        <button className="btn-primary" onClick={onRetry}>↺ Try Again</button>
      </div>
    </div>
  );
}

/* ── Progress ── */
function ProgressMode({mastery}){
  const tableScores=ALL_TABLES.map(t=>{
    let done=0;
    for(let i=1;i<=10;i++){if((mastery[`${t}x${i}`]||0)>=3)done++;}
    return{t,pct:Math.round(done/10*100),done};
  });
  const overallPct=Math.round(tableScores.reduce((a,s)=>a+s.pct,0)/20);
  const fullyMastered=tableScores.filter(s=>s.pct===100).length;

  return(
    <div className="fade-in">
      <div style={{background:'var(--surface)',border:'2px solid var(--border)',borderRadius:18,padding:22,marginBottom:18,textAlign:'center'}}>
        <div style={{color:'var(--text2)',fontSize:'.83rem',fontWeight:700,marginBottom:7}}>OVERALL MASTERY</div>
        <div style={{fontFamily:"'Baloo 2',cursive",fontSize:'4rem',fontWeight:800,
          background:'linear-gradient(135deg,var(--accent),var(--accent3))',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>
          {overallPct}%
        </div>
        <div style={{color:'var(--text2)',fontSize:'.88rem',marginTop:4}}>{fullyMastered} of 20 tables fully mastered</div>
        <div style={{margin:'11px auto 0',maxWidth:300,height:9,background:'var(--surface2)',borderRadius:5,overflow:'hidden'}}>
          <div style={{height:'100%',borderRadius:5,width:overallPct+'%',background:'linear-gradient(90deg,var(--accent3),var(--accent))',transition:'width 1s ease'}}/>
        </div>
      </div>
      <div className="mastery-section">
        <div className="mastery-title">MASTERY BY TABLE (3 correct taps = mastered)</div>
        <div className="mastery-bars">
          {tableScores.map(({t,pct,done})=>(
            <div key={t} className="mastery-row">
              <div className="mastery-table-label">×{t}</div>
              <div className="mastery-bar-track"><div className="mastery-bar-fill" style={{width:pct+'%'}}/></div>
              <div className="mastery-pct">{pct}%</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{marginTop:14,textAlign:'center'}}>
        <button className="btn-secondary" onClick={()=>{if(confirm('Reset all mastery progress?')){localStorage.removeItem('tt_mastery');location.reload();}}}>🗑 Reset Progress</button>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);

