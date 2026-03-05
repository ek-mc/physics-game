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
    `Ποιος είναι ο σωστός τύπος για θέση με χρόνο σε σταθερή επιτάχυνση a;`,
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
        const trend = Math.abs(v)>Math.abs(v0) ? 'αυξάνεται' : (Math.abs(v)<Math.abs(v0) ? 'μειώνεται' : 'μένει σταθερό');
        out.push(makeQuestion(
          'kinematics','hard',
          `Κινηματική (πρόσημα): v₀=${v0} m/s, a=${a} m/s², t=${t} s. Ποια είναι η v και τι συμβαίνει στο |v|;`,
          [
            `${fmt(v)} m/s, ${trend}`,
            `${fmt(v0-a*t)} m/s, αυξάνεται`,
            `${fmt(v0+a)} m/s, μειώνεται`,
            `${fmt(v)} m/s, μένει σταθερό`
          ],
          0,
          `Υπολογίζουμε v=v₀+at και συγκρίνουμε |v| με |v₀|.`
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
      <circle cx="${x}" cy="${y}" r="4" fill="#f59e0b"/>
      <line x1="${x}" y1="110" x2="${x}" y2="${y}" stroke="#f59e0b" stroke-dasharray="3 2"/>
      <line x1="20" y1="${y}" x2="${x}" y2="${y}" stroke="#f59e0b" stroke-dasharray="3 2"/>
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
        `Γράφημα a–F με κλίμακα για μάζα m=${m} kg: στο σημείο F=${F} N, ποια τιμή επιτάχυνσης δείχνει ο κατακόρυφος άξονας;`,
        [a, F*m, m/F, F/(m+1)].map(x=>`${fmt(x)} m/s²`),
        0,
        'Διαβάζουμε το σημείο και ισοδύναμα εφαρμόζουμε a=F/m.',
        {isGraph:true, graphSvg: makeScaledFAGraph(m, F)}
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
    ['Διαστημόπλοιο αλλάζει πορεία με σταθερό a. Ποια εξίσωση δίνει v όταν ξέρεις t;', ['v=v₀+at','x=x₀+v₀t+½at²','v²=v₀²+2aΔx','a=Δx/Δt'],0,'Για ταχύτητα με γνωστό χρόνο: v=v₀+at.'],
    ['Στρεφόμενος δίσκος: περιστρέφεται με σταθερή γωνιακή ταχύτητα. Τι είναι σταθερό;', ['ω','α','θ','τ'],0,'Σε ομαλή περιστροφή: σταθερή ω, μηδενική α.'],
    ['Τρένο χωρίς χρόνο t στο πρόβλημα. Ποια εξίσωση προτιμάς για v;', ['v²=v₀²+2aΔx','v=v₀+at','x=x₀+vt','P=dW/dt'],0,'Όταν λείπει ο χρόνος, πάμε σε v²=v₀²+2aΔx.'],
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
    'Ένας στρεφόμενος δίσκος σε μηχανισμό',
    'Ένας ανελκυστήρας σε κτίριο',
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
            `${ctx}: ξεκινά με v₀=${v0} m/s και κινείται με σταθερή επιτάχυνση a=${a} m/s² για t=${t} s. Ποια είναι η τελική ταχύτητα;`,
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
  const vtSvg = `<svg viewBox="0 0 240 120" aria-label="v-t graph"><line x1="20" y1="100" x2="220" y2="100" stroke="#94a3b8"/><line x1="20" y1="100" x2="20" y2="20" stroke="#94a3b8"/><line x1="20" y1="90" x2="200" y2="35" stroke="#22c55e" stroke-width="3"/><text x="210" y="110" fill="#94a3b8" font-size="12">t</text><text x="8" y="18" fill="#94a3b8" font-size="12">v</text></svg>`;
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
        [dx, v0+t, v0/t, t/v0].map(x=>`${fmt(x)} m`),0,
        `Εμβαδό ορθογωνίου: Δx=v·t=${fmt(dx)} m.`
      ));
    }
  }

  return out;
}


function genFormulaQuiz(){
  const out = [];
  const items = [
    ['Για τελική ταχύτητα με γνωστά v₀, a, t, ποιος τύπος είναι σωστός;', ['v=v₀+at','x=x₀+v₀t+½at²','v²=v₀²+2aΔx','P=dW/dt'],0,'Κινηματική σταθερής επιτάχυνσης.'],
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
  ...genDynamics(),
  ...genDynamicsVariety(),
  ...genDynamicsGraphs(),
  ...genRotation(),
  ...genEnergy(),
  ...genIdeaProblems(),
  ...genWordProblems(),
  ...genGraphConcepts(),
  ...genFormulaQuiz()
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
      const vPct = v.total ? v.score / v.total : 0;
      const bPct = best.total ? best.score / best.total : 0;
      if (vPct > bPct || (vPct === bPct && (v.score > best.score || (v.streak || 0) > (best.streak || 0)))) {
        best = { score: v.score || 0, total: v.total || 0, streak: v.streak || 0 };
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
    alert('Δεν υπάρχουν ερωτήσεις για αυτές τις ρυθμίσεις. Δοκίμασε άλλη δυσκολία.');
    return;
  }

  const targetCount = Math.min(config.count, src.length);
  if (config.mode === 'chapter' && (config.chapter === 'kinematics' || config.chapter === 'dynamics')) {
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


document.addEventListener('keydown', (e) => {
  if (e.code !== 'Space') return;
  const tag = (document.activeElement && document.activeElement.tagName || '').toLowerCase();
  if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
  if (quiz.classList.contains('hidden')) return;
  if (!nextBtn.disabled) {
    e.preventDefault();
    nextBtn.click();
  }
});
