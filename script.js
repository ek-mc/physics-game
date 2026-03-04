const chapters = {
  kinematics: 'Κινηματική',
  dynamics: 'Δυναμική',
  rotation: 'Περιστροφή',
  energy: 'Έργο & Ενέργεια'
};

const DIFFS = ['easy', 'medium', 'hard'];
const DIFF_LABEL = { easy: 'Easy', medium: 'Medium', hard: 'Hard', mixed: 'Μικτή' };
const DEFAULT_TIMER_SECONDS = 45;
const PREFS_KEY = 'physics-game-prefs-v1';

const homeBtn = document.getElementById('homeBtn');
const menu = document.getElementById('menu');
const quiz = document.getElementById('quiz');
const result = document.getElementById('result');
const questionEl = document.getElementById('question');
const answersEl = document.getElementById('answers');
const progressEl = document.getElementById('progress');
const scoreEl = document.getElementById('score');
const streakEl = document.getElementById('streak');
const timerEl = document.getElementById('timer');
const feedbackEl = document.getElementById('feedback');
const nextBtn = document.getElementById('nextBtn');
const backBtn = document.getElementById('backBtn');
const restartBtn = document.getElementById('restartBtn');
const resultText = document.getElementById('resultText');
const bestResultText = document.getElementById('bestResultText');
const difficultySelect = document.getElementById('difficultySelect');
const countSelect = document.getElementById('countSelect');
const timerToggle = document.getElementById('timerToggle');
const timerSecondsSelect = document.getElementById('timerSecondsSelect');
const streakToggle = document.getElementById('streakToggle');
const bankInfo = document.getElementById('bankInfo');
const bestInfo = document.getElementById('bestInfo');

function shuffle(arr){ return [...arr].sort(()=>Math.random()-0.5); }
function fmt(n){ return Number.isInteger(n) ? String(n) : n.toFixed(2).replace(/\.00$/, ''); }
function clampPositive(x){ return x <= 0 ? 1 : x; }

function makeQuestion(chapter, difficulty, q, answers, correctIndex, explanation){
  return { chapter, difficulty, q, a: answers, c: correctIndex, e: explanation };
}

function genKinematics(){
  const out = [];
  const v0s = [4,6,8,10,12,14,16,18,20,22,24,26];
  const as = [1,2,3,4,-1,-2,-3,-4];
  const ts = [2,3,4,5,6,7];
  for (const v0 of v0s){
    for (const a of as){
      for (const t of ts){
        const v = v0 + a*t;
        if (v < -20 || v > 40) continue;
        out.push(makeQuestion(
          'kinematics',
          Math.abs(a) <= 2 ? 'easy' : 'medium',
          `Σε ευθύγραμμη κίνηση με σταθερή επιτάχυνση: v₀=${v0} m/s, a=${a} m/s², t=${t} s. Ποια είναι η τελική ταχύτητα v;`,
          shuffle([v, v0 + a, v0 + t, v0 - a*t]).map(x => `${fmt(x)} m/s`),
          0,
          `Χρησιμοποιούμε v=v₀+at → v=${fmt(v)} m/s.`
        ));
      }
    }
  }

  const x0s = [0,2,5,10];
  for (const x0 of x0s){
    for (const v0 of [2,4,6,8,10,12]){
      for (const a of [1,2,3,-1,-2]){
        for (const t of [2,3,4,5]){
          const x = x0 + v0*t + 0.5*a*t*t;
          out.push(makeQuestion(
            'kinematics',
            Math.abs(a) <= 1 ? 'medium' : 'hard',
            `Ποιος είναι ο σωστός τύπος για θέση με χρόνο σε σταθερή επιτάχυνση a;`,
            ['x=x₀+v₀t+½at²','x=x₀+at','x=v/t','x=v₀+at'],
            0,
            'Σωστό: x=x₀+v₀t+½at² (σταθερή επιτάχυνση σημαίνει a σταθερή, όχι απαραίτητα 0).'
          ));
          out.push(makeQuestion(
            'kinematics',
            'medium',
            `Δίνονται x₀=${x0} m, v₀=${v0} m/s, a=${a} m/s², t=${t} s. Ποια είναι η θέση x;`,
            shuffle([x, x0 + v0*t, x0 + 0.5*a*t*t, v0 + a*t]).map(x => `${fmt(x)} m`),
            0,
            `x=x₀+v₀t+½at² = ${fmt(x)} m.`
          ));
        }
      }
    }
  }

  for (const v0 of [6,8,10,12,14,16,18,20]){
    for (const a of [1,2,3,4,-1,-2,-3]){
      for (const dx of [5,8,10,12,15,18,20]){
        const v2 = v0*v0 + 2*a*dx;
        if (v2 < 0) continue;
        const v = Math.sqrt(v2);
        out.push(makeQuestion(
          'kinematics',
          'hard',
          `Χωρίς χρόνο t: v₀=${v0} m/s, a=${a} m/s², Δx=${dx} m. Ποια είναι η τελική ταχύτητα (μέτρο) v;`,
          shuffle([v, Math.sqrt(Math.abs(v0*v0 + a*dx)), Math.sqrt(v0*v0 + 2*dx), Math.abs(v0 + a*dx)]).map(x => `${fmt(x)} m/s`),
          0,
          `Με v²=v₀²+2aΔx → v=${fmt(v)} m/s.`
        ));
      }
    }
  }

  return out;
}

