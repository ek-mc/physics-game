const chapters = {
 kinematics: 'Κινηματική',
 dynamics: 'Δυναμική',
 rotation: 'Περιστροφή',
 energy: 'Έργο & Ενέργεια',
 formulas: 'Τύποι (mixed)'
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
const graphBoxEl = document.getElementById('graphBox');
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
const btnK = document.getElementById('btnK');
const btnD = document.getElementById('btnD');
const btnP = document.getElementById('btnP');
const btnE = document.getElementById('btnE');
const btnT = document.getElementById('btnT');
const btnM = document.getElementById('btnM');

function shuffle(arr){ return [...arr].sort(()=>Math.random()-0.5); }
function fmt(n){ return Number.isInteger(n) ? String(n) : n.toFixed(2).replace(/\.00$/, ''); }
function clampPositive(x){ return x <= 0 ? 1 : x; }

function makeQuestion(chapter, difficulty, q, answers, correctIndex, explanation, meta = {}){
 return { chapter, difficulty, q, a: answers, c: correctIndex, e: explanation, ...meta };
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
     [v, v0 + a, v0 + t, v0 - a*t].map(x => `${fmt(x)} m/s`),
     0,
     `Χρησιμοποιούμε v=v₀+at → v=${fmt(v)} m/s.`
    ));
   }
  }
 }

 out.push(makeQuestion(
  'kinematics',
  'easy',
  `Ποιος είναι ο σωστός τύπος για τη θέση x(t) σε κίνηση με σταθερή επιτάχυνση;`,
  ['x=x₀+v₀t+½at²','x=x₀+at','x=v/t','x=v₀+at'],
  0,
  'Σωστό: x=x₀+v₀t+½at² (σταθερή επιτάχυνση σημαίνει a σταθερή, όχι απαραίτητα 0).'
 ));

 const x0s = [0,2,5,10];
 for (const x0 of x0s){
  for (const v0 of [2,4,6,8,10,12]){
   for (const a of [1,2,3,-1,-2]){
    for (const t of [2,3,4,5]){
     const x = x0 + v0*t + 0.5*a*t*t;
     out.push(makeQuestion(
      'kinematics',
      'medium',
      `Δίνονται x₀=${x0} m, v₀=${v0} m/s, a=${a} m/s², t=${t} s. Ποια είναι η θέση x;`,
      [x, x0 + v0*t, x0 + 0.5*a*t*t, v0 + a*t].map(x => `${fmt(x)} m`),
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
     [v, Math.sqrt(Math.abs(v0*v0 + a*dx)), Math.sqrt(v0*v0 + 2*dx), Math.abs(v0 + a*dx)].map(x => `${fmt(x)} m/s`),
     0,
     `Με v²=v₀²+2aΔx → v=${fmt(v)} m/s.`
    ));
   }
  }
 }

 return out;
}


function genKinematicsHardVariety(){
 const out = [];

 const methodQs = [
  ['Κινηματική (δύσκολο): Δίνονται x₀, v₀, a, t και ζητείται x. Ποια εξίσωση ξεκινάς πρώτα;', ['x=x₀+v₀t+½at²','v=v₀+at','v²=v₀²+2aΔx','a=Δv/Δt'],0,'Για θέση με γνωστό χρόνο: x=x₀+v₀t+½at².'],
  ['Κινηματική (δύσκολο): Δεν δίνεται χρόνος t και ζητείται τελική ταχύτητα. Ποια εξίσωση είναι η σωστή βάση;', ['v²=v₀²+2aΔx','v=v₀+at','x=x₀+vt','v=Δx/Δt'],0,'Χωρίς χρόνο: v²=v₀²+2aΔx.'],
  ['Κινηματική (δύσκολο): Για χρόνο ακινητοποίησης με σταθερή επιτάχυνση, ποια σχέση χρησιμοποιείς;', ['0=v₀+at','x=x₀+v₀t+½at²','v²=v₀²+2aΔx','a=0'],0,'Θέτουμε v=0 στην v=v₀+at.']
 ];
 for (const [q,a,c,e] of methodQs) out.push(makeQuestion('kinematics','hard',q,a,c,e));

 for (const v0 of [12,14,16,18,20,22]){
  for (const a of [-2,-3,-4,-5]){
   const t = -v0/a;
   const dx = v0*t + 0.5*a*t*t;
   if (t<=0 || dx<=0) continue;
   out.push(makeQuestion(
    'kinematics','hard',
    `Κινηματική (2 βήματα): v₀=${v0} m/s, a=${a} m/s². Ποια απόσταση διανύει μέχρι να σταματήσει;`,
    [dx, v0*t, Math.abs(a)*t, 0.5*Math.abs(a)*t*t].map(x=>`${fmt(x)} m`),
    0,
    `Πρώτα t_stop=-v₀/a, μετά Δx=v₀t+½at².`
   ));
  }
 }

 for (const v0 of [8,10,12,14]){
  for (const a of [-3,-2,2,3]){
   for (const t of [2,3,4]){
    const v=v0+a*t;
    out.push(makeQuestion(
     'kinematics','hard',
     `Δίνονται v₀=${v0} m/s, a=${a} m/s² και t=${t} s. Ποια είναι η τελική ταχύτητα v;`,
     [
      `${fmt(v)} m/s`,
      `${fmt(v0-a*t)} m/s`,
      `${fmt(v0+a)} m/s`,
      `${fmt(v)} m/s²`
     ],
     0,
     `Υπολογίζουμε από τον τύπο v=v₀+at.`
    ));
   }
  }
 }

 return out;
}


function genKinematicsAdvanced(){
 const out = [];

 // Κατακόρυφη κίνηση στο πεδίο βαρύτητας
 out.push(makeQuestion('kinematics','hard',
  'Κατακόρυφη κίνηση: αν διαλέξουμε προς τα πάνω θετική φορά, η επιτάχυνση βαρύτητας g έχει πρόσημο:',
  ['Αρνητικό (a=-g)','Θετικό (a=+g)','Μηδέν','Εξαρτάται από τη μάζα'],
  0,
  'Με θετική φορά προς τα πάνω, η βαρύτητα είναι προς τα κάτω => a=-g.'
 ));

 for (const v0 of [10,12,14,16,18,20]){
  const h = (v0*v0)/(2*10);
  out.push(makeQuestion('kinematics','hard',
   `Κατακόρυφη βολή προς τα πάνω με v₀=${v0} m/s (g=10). Ποιο είναι το μέγιστο ύψος;`,
   [h, v0/10, v0*v0/10, 2*h].map(x=>`${fmt(x)} m`),
   0,
   'Στο ανώτερο σημείο v=0 και v²=v₀²-2gh => h=v₀²/(2g).'
  ));

  const ttop = v0/10;
  out.push(makeQuestion('kinematics','hard',
   `Κατακόρυφη βολή προς τα πάνω με v₀=${v0} m/s (g=10). Σε πόσο χρόνο φτάνει στο ανώτερο σημείο;`,
   [ttop, v0/5, v0, v0*v0/20].map(x=>`${fmt(x)} s`),
   0,
   'Στο ανώτερο σημείο 0=v₀-gt => t=v₀/g.'
  ));
 }

 // Πλάγια βολή
 for (const v0 of [20,25,30,35]){
  for (const ang of [30,37,45,53,60]){
   const rad=Math.PI*ang/180;
   const vx=v0*Math.cos(rad);
   const vy=v0*Math.sin(rad);
   out.push(makeQuestion('kinematics','hard',
    `Πλάγια βολή: v₀=${v0} m/s, θ=${ang}°. Ποια είναι η οριζόντια συνιστώσα της αρχικής ταχύτητας (v_0x);`,
    [vx, vy, v0, v0*Math.tan(rad)].map(x=>`${fmt(x)} m/s`),
    0,
    'Ανάλυση αρχικής ταχύτητας: v_0x=v_0cosθ.'
   ));
   out.push(makeQuestion('kinematics','hard',
    `Πλάγια βολή: v₀=${v0} m/s, θ=${ang}°. Ποια είναι η κατακόρυφη συνιστώσα της αρχικής ταχύτητας (v_0y);`,
    [vy, vx, v0*Math.sin(rad/2), v0*Math.cos(rad/2)].map(x=>`${fmt(x)} m/s`),
    0,
    'Ανάλυση αρχικής ταχύτητας: v_0y=v_0sinθ.'
   ));
  }
 }

 // Κυκλική κίνηση / Ομαλή κυκλική κίνηση
 out.push(makeQuestion('kinematics','hard',
  'Ένας δίσκος περιστρέφεται γύρω από σταθερό άξονα που περνά από το κέντρο του, με σταθερή γωνιακή ταχύτητα (ομαλή περιστροφή). Ποιο μέγεθος είναι σταθερό και μη μηδενικό;',
  ['Η γωνιακή ταχύτητα ω','Η γωνιακή επιτάχυνση α','Η μεταβολή γωνίας ανά κύκλο είναι μηδέν','Το διάνυσμα ταχύτητας κάθε σημείου είναι σταθερό'],
  0,
  'Στην ομαλή περιστροφή: ω=σταθερή (και συνήθως μη μηδενική), ενώ α=0.'
 ));

 out.push(makeQuestion('kinematics','hard',
  'Δίσκος περιστρέφεται γύρω από σταθερό άξονα με σταθερή γωνιακή ταχύτητα (ομαλή περιστροφή). Ποιο μέγεθος είναι μηδενικό;',
  ['Η γωνιακή επιτάχυνση α','Η γωνιακή ταχύτητα ω','Η κεντρομόλος επιτάχυνση','Η ταχύτητα κάθε σημείου'],
  0,
  'Αφού η ω δεν αλλάζει με τον χρόνο, α=dω/dt=0.'
 ));

 for (const v of [4,6,8,10,12]){
  for (const r of [1,2,3,4,5]){
   const ac = v*v/r;
   out.push(makeQuestion('kinematics','hard',
    `Ομαλή κυκλική κίνηση: v=${v} m/s, r=${r} m. Ποιο είναι το κεντρομόλο μέτρο επιτάχυνσης;`,
    [ac, v/r, r/v, 2*v*v/r].map(x=>`${fmt(x)} m/s²`),
    0,
    'Κεντρομόλος επιτάχυνση: a_c=v²/r.'
   ));
  }
 }

 for (const T of [1,2,3,4,5]){
  const w=2*Math.PI/T;
  out.push(makeQuestion('kinematics','hard',
   `Ομαλή κυκλική κίνηση με περίοδο T=${T} s. Ποια είναι η γωνιακή ταχύτητα ω;`,
   [w, Math.PI/T, 2*T, T/(2*Math.PI)].map(x=>`${fmt(x)} rad/s`),
   0,
   'ω=2π/T.'
  ));
 }

 return out;
}


