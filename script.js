const bank = [
  {chapter:'kinematics',q:'Ποιος είναι ο σωστός τύπος για σταθερή επιτάχυνση;',a:['v=v₀+at','v=v₀+xt','v=v₀+at²','v=v₀+t/a'],c:0,e:'Σωστό: v=v₀+at'},
  {chapter:'kinematics',q:'Όταν δεν έχεις χρόνο t, ποιος τύπος βοηθάει;',a:['x=x₀+vt','v²=v₀²+2aΔx','v=v₀+at','a=Δx/Δt'],c:1,e:'Σωστό: v²=v₀²+2aΔx'},
  {chapter:'kinematics',q:'Αν v και a έχουν αντίθετο πρόσημο, συνήθως τι συμβαίνει;',a:['Επιτάχυνση','Επιβράδυνση','Σταθερή ταχύτητα','Δεν ξέρουμε ποτέ'],c:1,e:'Σωστό: Επιβράδυνση (μειώνεται |v|).'},
  {chapter:'dynamics',q:'Ο 2ος Νόμος Newton είναι:',a:['ΣF=0','ΣF=ma','ΣF=mv','ΣF=mg'],c:1,e:'Σωστό: ΣF=ma'},
  {chapter:'dynamics',q:'Σε οριζόντιο χωρίς τριβή: m=2kg, F=10N. a=?',a:['2 m/s²','5 m/s²','10 m/s²','20 m/s²'],c:1,e:'a=F/m=10/2=5 m/s²'},
  {chapter:'dynamics',q:'Σε κεκλιμένο χωρίς τριβή, η επιτάχυνση είναι:',a:['g cosθ','g tanθ','g sinθ','g/θ'],c:2,e:'Σωστό: a=g sinθ'},
  {chapter:'rotation',q:'Η βασική εξίσωση περιστροφικής δυναμικής είναι:',a:['Στ=Iα','ΣF=Iα','L=mv','I=mr'],c:0,e:'Σωστό: Στ=Iα'},
  {chapter:'rotation',q:'Η ροπή αδράνειας I εκφράζει κυρίως:',a:['Θερμότητα','Αντίσταση στη μεταφορική κίνηση','Αντίσταση στη μεταβολή περιστροφής','Ηλεκτρική αντίσταση'],c:2,e:'Σωστό: αντίσταση στη μεταβολή περιστροφής.'},
  {chapter:'energy',q:'Το έργο ορίζεται ως:',a:['W=F·Δr','W=F/Δr','W=mgh μόνο','W=mv'],c:0,e:'Σωστό: W=F·Δr (γενικά εσωτερικό γινόμενο).'},
  {chapter:'energy',q:'Το θεώρημα έργου-ενέργειας λέει:',a:['ΣW=ΔK','ΣW=ΔU','ΣW=0 πάντα','K=U πάντα'],c:0,e:'Σωστό: Συνολικό έργο = μεταβολή κινητικής ενέργειας.'},
  {chapter:'energy',q:'Ισχύς είναι:',a:['P=dW/dt','P=F/a','P=W·t','P=ma'],c:0,e:'Σωστό: P=dW/dt'},
  {chapter:'dynamics',q:'Σε ισορροπία στο y (χωρίς κατακόρυφη επιτάχυνση):',a:['N+mg=0','N=mg (αν μόνο αυτά δρουν)','N=0 πάντα','mg=0'],c:1,e:'Σωστό: N=mg όταν μόνο αυτές οι κατακόρυφες δυνάμεις υπάρχουν.'},
  {chapter:'kinematics',q:'Ποιος τύπος δίνει θέση με χρόνο σε σταθερή a;',a:['x=x₀+v₀t+½at²','x=x₀+at','x=v/t','x=v₀+at'],c:0,e:'Σωστό: x=x₀+v₀t+½at²'}
];

const menu = document.getElementById('menu');
const quiz = document.getElementById('quiz');
const result = document.getElementById('result');
const questionEl = document.getElementById('question');
const answersEl = document.getElementById('answers');
const progressEl = document.getElementById('progress');
const scoreEl = document.getElementById('score');
const feedbackEl = document.getElementById('feedback');
const nextBtn = document.getElementById('nextBtn');
const backBtn = document.getElementById('backBtn');
const restartBtn = document.getElementById('restartBtn');
const resultText = document.getElementById('resultText');

let quizSet = [], idx = 0, score = 0, locked = false;

function shuffle(arr){ return [...arr].sort(()=>Math.random()-0.5); }
function pick(mode, chapter){
  const src = mode==='random' ? bank : bank.filter(x=>x.chapter===chapter);
  return shuffle(src).slice(0, Math.min(10, src.length));
}

function start(mode, chapter){
  quizSet = pick(mode, chapter); idx=0; score=0; locked=false;
  menu.classList.add('hidden'); result.classList.add('hidden'); quiz.classList.remove('hidden');
  render();
}

function render(){
  const q = quizSet[idx];
  progressEl.textContent = `Ερώτηση ${idx+1}/${quizSet.length}`;
  scoreEl.textContent = `Σκορ: ${score}`;
  questionEl.textContent = q.q;
  answersEl.innerHTML=''; feedbackEl.textContent=''; nextBtn.disabled=true; locked=false;
  q.a.forEach((opt,i)=>{
    const b=document.createElement('button'); b.className='answer-btn'; b.textContent=String.fromCharCode(65+i)+') '+opt;
    b.onclick=()=>answer(i,b); answersEl.appendChild(b);
  });
}

function answer(i,btn){
  if(locked) return; locked=true;
  const q = quizSet[idx];
  [...answersEl.children].forEach((b,k)=>{
    b.disabled=true;
    if(k===q.c) b.classList.add('correct');
  });
  if(i===q.c){ score++; scoreEl.textContent=`Σκορ: ${score}`; }
  else btn.classList.add('wrong');
  feedbackEl.textContent = q.e;
  nextBtn.disabled=false;
}

nextBtn.onclick=()=>{
  idx++;
  if(idx>=quizSet.length){
    quiz.classList.add('hidden'); result.classList.remove('hidden');
    const pct = Math.round((score/quizSet.length)*100);
    resultText.textContent = `Πέτυχες ${score}/${quizSet.length} (${pct}%).`;
  } else render();
};

backBtn.onclick=()=>{ quiz.classList.add('hidden'); menu.classList.remove('hidden'); };
restartBtn.onclick=()=>{ result.classList.add('hidden'); menu.classList.remove('hidden'); };

document.querySelectorAll('#menu button').forEach(b=>{
  b.onclick=()=>start(b.dataset.mode,b.dataset.chapter);
});