function genDynamics(){
  const out = [];

  for (const m of [1,2,3,4,5,6,8,10]){
    for (const F of [5,8,10,12,15,18,20,24,30]){
      const a = F/m;
      out.push(makeQuestion(
        'dynamics',
        a <= 3 ? 'easy' : 'medium',
        `Σε οριζόντιο επίπεδο χωρίς τριβή, σώμα m=${m} kg δέχεται οριζόντια δύναμη F=${F} N. Ποια είναι η επιτάχυνση;`,
        shuffle([a, F*m, F/(m+1), m/F]).map(x => `${fmt(x)} m/s²`),
        0,
        `Σε οριζόντιο επίπεδο χωρίς τριβή: ΣF=ma ⇒ a=F/m=${fmt(a)} m/s².`
      ));
    }
  }

  for (const m of [2,3,4,5,6,8]){
    for (const F1 of [8,10,12,14,16,20]){
      for (const F2 of [3,5,7,9,11,13,15]){
        const a = (F1 - F2)/m;
        out.push(makeQuestion(
          'dynamics',
          'medium',
          `Σε οριζόντιο επίπεδο χωρίς τριβή: m=${m} kg, F₁=${F1} N (δεξιά), F₂=${F2} N (αριστερά). Ποια είναι η επιτάχυνση;`,
          shuffle([a, (F1 + F2)/m, F1/m, F2/m]).map(x => `${fmt(x)} m/s²`),
          0,
          `ΣF=F₁-F₂=${fmt(F1-F2)} N ⇒ a=${fmt(a)} m/s² (το πρόσημο δείχνει φορά).`
        ));
      }
    }
  }

  for (const m of [2,3,4,5,6]){
    for (const theta of [15,20,25,30,35,40,45]){
      const s = Math.sin(theta*Math.PI/180);
      const c = Math.cos(theta*Math.PI/180);
      const a = 10*s;
      const N = m*10*c;
      out.push(makeQuestion(
        'dynamics',
        theta <= 25 ? 'medium' : 'hard',
        `Σε κεκλιμένο επίπεδο χωρίς τριβή (θ=${theta}°), ποια είναι η επιτάχυνση κατά μήκος του επιπέδου; (g=10 m/s²)`,
        shuffle([a, 10*c, 10*Math.tan(theta*Math.PI/180), 10/theta]).map(x => `${fmt(x)} m/s²`),
        0,
        `a=g·sinθ=${fmt(a)} m/s².`
      ));
      out.push(makeQuestion(
        'dynamics',
        'hard',
        `Σε κεκλιμένο επίπεδο χωρίς τριβή: m=${m} kg, θ=${theta}°. Ποια είναι η κάθετη αντίδραση N; (g=10 m/s²)`,
        shuffle([N, m*10*s, m*10, m*10*Math.tan(theta*Math.PI/180)]).map(x => `${fmt(x)} N`),
        0,
        `N=mg·cosθ=${fmt(N)} N.`
      ));
    }
  }

  return out;
}