function genKinematicsWorksheetStyle(){
 const out = [];

 // Style inspired by worksheet sub-questions (i, ii, iii...)
 for (const v of [4,5,6,8,10,12]){
  for (const dt of [5,8,10,12]){
   const dx = v*dt;
   out.push(makeQuestion('kinematics','medium',
    `Άσκηση (i): Αυτοκίνητο κινείται ευθύγραμμα με σταθερή ταχύτητα v=${v} m/s. Τι είδος κίνησης κάνει;`,
    ['Ευθύγραμμη ομαλή κίνηση','Ευθύγραμμη ομαλά επιταχυνόμενη','Κυκλική ομαλή','Ταλάντωση'],
    0,
    'Σταθερή ταχύτητα σε ευθεία => ευθύγραμμη ομαλή κίνηση.'
   ));
   out.push(makeQuestion('kinematics','medium',
    `Άσκηση (ii): Για v=${v} m/s, πόση απόσταση διανύει σε Δt=${dt} s;`,
    [dx, v+dt, v/dt, dt/v].map(x=>`${fmt(x)} m`),
    0,
    'Σε ομαλή κίνηση: Δx=v·Δt.'
   ));
   out.push(makeQuestion('kinematics','medium',
    `Αυτοκίνητο κινείται ευθύγραμμα με σταθερή ταχύτητα v=${v} m/s. Ποια είναι η επιτάχυνση;`,
    ['0 m/s²','1 m/s²','v m/s²','Δt m/s²'],
    0,
    'Σταθερή ταχύτητα => a=0.'
   ));
  }
 }

 for (const v of [5,6,8,10]){
  for (const t1 of [1,2,3]){
   for (const t2 of [7,10,13]){
    if (t2 <= t1) continue;
    const dt=t2-t1;
    const dx=v*dt;
    out.push(makeQuestion('kinematics','hard',
     `Άσκηση (iv): Σε διάστημα από t=${t1} s έως t'=${t2} s, με σταθερή ταχύτητα v=${v} m/s, ποια απόσταση διανύεται;`,
     [dx, v*t2, v*t1, dt/v].map(x=>`${fmt(x)} m`),
     0,
     `Χρησιμοποιούμε Δt=t'-t=${fmt(dt)} s και Δx=v·Δt=${fmt(dx)} m.`
    ));
   }
  }
 }

 out.push(makeQuestion('kinematics','hard',
  'Άσκηση (v): Σε γράφημα απόστασης-χρόνου (x-t), η κλίση της ευθείας αντιστοιχεί σε ποιο μέγεθος;',
  ['Ταχύτητα','Επιτάχυνση','Δύναμη','Ισχύ'],
  0,
  'Η κλίση στο x-t δίνει την ταχύτητα.'
 ));

 return out;
}


function genKinematicsExamStyleSet(){
 const out = [];

 // (2) from rest with constant acceleration, two-part style
 for (const a of [1,2,3,4]){
  for (const t of [10,12,15,18]){
   const v = a*t;
   const x = 0.5*a*t*t;
   out.push(makeQuestion('kinematics','hard',
    `Μοτοσυκλέτα ξεκινά από ηρεμία με σταθερή επιτάχυνση a=${a} m/s². Ποια είναι η ταχύτητα μετά από t=${t} s;`,
    [v, a+t, t/a, 0.5*a*t].map(z=>`${fmt(z)} m/s`),0,
    'Από ηρεμία: v=at.'
   ));
   out.push(makeQuestion('kinematics','hard',
    `Σώμα ξεκινά από ηρεμία και κινείται με σταθερή επιτάχυνση a=${a} m/s². Ποια απόσταση διανύει σε t=${t} s;`,
    [x, a*t, v*t, 0.5*v*t].map(z=>`${fmt(z)} m`),0,
    'Από ηρεμία: Δx=½at².'
   ));
  }
 }

 // (3) vt graph area style
 for (const vmax of [12,16,20,24]){
  for (const tmax of [6,8,10,12]){
   const a=vmax/tmax;
   const x=(vmax*tmax)/2;
   out.push(makeQuestion('kinematics','hard',
    `Σε γράφημα v-t η ταχύτητα αυξάνει γραμμικά από 0 σε ${vmax} m/s μέχρι t=${tmax} s. Ποιο είναι το διάστημα μέχρι t=${tmax} s;`,
    [x, vmax*tmax, vmax+tmax, a*tmax].map(z=>`${fmt(z)} m`),0,
    'Εμβαδό τριγώνου στο v-t: Δx=½·base·height.'
   ));
   out.push(makeQuestion('kinematics','hard',
    `Σε γράφημα v-t όπου η ταχύτητα αυξάνει γραμμικά από 0 σε ${vmax} m/s μέχρι t=${tmax} s, ποια είναι η επιτάχυνση;`,
    [a, vmax*tmax, tmax/vmax, vmax+tmax].map(z=>`${fmt(z)} m/s²`),0,
    'Κλίση στο v-t: a=Δv/Δt.'
   ));
  }
 }

 // (4) bridge/meeting style with varied parameters
 const bridgeCases = [
  {l:180, v0:16, a:1.8, d:70},
  {l:260, v0:18, a:2.2, d:90},
  {l:340, v0:20, a:1.6, d:110},
  {l:420, v0:22, a:2.0, d:95}
 ];
 for (const c of bridgeCases){
  const {l,v0,a,d} = c;
  const tBridgeEnd = (-v0 + Math.sqrt(v0*v0 + 2*a*l))/a;
  const vmax = (d+l)/tBridgeEnd;
  out.push(makeQuestion('kinematics','hard',
   `ΙΧ εισέρχεται σε γέφυρα μήκους ${l} m με αρχική ταχύτητα v₀=${v0} m/s και σταθερή επιτάχυνση a=${a} m/s². Από το απέναντι άκρο ξεκινά φορτηγάκι σε απόσταση ${d} m από τη γέφυρα με σταθερή ταχύτητα. Ποια είναι η μέγιστη επιτρεπτή ταχύτητα του φορτηγού ώστε να μη συναντηθούν πάνω στη γέφυρα;`,
   [vmax, vmax+8, vmax/2, vmax*1.35].map(z=>`${fmt(z)} m/s`),0,
   'Οριακή περίπτωση: συναντιούνται ακριβώς στην έξοδο της γέφυρας.'
  ));
 }

 // (5) rotating dryer drum style
 for (const rpm of [600,720,780,900]){
  for (const diam of [0.5,0.66,0.8]){
   const r=diam/2;
   const f=rpm/60;
   const w=2*Math.PI*f;
   const v=w*r;
   const ac=v*v/r;
   out.push(makeQuestion('kinematics','hard',
    `Κάδος στύψεως εκτελεί ${rpm} rpm και έχει διάμετρο ${diam} m. Ποια είναι η ταχύτητα σημείου στο τοίχωμα;`,
    [v, w, r, f].map(z=>`${fmt(z)} m/s`),0,
    'v=ωr, με ω=2πf και f=rpm/60.'
   ));
   out.push(makeQuestion('kinematics','hard',
    `Κάδος στύψεως εκτελεί ${rpm} rpm και έχει διάμετρο ${diam} m. Ποια είναι η κεντρομόλος επιτάχυνση σημείου στο τοίχωμα;`,
    [ac, v/r, w/r, r*v].map(z=>`${fmt(z)} m/s²`),0,
    'a_c=v²/r (ή ω²r).'
   ));
  }
 }

 // Extra fixed scenarios from worksheet ideas (ping-pong + relative motion)
 {
  const v0 = 3;
  const ang = 35;
  const y0 = 0.5;
  const yCup = 0.2;
  const g = 10;
  const r = Math.PI * ang / 180;
  const vy = v0 * Math.sin(r);
  const a = -0.5 * g;
  const b = vy;
  const c = y0 - yCup;
  const D = b*b - 4*a*c;
  const t = Math.max(( -b + Math.sqrt(D) )/(2*a), ( -b - Math.sqrt(D) )/(2*a));
  const x = v0 * Math.cos(r) * t;
  out.push(makeQuestion('kinematics','hard',
   'Πετάς μπαλάκι πινγκ-πονγκ από ύψος 0,5 m πάνω από τραπέζι με ταχύτητα 3 m/s και γωνία 35° ως προς τον ορίζοντα, προς κύπελλο ύψους 20 cm. Σε ποια οριζόντια απόσταση πρέπει να είναι το κύπελλο; (g=10 m/s²)',
   [x, x+0.25, x-0.25, x*1.4].map(z=>`${fmt(z)} m`),
   0,
   'Λύνουμε από την κατακόρυφη κίνηση τον χρόνο που το μπαλάκι βρίσκεται στο ύψος του χείλους και μετά βρίσκουμε x=v₀cosφ·t.'
  ));
 }

 {
  const v0 = 5;
  const x = 1.0;
  const y0 = 0.6;
  const y = 0.2;
  const g = 10;
  const A = g*x*x/(2*v0*v0);
  const C = A + (y - y0);
  const D = x*x - 4*A*C;
  const u1 = (x + Math.sqrt(D)) / (2*A);
  const u2 = (x - Math.sqrt(D)) / (2*A);
  const th1 = Math.atan(u1)*180/Math.PI;
  const th2 = Math.atan(u2)*180/Math.PI;
  const th = (th1 > 10 && th1 < 80) ? th1 : th2;
  out.push(makeQuestion('kinematics','hard',
   'Μπαλάκι πινγκ-πονγκ εκτοξεύεται από ύψος 0,6 m με ταχύτητα 5 m/s και πρέπει να πέσει σε κύπελλο ύψους 20 cm που βρίσκεται 1,0 m μακριά οριζόντια. Σε ποια γωνία ως προς τον ορίζοντα πρέπει να γίνει η ρίψη; (g=10 m/s²)',
   [th, th+7, th-7, 45].map(z=>`${fmt(z)}°`),
   0,
   'Χρησιμοποιούμε την εξίσωση τροχιάς και λύνουμε ως προς tanφ.'
  ));
 }

 {
  const L = 100; // meters
  const v1 = 5;  // m/s
  const v2 = 1;  // m/s
  const xMeet = L * v1/(v1+v2);
  out.push(makeQuestion('kinematics','hard',
   'Σε γήπεδο ποδοσφαίρου μήκους 100 m, δύο άτομα ξεκινούν ταυτόχρονα από τα δύο τέρματα και κινούνται το ένα προς το άλλο. Το πρώτο κινείται με 5 m/s και το δεύτερο με 1 m/s. Σε ποια απόσταση από το πρώτο τέρμα συναντιούνται;',
   [xMeet, 100-xMeet, 50, L/(v1+v2)].map(z=>`${fmt(z)} m`),
   0,
   'Η θέση συνάντησης από την πλευρά του πρώτου είναι x=L·v1/(v1+v2).'
  ));
 }

 // (6) projectile style (general launch angle)
 for (const v0 of [10,12,14,16]){
  const g=10;
  for (const ang of [30,37,45,53,60]) {
   const r = Math.PI*ang/180;
   const R=(v0*v0*Math.sin(2*r))/g;
   const H=(v0*v0*Math.sin(r)*Math.sin(r))/(2*g);
   out.push(makeQuestion('kinematics','hard',
    `Βολή από το έδαφος με φ=${ang}° και v₀=${v0} m/s (g=10). Ποιο είναι το βεληνεκές;`,
    [R, R/2, 2*R, H].map(z=>`${fmt(z)} m`),0,
    'Γενικά: R=(v₀²·sin2φ)/g.'
   ));
   out.push(makeQuestion('kinematics','hard',
    `Βολή από το έδαφος με φ=${ang}° και v₀=${v0} m/s (g=10). Ποιο είναι το μέγιστο ύψος;`,
    [H, R, H/2, v0/10].map(z=>`${fmt(z)} m`),0,
    'Γενικά: H=(v₀²·sin²φ)/(2g).'
   ));
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
    [a, F*m, F/(m+1), m/F].map(x => `${fmt(x)} m/s²`),
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
     [a, (F1 + F2)/m, F1/m, F2/m].map(x => `${fmt(x)} m/s²`),
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
    [a, 10*c, 10*Math.tan(theta*Math.PI/180), 10/theta].map(x => `${fmt(x)} m/s²`),
    0,
    `a=g·sinθ=${fmt(a)} m/s².`
   ));
   out.push(makeQuestion(
    'dynamics',
    'hard',
    `Σε κεκλιμένο επίπεδο χωρίς τριβή: m=${m} kg, θ=${theta}°. Ποια είναι η κάθετη αντίδραση N; (g=10 m/s²)`,
    [N, m*10*s, m*10, m*10*Math.tan(theta*Math.PI/180)].map(x => `${fmt(x)} N`),
    0,
    `N=mg·cosθ=${fmt(N)} N.`
   ));
  }
 }

 return out;
}


function genDynamicsVariety(){
 const out = [];

 // Conceptual dynamics variety (not only N and friction)
 const concept = [
  ['Σε οριζόντιο επίπεδο χωρίς τριβή, αν η συνισταμένη δύναμη διπλασιαστεί και η μάζα μείνει ίδια, τι γίνεται στην επιτάχυνση;', ['Διπλασιάζεται','Μειώνεται στο μισό','Μένει ίδια','Μηδενίζεται'],0,'Από a=ΣF/m.'],
  ['Σε οριζόντιο επίπεδο χωρίς τριβή, αν η μάζα διπλασιαστεί και η συνισταμένη μείνει ίδια, η επιτάχυνση:', ['Μειώνεται στο μισό','Διπλασιάζεται','Μένει ίδια','Γίνεται μηδέν'],0,'Από a=ΣF/m.'],
  ['Αν σε σώμα δρουν αντίθετες δυνάμεις 18N και 11N, η φορά της επιτάχυνσης είναι προς:', ['Τη δύναμη των 18N','Τη δύναμη των 11N','Δεν ξέρουμε','Πάντα προς τα δεξιά'],0,'Η φορά είναι της συνισταμένης.'],
  ['Σε ισορροπία (a=0), η συνισταμένη δύναμη είναι:', ['0','mg','N','μN'],0,'Ορισμός ισορροπίας στη μεταφορική κίνηση.']
 ];
 for (const [q,a,c,e] of concept) out.push(makeQuestion('dynamics','hard',q,a,c,e));

 // Tension-like one-body pulls
 for (const m of [2,3,4,5,6,8]){
  for (const T of [6,8,10,12,15,18]){
   const a=T/m;
   out.push(makeQuestion(
    'dynamics','hard',
    `Σώμα μάζας ${m} kg πάνω σε λείο οριζόντιο επίπεδο έλκεται από τεντωμένο νήμα με τάση T=${T} N. Ποια είναι η επιτάχυνση;`,
    [a, T*m, m/T, T/(m+1)].map(x=>`${fmt(x)} m/s²`),
    0,
    'Σε λείο οριζόντιο: ΣF=T, άρα a=T/m.'
   ));
  }
 }

 // Inverse Newton problems (find mass or net force, not only acceleration)
 for (const a of [1,2,3,4,5,6]){
  for (const m of [2,3,4,5,6,8]){
   const Fnet = a*m;
   out.push(makeQuestion(
    'dynamics','hard',
    `Για σώμα με επιτάχυνση a=${a} m/s² και μάζα m=${m} kg, ποια είναι η συνισταμένη δύναμη;`,
    [Fnet, a+m, a/m, m/a].map(x=>`${fmt(x)} N`),
    0,
    'Από τον 2ο νόμο: ΣF=ma.'
   ));
  }
 }

 for (const Fnet of [6,8,10,12,15,18,20,24]){
  for (const a of [1,2,3,4,5,6]){
   const m = Fnet/a;
   out.push(makeQuestion(
    'dynamics','hard',
    `Σε σώμα ασκείται συνισταμένη δύναμη ΣF=${Fnet} N και αποκτά επιτάχυνση a=${a} m/s². Ποια είναι η μάζα;`,
    [m, Fnet*a, a/Fnet, Fnet+a].map(x=>`${fmt(x)} kg`),
    0,
    'Από ΣF=ma ⇒ m=ΣF/a.'
   ));
  }
 }

 // Two-force resultant with direction text
 for (const m of [3,4,5,6]){
  for (const F1 of [10,12,14,16,18]){
   for (const F2 of [4,6,8,10,12]){
    if (F1===F2) continue;
    const a=(F1-F2)/m;
    const dir = a>0 ? 'προς τη φορά της F1' : 'προς τη φορά της F2';
    out.push(makeQuestion(
     'dynamics','hard',
     `Σε σώμα μάζας ${m} kg ασκούνται δύο αντίθετες οριζόντιες δυνάμεις F1=${F1} N και F2=${F2} N. Τι ισχύει για την επιτάχυνση;`,
     [
      `${fmt(Math.abs(a))} m/s², ${dir}`,
      `${fmt((F1+F2)/m)} m/s², προς τη φορά της F1`,
      `${fmt(F1/m)} m/s², προς τη φορά της F2`,
      `0 m/s², ισορροπία`
     ],
     0,
     'Πρώτα βρίσκουμε ΣF=F1−F2, μετά a=ΣF/m και φορά από το πρόσημο.'
    ));
   }
  }
 }

 return out;
}

function genDynamicsGraphs(){
 const out = [];

 const makeScaledFAGraph = (m, Fmark) => {
  const aMark = Fmark / m;
  const Fmax = 24;
  const Amax = Fmax / 2; // for m>=2 in our set
  const x = 20 + (Fmark / Fmax) * 200;
  const y = 110 - (aMark / Amax) * 80;
  const tickF = [0, 6, 12, 18, 24].map(v => {
   const tx = 20 + (v / Fmax) * 200;
   return `<line x1="${tx}" y1="110" x2="${tx}" y2="114" stroke="#94a3b8"/><text x="${tx-6}" y="126" fill="#94a3b8" font-size="10">${v}</text>`;
  }).join('');
  const tickA = [0, 2, 4, 6, 8, 10, 12].map(v => {
   const ty = 110 - (v / Amax) * 80;
   return `<line x1="16" y1="${ty}" x2="20" y2="${ty}" stroke="#94a3b8"/><text x="2" y="${ty+3}" fill="#94a3b8" font-size="10">${v}</text>`;
  }).join('');

  return `<svg viewBox="0 0 260 130" aria-label="F-a graph with scale">
   <line x1="20" y1="110" x2="240" y2="110" stroke="#94a3b8"/>
   <line x1="20" y1="110" x2="20" y2="20" stroke="#94a3b8"/>
   ${tickF}
   ${tickA}
   <line x1="20" y1="110" x2="220" y2="${110 - (Fmax/m)/Amax*80}" stroke="#22c55e" stroke-width="3"/>
      <text x="244" y="114" fill="#94a3b8" font-size="12">F (N)</text>
   <text x="4" y="18" fill="#94a3b8" font-size="12">a (m/s²)</text>
  </svg>`;
 };

 const fmSvg = `<svg viewBox="0 0 260 130" aria-label="m-a graph"><line x1="20" y1="110" x2="240" y2="110" stroke="#94a3b8"/><line x1="20" y1="110" x2="20" y2="20" stroke="#94a3b8"/><path d="M30 35 Q90 65 220 98" fill="none" stroke="#22c55e" stroke-width="3"/><text x="244" y="114" fill="#94a3b8" font-size="12">m</text><text x="8" y="18" fill="#94a3b8" font-size="12">a</text></svg>`;

 out.push(makeQuestion('dynamics','hard',
  'Σε γράφημα a–m για σταθερή συνισταμένη, τι δείχνει η φθίνουσα καμπύλη;',
  ['Όσο αυξάνει η μάζα, η επιτάχυνση μειώνεται','Όσο αυξάνει η μάζα, η επιτάχυνση αυξάνει','Η μάζα δεν επηρεάζει την a','Η a είναι πάντα σταθερή'],
  0,
  'Από a=F/m για σταθερό F.',
  {isGraph:true, graphSvg: fmSvg}
 ));

 for (const m of [2,3,4,5,6]){
  for (const F of [8,10,12,15,18,20]){
   const a=F/m;
   out.push(makeQuestion('dynamics','hard',
    `Γράφημα a–F με κλίμακα για μάζα m=${m} kg: για F=${F} N, ποια τιμή επιτάχυνσης αντιστοιχεί στη γραμμή;`,
    [a, F*m, m/F, F/(m+1)].map(x=>`${fmt(x)} m/s²`),
    0,
    'Διαβάζουμε το σημείο και ισοδύναμα εφαρμόζουμε a=F/m.',
    {isGraph:true, graphSvg: makeScaledFAGraph(m, F)}
   ));
  }
 }

 return out;
}