function genRotation(){
  const out = [];
  for (const I of [0.5,1,1.5,2,2.5,3,4,5]){
    for (const alpha of [1,2,3,4,5,6,7,8]){
      const tau = I*alpha;
      out.push(makeQuestion(
        'rotation',
        alpha <= 3 ? 'easy' : 'medium',
        `Για περιστροφή γύρω από σταθερό άξονα: I=${fmt(I)} kg·m² και α=${alpha} rad/s². Ποια ροπή τ απαιτείται;`,
        shuffle([tau, I+alpha, alpha/I, I*alpha*alpha]).map(x => `${fmt(x)} N·m`),
        0,
        `Στ=Iα ⇒ τ=${fmt(tau)} N·m.`
      ));
    }
  }

  for (const I of [0.8,1.2,1.6,2.4,3.2,4.0]){
    for (const tau of [2,4,6,8,10,12,14]){
      const alpha = tau/I;
      out.push(makeQuestion(
        'rotation',
        'medium',
        `Δίνεται ροπή τ=${tau} N·m και ροπή αδράνειας I=${fmt(I)} kg·m². Ποια είναι η γωνιακή επιτάχυνση α;`,
        shuffle([alpha, tau*I, I/tau, tau+I]).map(x => `${fmt(x)} rad/s²`),
        0,
        `α=τ/I=${fmt(alpha)} rad/s².`
      ));
    }
  }

  for (const I of [1,2,3,4,5,6,8]){
    for (const w of [2,3,4,5,6,7,8,10]){
      const L = I*w;
      out.push(makeQuestion(
        'rotation',
        'hard',
        `Για στερεό με I=${I} kg·m² και ω=${w} rad/s, ποια είναι η στροφορμή L (μέτρο);`,
        shuffle([L, I*w*w, w/I, I+w]).map(x => `${fmt(x)} kg·m²/s`),
        0,
        `L=Iω=${fmt(L)} kg·m²/s.`
      ));
    }
  }

  return out;
}

function genEnergy(){
  const out = [];
  for (const F of [5,8,10,12,15,18,20,25]){
    for (const s of [2,3,4,5,6,8,10]){
      const W = F*s;
      out.push(makeQuestion(
        'energy',
        'easy',
        `Δύναμη F=${F} N παράλληλη στη μετατόπιση s=${s} m. Ποιο είναι το έργο W;`,
        shuffle([W, F/s, F+s, F*s*s]).map(x => `${fmt(x)} J`),
        0,
        `W=F·s=${fmt(W)} J (εδώ θ=0°).`
      ));
    }
  }

  for (const F of [10,15,20,25]){
    for (const s of [4,6,8,10]){
      for (const theta of [30,45,60]){
        const W = F*s*Math.cos(theta*Math.PI/180);
        out.push(makeQuestion(
          'energy',
          'medium',
          `Δίνεται F=${F} N, s=${s} m, γωνία θ=${theta}°. Ποιο είναι το έργο W;`,
          shuffle([W, F*s, F*s*Math.sin(theta*Math.PI/180), F*Math.cos(theta*Math.PI/180)]).map(x => `${fmt(x)} J`),
          0,
          `W=F·s·cosθ=${fmt(W)} J.`
        ));
      }
    }
  }

  for (const m of [1,2,3,4,5,6]){
    for (const va of [2,3,4,5,6,7]){
      for (const vb of [4,5,6,7,8,9]){
        if (vb <= va) continue;
        const dK = 0.5*m*(vb*vb - va*va);
        out.push(makeQuestion(
          'energy',
          'hard',
          `Σώμα m=${m} kg αλλάζει ταχύτητα από vₐ=${va} m/s σε vᵦ=${vb} m/s. Ποιο είναι το συνολικό έργο;`,
          shuffle([dK, 0.5*m*(vb-va), m*(vb-va), 0.5*(vb*vb-va*va)]).map(x => `${fmt(x)} J`),
          0,
          `Θεώρημα έργου-ενέργειας: ΣW=ΔK=½m(vᵦ²-vₐ²)=${fmt(dK)} J.`
        ));
      }
    }
  }

  for (const W of [20,30,40,50,60,80,100]){
    for (const t of [2,4,5,8,10]){
      const P = W/t;
      out.push(makeQuestion(
        'energy',
        'medium',
        `Παράγεται έργο W=${W} J σε χρόνο t=${t} s. Ποια είναι η ισχύς P;`,
        shuffle([P, W*t, t/W, W+t]).map(x => `${fmt(x)} W`),
        0,
        `P=W/t=${fmt(P)} W.`
      ));
    }
  }

  return out;
}