function genDynamicsWorksheetStyle(){
 const out = [];

 // 1) Resultant from components / direction basics
 out.push(makeQuestion('dynamics','hard',
  'Άσκηση Δυναμικής (τύπου 1): Για να βρούμε τη συνισταμένη πολλών δυνάμεων στο επίπεδο, ποιο είναι το σωστό πρώτο βήμα;',
  ['Ανάλυση κάθε δύναμης σε συνιστώσες x και y','Προσθέτουμε μόνο τα μέτρα τους','Κρατάμε μόνο τη μεγαλύτερη δύναμη','Θέτουμε κατευθείαν ΣF=0'],
  0,
  'Σωστή διαδικασία: συνιστώσες ανά άξονα και μετά άθροιση.'
 ));

 // 2) Incline static equilibrium / friction coefficient
 for (const th of [20,30,37,45]){
  const r=Math.PI*th/180;
  const mu=Math.tan(r);
  out.push(makeQuestion('dynamics','hard',
   `Άσκηση Δυναμικής (τύπου 2): Σώμα ισορροπεί σε κεκλιμένο επίπεδο γωνίας φ=${th}°. Ποια είναι η ελάχιστη τιμή του συντελεστή στατικής τριβής μ_s ώστε να μην ολισθήσει;`,
   [mu, Math.sin(r), Math.cos(r), 1/mu].map(z=>`${fmt(z)}`),
   0,
   'Ισορροπία στον παράλληλο άξονα: mg sinφ ≤ μ_s mg cosφ ⇒ μ_s,min = tanφ.'
  ));
 }

 // 3) Incline moving with constant speed and applied force
 for (const th of [45]){
  const r=Math.PI*th/180;
  const mu=0.3;
  const F=15;
  const B=F/(Math.sin(r)+mu*Math.cos(r));
  const Fdown=B*(Math.sin(r)-mu*Math.cos(r));
  out.push(makeQuestion('dynamics','hard',
   'Άσκηση Δυναμικής (τύπου 3): Σώμα σε κεκλιμένο 45° κινείται προς τα πάνω με σταθερή ταχύτητα υπό δύναμη 15 N παράλληλη στο επίπεδο και μ_k=0.3. Ποιο είναι το βάρος του;',
   [B, B/2, B*2, F].map(z=>`${fmt(z)} N`),
   0,
   'Σταθερή ταχύτητα ⇒ ΣF∥=0: F = B(sinφ + μ_k cosφ).'
  ));
  out.push(makeQuestion('dynamics','hard',
   'Σώμα σε κεκλιμένο 45° έχει μ_k=0.3 και βάρος ίσο με αυτό που προκύπτει όταν προς τα πάνω κινείται με σταθερή ταχύτητα υπό δύναμη 15 N. Ποια ελάχιστη παράλληλη δύναμη χρειάζεται ώστε να κατεβαίνει με σταθερή ταχύτητα;',
   [Fdown, Fdown/2, Fdown*2, F].map(z=>`${fmt(z)} N`),
   0,
   'Για οριακή σταθερή προς τα κάτω: ΣF∥=0 με αντίθετη φορά τριβής.'
  ));
 }

 // 5) center of mass discrete masses
 out.push(makeQuestion('dynamics','hard',
  'Άσκηση Δυναμικής (τύπου 5): Μάζες 5 kg στο (0,0), 3 kg στο (0,4), 4 kg στο (3,0). Ποιο είναι το κέντρο μάζας x_cm;',
  ['1.00','1.50','0.75','2.00'],
  0,
  'x_cm=(Σm_i x_i)/(Σm_i)=12/12=1.'
 ));
 out.push(makeQuestion('dynamics','hard',
  'Για μάζες 5 kg στο (0,0), 3 kg στο (0,4), 4 kg στο (3,0), ποιο είναι το y_cm;',
  ['1.00','0.75','1.50','2.00'],
  0,
  'y_cm=(Σm_i y_i)/(Σm_i)=12/12=1.'
 ));

 // 7) recoil / momentum conservation
 const vChild=(2*8)/40;
 out.push(makeQuestion('dynamics','hard',
  'Άσκηση Δυναμικής (τύπου 7): Παιδί 40 kg σε πάγο πετά πέτρα 2 kg με ταχύτητα 8 m/s προς τα δεξιά. Ποια είναι η ταχύτητα οπισθοχώρησης του παιδιού (χωρίς τριβή);',
  [vChild, vChild/2, vChild*2, 8].map(z=>`${fmt(z)} m/s`),
  0,
  'Διατήρηση ορμής: m_π·v_π + m_παιδ·v_παιδ = 0.'
 ));

 // 8) force from Δv/Δt
 const F8=2*(-6/4);
 out.push(makeQuestion('dynamics','hard',
  'Άσκηση Δυναμικής (τύπου 8): Σώμα 2 kg από ηρεμία έχει v=-6 m/s σε t=4 s υπό σταθερή δύναμη στον άξονα x. Ποια είναι η δύναμη στον x;',
  [F8, -6/4, 2*6, 6/2].map(z=>`${fmt(z)} N`),
  0,
  'a=Δv/Δt και F=ma. Το αρνητικό πρόσημο δείχνει προς -x.'
 ));

 // 10) drag force proportional to v
 out.push(makeQuestion('dynamics','hard',
  'Άσκηση Δυναμικής (τύπου 10): Για κίνηση πλοίου με δύναμη αντίστασης F_d=-bv, ποια είναι η μορφή της ταχύτητας v(t) μετά τη βλάβη της μηχανής;',
  ['v(t)=v_0 e^{-(b/m)t}','v(t)=v_0-(b/m)t','v(t)=v_0+(b/m)t','v(t)=σταθερή'],
  0,
  'Από m dv/dt = -bv προκύπτει εκθετική απομείωση.'
 ));

 // 11) ferris wheel top/bottom force trend
 out.push(makeQuestion('dynamics','hard',
  'Άσκηση Δυναμικής (τύπου 11): Σε κυκλική κίνηση επιβάτη σε ρόδα λούνα-παρκ, συγκριτικά με το κάτω σημείο, η δύναμη του καθίσματος στο πάνω σημείο είναι:',
  ['Μικρότερη','Μεγαλύτερη','Ίση πάντα','Μηδενική πάντα'],
  0,
  'Στο πάνω σημείο η κεντρομόλος είναι προς τα κάτω, άρα N_top συνήθως μικρότερη από N_bottom.'
 ));

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
    [tau, I+alpha, alpha/I, I*alpha*alpha].map(x => `${fmt(x)} N·m`),
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
    [alpha, tau*I, I/tau, tau+I].map(x => `${fmt(x)} rad/s²`),
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
    [L, I*w*w, w/I, I+w].map(x => `${fmt(x)} kg·m²/s`),
    0,
    `L=Iω=${fmt(L)} kg·m²/s.`
   ));
  }
 }

 return out;
}


function genRotationWorksheetStyle(){
 const out = [];

 // 1) Earth angular speed / equator linear speed
 const T=24*3600;
 const w=2*Math.PI/T;
 const Re=6.4e6;
 const vEq=w*Re;
 out.push(makeQuestion('rotation','hard',
  'Ποια είναι η γωνιακή ταχύτητα της Γης (περίοδος 24 h);',
  [w, 1/T, 2*Math.PI*24, 24/T].map(x=>`${fmt(x)} rad/s`),
  0,
  'ω=2π/T.'
 ));
 out.push(makeQuestion('rotation','hard',
  'Ποια είναι η γραμμική ταχύτητα σημείου στον ισημερινό; (R=6.4×10^6 m)',
  [vEq, Re/T, 2*Math.PI*Re*T, w/Re].map(x=>`${fmt(x)} m/s`),
  0,
  'v=ωR.'
 ));

 // 2) alpha(t) -> omega(t), theta(t) forms
 out.push(makeQuestion('rotation','hard',
  'Αν α(t)=4bt^3−3ct^2 και ω(0)=ω₀, ποια μορφή έχει η ω(t);',
  ['ω(t)=ω₀+bt^4−ct^3','ω(t)=ω₀+4bt^3−3ct^2','ω(t)=ω₀+2bt^2−ct','ω(t)=ω₀+bt^5−ct^4'],
  0,
  'Ολοκλήρωση της α(t) ως προς t.'
 ));
 out.push(makeQuestion('rotation','hard',
  'Αν α(t)=4bt^3−3ct^2, ω(0)=ω₀ και θ(0)=θ₀, ποια μορφή έχει η θ(t);',
  ['θ(t)=θ₀+ω₀t+(b/5)t^5−(c/4)t^4','θ(t)=θ₀+ω₀t+bt^4−ct^3','θ(t)=θ₀+ω₀t+(b/4)t^4−(c/3)t^3','θ(t)=θ₀+ω₀t+(b/6)t^6−(c/5)t^5'],
  0,
  'Ολοκλήρωση της ω(t).'
 ));

 // 3) angular momentum components relation
 out.push(makeQuestion('rotation','hard',
  'Ποια είναι η σωστή έκφραση για τη z-συνιστώσα της στροφορμής l=r×p;',
  ['l_z=xp_y−yp_x','l_z=yp_z−zp_y','l_z=zp_x−xp_z','l_z=xp_x+yp_y'],
  0,
  'Από τον ορισμό του διανυσματικού γινομένου.'
 ));

 // 4-5 torque and angular momentum rate relation
 out.push(makeQuestion('rotation','hard',
  'Ο ρυθμός μεταβολής της στροφορμής ισούται με:',
  ['τη συνολική ροπή δύναμης (dL/dt=τ)','τη συνολική δύναμη','την ισχύ','τη μάζα επί επιτάχυνση'],
  0,
  'Βασική εξίσωση στροφικής δυναμικής.'
 ));

 // 6) moments of inertia axes
 out.push(makeQuestion('rotation','hard',
  'Σε σύστημα μαζών τοποθετημένων στο επίπεδο xy, ποια ροπή αδράνειας είναι συνήθως μεγαλύτερη: γύρω από άξονα z (κάθετο στο επίπεδο) ή γύρω από y (εντός επιπέδου);',
  ['Γύρω από z','Γύρω από y','Πάντα ίσες','Δεν συγκρίνονται'],
  0,
  'Συνήθως I_z περιλαμβάνει μεγαλύτερα τετράγωνα αποστάσεων από τον άξονα.'
 ));

 // 7) net torque direction and motion equations
 out.push(makeQuestion('rotation','hard',
  'Αν η συνολική ροπή στον δίσκο είναι σταθερή και θετική, ποια ποιοτική πρόταση είναι σωστή;',
  ['Η ω αυξάνει γραμμικά και η θ είναι παραβολική συνάρτηση του t','Η ω είναι σταθερή και η θ γραμμική','Η α είναι μηδέν','Η θ είναι σταθερή'],
  0,
  'Για σταθερή μη μηδενική α: ω(t)=ω₀+αt και θ(t)=θ₀+ω₀t+½αt².'
 ));

 // 8) composite body inertia concept
 out.push(makeQuestion('rotation','hard',
  'Σε σύστημα ράβδου + σφαίρας, η συνολική ροπή αδράνειας γύρω από άξονα είναι:',
  ['I_total=I_ράβδου+I_σφαίρας (με θεώρημα παραλλήλων όπου χρειάζεται)','I_total=I_ράβδου−I_σφαίρας','I_total=I_ράβδου/I_σφαίρας','Δεν αθροίζονται οι ροπές αδράνειας'],
  0,
  'Για σύνθετα συστήματα αθροίζουμε ροπές αδράνειας ως προς τον ίδιο άξονα.'
 ));

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
    [W, F/s, F+s, F*s*s].map(x => `${fmt(x)} J`),
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
     [W, F*s, F*s*Math.sin(theta*Math.PI/180), F*Math.cos(theta*Math.PI/180)].map(x => `${fmt(x)} J`),
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
     [dK, 0.5*m*(vb-va), m*(vb-va), 0.5*(vb*vb-va*va)].map(x => `${fmt(x)} J`),
     0,
     `Θεώρημα έργου-ενέργειας: ΣW=ΔK=½m(vᵦ²-vₐ²)=${fmt(dK)} J.`
    ));
   }
  }
 }

 // Concept questions for ΘΜΚΕ and ΑΔΜΕ
 out.push(makeQuestion(
  'energy','hard',
  'Πότε εφαρμόζουμε ΘΜΚΕ (Θεώρημα Μεταβολής Κινητικής Ενέργειας);',
  [
   'Όταν συνδέουμε το συνολικό έργο με τη μεταβολή της κινητικής ενέργειας (ΣW=ΔK)',
   'Μόνο όταν η τριβή είναι μηδέν',
   'Μόνο σε κυκλική κίνηση',
   'Μόνο όταν η ταχύτητα είναι σταθερή'
  ],
  0,
  'ΘΜΚΕ: ΣW = ΔK, γενική σχέση έργου–κινητικής ενέργειας.'
 ));

 out.push(makeQuestion(
  'energy','hard',
  'Πότε εφαρμόζουμε ΑΔΜΕ (Αρχή Διατήρησης Μηχανικής Ενέργειας);',
  [
   'Όταν δρουν μόνο διατηρητικές δυνάμεις (ή η μη-διατηρητική συνεισφορά είναι μηδενική)',
   'Όταν υπάρχει πάντα τριβή ολίσθησης',
   'Σε κάθε πρόβλημα ανεξάρτητα από δυνάμεις',
   'Μόνο αν το σώμα είναι ακίνητο αρχικά'
  ],
  0,
  'ΑΔΜΕ: K+U = σταθερό όταν δεν υπάρχει έργο μη-διατηρητικών δυνάμεων.'
 ));

 out.push(makeQuestion(
  'energy','hard',
  'Ποια σχέση εκφράζει σωστά το ΘΜΚΕ;',
  ['ΣW=ΔK', 'K+U=σταθερό', 'P=dU/dt', 'ΣF=ma'],
  0,
  'Σωστή σχέση ΘΜΚΕ: ΣW=ΔK.'
 ));

 out.push(makeQuestion(
  'energy','hard',
  'Ποια σχέση εκφράζει σωστά την ΑΔΜΕ;',
  ['K₁+U₁=K₂+U₂', 'ΣW=ΔK', 'P=F·v', 'L=Iω'],
  0,
  'ΑΔΜΕ: K+U διατηρείται.'
 ));

 for (const W of [20,30,40,50,60,80,100]){
  for (const t of [2,4,5,8,10]){
   const P = W/t;
   out.push(makeQuestion(
    'energy',
    'medium',
    `Παράγεται έργο W=${W} J σε χρόνο t=${t} s. Ποια είναι η ισχύς P;`,
    [P, W*t, t/W, W+t].map(x => `${fmt(x)} W`),
    0,
    `P=W/t=${fmt(P)} W.`
   ));
  }
 }

 return out;
}