function genGraphConcepts(){
  const out = [];
  out.push(makeQuestion('kinematics','easy',
    'Σε διάγραμμα v-t, η κλίση της ευθείας τι εκφράζει;',
    ['Επιτάχυνση', 'Θέση', 'Μετατόπιση', 'Ροπή'],0,
    'Στο v-t η κλίση είναι η επιτάχυνση a.'));
  out.push(makeQuestion('kinematics','easy',
    'Σε διάγραμμα x-t, η κλίση της καμπύλης τι εκφράζει;',
    ['Ταχύτητα', 'Επιτάχυνση', 'Δύναμη', 'Ενέργεια'],0,
    'Στο x-t η κλίση είναι η ταχύτητα v.'));
  out.push(makeQuestion('kinematics','medium',
    'Σε διάγραμμα v-t, το εμβαδό κάτω από την καμπύλη σε χρονικό διάστημα δίνει:',
    ['Μετατόπιση', 'Επιτάχυνση', 'Δύναμη', 'Ισχύ'],0,
    'Το εμβαδό κάτω από v-t δίνει τη μετατόπιση Δx.'));

  // Generate many graph-style numeric questions
  for (const a of [1,2,3,4,-1,-2,-3]){
    for (const v0 of [0,2,4,6,8,10]){
      for (const t of [2,3,4,5,6]){
        const v = v0 + a*t;
        out.push(makeQuestion('kinematics','medium',
          `Γραφικά: στο διάγραμμα v-t η γραμμή ξεκινά από v₀=${v0} m/s και έχει κλίση a=${a} m/s². Ποια είναι η v στο t=${t} s;`,
          shuffle([v, v0+a, v0+t, a*t]).map(x=>`${fmt(x)} m/s`),0,
          `Από το διάγραμμα: v=v₀+at=${fmt(v)} m/s.`
        ));
      }
    }
  }

  for (const v0 of [2,4,6,8,10,12]){
    for (const t of [2,3,4,5,6]){
      const dx = v0*t;
      out.push(makeQuestion('kinematics','easy',
        `Σε διάγραμμα v-t με σταθερή ταχύτητα v=${v0} m/s για t=${t} s, πόση είναι η μετατόπιση;`,
        shuffle([dx, v0+t, v0/t, t/v0]).map(x=>`${fmt(x)} m`),0,
        `Εμβαδό ορθογωνίου: Δx=v·t=${fmt(dx)} m.`
      ));
    }
  }

  return out;
}

const bank = [
  ...genKinematics(),
  ...genDynamics(),
  ...genRotation(),
  ...genEnergy(),
  ...genGraphConcepts()
];

let quizSet = [];
let idx = 0;
let score = 0;
let streak = 0;
let bestStreakRun = 0;
let locked = false;
let config = null;
let timerId = null;
let secondsLeft = DEFAULT_TIMER_SECONDS;
let renderedCorrectIndex = null;

function bestKey(cfg){
  return `physics-game-best-v3-${cfg.mode}-${cfg.chapter||'all'}-${cfg.difficulty}-${cfg.count}-${cfg.timer}-${cfg.timerSeconds}-${cfg.streakMode}`;
}

function getBest(cfg){
  const raw = localStorage.getItem(bestKey(cfg));
  if (!raw) return { score: 0, total: cfg.count, streak: 0 };
  try { return JSON.parse(raw); } catch { return { score: 0, total: cfg.count, streak: 0 }; }
}

function setBest(cfg, resultObj){
  const old = getBest(cfg);
  const oldPct = old.total ? old.score/old.total : 0;
  const newPct = resultObj.total ? resultObj.score/resultObj.total : 0;
  const better = newPct > oldPct || (newPct === oldPct && resultObj.score > old.score) || resultObj.streak > old.streak;
  if (better) localStorage.setItem(bestKey(cfg), JSON.stringify(resultObj));
  return better;
}