function genIdeaProblems(){
 const out = [];

 const kin = [
  ['Όχημα φρενάρει απότομα σε βρεγμένο δρόμο. Ποιο μέγεθος δείχνει πόσο γρήγορα πέφτει η ταχύτητα;', ['Επιτάχυνση','Θέση','Μετατόπιση','Ισχύ'],0,'Η επιτάχυνση (αρνητική εδώ) μετρά τον ρυθμό μεταβολής της ταχύτητας.'],
  ['Διαστημόπλοιο κινείται σε ευθεία με σταθερή επιτάχυνση a. Ποια εξίσωση δίνει v όταν ξέρεις t;', ['v=v₀+at','x=x₀+v₀t+½at²','v²=v₀²+2aΔx','a=Δx/Δt'],0,'Για ταχύτητα με γνωστό χρόνο: v=v₀+at.'],
  ['Δίσκος περιστρέφεται γύρω από σταθερό άξονα με σταθερή γωνιακή ταχύτητα. Ποιο μέγεθος είναι σταθερό και μη μηδενικό;', ['ω','α','θ','τ'],0,'Στην ομαλή περιστροφή η ω παραμένει σταθερή (και μη μηδενική), ενώ α=0.'],
  ['Δίσκος περιστρέφεται γύρω από σταθερό άξονα με σταθερή γωνιακή ταχύτητα (ομαλή περιστροφή). Ποιο μέγεθος είναι μηδενικό;', ['α','ω','θ','τ'],0,'Αφού η ω δεν μεταβάλλεται με τον χρόνο, α=dω/dt=0.'],
  ['Τρένο κινείται σε ράγες με σταθερή επιτάχυνση και διανύει την γνωστή απόσταση από το σταθμό του Πειραιά μέχρι σταθμό της Οινόης, χωρίς να δίνεται ο χρόνος. Ποια εξίσωση είναι η πιο κατάλληλη για να βρεθεί η τελική ταχύτητα v;', ['v²=v₀²+2aΔx','v=v₀+at','x=x₀+vt','P=dW/dt'],0,'Όταν λείπει ο χρόνος, πάμε σε v²=v₀²+2aΔx.'],
  ['Τρένο κινείται με σταθερή επιτάχυνση και διανύει γνωστή απόσταση από Θεσσαλονίκη προς Λάρισα, χωρίς να δίνεται ο χρόνος. Ποια εξίσωση είναι η πιο κατάλληλη για την τελική ταχύτητα v;', ['v²=v₀²+2aΔx','v=v₀+at','x=x₀+vt','P=dW/dt'],0,'Όταν λείπει ο χρόνος, πάμε σε v²=v₀²+2aΔx.'],
  ['Τρένο κινείται με σταθερή επιτάχυνση και διανύει γνωστή απόσταση από Αθήνα προς Πάτρα, χωρίς να δίνεται ο χρόνος. Ποια εξίσωση είναι η πιο κατάλληλη για την τελική ταχύτητα v;', ['v²=v₀²+2aΔx','v=v₀+at','x=x₀+vt','P=dW/dt'],0,'Όταν λείπει ο χρόνος, πάμε σε v²=v₀²+2aΔx.'],
  ['Τρένο κινείται με σταθερή επιτάχυνση και διανύει γνωστή απόσταση από Βόλο προς Λαμία, χωρίς να δίνεται ο χρόνος. Ποια εξίσωση είναι η πιο κατάλληλη για την τελική ταχύτητα v;', ['v²=v₀²+2aΔx','v=v₀+at','x=x₀+vt','P=dW/dt'],0,'Όταν λείπει ο χρόνος, πάμε σε v²=v₀²+2aΔx.'],
  ['Αν v>0 και a<0, τι συμβαίνει συνήθως στο |v|;', ['Μειώνεται','Αυξάνεται','Μένει πάντα σταθερό','Γίνεται αρνητικό πάντα'],0,'Αντίθετα πρόσημα συνήθως σημαίνουν επιβράδυνση.']
 ];

 const dyn = [
  ['Ανελκυστήρας κινείται με σταθερή ταχύτητα. Ποια σχέση ισχύει για τη συνισταμένη;', ['ΣF=0','ΣF=ma με a>0','ΣF=mg','ΣF=T'],0,'Σταθερή ταχύτητα ⇒ a=0 ⇒ ΣF=0.'],
  ['Ένα όχημα δέχεται δύο αντίθετες οριζόντιες δυνάμεις (μία προς τα δεξιά και μία προς τα αριστερά). Ποια δύναμη καθορίζει τη φορά της επιτάχυνσης;', ['Ττη συνισταμένη (δηλαδή ποια δύναμη υπερισχύει)','Τη μάζα μόνο','Το βάρος','Την αρχική ταχύτητα'],0,'Η επιτάχυνση έχει φορά τη συνισταμένης δύναμης.'],
  ['Σε κεκλιμένο χωρίς τριβή, ποιο κομμάτι του βάρους κινεί το σώμα;', ['mg·sinθ','mg·cosθ','mg','0'],0,'Παράλληλα στο επίπεδο δρα το mg sinθ.'],
  ['Σε οριζόντιο επίπεδο χωρίς τριβή, γιατί ισχύει N=mg;', ['Δεν υπάρχει κατακόρυφη επιτάχυνση','Επειδή m=1','Επειδή δεν υπάρχει F','Επειδή v=0'],0,'Στον y άξονα: ΣFy=0 ⇒ N=mg (αν αυτές είναι οι μόνες κατακόρυφες).'],
  ['Η τριβή ολίσθησης γράφεται σωστά ως:', ['f_k=μ_kN','f=ma','f=mg','f=μm'],0,'Σωστό για ολίσθηση: f_k=μ_kN.']
 ];

 const rot = [
  ['Ποιο είναι το ανάλογο του ΣF=ma στην περιστροφή;', ['Στ=Iα','L=Iω','ΣF=Iα','W=τθ'],0,'Βασικός νόμος περιστροφικής δυναμικής: Στ=Iα.'],
  ['Τι εκφράζει η ροπή αδράνειας I;', ['Αντίσταση στη μεταβολή περιστροφής','Βάρος','Ενέργεια','Ταχύτητα'],0,'Όσο μεγαλύτερο I, τόσο πιο δύσκολα αλλάζει η ω.'],
  ['Αν διπλασιάσω I με ίδια τ, τι παθαίνει η α;', ['Υποδιπλασιάζεται','Διπλασιάζεται','Μένει ίδια','Μηδενίζεται'],0,'α=τ/I.'],
  ['Η στροφορμή στερεού γύρω από άξονα δίνεται από:', ['L=Iω','L=mv','L=τt μόνο','L=Iα'],0,'Κλασικά: L=Iω.'],
  ['Μονάδα της ροπής τ στο SI;', ['N·m','J/s','kg·m/s','W'],0,'Η ροπή μετριέται σε N·m.']
 ];

 const en = [
  ['Όταν η δύναμη είναι κάθετη στη μετατόπιση, το έργο είναι:', ['0','Μέγιστο','Αρνητικό πάντα','Ίσο με FΔx'],0,'W=FΔxcosθ και για θ=90° ⇒ W=0.'],
  ['Το θεώρημα έργου-ενέργειας λέει:', ['ΣW=ΔK','ΣW=ΔU','ΣW=0','P=ΔK'],0,'Συνολικό έργο ίσο με μεταβολή κινητικής ενέργειας.'],
  ['Η ισχύς εκφράζει:', ['Ρυθμό παραγωγής έργου','Συνολικό έργο','Δύναμη ανά μάζα','Ενέργεια ανά μετατόπιση'],0,'P=dW/dt.'],
  ['Διατηρητική δύναμη σημαίνει ότι σε κλειστή διαδρομή:', ['W=0','K=0','U=0','P=0'],0,'Ο ορισμός της διατηρητικής δύναμης.'],
  ['Αν μόνο διατηρητικές δυνάμεις δρουν, διατηρείται:', ['Μηχανική ενέργεια','Ισχύς','Ροπή','Επιτάχυνση'],0,'K+U=σταθερό.']
 ];

 for (const [q,a,c,e] of kin) out.push(makeQuestion('kinematics','easy',q,a,c,e));
 for (const [q,a,c,e] of dyn) out.push(makeQuestion('dynamics','easy',q,a,c,e));
 for (const [q,a,c,e] of rot) out.push(makeQuestion('rotation','easy',q,a,c,e));
 for (const [q,a,c,e] of en) out.push(makeQuestion('energy','easy',q,a,c,e));

 return out;
}

function genWordProblems(){
 const out = [];
 const contexts = [
  'Ένα όχημα σε ευθεία λεωφόρο',
  'Ένα διαστημόπλοιο σε δοκιμή κινητήρα',
  'Ένα καροτσάκι σε οριζόντια τροχιά',
  'Ένα τρένο σε γραμμή προαστιακού',
  'Ένας ποδηλάτης σε ευθεία διαδρομή'
 ];

 for (const ctx of contexts){
  for (const v0 of [4,6,8,10,12]){
   for (const a of [-2,-1,1,2,3]){
    for (const t of [2,3,4,5]){
     const v = v0 + a*t;
     if (v < -20 || v > 40) continue;
     out.push(makeQuestion('kinematics','medium',
      `${ctx}: ξεκινά με v₀=${v0} m/s και κινείται ευθύγραμμα με σταθερή επιτάχυνση a=${a} m/s² για t=${t} s. Ποια είναι η τελική ταχύτητα;`,
      [v, v0+a, v0+t, v0-a*t].map(x=>`${fmt(x)} m/s`),0,
      `Χρησιμοποιούμε v=v₀+at → v=${fmt(v)} m/s.`
     ));
    }
   }
  }
 }

 for (const m of [2,3,4,5,6]){
  for (const F1 of [8,10,12,14,16]){
   for (const F2 of [2,4,6,8,10]){
    const a = (F1-F2)/m;
    out.push(makeQuestion('dynamics','medium',
     `Ένα όχημα μάζας ${m} kg δέχεται προωθητική δύναμη ${F1} N και αντίσταση ${F2} N. Ποια είναι η επιτάχυνση;`,
     [a, (F1+F2)/m, F1/m, F2/m].map(x=>`${fmt(x)} m/s²`),0,
     `ΣF=F1-F2=${fmt(F1-F2)} N ⇒ a=${fmt(a)} m/s².`
    ));
   }
  }
 }

 for (const I of [1,2,3,4]){
  for (const alpha of [2,3,4,5,6]){
   const tau = I*alpha;
   out.push(makeQuestion('rotation','medium',
    `Ένας στρεφόμενος δίσκος έχει ροπή αδράνειας I=${I} kg·m² και θέλουμε γωνιακή επιτάχυνση α=${alpha} rad/s². Πόση ροπή χρειάζεται;`,
    [tau, I+alpha, alpha/I, I*alpha*alpha].map(x=>`${fmt(x)} N·m`),0,
    `Στ=Iα ⇒ τ=${fmt(tau)} N·m.`
   ));
  }
 }

 for (const m of [2,3,4,5]){
  for (const va of [2,3,4,5]){
   for (const vb of [6,7,8,9]){
    if (vb<=va) continue;
    const dK=0.5*m*(vb*vb-va*va);
    out.push(makeQuestion('energy','hard',
     `Ένα διαστημόπλοιο μάζας ${m} kg αυξάνει ταχύτητα από ${va} m/s σε ${vb} m/s. Ποιο είναι το απαιτούμενο συνολικό έργο;`,
     [dK, m*(vb-va), 0.5*(vb*vb-va*va), 0.5*m*(vb-va)].map(x=>`${fmt(x)} J`),0,
     `Θεώρημα έργου-ενέργειας: ΣW=ΔK=${fmt(dK)} J.`
    ));
   }
  }
 }

 return out;
}

function genGraphConcepts(){
 const out = [];

 const makeVtGraph = (v0 = 6, a = 1, t = 4) => {
  const vt = v0 + a * t;
  const vMin = Math.min(0, v0, vt) - 1;
  const vMax = Math.max(v0, vt, 0) + 1;
  const y = (v) => 115 - ((v - vMin) / (vMax - vMin || 1)) * 85;
  const x0 = 30;
  const xt = 215;
  const y0 = y(v0);
  const yt = y(vt);

  return `<svg viewBox="0 0 260 140" aria-label="v-t graph with scale">
   <rect x="0" y="0" width="260" height="140" fill="#020817" rx="8"/>
   <g stroke="#1e293b" stroke-width="1">
    <line x1="40" y1="30" x2="40" y2="115"/><line x1="80" y1="30" x2="80" y2="115"/><line x1="120" y1="30" x2="120" y2="115"/><line x1="160" y1="30" x2="160" y2="115"/><line x1="200" y1="30" x2="200" y2="115"/>
    <line x1="30" y1="35" x2="235" y2="35"/><line x1="30" y1="55" x2="235" y2="55"/><line x1="30" y1="75" x2="235" y2="75"/><line x1="30" y1="95" x2="235" y2="95"/>
   </g>
   <line x1="30" y1="115" x2="235" y2="115" stroke="#94a3b8" stroke-width="2"/>
   <line x1="30" y1="115" x2="30" y2="20" stroke="#94a3b8" stroke-width="2"/>
   <line x1="${x0}" y1="${y0}" x2="${xt}" y2="${yt}" stroke="#22c55e" stroke-width="4"/>
   <circle cx="${x0}" cy="${y0}" r="3.5" fill="#22c55e"/>
   <circle cx="${xt}" cy="${yt}" r="3.5" fill="#22c55e"/>
   <text x="236" y="120" fill="#94a3b8" font-size="12">t</text>
   <text x="18" y="18" fill="#94a3b8" font-size="12">v</text>
   <text x="36" y="129" fill="#64748b" font-size="10">0</text>
   <text x="8" y="${Math.max(20, Math.min(116, y0-6))}" fill="#64748b" font-size="10">v₀</text>
   <text x="206" y="128" fill="#64748b" font-size="10">t</text>
   <text x="221" y="${Math.max(18, Math.min(116, yt-6))}" fill="#64748b" font-size="10">v(t)</text>
   <text x="180" y="20" fill="#94a3b8" font-size="10">a</text>
  </svg>`;
 };

 const vtSvg = makeVtGraph();
 const xtSvg = `<svg viewBox="0 0 240 120" aria-label="x-t graph"><line x1="20" y1="100" x2="220" y2="100" stroke="#94a3b8"/><line x1="20" y1="100" x2="20" y2="20" stroke="#94a3b8"/><path d="M20 95 Q90 70 200 25" fill="none" stroke="#22c55e" stroke-width="3"/><text x="210" y="110" fill="#94a3b8" font-size="12">t</text><text x="8" y="18" fill="#94a3b8" font-size="12">x</text></svg>`;
 out.push(makeQuestion('kinematics','easy',
  'Σε διάγραμμα v-t, η κλίση της ευθείας τι εκφράζει;',
  ['Επιτάχυνση', 'Θέση', 'Μετατόπιση', 'Ροπή'],0,
  'Στο v-t η κλίση είναι η επιτάχυνση a.', {isGraph:true, graphSvg: vtSvg}));
 out.push(makeQuestion('kinematics','easy',
  'Σε διάγραμμα x-t, η κλίση της καμπύλης τι εκφράζει;',
  ['Ταχύτητα', 'Επιτάχυνση', 'Δύναμη', 'Ενέργεια'],0,
  'Στο x-t η κλίση είναι η ταχύτητα v.', {isGraph:true, graphSvg: xtSvg}));
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
     [v, v0+a, v0+t, a*t].map(x=>`${fmt(x)} m/s`),0,
     `Από το διάγραμμα: v=v₀+at=${fmt(v)} m/s.`,
     {isGraph:true, graphSvg: makeVtGraph(v0, a, t)}
    ));
   }
  }
 }

 for (const v0 of [2,4,6,8,10,12]){
  for (const t of [2,3,4,5,6]){
   const x = v0*t;
   out.push(makeQuestion('kinematics','medium',
    `Διάγραμμα x-t: ευθεία με σταθερή κλίση. Αν σε χρόνο t=${t} s το διάστημα είναι x=${x} m, ποια είναι η ταχύτητα;`,
    [v0, x/t, t/x, x+v0].map(v=>`${fmt(v)} m/s`),0,
    `Στο γράφημα x-t η κλίση είναι η ταχύτητα: v=Δx/Δt=${fmt(v0)} m/s.`,
    {isGraph:true, graphSvg: xtSvg}
   ));

   out.push(makeQuestion('kinematics','medium',
    `Διάγραμμα x-t: αν η καμπύλη είναι ευθεία με θετική κλίση, τι συμπέρασμα βγάζεις;`,
    ['Η ταχύτητα είναι σταθερή και θετική','Η επιτάχυνση είναι σταθερή και θετική','Η ταχύτητα είναι μηδέν','Η κίνηση είναι κυκλική'],0,
    'Στο x-t ευθεία => σταθερή ταχύτητα. Θετική κλίση => θετική v.',
    {isGraph:true, graphSvg: xtSvg}
   ));
  }
 }

 return out;
}



function genEnergyWorksheetStyle(){
 const out = [];

 // 1) book on table (work by force and friction)
 out.push(makeQuestion('energy','hard',
  'Βιβλίο μετατοπίζεται 1.5 m σε οριζόντιο τραπέζι από οριζόντια δύναμη F=2 N. Ποιο είναι το έργο της F;',
  ['3 J','2 J','1.5 J','0 J'],
  0,
  'W_F=F·s=2·1.5=3 J.'
 ));
 out.push(makeQuestion('energy','hard',
  'Αν η τριβή είναι T=0.4 N, ποιο είναι το έργο της τριβής για την ίδια μετατόπιση;',
  ['-0.6 J','+0.6 J','-3 J','0 J'],
  0,
  'W_τριβής=-T·s=-0.4·1.5=-0.6 J.'
 ));

 // 2) variable force from graph idea (piecewise area)
 out.push(makeQuestion('energy','hard',
  'Σε γράφημα F-x, το έργο από x1 σε x2 ισούται με:',
  ['Το εμβαδό κάτω από τη F(x)','Την κλίση της F(x)','Το μέγιστο της F','Το x2-x1 μόνο'],
  0,
  'W=∫F dx = γεωμετρικό εμβαδό στο διάγραμμα F-x.'
 ));

 // 3) dot product force-displacement
 out.push(makeQuestion('energy','hard',
  'Αν F=(6i−2j) N και s=(3i+1j) m, ποιο είναι το έργο;',
  ['16 J','20 J','12 J','10 J'],
  0,
  'W=F·s=6·3+(-2)·1=16 J.'
 ));

 // 4) cart + rope + friction + angle
 out.push(makeQuestion('energy','hard',
  'Καρότσι κινείται με σταθερή ταχύτητα σε οριζόντιο επίπεδο. Για την τάση T του σχοινιού ισχύει στον x άξονα:',
  ['T cosθ = f_k','T sinθ = f_k','T = mg','T cosθ = mg'],
  0,
  'Σταθερή ταχύτητα => ΣFx=0 => Tcosθ=f_k.'
 ));
 out.push(makeQuestion('energy','hard',
  'Το έργο του σχοινιού σε οριζόντια μετατόπιση s είναι:',
  ['W_T=T cosθ · s','W_T=T sinθ · s','W_T=Ts','W_T=0'],
  0,
  'Μόνο η οριζόντια συνιστώσα παράγει έργο στην οριζόντια μετατόπιση.'
 ));

 // 5) x(t)=t+2t^3 style
 out.push(makeQuestion('energy','hard',
  'Αν x(t)=t+2t^3, τότε v(t)= ;',
  ['1+6t²','1+2t²','t+6t²','6t'],
  0,
  'v=dx/dt=1+6t².'
 ));
 out.push(makeQuestion('energy','hard',
  'Για μάζα m, η κινητική ενέργεια είναι:',
  ['K=½m v²','K=mv','K=ma','K=F·x'],
  0,
  'Ορισμός κινητικής ενέργειας.'
 ));

 // 6) gravity path independence
 out.push(makeQuestion('energy','hard',
  'Για το βάρος, το έργο από O σε C σε διαφορετικές διαδρομές είναι:',
  ['Ίδιο, εξαρτάται μόνο από τα άκρα','Διαφορετικό σε κάθε διαδρομή','Μηδέν πάντα','Ίσο με την τριβή'],
  0,
  'Το βάρος είναι διατηρητική δύναμη (path independent).' 
 ));

 // 7) pendulum bottom speed/tension idea
 out.push(makeQuestion('energy','hard',
  'Απλό εκκρεμές που αφήνεται από γωνία θ0. Στο χαμηλότερο σημείο η ταχύτητα υπολογίζεται κυρίως από:',
  ['Διατήρηση μηχανικής ενέργειας','2ο νόμο μόνο στον εφαπτομενικό','Ορισμό ισχύος','Στατική τριβή'],
  0,
  'Μετατροπή δυναμικής σε κινητική ενέργεια.'
 ));

 // 8) ramp then rough horizontal
 out.push(makeQuestion('energy','hard',
  'Σε λείο κεκλιμένο και μετά τραχύ οριζόντιο, η ταχύτητα στη βάση του κεκλιμένου προκύπτει από:',
  ['Διατήρηση μηχανικής ενέργειας στο λείο τμήμα','ΘΜΚΕ με τριβή στο λείο','N=mg','P=Fv'],
  0,
  'Στο λείο τμήμα δεν υπάρχει απώλεια από τριβή.'
 ));

 // 9) power with constant speed and friction
 out.push(makeQuestion('energy','hard',
  'Κιβώτιο κινείται με σταθερή ταχύτητα v σε οριζόντιο με τριβή f_k. Ποια ισχύς απαιτείται από τη μηχανή;',
  ['P=f_k·v','P=mg·v','P=f_k/v','P=0'],
  0,
  'Σε σταθερή ταχύτητα, η μηχανή αντισταθμίζει την τριβή: P=F·v=f_k v.'
 ));

 return out;
}