function filterBank(mode, chapter, difficulty){
  let src = mode === 'random' ? bank : bank.filter(q => q.chapter === chapter);
  if (difficulty !== 'mixed') src = src.filter(q => q.difficulty === difficulty);
  return src;
}

function savePrefs(){
  const prefs = {
    difficulty: difficultySelect.value,
    count: countSelect.value,
    timer: timerToggle.checked,
    timerSeconds: timerSecondsSelect.value,
    streak: streakToggle.checked
  };
  localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
}

function loadPrefs(){
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (!raw) return;
    const p = JSON.parse(raw);
    if (p.difficulty) difficultySelect.value = p.difficulty;
    if (p.count) countSelect.value = String(p.count);
    if (typeof p.timer === 'boolean') timerToggle.checked = p.timer;
    if (p.timerSeconds) timerSecondsSelect.value = String(p.timerSeconds);
    if (typeof p.streak === 'boolean') streakToggle.checked = p.streak;
  } catch {}
}

function updateMenuInfo(){
  const difficulty = difficultySelect.value;
  const count = Number(countSelect.value);
  const timer = timerToggle.checked;
  const timerSeconds = Number(timerSecondsSelect.value || DEFAULT_TIMER_SECONDS);
  const streakMode = streakToggle.checked;

  const byChapter = Object.keys(chapters).map(ch => {
    const list = filterBank('chapter', ch, difficulty);
    return `${chapters[ch]}: ${list.length}`;
  }).join(' | ');

  bankInfo.textContent = `Σύνολο ερωτήσεων: ${bank.length} | ${byChapter}`;
  const cfg = { mode: 'random', chapter: null, difficulty, count, timer, timerSeconds, streakMode };
  const b = getBest(cfg);
  bestInfo.textContent = `Best (τελευταίες ρυθμίσεις random): ${b.score}/${b.total} | καλύτερο streak: ${b.streak || 0}`;
}

function start(mode, chapter){
  config = {
    mode,
    chapter: chapter || null,
    difficulty: difficultySelect.value,
    count: Number(countSelect.value),
    timer: timerToggle.checked,
    timerSeconds: Number(timerSecondsSelect.value || DEFAULT_TIMER_SECONDS),
    streakMode: streakToggle.checked
  };

  let src = filterBank(mode, chapter, config.difficulty);
  if (src.length === 0) {
    alert('Δεν υπάρχουν ερωτήσεις για αυτές τις ρυθμίσεις. Δοκίμασε άλλη δυσκολία.');
    return;
  }

  quizSet = shuffle(src).slice(0, Math.min(config.count, src.length));
  idx = 0; score = 0; streak = 0; bestStreakRun = 0; locked = false;

  menu.classList.add('hidden');
  result.classList.add('hidden');
  quiz.classList.remove('hidden');
  render();
}

function showTimer(show){
  timerEl.style.visibility = show ? 'visible' : 'hidden';
}

function tickTimer(){
  timerEl.textContent = `⏱ ${secondsLeft}s`;
  timerEl.classList.toggle('low', secondsLeft <= 7 && secondsLeft > 0);
  timerEl.classList.toggle('done', secondsLeft <= 0);
  if (secondsLeft <= 0) {
    clearInterval(timerId);
    timerId = null;
    timeOutCurrent();
    return;
  }
  secondsLeft -= 1;
}

function startTimer(){
  if (!config.timer) return;
  clearInterval(timerId);
  secondsLeft = config.timerSeconds || DEFAULT_TIMER_SECONDS;
  tickTimer();
  timerId = setInterval(tickTimer, 1000);
}

function stopTimer(){
  clearInterval(timerId);
  timerId = null;
}