function genFormulaQuiz(){
 const out = [];
 const items = [
  ['Για τελική ταχύτητα με γνωστά v₀, a, t, ποιος τύπος είναι σωστός;', ['v=v₀+at','x=x₀+v₀t+½at²','v²=v₀²+2aΔx','P=dW/dt'],0,'Κινηματική σταθερής επιτάχυνσης.'],
  ['Το σύμβολο a στη μηχανική συνήθως σημαίνει:', ['Επιτάχυνση','Απόσταση','Εμβαδό','Ενέργεια'],0,'a = επιτάχυνση (m/s²).'],
  ['Σε μέτρα (m) μετράμε συνήθως:', ['Μήκος/απόσταση','Ταχύτητα','Επιτάχυνση','Δύναμη'],0,'Η μονάδα m αντιστοιχεί σε μήκος/απόσταση.'],
  ['Σε m/s μετράμε συνήθως:', ['Ταχύτητα','Επιτάχυνση','Δύναμη','Ενέργεια'],0,'Η μονάδα m/s αντιστοιχεί στην ταχύτητα.'],
  ['Σε m/s² μετράμε συνήθως:', ['Επιτάχυνση','Ταχύτητα','Δύναμη','Ισχύ'],0,'Η μονάδα m/s² αντιστοιχεί στην επιτάχυνση.'],
  ['Σε N (Newton) μετράμε:', ['Δύναμη','Ενέργεια','Ισχύ','Μάζα'],0,'N είναι μονάδα δύναμης.'],
  ['Σε J (Joule) μετράμε:', ['Ενέργεια/έργο','Δύναμη','Ισχύ','Μάζα'],0,'J είναι μονάδα ενέργειας/έργου.'],
  ['Σε W (Watt) μετράμε:', ['Ισχύ','Ενέργεια','Δύναμη','Ταχύτητα'],0,'W είναι μονάδα ισχύος.'],
  ['Σε kg μετράμε:', ['Μάζα','Βάρος','Δύναμη','Επιτάχυνση'],0,'kg είναι μονάδα μάζας.'],
  ['Σε rad/s μετράμε:', ['Γωνιακή ταχύτητα','Γωνιακή επιτάχυνση','Στροφορμή','Ροπή'],0,'rad/s αντιστοιχεί στη γωνιακή ταχύτητα ω.'],
  ['Σε rad/s² μετράμε:', ['Γωνιακή επιτάχυνση','Γωνιακή ταχύτητα','Ροπή','Ισχύ'],0,'rad/s² αντιστοιχεί στη γωνιακή επιτάχυνση α.'],
  ['Σε N·m μετράμε συνήθως:', ['Ροπή δύναμης','Ισχύ','Ταχύτητα','Μάζα'],0,'N·m είναι μονάδα ροπής (και διαστατικά ενέργειας, ανάλογα context).'],

  ['Το σύμβολο v σημαίνει συνήθως:', ['Ταχύτητα','Όγκο','Τάση','Συχνότητα'],0,'v = ταχύτητα.'],
  ['Το σύμβολο x στη βασική κινηματική αναφέρεται συνήθως σε:', ['Θέση (συντεταγμένη)','Επιτάχυνση','Χρόνο','Μάζα'],0,'x = θέση/συντεταγμένη.'],
  ['Το σύμβολο t σημαίνει:', ['Χρόνο','Τάση νήματος','Θερμοκρασία πάντα','Ροπή'],0,'t = χρόνος.'],
  ['Το g κοντά στην επιφάνεια της Γης είναι:', ['Η επιτάχυνση βαρύτητας','Η παγκόσμια σταθερά G','Η γωνιακή ταχύτητα','Το βάρος'],0,'g ≈ 9.81 ή ~10 m/s².'],
  ['Το m στα περισσότερα προβλήματα μηχανικής είναι:', ['Μάζα','Μέτρο δύναμης','Μήκος τροχιάς','Ρυθμός έργου'],0,'m = μάζα σε kg.'],
  ['Το N ως μονάδα (Newton) μετρά:', ['Δύναμη','Ενέργεια','Ισχύ','Στροφορμή'],0,'Η μονάδα δύναμης είναι το Newton.'],
  ['Το P στη μηχανική συνήθως συμβολίζει:', ['Ισχύ','Ορμή','Πίεση πάντα','Περίμετρο'],0,'P = ισχύς (W) στο πλαίσιο έργου/ενέργειας.'],
  ['Το W στο κεφάλαιο έργου-ενέργειας σημαίνει συνήθως:', ['Έργο','Βάρος','Ισχύ','Ροπή'],0,'W = έργο.'],
  ['Το U στη μηχανική ενέργεια σημαίνει:', ['Δυναμική ενέργεια','Ταχύτητα','Τάση','Μονάδα'],0,'U = δυναμική ενέργεια.'],

  ['Για θέση με γνωστά x₀, v₀, a, t, ποιος τύπος είναι σωστός;', ['x=x₀+v₀t+½at²','v=v₀+at','x=x₀+vt','L=Iω'],0,'Κινηματική σταθερής επιτάχυνσης.'],
  ['Όταν δεν δίνεται χρόνος t και ζητείται v, ποιος τύπος βοηθά;', ['v²=v₀²+2aΔx','v=v₀+at','x=x₀+v₀t+½at²','a=Δx/Δt'],0,'Χωρίς t.'],
  ['2ος νόμος Newton:', ['ΣF=ma','ΣF=0','Στ=Iα','ΣW=ΔK'],0,'Βασικός νόμος δυναμικής.'],
  ['Κάθετη αντίδραση σε κεκλιμένο χωρίς τριβή:', ['N=mgcosθ','N=mgsinθ','N=mg','N=μN'],0,'Κάθετη συνιστώσα βάρους.'],
  ['Επιτάχυνση σε κεκλιμένο χωρίς τριβή:', ['a=gsinθ','a=gcosθ','a=μg','a=τ/I'],0,'Παράλληλη συνιστώσα βάρους.'],
  ['Τριβή ολίσθησης:', ['f_k=μ_kN','f_s=μ_sN πάντα','f=ma','f=mg'],0,'Μοντέλο ολίσθησης.'],
  ['Στροφορμή στερεού:', ['L=Iω','L=mv','L=Iα','L=τt μόνο'],0,'Περιστροφή.'],
  ['Νόμος περιστροφικής δυναμικής:', ['Στ=Iα','ΣF=Iα','W=FΔx','P=Fv'],0,'Ανάλογο του ΣF=ma.'],
  ['Έργο δύναμης:', ['W=FΔxcosθ','W=F/Δx','W=ma','W=Pt²'],0,'Ορισμός έργου.'],
  ['ΘΜΚΕ (Θεώρημα Μεταβολής Κινητικής Ενέργειας):', ['ΣW=ΔK','ΣW=ΔU','ΣW=0','K+U=0'],0,'Συνολικό έργο και κινητική ενέργεια.'],
  ['ΑΔΜΕ (Αρχή Διατήρησης Μηχανικής Ενέργειας):', ['K₁+U₁=K₂+U₂','ΣW=ΔK','P=dW/dt','ΣF=ma'],0,'Διατήρηση μηχανικής ενέργειας όταν δεν υπάρχει έργο μη-διατηρητικών δυνάμεων.'],
  ['Ισχύς:', ['P=dW/dt','P=W·t','P=F/a','P=ma'],0,'Ρυθμός παραγωγής έργου.']
 ];

 for (let r=0; r<12; r++) {
  for (const [q,a,c,e] of items) {
   out.push(makeQuestion('formulas', r<4?'easy':(r<8?'medium':'hard'), q, a, c, e));
  }
 }
 return out;
}


function genVeryHardMixed(){
 const out = [];

 // Multi-step kinematics (2+ operations)
 for (const v0 of [12,14,16,18]){
  for (const a of [-2,-3,-4]){
   const t=-v0/a;
   const x=v0*t+0.5*a*t*t;
   if (t<=0||x<=0) continue;
   out.push(makeQuestion('kinematics','hard',
    `Σώμα με v₀=${v0} m/s και a=${a} m/s² επιβραδύνεται μέχρι να σταματήσει. Ποια απόσταση διανύει μέχρι την ακινητοποίηση;`,
    [x, v0*t, 0.5*Math.abs(a)*t*t, x/2].map(z=>`${fmt(z)} m`),
    0,
    'Βήματα: 1) t_stop από 0=v₀+at, 2) Δx=v₀t+½at².'
   ));
  }
 }

 // Multi-step dynamics incline with friction
 for (const th of [30,37,45]){
  const r=Math.PI*th/180;
  for (const mu of [0.1,0.2,0.3]){
   const a=10*(Math.sin(r)-mu*Math.cos(r));
   out.push(makeQuestion('dynamics','hard',
    `Κεκλιμένο επίπεδο θ=${th}° με τριβή ολίσθησης μ_k=${mu}. Ποια είναι η επιτάχυνση κατά μήκος (g=10);`,
    [a, 10*Math.sin(r), 10*Math.cos(r), 10*(Math.sin(r)+mu*Math.cos(r))].map(z=>`${fmt(z)} m/s²`),
    0,
    'Βήματα: N=mgcosθ, f_k=μ_kN, μετά ΣF∥=mgsinθ−f_k=ma.'
   ));
  }
 }

 // Mixed energy + kinematics
 for (const m of [2,3,4]){
  for (const va of [2,3,4]){
   for (const vb of [7,8,9]){
    const dK=0.5*m*(vb*vb-va*va);
    out.push(makeQuestion('energy','hard',
     `Σώμα μάζας ${m} kg αυξάνει ταχύτητα από ${va} σε ${vb} m/s. Ποιο είναι το συνολικό έργο που απαιτείται;`,
     [dK, m*(vb-va), 0.5*(vb*vb-va*va), dK/2].map(z=>`${fmt(z)} J`),
     0,
     'ΘΜΚΕ: ΣW=ΔK=½m(v_b²−v_a²).'
    ));
   }
  }
 }



 // three-stage velocity profile (more diverse Nightmare kinematics)
 for (const v0 of [6,8,10]){
  for (const a1 of [2,3]){
   for (const t1 of [2,3,4]){
    for (const t2 of [2,3]){
     for (const a3 of [-1,-2]){
      const v1=v0+a1*t1;
      const v2=v1; // middle stage constant speed
      const v3=v2+a3*t2;
      out.push(makeQuestion('kinematics','hard',
       `Κίνηση 3 φάσεων: από v₀=${v0} m/s επιταχύνεται με a₁=${a1} m/s² για ${t1} s, μετά κινείται με σταθερή ταχύτητα για ${t2} s, και τέλος για ${t2} s με a₃=${a3} m/s². Ποια είναι η τελική ταχύτητα;`,
       [v3, v2, v0, v2+Math.abs(a3)*t2].map(z=>`${fmt(z)} m/s`),
       0,
       'Υπολογισμός ανά φάση με διαδοχική εφαρμογή v=v₀+at.'
      ));
     }
    }
   }
  }
 }

 // target-distance with two acceleration phases
 for (const v0 of [8,10,12]){
  for (const a1 of [1,2,3]){
   for (const t1 of [3,4,5]){
    for (const a2 of [-1,-2,-3]){
     const v1=v0+a1*t1;
     const dx1=v0*t1+0.5*a1*t1*t1;
     const t2=2;
     const dx2=v1*t2+0.5*a2*t2*t2;
     out.push(makeQuestion('kinematics','hard',
      `Σώμα κινείται σε 2 φάσεις: v₀=${v0} m/s, a₁=${a1} m/s² για t₁=${t1} s και μετά a₂=${a2} m/s² για t₂=${t2} s. Ποια είναι η συνολική μετατόπιση;`,
      [dx1+dx2, dx1, dx2, Math.abs(dx1-dx2)].map(z=>`${fmt(z)} m`),
      0,
      'Υπολογίζουμε Δx₁ και Δx₂ χωριστά και τα αθροίζουμε.'
     ));
    }
   }
  }
 }

 // Extra veryhard kinematics stems (to avoid same-template repetition)
 for (const v0 of [8,10,12,14]){
  for (const a1 of [2,3,4]){
   for (const t1 of [3,4,5]){
    const v1=v0+a1*t1;
    const dx1=v0*t1+0.5*a1*t1*t1;
    for (const a2 of [-2,-3]){
     const t2=Math.max(1, Math.ceil(v1/Math.abs(a2))/2);
     const v2=v1+a2*t2;
     const dx2=v1*t2+0.5*a2*t2*t2;
     out.push(makeQuestion('kinematics','hard',
      `Σώμα ξεκινά με v₀=${v0} m/s, επιταχύνεται για t₁=${t1} s με a₁=${a1} m/s² και μετά επιβραδύνεται για t₂=${t2} s με a₂=${a2} m/s². Ποια είναι η τελική ταχύτητα;`,
      [v2, v1, v0, v1+Math.abs(a2)*t2].map(z=>`${fmt(z)} m/s`),
      0,
      'Δύο στάδια: πρώτα v₁=v₀+a₁t₁, μετά v₂=v₁+a₂t₂.'
     ));
     out.push(makeQuestion('kinematics','hard',
      `Σώμα ξεκινά με v₀=${v0} m/s, κινείται για t₁=${t1} s με a₁=${a1} m/s² και μετά για t₂=${t2} s με a₂=${a2} m/s². Ποια είναι η συνολική μετατόπιση;`,
      [dx1+dx2, dx1, dx2, Math.abs(dx1-dx2)].map(z=>`${fmt(z)} m`),
      0,
      'Συνολικά: Δx=Δx₁+Δx₂ με Δx₁=v₀t₁+½a₁t₁² και Δx₂=v₁t₂+½a₂t₂².'
     ));
    }
   }
  }
 }

 return out;
}

function uniqueQuestions(list){
 const seen = new Set();
 const out = [];
 for (const q of list) {
  const key = `${q.chapter}|${q.difficulty}|${q.q}`;
  if (seen.has(key)) continue;
  seen.add(key);
  out.push(q);
 }
 return out;
}

function ensureUniqueAnswerOptions(q){
 const options = (q.a || []).map(x => String(x));
 if (options.length === 0) return q;

 const originalCorrectText = options[q.c] ?? options[0];
 const seen = new Set();
 const uniq = [];
 let correctIndex = -1;

 options.forEach((opt, i) => {
  if (!seen.has(opt)) {
   seen.add(opt);
   if (i === q.c) correctIndex = uniq.length;
   uniq.push(opt);
  } else if (i === q.c && correctIndex === -1) {
   correctIndex = uniq.indexOf(opt);
  }
 });

 if (correctIndex === -1) {
  if (!seen.has(originalCorrectText)) {
   uniq.unshift(originalCorrectText);
   correctIndex = 0;
   seen.add(originalCorrectText);
  } else {
   correctIndex = uniq.indexOf(originalCorrectText);
  }
 }

 const m = originalCorrectText.match(/-?\d+(?:\.\d+)?/);
 const base = m ? Number(m[0]) : null;
 const unit = m ? originalCorrectText.slice((m.index ?? 0) + m[0].length).trim() : '';

 const fnum = (x) => Number.isInteger(x) ? String(x) : x.toFixed(2).replace(/\.00$/, '');

 let tries = 0;
 while (uniq.length < 4 && tries < 40) {
  tries++;
  let candidate;
  if (base !== null && Number.isFinite(base)) {
   const mult = [0.5, 0.75, 1.25, 1.5, 2, 3][Math.floor(Math.random() * 6)];
   const sign = Math.random() < 0.5 ? 1 : -1;
   const bump = [0.1, 0.2, 0.5, 1][Math.floor(Math.random() * 4)];
   const val = Math.abs(base * mult + sign * bump);
   candidate = `${fnum(val)}${unit ? ' ' + unit : ''}`;
  } else {
   candidate = `Επιλογή ${uniq.length + 1}`;
  }
  if (!seen.has(candidate)) {
   seen.add(candidate);
   uniq.push(candidate);
  }
 }

 // Keep exactly 4 options, preserving the correct one
 let finalOpts = uniq;
 if (finalOpts.length > 4) {
  if (correctIndex >= 4) {
   const correctText = finalOpts[correctIndex];
   finalOpts = [correctText, ...finalOpts.filter((_, i) => i !== correctIndex).slice(0, 3)];
   correctIndex = 0;
  } else {
   finalOpts = finalOpts.slice(0, 4);
  }
 }

 return { ...q, a: finalOpts, c: correctIndex };
}

const bank = uniqueQuestions([
 ...genKinematics(),
 ...genKinematicsHardVariety(),
 ...genKinematicsAdvanced(),
 ...genKinematicsWorksheetStyle(),
 ...genKinematicsExamStyleSet(),
 ...genDynamics(),
 ...genDynamicsVariety(),
 ...genDynamicsWorksheetStyle(),
 ...genRotation(),
 ...genRotationWorksheetStyle(),
 ...genEnergy(),
 ...genEnergyWorksheetStyle(),
 ...genIdeaProblems(),
 ...genWordProblems(),
 ...genGraphConcepts(),
 ...genFormulaQuiz(),
 ...genVeryHardMixed()
]).map(ensureUniqueAnswerOptions);

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

function getGlobalMaxStreak(){
 const prefix = 'physics-game-best-v';
 let mx = 0;
 try {
  for (let i = 0; i < localStorage.length; i++) {
   const k = localStorage.key(i);
   if (!k || !k.startsWith(prefix)) continue;
   const raw = localStorage.getItem(k);
   if (!raw) continue;
   const v = JSON.parse(raw);
   mx = Math.max(mx, Number(v.streak || 0));
  }
 } catch {}
 return mx;
}

function getGlobalBest(){
 const prefix = 'physics-game-best-v';
 let best = { score: 0, total: 0, streak: 0 };
 try {
  for (let i = 0; i < localStorage.length; i++) {
   const k = localStorage.key(i);
   if (!k || !k.startsWith(prefix)) continue;
   const raw = localStorage.getItem(k);
   if (!raw) continue;
   const v = JSON.parse(raw);
   const vScore = Number(v.score || 0);
   const vTotal = Number(v.total || 0);
   const vStreak = Number(v.streak || 0);
   const bScore = Number(best.score || 0);
   const bTotal = Number(best.total || 0);
   const bStreak = Number(best.streak || 0);
   const vPct = vTotal ? vScore / vTotal : 0;
   const bPct = bTotal ? bScore / bTotal : 0;

   // Priority: absolute score first, then accuracy, then streak.
   if (
    vScore > bScore ||
    (vScore === bScore && (vPct > bPct || (vPct === bPct && vStreak > bStreak)))
   ) {
    best = { score: vScore, total: vTotal, streak: vStreak };
   }
  }
 } catch {}
 return best;
}

function filterBank(mode, chapter, difficulty){
 let src = mode === 'random' ? bank : bank.filter(q => q.chapter === chapter);
 if (difficulty !== 'mixed') src = src.filter(q => q.difficulty === difficulty);
 return src;
}

function stemSignature(text){
 return String(text)
  .toLowerCase()
  .replace(/[0-9]+([.,][0-9]+)?/g, 'N')
  .replace(/\s+/g, ' ')
  .trim();
}

function countUniqueStems(src){
 return new Set((src||[]).map(q => stemSignature(q.q))).size;
}

function pickDiverseQuestions(src, targetCount){
 const shuffled = shuffle(src);
 const used = new Set();
 const picked = [];

 for (const q of shuffled){
  const sig = stemSignature(q.q);
  if (used.has(sig)) continue;
  used.add(sig);
  picked.push(q);
  if (picked.length >= targetCount) return picked;
 }

 for (const q of shuffled){
  if (picked.length >= targetCount) break;
  if (!picked.includes(q)) picked.push(q);
 }

 return picked;
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
 const g = getGlobalBest();
 bestInfo.textContent = `Best (τρέχουσες ρυθμίσεις random): ${b.score}/${b.total} | streak: ${b.streak || 0} • Global best: ${g.score}/${g.total || '-'} | streak: ${g.streak || 0}`;
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
  // Graceful fallback: if selected level has no items, step down difficulty automatically
  const fallbackOrder = config.difficulty === 'hard'
   ? ['hard', 'medium', 'easy']
   : config.difficulty === 'hard'
   ? ['medium', 'easy']
   : config.difficulty === 'medium'
   ? ['easy']
   : [];

  for (const d of fallbackOrder) {
   const alt = filterBank(mode, chapter, d);
   if (alt.length > 0) {
    config.difficulty = d;
    difficultySelect.value = d;
    savePrefs();
    src = alt;
    break;
   }
  }

  if (src.length === 0) {
   alert('Δεν υπάρχουν διαθέσιμες ερωτήσεις για αυτή την ενότητα αυτή τη στιγμή.');
   return;
  }
 }

 const targetCount = Math.min(config.count, src.length);
 if (config.mode === 'chapter' && config.chapter === 'dynamics') {
  // Keep graph-mix support only in dynamics chapter.
  const graphPool = src.filter(q => q.isGraph);
  const nonGraphPool = src.filter(q => !q.isGraph);
  const minGraphs = Math.min(3, graphPool.length, targetCount);
  const pickedGraphs = pickDiverseQuestions(graphPool, minGraphs);
  const pickedNonGraphs = pickDiverseQuestions(nonGraphPool, targetCount - minGraphs);
  quizSet = shuffle([...pickedGraphs, ...pickedNonGraphs]);
 } else {
  quizSet = pickDiverseQuestions(src, targetCount);
 }
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
 if (q.graphSvg) {
  graphBoxEl.style.display = 'block';
  graphBoxEl.innerHTML = q.graphSvg;
 } else {
  graphBoxEl.style.display = 'none';
  graphBoxEl.innerHTML = '';
 }
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
 const selectedTotal = quizSet.length;
 const pct = Math.round((score / safeTotal) * 100);
 const modeLabel = config.mode === 'random' ? 'Τυχαίο' : chapters[config.chapter];
 const early = config.streakMode && reason !== 'end';

 resultText.textContent = `${modeLabel} | ${DIFF_LABEL[config.difficulty]} | Σκορ: ${score}/${safeTotal} (${pct}%).${early ? ` (Streak mode: σταμάτησε νωρίς στο ${safeTotal}/${selectedTotal})` : ` (Συνολικές ερωτήσεις: ${selectedTotal})`} Καλύτερο streak run: ${bestStreakRun}.`;

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


document.addEventListener('keydown', (e) => {
 const tag = (document.activeElement && document.activeElement.tagName || '').toLowerCase();
 if (tag === 'input' || tag === 'textarea' || tag === 'select') return;

 const inQuiz = !quiz.classList.contains('hidden');
 const inMenu = !menu.classList.contains('hidden');
 const inResult = !result.classList.contains('hidden');

 // Space behavior by screen
 if (e.code === 'Space') {
  if (inQuiz && !nextBtn.disabled) {
   e.preventDefault();
   nextBtn.click();
   return;
  }
  if (inResult) {
   e.preventDefault();
   restartBtn.click();
   return;
  }
 }

 // Menu shortcuts: K/D/P/E/T/M
 if (inMenu) {
  const key = (e.key || '').toLowerCase();
  const map = {
   k: btnK,
   d: btnD,
   p: btnP,
   e: btnE,
   t: btnT,
   m: btnM,
   'κ': btnK,
   'δ': btnD,
   'π': btnP,
   'ε': btnE,
   'τ': btnT,
   'μ': btnM
  };
  const target = map[key];
  if (target) {
   e.preventDefault();
   target.click();
   return;
  }
 }

 if (!inQuiz) return;

 // A/B/C/D physical keys -> choose option 1/2/3/4 (layout-independent)
 let idx;
 if (e.code === 'KeyA') idx = 0;
 else if (e.code === 'KeyB') idx = 1;
 else if (e.code === 'KeyC') idx = 2;
 else if (e.code === 'KeyD') idx = 3;
 else {
  // fallback by character (latin or greek letters)
  const k = (e.key || '').toLowerCase();
  idx = ({ a: 0, b: 1, c: 2, d: 3, 'α': 0, 'β': 1, 'γ': 2, 'δ': 3 })[k];
 }
 if (idx === undefined) return;
 const btns = [...answersEl.querySelectorAll('button')];
 if (!btns.length) return;
 if (btns.some(b => b.disabled)) return; // already answered
 if (idx < btns.length) {
  e.preventDefault();
  btns[idx].click();
 }
});