function render(){
  const q = quizSet[idx];
  progressEl.textContent = `Ερώτηση ${idx+1}/${quizSet.length}`;
  scoreEl.textContent = `Σκορ: ${score}`;
  streakEl.textContent = `Streak: ${streak}`;
  questionEl.textContent = q.q;
  answersEl.innerHTML='';
  feedbackEl.textContent='';
  nextBtn.disabled=true;
  locked=false;

  const options = q.a.map((text, i) => ({ text, idx: i }));
  const shuffledOptions = shuffle(options);
  renderedCorrectIndex = shuffledOptions.findIndex(x => x.idx === q.c);

  shuffledOptions.forEach((opt, i) => {
    const b = document.createElement('button');
    b.className='answer-btn';
    b.textContent = `${String.fromCharCode(65+i)}) ${opt.text}`;
    b.onclick = () => answer(i, renderedCorrectIndex, b);
    answersEl.appendChild(b);
  });

  showTimer(config.timer);
  if (config.timer) startTimer();
}

function finishRun(reason = ''){
  stopTimer();
  quiz.classList.add('hidden');
  result.classList.remove('hidden');

  const answered = reason === 'end' ? quizSet.length : Math.min(idx + 1, quizSet.length);
  const safeTotal = clampPositive(answered);
  const pct = Math.round((score / safeTotal) * 100);
  const modeLabel = config.mode === 'random' ? 'Τυχαίο' : chapters[config.chapter];

  resultText.textContent = `${modeLabel} | ${DIFF_LABEL[config.difficulty]} | Σκορ: ${score}/${safeTotal} (${pct}%). Καλύτερο streak run: ${bestStreakRun}.`;

  const improved = setBest(config, { score, total: safeTotal, streak: bestStreakRun });
  const b = getBest(config);
  bestResultText.textContent = `Best score: ${b.score}/${b.total} | Best streak: ${b.streak}${improved ? ' (νέο ρεκόρ 🎉)' : ''}`;
  updateMenuInfo();
}

function markButtons(correctIndex, clickedIndex = null){
  [...answersEl.children].forEach((b, k)=>{
    b.disabled=true;
    if (k===correctIndex) b.classList.add('correct');
    if (clickedIndex !== null && k===clickedIndex && k!==correctIndex) b.classList.add('wrong');
  });
}

function answer(clickedIndex, correctIndex, btn){
  if (locked) return;
  locked = true;
  stopTimer();

  const q = quizSet[idx];
  const correct = clickedIndex === correctIndex;

  markButtons(correctIndex, clickedIndex);

  if (correct) {
    score++;
    streak++;
    bestStreakRun = Math.max(bestStreakRun, streak);
    scoreEl.textContent = `Σκορ: ${score}`;
    streakEl.textContent = `Streak: ${streak}`;
  } else {
    streak = 0;
    streakEl.textContent = `Streak: ${streak}`;
  }

  feedbackEl.textContent = q.e;
  nextBtn.disabled = false;

  if (!correct && config.streakMode) {
    setTimeout(() => finishRun('wrong'), 700);
  }
}

function timeOutCurrent(){
  if (locked) return;
  locked = true;
  const q = quizSet[idx];
  markButtons(renderedCorrectIndex, null);
  streak = 0;
  streakEl.textContent = `Streak: ${streak}`;
  feedbackEl.textContent = `⏰ Χρόνος! ${q.e}`;
  nextBtn.disabled = false;

  if (config.streakMode) {
    setTimeout(() => finishRun('timeout'), 700);
  }
}

nextBtn.onclick = () => {
  idx++;
  if (idx >= quizSet.length) {
    finishRun('end');
  } else {
    render();
  }
};

backBtn.onclick = () => {
  stopTimer();
  quiz.classList.add('hidden');
  menu.classList.remove('hidden');
};

restartBtn.onclick = () => {
  result.classList.add('hidden');
  menu.classList.remove('hidden');
};

homeBtn.onclick = () => {
  stopTimer();
  quiz.classList.add('hidden');
  result.classList.add('hidden');
  menu.classList.remove('hidden');
};

document.querySelectorAll('#menu button').forEach(b => {
  b.onclick = () => start(b.dataset.mode, b.dataset.chapter);
});

[difficultySelect, countSelect, timerToggle, timerSecondsSelect, streakToggle].forEach(el => {
  el.addEventListener('change', () => {
    savePrefs();
    updateMenuInfo();
  });
});

loadPrefs();
updateMenuInfo();
