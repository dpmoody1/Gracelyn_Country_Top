// ==========================================
// Country Tops - School Learning Hub Engine
// ==========================================

// --- Web Audio API Synth Engine ---
let audioCtx = null;

function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
}

function playSound(type) {
  try {
    initAudio();
    if (!audioCtx) return;
    
    // Resume context if suspended (browser security)
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    
    const time = audioCtx.currentTime;
    
    switch (type) {
      case 'click': {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(300, time);
        osc.frequency.exponentialRampToValueAtTime(600, time + 0.08);
        
        gain.gain.setValueAtTime(0.15, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.08);
        
        osc.start(time);
        osc.stop(time + 0.08);
        break;
      }
      case 'correct': {
        const osc1 = audioCtx.createOscillator();
        const osc2 = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc1.type = 'sine';
        osc2.type = 'sine';
        
        osc1.frequency.setValueAtTime(523.25, time); // C5
        osc2.frequency.setValueAtTime(659.25, time); // E5
        osc1.frequency.setValueAtTime(783.99, time + 0.1); // G5
        osc2.frequency.setValueAtTime(1046.50, time + 0.1); // C6
        
        gain.gain.setValueAtTime(0.12, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.3);
        
        osc1.start(time);
        osc2.start(time);
        osc1.stop(time + 0.35);
        osc2.stop(time + 0.35);
        break;
      }
      case 'incorrect': {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, time);
        osc.frequency.linearRampToValueAtTime(100, time + 0.2);
        
        gain.gain.setValueAtTime(0.15, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.25);
        
        osc.start(time);
        osc.stop(time + 0.25);
        break;
      }
      case 'cheer': {
        // Star rewards / game completion chord progression
        const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5 chord arpeggio
        notes.forEach((freq, idx) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, time + idx * 0.08);
          osc.frequency.exponentialRampToValueAtTime(freq * 1.5, time + idx * 0.08 + 0.4);
          
          gain.gain.setValueAtTime(0.08, time + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, time + idx * 0.08 + 0.45);
          
          osc.start(time + idx * 0.08);
          osc.stop(time + idx * 0.08 + 0.5);
        });
        break;
      }
      case 'soccer-kick': {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(120, time);
        osc.frequency.exponentialRampToValueAtTime(40, time + 0.15);
        
        gain.gain.setValueAtTime(0.25, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.18);
        
        osc.start(time);
        osc.stop(time + 0.2);
        break;
      }
      case 'soccer-goal': {
        // Whistle + synthesised crowd noise
        // Whistle
        const whistleOsc = audioCtx.createOscillator();
        const whistleGain = audioCtx.createGain();
        whistleOsc.connect(whistleGain);
        whistleGain.connect(audioCtx.destination);
        whistleOsc.type = 'sine';
        whistleOsc.frequency.setValueAtTime(1500, time);
        whistleOsc.frequency.setValueAtTime(1800, time + 0.08);
        whistleOsc.frequency.setValueAtTime(1500, time + 0.16);
        whistleGain.gain.setValueAtTime(0.08, time);
        whistleGain.gain.exponentialRampToValueAtTime(0.001, time + 0.35);
        whistleOsc.start(time);
        whistleOsc.stop(time + 0.35);

        // Synth Goal noise
        const bufferSize = audioCtx.sampleRate * 0.8;
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1; // White noise
        }
        
        const noiseNode = audioCtx.createBufferSource();
        noiseNode.buffer = buffer;
        
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(300, time);
        filter.frequency.exponentialRampToValueAtTime(1500, time + 0.3);
        filter.frequency.exponentialRampToValueAtTime(400, time + 0.7);
        
        const noiseGain = audioCtx.createGain();
        noiseGain.gain.setValueAtTime(0.18, time);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, time + 0.78);
        
        noiseNode.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(audioCtx.destination);
        
        noiseNode.start(time);
        noiseNode.stop(time + 0.8);
        break;
      }
    }
  } catch (err) {
    console.log("Audio synthesis error: ", err);
  }
}

// --- Confetti Animation Engine ---
const canvas = document.getElementById('confetti-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let animationId = null;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class ConfettiParticle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * -100 - 20;
    this.radius = Math.random() * 8 + 4;
    this.color = ['#2D6A4F', '#C5A059', '#F2A1A8', '#E5838B', '#FAF7F0', '#FFD166'][Math.floor(Math.random() * 6)];
    this.vx = Math.random() * 4 - 2;
    this.vy = Math.random() * 6 + 4;
    this.rotation = Math.random() * 360;
    this.rotationSpeed = Math.random() * 4 - 2;
    this.opacity = 1;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.rotation += this.rotationSpeed;
    if (this.y > canvas.height) {
      this.opacity = 0;
    }
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.opacity;
    
    // Draw polygon or circle
    ctx.beginPath();
    ctx.rect(-this.radius, -this.radius, this.radius * 2, this.radius * 2);
    ctx.fill();
    ctx.restore();
  }
}

function startConfetti() {
  particles = [];
  for (let i = 0; i < 120; i++) {
    particles.push(new ConfettiParticle());
  }
  
  if (animationId) cancelAnimationFrame(animationId);
  animateConfetti();
}

function animateConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  let livingParticles = false;
  
  particles.forEach(p => {
    p.update();
    p.draw();
    if (p.opacity > 0) livingParticles = true;
  });
  
  if (livingParticles) {
    animationId = requestAnimationFrame(animateConfetti);
  } else {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

// --- 65 Lessons Database (HARDER QUESTIONS) ---
const lessonsData = [
  // ==================== MATH (17) ====================
  // Preschool Math
  {
    id: 1,
    title: "Counting Happy Apples",
    subject: "math",
    grade: "preschool",
    description: "Help Miss Grace count the shiny red apples on the tree!",
    type: "quiz",
    content: {
      question: "How many red apples are on this branch? 🍎 🍎 🍎 🍎",
      options: ["2", "3", "4", "5"],
      answer: "4"
    }
  },
  {
    id: 2,
    title: "Shape Detective",
    subject: "math",
    grade: "preschool",
    description: "Look closely at the items around the room. Which shape looks like a wheel?",
    type: "quiz",
    content: {
      question: "What shape is a bicycle wheel or a round cookie?",
      options: ["Triangle ▲", "Square ■", "Circle ●", "Star ★"],
      answer: "Circle ●"
    }
  },
  // Kindergarten Math
  {
    id: 3,
    title: "Adding Gold Stars",
    subject: "math",
    grade: "kindergarten",
    description: "Add the gold stars together to get the total!",
    type: "quiz",
    content: {
      question: "What is 2 stars (★★) plus 3 stars (★★★)?",
      options: ["3 stars", "4 stars", "5 stars", "6 stars"],
      answer: "5 stars"
    }
  },
  {
    id: 4,
    title: "Pop the Pink Balloons",
    subject: "math",
    grade: "kindergarten",
    description: "We are subtracting! Pop some balloons and see what remains.",
    type: "quiz",
    content: {
      question: "You have 5 balloons. 2 of them pop! How many balloons are left?",
      options: ["2 balloons", "3 balloons", "4 balloons", "7 balloons"],
      answer: "3 balloons"
    }
  },
  // 1st Grade Math
  {
    id: 5,
    title: "Tens and Ones",
    subject: "math",
    grade: "grade1",
    description: "Explore the place value system with tens and ones columns.",
    type: "quiz",
    content: {
      question: "What number has 1 Ten and 7 Ones?",
      options: ["107", "71", "17", "8"],
      answer: "17"
    }
  },
  {
    id: 6,
    title: "Reading Clock Time",
    subject: "math",
    grade: "grade1",
    description: "Read the hands on the school clock.",
    type: "quiz",
    content: {
      question: "If the hour hand points to 3 and the minute hand points to 12, what time is it?",
      options: ["12:03", "3:00", "3:30", "12:15"],
      answer: "3:00"
    }
  },
  // 2nd Grade Math - HARDER
  {
    id: 7,
    title: "Skip Counting by 5s",
    subject: "math",
    grade: "grade2",
    description: "Fill in the blank by skipping by five each time.",
    type: "puzzle",
    content: {
      question: "Click the missing number to complete the skip counting sequence: 5, 10, 15, __, 25",
      items: [18, 20, 22, 30],
      answer: [20]
    }
  },
  {
    id: 8,
    title: "Greater or Less Than",
    subject: "math",
    grade: "grade2",
    description: "Compare these two double-digit numbers.",
    type: "quiz",
    content: {
      question: "Fill in the box: 45 [ ? ] 54",
      options: ["is greater than (>)", "is less than (<)", "is equal to (=)"],
      answer: "is less than (<)"
    }
  },
  // 3rd Grade Math - HARDER
  {
    id: 9,
    title: "Multiplication Table Builder",
    subject: "math",
    grade: "grade3",
    description: "Solve this challenging multiplication problem.",
    type: "quiz",
    content: {
      question: "What is 8 times 9 (8 x 9)?",
      options: ["63", "72", "81", "56"],
      answer: "72"
    }
  },
  {
    id: 10,
    title: "Fraction Fun",
    subject: "math",
    grade: "grade3",
    description: "Challenge your fraction knowledge!",
    type: "quiz",
    content: {
      question: "If you cut a pizza into 8 equal slices and eat 3 slices, what fraction remains?",
      options: ["3/5", "5/8", "3/8", "1/2"],
      answer: "5/8"
    }
  },
  // 4th Grade Math - HARDER
  {
    id: 11,
    title: "Division Dash",
    subject: "math",
    grade: "grade4",
    description: "Solve this challenging division equation.",
    type: "spelling",
    content: {
      question: "What is 96 divided by 8? (Type the number)",
      answer: "12"
    }
  },
  {
    id: 12,
    title: "Measuring Angles",
    subject: "math",
    grade: "grade4",
    description: "Identify the angle types with precision.",
    type: "quiz",
    content: {
      question: "What do we call an angle that measures more than 90 degrees but less than 180 degrees?",
      options: ["Acute Angle", "Obtuse Angle", "Right Angle", "Straight Angle"],
      answer: "Obtuse Angle"
    }
  },
  {
    id: 13,
    title: "Area Explorer",
    subject: "math",
    grade: "grade4",
    description: "Calculate area with tricky dimensions.",
    type: "quiz",
    content: {
      question: "What is the area of a rug that is 7 feet long and 6 feet wide?",
      options: ["13 sq ft", "26 sq ft", "42 sq ft", "35 sq ft"],
      answer: "42 sq ft"
    }
  },
  // 5th Grade Math - HARDER
  {
    id: 14,
    title: "Decimal Addition",
    subject: "math",
    grade: "grade5",
    description: "Master decimal calculations!",
    type: "spelling",
    content: {
      question: "What is 2.75 + 3.5? (Type the decimal number)",
      answer: "6.25"
    }
  },
  {
    id: 15,
    title: "Volume Finder",
    subject: "math",
    grade: "grade5",
    description: "Calculate 3D volume with precision.",
    type: "quiz",
    content: {
      question: "What is the volume of a box that is 3 inches wide, 5 inches long, and 6 inches high?",
      options: ["14 cubic inches", "30 cubic inches", "60 cubic inches", "90 cubic inches"],
      answer: "90 cubic inches"
    }
  },
  {
    id: 16,
    title: "Order of Operations",
    subject: "math",
    grade: "grade5",
    description: "Follow PEMDAS carefully!",
    type: "quiz",
    content: {
      question: "Solve: 10 + 4 x 3 - 2",
      options: ["20", "22", "40", "14"],
      answer: "20"
    }
  },
  {
    id: 17,
    title: "Simplifying Fractions",
    subject: "math",
    grade: "grade5",
    description: "Find the simplest form.",
    type: "quiz",
    content: {
      question: "What is the simplified form of 6/9?",
      options: ["2/3", "1/3", "3/4", "2/4"],
      answer: "2/3"
    }
  },

  // ==================== ENGLISH (16) ====================
  // Preschool English
  {
    id: 18,
    title: "Letter Sound Matcher",
    subject: "english",
    grade: "preschool",
    description: "Identify the letter sound with Miss Grace.",
    type: "quiz",
    content: {
      question: "What letter makes the 'Buh' sound, like in Ball and Banana?",
      options: ["A", "B", "C", "D"],
      answer: "B"
    }
  },
  {
    id: 19,
    title: "Rhyme Time",
    subject: "english",
    grade: "preschool",
    description: "Find the words that share the same ending sound.",
    type: "quiz",
    content: {
      question: "Which word rhymes with CAT?",
      options: ["Dog", "Pig", "Hat", "Sun"],
      answer: "Hat"
    }
  },
  // Kindergarten English
  {
    id: 20,
    title: "Sight Words Spell",
    subject: "english",
    grade: "kindergarten",
    description: "Type the sight word correctly.",
    type: "spelling",
    content: {
      question: "Spell the common sight word 'the' (lowercase):",
      answer: "the"
    }
  },
  {
    id: 21,
    title: "Capital Letters Check",
    subject: "english",
    grade: "kindergarten",
    description: "Find the big capital version of this letter.",
    type: "quiz",
    content: {
      question: "Which of these is the capital letter 'A'?",
      options: ["a", "B", "A", "d"],
      answer: "A"
    }
  },
  // 1st Grade English
  {
    id: 22,
    title: "Vowels and Consonants",
    subject: "english",
    grade: "grade1",
    description: "Identify vowels versus consonants.",
    type: "quiz",
    content: {
      question: "Which of these letters is a Vowel?",
      options: ["M", "E", "S", "G"],
      answer: "E"
    }
  },
  {
    id: 23,
    title: "Compound Words",
    subject: "english",
    grade: "grade1",
    description: "Combine two words into one!",
    type: "quiz",
    content: {
      question: "What word do you get when you combine SUN and FLOWER?",
      options: ["Sunny", "Flowerbed", "Sunflower", "Daylight"],
      answer: "Sunflower"
    }
  },
  // 2nd Grade English - HARDER
  {
    id: 24,
    title: "Action Verbs",
    subject: "english",
    grade: "grade2",
    description: "Find the action word in a complex sentence.",
    type: "quiz",
    content: {
      question: "Identify the action Verb in this sentence: 'The happy puppy quickly jumps over the tall grass.'",
      options: ["happy", "puppy", "jumps", "grass"],
      answer: "jumps"
    }
  },
  {
    id: 25,
    title: "Plural Words",
    subject: "english",
    grade: "grade2",
    description: "Pluralize tricky words.",
    type: "quiz",
    content: {
      question: "What is the correct plural form of the word 'tooth'?",
      options: ["tooths", "teeth", "tooths", "toothes"],
      answer: "teeth"
    }
  },
  // 3rd Grade English - HARDER
  {
    id: 26,
    title: "Synonym Finder",
    subject: "english",
    grade: "grade3",
    description: "Find words with similar meanings.",
    type: "quiz",
    content: {
      question: "What is a synonym of the word 'DIFFICULT'?",
      options: ["Easy", "Challenging", "Simple", "Quick"],
      answer: "Challenging"
    }
  },
  {
    id: 27,
    title: "Opposites (Antonyms)",
    subject: "english",
    grade: "grade3",
    description: "Find true opposites.",
    type: "quiz",
    content: {
      question: "What is the opposite (antonym) of the word 'BRIGHT'?",
      options: ["Shiny", "Dark", "Light", "White"],
      answer: "Dark"
    }
  },
  // 4th Grade English - HARDER
  {
    id: 28,
    title: "Homophones",
    subject: "english",
    grade: "grade4",
    description: "Choose the correct homophone.",
    type: "quiz",
    content: {
      question: "Which word fits in this blank: 'The team won the _______ at the state competition.'",
      options: ["price", "prize", "prise"],
      answer: "prize"
    }
  },
  {
    id: 29,
    title: "Descriptive Adjectives",
    subject: "english",
    grade: "grade4",
    description: "Identify adjectives that describe quality.",
    type: "quiz",
    content: {
      question: "In the phrase 'the magnificent old mansion', which adjective describes age?",
      options: ["the", "magnificent", "old", "mansion"],
      answer: "old"
    }
  },
  // 5th Grade English - HARDER
  {
    id: 30,
    title: "Idioms Unlocked",
    subject: "english",
    grade: "grade5",
    description: "Understand figurative language.",
    type: "quiz",
    content: {
      question: "If someone says 'time flies when you're having fun', what do they mean?",
      options: ["Time literally moves faster", "Hours pass quickly when enjoying yourself", "Birds can tell time", "Fun should be short"],
      answer: "Hours pass quickly when enjoying yourself"
    }
  },
  {
    id: 31,
    title: "Prefix Powers",
    subject: "english",
    grade: "grade5",
    description: "Master word prefixes.",
    type: "quiz",
    content: {
      question: "What does the prefix 'RE-' mean, like in rewrite or reread?",
      options: ["Very", "Again", "Not", "Before"],
      answer: "Again"
    }
  },
  {
    id: 32,
    title: "Subject-Verb Agreement",
    subject: "english",
    grade: "grade5",
    description: "Match subjects and verbs correctly.",
    type: "quiz",
    content: {
      question: "Which verb correctly completes the sentence: 'Neither the cat nor the dogs ______ going outside.'",
      options: ["is", "am", "are", "was"],
      answer: "are"
    }
  },
  {
    id: 33,
    title: "Punctuating Sentences",
    subject: "english",
    grade: "grade5",
    description: "Get punctuation absolutely right.",
    type: "quiz",
    content: {
      question: "Which sentence has correct punctuation?",
      options: ["Wow, this is fun!", "Wow this is fun!", "Wow; this is fun!", "Wow-- this is fun!"],
      answer: "Wow, this is fun!"
    }
  },

  // ==================== SCIENCE (16) ====================
  // Preschool Science
  {
    id: 34,
    title: "Farm Animal Sounds",
    subject: "science",
    grade: "preschool",
    description: "Identify the animal that makes this classic farm sound.",
    type: "quiz",
    content: {
      question: "What animal says 'Moo'?",
      options: ["Sheep 🐑", "Pig 🐷", "Cow 🐮", "Chicken 🐔"],
      answer: "Cow 🐮"
    }
  },
  {
    id: 35,
    title: "Rainy Day Weather",
    subject: "science",
    grade: "preschool",
    description: "Choose the clothing suitable for the active weather.",
    type: "quiz",
    content: {
      question: "What do you wear to stay dry when water drops fall from the sky?",
      options: ["Sunglasses", "Raincoat", "Swimsuit", "Wool mittens"],
      answer: "Raincoat"
    }
  },
  // Kindergarten Science
  {
    id: 36,
    title: "Plant Anatomy",
    subject: "science",
    grade: "kindergarten",
    description: "Learn about the parts of a plant.",
    type: "quiz",
    content: {
      question: "What part of a plant is underground and drinks water from the soil?",
      options: ["Leaves", "Flower", "Roots", "Stem"],
      answer: "Roots"
    }
  },
  {
    id: 37,
    title: "Living or Non-Living",
    subject: "science",
    grade: "kindergarten",
    description: "Living things grow, breathe, and need food. Non-living things do not.",
    type: "quiz",
    content: {
      question: "Which of these is NON-LIVING?",
      options: ["A fuzzy puppy", "A shiny rock", "A green tree", "A buzzing bee"],
      answer: "A shiny rock"
    }
  },
  // 1st Grade Science
  {
    id: 38,
    title: "Five Senses",
    subject: "science",
    grade: "grade1",
    description: "Explore the body parts that help us perceive the world around us.",
    type: "flashcards",
    content: [
      { front: "👀 What do we use to SEE?", back: "Our Eyes! We look at pretty pictures and read books." },
      { front: "👃 What do we use to SMELL?", back: "Our Nose! We smell baking cookies and garden flowers." },
      { front: "👂 What do we use to HEAR?", back: "Our Ears! We listen to beautiful music and birds chirping." }
    ]
  },
  {
    id: 39,
    title: "Day and Night",
    subject: "science",
    grade: "grade1",
    description: "Learn about what we see in the sky as the Earth rotates.",
    type: "quiz",
    content: {
      question: "What bright star shines in the sky and keeps us warm during the daytime?",
      options: ["The Moon", "The Sun", "Polaris Star", "Mars"],
      answer: "The Sun"
    }
  },
  // 2nd Grade Science
  {
    id: 40,
    title: "States of Matter",
    subject: "science",
    grade: "grade2",
    description: "Everything is a solid, liquid, or gas.",
    type: "quiz",
    content: {
      question: "An ice cube is which state of matter?",
      options: ["Liquid", "Solid", "Gas"],
      answer: "Solid"
    }
  },
  {
    id: 41,
    title: "Animal Habitats",
    subject: "science",
    grade: "grade2",
    description: "Habitats are homes where animals naturally live.",
    type: "quiz",
    content: {
      question: "Where is the natural habitat of a dolphin?",
      options: ["Desert", "Ocean", "Forest", "Grassland"],
      answer: "Ocean"
    }
  },
  // 3rd Grade Science - HARDER
  {
    id: 42,
    title: "The Water Cycle",
    subject: "science",
    grade: "grade3",
    description: "Master the water cycle stages.",
    type: "quiz",
    content: {
      question: "When water from oceans rises into the atmosphere as an invisible gas, what is this process called?",
      options: ["Condensation", "Precipitation", "Evaporation", "Runoff"],
      answer: "Evaporation"
    }
  },
  {
    id: 43,
    title: "Simple Machines",
    subject: "science",
    grade: "grade3",
    description: "Identify the types of simple machines.",
    type: "quiz",
    content: {
      question: "Which simple machine consists of a grooved wheel with a rope or cable around it?",
      options: ["Lever", "Pulley", "Wheel and Axle", "Inclined Plane"],
      answer: "Pulley"
    }
  },
  // 4th Grade Science - HARDER
  {
    id: 44,
    title: "Photosynthesis Green",
    subject: "science",
    grade: "grade4",
    description: "Plants absorb light to synthesize their own sugar food.",
    type: "quiz",
    content: {
      question: "What is the process called where plants use sunlight, water, and CO2 to make food and oxygen?",
      options: ["Respiration", "Photosynthesis", "Decomposition", "Fermentation"],
      answer: "Photosynthesis"
    }
  },
  {
    id: 45,
    title: "Solar System Secrets",
    subject: "science",
    grade: "grade4",
    description: "Learn about planetary order with precision.",
    type: "quiz",
    content: {
      question: "Which planet is known for its beautiful rings and is the 6th from the Sun?",
      options: ["Neptune", "Jupiter", "Saturn", "Uranus"],
      answer: "Saturn"
    }
  },
  // 5th Grade Science - HARDER
  {
    id: 46,
    title: "The Human Pump",
    subject: "science",
    grade: "grade5",
    description: "Examine the circulatory system.",
    type: "quiz",
    content: {
      question: "The heart has four chambers. What are the two upper chambers called?",
      options: ["Ventricles", "Atria", "Valves", "Septums"],
      answer: "Atria"
    }
  },
  {
    id: 47,
    title: "Ecosystem Eating Roles",
    subject: "science",
    grade: "grade5",
    description: "Understand food chains and roles.",
    type: "quiz",
    content: {
      question: "What do we call an organism that feeds on both plants and animals?",
      options: ["Carnivore", "Herbivore", "Omnivore", "Decomposer"],
      answer: "Omnivore"
    }
  },
  {
    id: 48,
    title: "Gravity Discoverer",
    subject: "science",
    grade: "grade5",
    description: "Master gravitational concepts.",
    type: "quiz",
    content: {
      question: "According to Newton's law of universal gravitation, what two factors determine the gravitational force between objects?",
      options: ["Speed and distance", "Mass and distance", "Height and weight", "Density and volume"],
      answer: "Mass and distance"
    }
  },
  {
    id: 49,
    title: "Types of Earth Rocks",
    subject: "science",
    grade: "grade5",
    description: "Classify rocks by formation.",
    type: "quiz",
    content: {
      question: "What type of rock forms when sedimentary or igneous rock is subjected to intense heat and pressure deep in the Earth?",
      options: ["Sedimentary Rock", "Metamorphic Rock", "Igneous Rock", "Fossilized Rock"],
      answer: "Metamorphic Rock"
    }
  },

  // ==================== SOCIAL STUDIES (16) ====================
  // Preschool Social Studies
  {
    id: 50,
    title: "Community Helpers",
    subject: "socialstudies",
    grade: "preschool",
    description: "Learn about the brave people who protect our communities.",
    type: "quiz",
    content: {
      question: "Who drives a big red truck and puts out hot fires?",
      options: ["Police Officer", "Firefighter", "Mail Carrier", "Dentist"],
      answer: "Firefighter"
    }
  },
  {
    id: 51,
    title: "Sharing and Caring",
    subject: "socialstudies",
    grade: "preschool",
    description: "Good manners make our classrooms a happy place.",
    type: "quiz",
    content: {
      question: "Is it polite and friendly to share toys with your friends?",
      options: ["Yes, sharing is caring!", "No, keep them all!"],
      answer: "Yes, sharing is caring!"
    }
  },
  // Kindergarten Social Studies
  {
    id: 52,
    title: "Feelings Check-in",
    subject: "socialstudies",
    grade: "kindergarten",
    description: "Recognize facial expressions and feelings.",
    type: "quiz",
    content: {
      question: "If a student has a big smile on their face, how do they feel?",
      options: ["Angry", "Sad", "Happy", "Scared"],
      answer: "Happy"
    }
  },
  {
    id: 53,
    title: "School Rules",
    subject: "socialstudies",
    grade: "kindergarten",
    description: "Why do we have guidelines in Miss Grace's classroom?",
    type: "quiz",
    content: {
      question: "Why do we raise our hand before speaking in class?",
      options: ["To stretch our arm", "To show off a ring", "To wait for our turn to speak nicely", "To high-five the ceiling"],
      answer: "To wait for our turn to speak nicely"
    }
  },
  // 1st Grade Social Studies
  {
    id: 54,
    title: "Our Seven Continents",
    subject: "socialstudies",
    grade: "grade1",
    description: "The Earth is divided into large landmasses called continents.",
    type: "quiz",
    content: {
      question: "How many continents are there on planet Earth?",
      options: ["5", "6", "7", "8"],
      answer: "7"
    }
  },
  {
    id: 55,
    title: "American Flag Colors",
    subject: "socialstudies",
    grade: "grade1",
    description: "Learn the symbols on the United States flag.",
    type: "quiz",
    content: {
      question: "What three colors are on the US flag?",
      options: ["Red, White, and Blue", "Green, Gold, and Pink", "Black, Gold, and White", "Red, Yellow, and Blue"],
      answer: "Red, White, and Blue"
    }
  },
  // 2nd Grade Social Studies
  {
    id: 56,
    title: "Maps and Globes",
    subject: "socialstudies",
    grade: "grade2",
    description: "Learn maps vs. globes representations.",
    type: "quiz",
    content: {
      question: "What do we call a round 3D sphere model of the Earth?",
      options: ["Flat Map", "Compass Rose", "Globe", "Atlas Book"],
      answer: "Globe"
    }
  },
  {
    id: 57,
    title: "Historical Figures",
    subject: "socialstudies",
    grade: "grade2",
    description: "Learn about key figures in US history.",
    type: "quiz",
    content: {
      question: "Who was the very first President of the United States?",
      options: ["Abraham Lincoln", "George Washington", "Thomas Jefferson", "Benjamin Franklin"],
      answer: "George Washington"
    }
  },
  // 3rd Grade Social Studies - HARDER
  {
    id: 58,
    title: "City Leadership",
    subject: "socialstudies",
    grade: "grade3",
    description: "Who governs and leads our local communities?",
    type: "quiz",
    content: {
      question: "What government official leads a state?",
      options: ["President", "Governor", "Mayor", "Senator"],
      answer: "Governor"
    }
  },
  {
    id: 59,
    title: "Invention of the Lightbulb",
    subject: "socialstudies",
    grade: "grade3",
    description: "Great inventors changed how we live.",
    type: "quiz",
    content: {
      question: "Which inventor created the first practical incandescent lightbulb?",
      options: ["Alexander Graham Bell", "Thomas Edison", "Benjamin Franklin", "Nikola Tesla"],
      answer: "Thomas Edison"
    }
  },
  // 4th Grade Social Studies - HARDER
  {
    id: 60,
    title: "Three Government Branches",
    subject: "socialstudies",
    grade: "grade4",
    description: "The US government is split to ensure balance of power.",
    type: "spelling",
    content: {
      question: "How many branches of US government are there? (Type the digit)",
      answer: "3"
    }
  },
  {
    id: 61,
    title: "Oregon Trail Covered Wagons",
    subject: "socialstudies",
    grade: "grade4",
    description: "Pioneers traveled west across America.",
    type: "quiz",
    content: {
      question: "Approximately in which decade did the largest migration on the Oregon Trail occur?",
      options: ["1820s", "1840s-1850s", "1880s", "1920s"],
      answer: "1840s-1850s"
    }
  },
  // 5th Grade Social Studies - HARDER
  {
    id: 62,
    title: "Ancient Pyramids",
    subject: "socialstudies",
    grade: "grade5",
    description: "Explore world history and landmarks.",
    type: "quiz",
    content: {
      question: "Which Pharaoh commanded the construction of the Great Pyramid of Khufu?",
      options: ["Ramesses II", "Khufu", "Hatshepsut", "Tutankhamun"],
      answer: "Khufu"
    }
  },
  {
    id: 63,
    title: "Supply and Demand",
    subject: "socialstudies",
    grade: "grade5",
    description: "Explore advanced market economics.",
    type: "quiz",
    content: {
      question: "When supply decreases but demand stays the same, what effect does this have on the price of a product?",
      options: ["Price decreases", "Price increases", "Price stays the same", "Price fluctuates randomly"],
      answer: "Price increases"
    }
  },
  {
    id: 64,
    title: "The Bill of Rights",
    subject: "socialstudies",
    grade: "grade5",
    description: "Explore constitutional amendments.",
    type: "quiz",
    content: {
      question: "What do we call the first ten amendments to the United States Constitution?",
      options: ["Declaration of Independence", "Emancipation Proclamation", "Articles of Confederation", "Bill of Rights"],
      answer: "Bill of Rights"
    }
  },
  {
    id: 65,
    title: "Civil Rights Leader",
    subject: "socialstudies",
    grade: "grade5",
    description: "Learn about the struggle for equality in America.",
    type: "quiz",
    content: {
      question: "Who delivered the historical 'I Have a Dream' speech in Washington DC?",
      options: ["Rosa Parks", "Abraham Lincoln", "Martin Luther King Jr.", "John F. Kennedy"],
      answer: "Martin Luther King Jr."
    }
  }
];

// --- App State Store ---
let state = {
  completedLessons: [],
  totalStars: 0,
  currentGrade: 'all',
  currentSubject: 'all',
  activeTab: 'schoolyard',
  activeExtra: 'dance',
  sportsScore: 0,
  sportsTrophies: 0,
  announcement: "Welcome to Country Tops Elementary! Be sure to work hard on your lessons and try out our new Fun Clubs. Let's make it a wonderful week! - Miss Grace",
  activeLesson: null,
  currentScore: 0
};

// --- LocalStorage Integration ---
function saveToLocalStorage() {
  localStorage.setItem('country_tops_state', JSON.stringify(state));
}

function loadFromLocalStorage() {
  const data = localStorage.getItem('country_tops_state');
  if (data) {
    try {
      state = { ...state, ...JSON.parse(data) };
      // Sync UI elements
      document.getElementById('bulletin-text').innerText = state.announcement;
      document.getElementById('announcement-input').value = state.announcement;
      document.getElementById('total-stars').innerText = state.totalStars;
      document.getElementById('rc-preview-stars').innerText = state.totalStars;
      document.getElementById('sports-score').innerText = state.sportsScore;
      document.getElementById('sports-trophies').innerText = state.sportsTrophies;
      
      updateProgressUI();
    } catch (e) {
      console.error("Error parsing localStorage data:", e);
    }
  }
}

// --- Navigation Tabs Switcher ---
function switchTab(tabId) {
  playSound('click');
  state.activeTab = tabId;
  
  // Update nav tabs
  document.querySelectorAll('.nav-tab').forEach(btn => {
    if (btn.getAttribute('data-tab') === tabId) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Update content sections
  document.querySelectorAll('.tab-content').forEach(sec => {
    sec.classList.remove('active');
  });
  
  const targetSection = document.getElementById(`tab-${tabId}`);
  if (targetSection) {
    targetSection.classList.add('active');
  }

  // Trigger subview initialization if needed
  if (tabId === 'extracurriculars') {
    initExtraTab();
  } else if (tabId === 'office') {
    updateReportCardPreview();
  }

  saveToLocalStorage();
}

// Attach listeners to tabs
document.querySelectorAll('.nav-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    switchTab(tab.getAttribute('data-tab'));
  });
});

// --- Lessons Catalog rendering & filtering ---
function renderLessonsGrid() {
  const container = document.getElementById('lessons-grid-container');
  if (!container) return;
  container.innerHTML = '';

  const filtered = lessonsData.filter(l => {
    const gradeMatch = state.currentGrade === 'all' || l.grade === state.currentGrade;
    const subjectMatch = state.currentSubject === 'all' || l.subject === state.currentSubject;
    return gradeMatch && subjectMatch;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-light);">
        <p style="font-size: 1.2rem; font-weight: 700;">No lessons found matching this filter!</p>
        <p style="font-size: 0.9rem; margin-top: 0.5rem;">Try choosing another grade or subject.</p>
      </div>
    `;
    return;
  }

  filtered.forEach(lesson => {
    const isCompleted = state.completedLessons.includes(lesson.id);
    const card = document.createElement('div');
    card.className = `lesson-card ${isCompleted ? 'completed' : ''}`;
    card.setAttribute('onclick', `openLesson(${lesson.id})`);

    const formattedSubject = lesson.subject === 'socialstudies' ? 'Social Studies' : lesson.subject.charAt(0).toUpperCase() + lesson.subject.slice(1);
    const formattedGrade = getFormattedGrade(lesson.grade);

    card.innerHTML = `
      <div>
        <div class="lesson-card-header">
          <span class="lesson-number">Lesson #${lesson.id}</span>
          <span class="lesson-subject-badge badge-${lesson.subject}">${formattedSubject}</span>
        </div>
        <h4>${lesson.title}</h4>
        <p>${lesson.description}</p>
      </div>
      <div class="lesson-card-footer">
        <span class="lesson-grade-tag">${formattedGrade}</span>
        <div class="lesson-status-icon">
          <svg viewBox="0 0 24 24">
            ${isCompleted 
              ? '<path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>' 
              : '<path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6h4.2v2z"/>'
            }
          </svg>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

function filterGrade(gradeId) {
  playSound('click');
  state.currentGrade = gradeId;
  
  document.querySelectorAll('[data-grade]').forEach(btn => {
    if (btn.getAttribute('data-grade') === gradeId) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  renderLessonsGrid();
}

function filterSubject(subjectId) {
  playSound('click');
  state.currentSubject = subjectId;

  document.querySelectorAll('.subject-chip').forEach(btn => {
    if (btn.getAttribute('data-subject') === subjectId) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  renderLessonsGrid();
}

function getFormattedGrade(gradeVal) {
  const map = {
    'preschool': 'Preschool',
    'kindergarten': 'Kindergarten',
    'grade1': '1st Grade',
    'grade2': '2nd Grade',
    'grade3': '3rd Grade',
    'grade4': '4th Grade',
    'grade5': '5th Grade'
  };
  return map[gradeVal] || gradeVal;
}

// Calculate badge counts for the sidebar
function calculateFilterCounts() {
  document.getElementById('badge-all').innerText = lessonsData.length;
  
  const grades = ['preschool', 'kindergarten', 'grade1', 'grade2', 'grade3', 'grade4', 'grade5'];
  grades.forEach(g => {
    const count = lessonsData.filter(l => l.grade === g).length;
    const badge = document.getElementById(`badge-${g}`);
    if (badge) badge.innerText = count;
  });
}

// --- Dashboard Progress UI updates ---
function updateProgressUI() {
  const completedCount = state.completedLessons.length;
  document.getElementById('completed-count').innerText = `${completedCount} / 65`;
  
  const percentage = (completedCount / 65) * 100;
  document.getElementById('completed-progress').style.width = `${percentage}%`;

  // Learning rank calculation
  let rank = "Pre-K Explorer";
  if (completedCount >= 56) rank = "Country Tops Graduate 🎓";
  else if (completedCount >= 46) rank = "5th Grade Graduate 🎓";
  else if (completedCount >= 36) rank = "4th Grade Mastermind 🧠";
  else if (completedCount >= 26) rank = "3rd Grade Champion 🏆";
  else if (completedCount >= 16) rank = "2nd Grade Star 🌟";
  else if (completedCount >= 6) rank = "Kindergarten Scout ⛺";

  document.getElementById('learning-rank').innerText = rank;
}

// --- Interactive Lesson Modals Logic ---
function openLesson(lessonId) {
  playSound('click');
  const lesson = lessonsData.find(l => l.id === lessonId);
  if (!lesson) return;

  state.activeLesson = lesson;
  state.currentScore = 0; // Reset score for this lesson
  
  const modal = document.getElementById('lesson-modal');
  const modalHeader = document.getElementById('modal-header');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-description');
  const modalContent = document.getElementById('modal-interactive-content');
  const modalBadge = document.getElementById('modal-progress-badge');

  modalHeader.setAttribute('data-subject', lesson.subject);
  modalTitle.innerText = lesson.title;
  modalDesc.innerText = lesson.description;
  
  const formattedSubject = lesson.subject === 'socialstudies' ? 'Social Studies' : lesson.subject.charAt(0).toUpperCase() + lesson.subject.slice(1);
  const formattedGrade = getFormattedGrade(lesson.grade);
  modalBadge.innerText = `${formattedGrade} - ${formattedSubject}`;

  // Reset interactive area
  modalContent.innerHTML = '';

  // Render content based on type
  if (lesson.type === 'quiz') {
    renderQuizContent(lesson, modalContent);
  } else if (lesson.type === 'spelling') {
    renderSpellingContent(lesson, modalContent);
  } else if (lesson.type === 'flashcards') {
    renderFlashcardsContent(lesson, modalContent);
  } else if (lesson.type === 'puzzle') {
    renderPuzzleContent(lesson, modalContent);
  }

  // Set action button state
  const actBtn = document.getElementById('modal-action-btn');
  actBtn.innerText = 'Close';
  actBtn.setAttribute('onclick', 'closeLessonModal()');
  actBtn.className = 'btn btn-outline';

  modal.style.display = 'flex';
}

function closeLessonModal() {
  playSound('click');
  document.getElementById('lesson-modal').style.display = 'none';
  state.activeLesson = null;
}

// Renderers for different lesson styles
function renderQuizContent(lesson, container) {
  const quiz = lesson.content;
  container.innerHTML = `
    <h3 style="font-size: 1.15rem; color: var(--text-dark); margin-bottom: 1rem; text-align: center;">${quiz.question}</h3>
    <div class="quiz-options-list">
      ${quiz.options.map(opt => `
        <button class="quiz-option-btn" onclick="checkQuizAnswer(this, '${opt.replace(/'/g, "\\'")}')">${opt}</button>
      `).join('')}
    </div>
  `;
}

function checkQuizAnswer(btn, selection) {
  const lesson = state.activeLesson;
  if (!lesson) return;

  if (selection === lesson.content.answer) {
    btn.classList.add('correct');
    playSound('correct');
    handleLessonCompletion();
  } else {
    btn.classList.add('wrong');
    btn.disabled = true;
    playSound('incorrect');
    state.currentScore -= 1; // Deduct 1 point for wrong answer
  }
}

function renderSpellingContent(lesson, container) {
  const content = lesson.content;
  container.innerHTML = `
    <h3 style="font-size: 1.15rem; color: var(--text-dark); margin-bottom: 1.25rem; text-align: center;">${content.question}</h3>
    <div style="display: flex; flex-direction: column; gap: 0.75rem; align-items: center;">
      <input type="text" id="spelling-input" style="padding: 0.8rem 1rem; width: 100%; max-width: 280px; text-align: center; font-size: 1.2rem; font-weight: 700; border-radius: 8px; border: 2px solid var(--cream-border);" placeholder="Type your answer here...">
      <button class="btn btn-pink" onclick="checkSpellingAnswer()" style="width: 100%; max-width: 280px;">Submit Answer</button>
    </div>
    <div id="spelling-feedback" style="margin-top: 1rem; text-align: center; font-weight: bold;"></div>
  `;

  // Allow enter key
  document.getElementById('spelling-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') checkSpellingAnswer();
  });
}

function checkSpellingAnswer() {
  const lesson = state.activeLesson;
  if (!lesson) return;

  const userVal = document.getElementById('spelling-input').value.trim().toLowerCase();
  const correctVal = lesson.content.answer.toLowerCase();
  const feedback = document.getElementById('spelling-feedback');

  if (userVal === correctVal) {
    feedback.innerText = "Fantastic Job! Correct! 🎉";
    feedback.style.color = "var(--green-primary)";
    playSound('correct');
    handleLessonCompletion();
  } else {
    feedback.innerText = "Try again! Double check spelling.";
    feedback.style.color = "var(--pink-medium)";
    playSound('incorrect');
    state.currentScore -= 1; // Deduct 1 point for wrong answer
  }
}

function renderFlashcardsContent(lesson, container) {
  const cards = lesson.content;
  container.innerHTML = `
    <div class="modal-flashcard-deck">
      <div class="modal-flashcard" onclick="flipModalCard(this)">
        <div class="modal-flashcard-inner">
          <div class="flashcard-front">
            <h4>${cards[0].front}</h4>
            <div class="flashcard-tip">Click card to Flip! 👆</div>
          </div>
          <div class="flashcard-back">
            <h4>${cards[0].back}</h4>
            <div class="flashcard-tip">Click to Flip back!</div>
          </div>
        </div>
      </div>
    </div>
    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1.5rem;">
      <button class="btn btn-outline" id="fc-prev-btn" onclick="switchFlashcard(-1)" disabled>Previous</button>
      <span style="font-weight: 700;" id="fc-indicator">Card 1 of ${cards.length}</span>
      <button class="btn btn-pink" id="fc-next-btn" onclick="switchFlashcard(1)">Next Card</button>
    </div>
  `;
  container.setAttribute('data-card-idx', '0');
}

function flipModalCard(cardEl) {
  playSound('click');
  cardEl.classList.toggle('flipped');
}

function switchFlashcard(dir) {
  const container = document.getElementById('modal-interactive-content');
  const lesson = state.activeLesson;
  if (!lesson) return;

  let activeIdx = parseInt(container.getAttribute('data-card-idx') || '0');
  activeIdx += dir;

  const cards = lesson.content;
  if (activeIdx < 0 || activeIdx >= cards.length) return;

  container.setAttribute('data-card-idx', activeIdx.toString());

  // Re-render flashcard inner
  const cardDeck = container.querySelector('.modal-flashcard-deck');
  cardDeck.innerHTML = `
    <div class="modal-flashcard" onclick="flipModalCard(this)">
      <div class="modal-flashcard-inner">
        <div class="flashcard-front">
          <h4>${cards[activeIdx].front}</h4>
          <div class="flashcard-tip">Click card to Flip! 👆</div>
        </div>
        <div class="flashcard-back">
          <h4>${cards[activeIdx].back}</h4>
          <div class="flashcard-tip">Click to Flip back!</div>
        </div>
      </div>
    </div>
  `;

  // Buttons update
  const prevBtn = document.getElementById('fc-prev-btn');
  const nextBtn = document.getElementById('fc-next-btn');
  const indicator = document.getElementById('fc-indicator');

  indicator.innerText = `Card ${activeIdx + 1} of ${cards.length}`;
  prevBtn.disabled = activeIdx === 0;
  
  if (activeIdx === cards.length - 1) {
    nextBtn.innerText = "Complete Lesson! 🎉";
    nextBtn.setAttribute('onclick', 'completeFlashcardLesson()');
  } else {
    nextBtn.innerText = "Next Card";
    nextBtn.setAttribute('onclick', 'switchFlashcard(1)');
  }
  playSound('click');
}

function completeFlashcardLesson() {
  playSound('correct');
  handleLessonCompletion();
}

function renderPuzzleContent(lesson, container) {
  const puzzle = lesson.content;
  container.innerHTML = `
    <h3 style="font-size: 1.15rem; color: var(--text-dark); margin-bottom: 1rem; text-align: center;">${puzzle.question}</h3>
    <div style="display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap; margin-bottom: 1.5rem;" id="puzzle-items-box">
      ${puzzle.items.map(num => `
        <button class="btn btn-outline" style="font-size: 1.2rem; min-width: 60px;" onclick="choosePuzzleItem(this, ${num})">${num}</button>
      `).join('')}
    </div>
    <div style="display: flex; gap: 0.75rem; justify-content: center; min-height: 50px; border: 2px dashed var(--cream-border); border-radius: 8px; padding: 0.5rem; background: var(--cream-card);" id="puzzle-sequence-box">
      <!-- User selections appear here -->
    </div>
    <div style="margin-top: 1rem; text-align: center;">
      <button class="btn btn-pink" onclick="resetPuzzle()" style="margin-right: 0.5rem;">Reset Order</button>
      <button class="btn btn-gold" onclick="checkPuzzleAnswer()">Verify Sequence</button>
    </div>
    <div id="puzzle-feedback" style="margin-top: 1rem; text-align: center; font-weight: bold;"></div>
  `;
  container.setAttribute('data-selections', '[]');
}

function choosePuzzleItem(btn, val) {
  playSound('click');
  const container = document.getElementById('modal-interactive-content');
  const seqBox = document.getElementById('puzzle-sequence-box');
  
  let selections = JSON.parse(container.getAttribute('data-selections') || '[]');
  if (selections.includes(val)) return;

  selections.push(val);
  container.setAttribute('data-selections', JSON.stringify(selections));

  btn.style.opacity = '0.3';
  btn.disabled = true;

  const item = document.createElement('div');
  item.className = 'btn btn-gold';
  item.style.fontSize = '1.2rem';
  item.style.minWidth = '60px';
  item.innerText = val.toString();
  seqBox.appendChild(item);
}

function resetPuzzle() {
  playSound('click');
  const lesson = state.activeLesson;
  if (!lesson) return;
  const container = document.getElementById('modal-interactive-content');
  renderPuzzleContent(lesson, container);
}

function checkPuzzleAnswer() {
  const lesson = state.activeLesson;
  if (!lesson) return;

  const container = document.getElementById('modal-interactive-content');
  const selections = JSON.parse(container.getAttribute('data-selections') || '[]');
  const feedback = document.getElementById('puzzle-feedback');

  if (selections.length < lesson.content.answer.length) {
    feedback.innerText = "Add all numbers before checking!";
    feedback.style.color = "var(--pink-medium)";
    playSound('incorrect');
    return;
  }

  const isCorrect = selections.every((val, idx) => val === lesson.content.answer[idx]);

  if (isCorrect) {
    feedback.innerText = "Stunning work! Everything is in order! 🏆";
    feedback.style.color = "var(--green-primary)";
    playSound('correct');
    handleLessonCompletion();
  } else {
    feedback.innerText = "Oops, sequence is incorrect. Try resetting!";
    feedback.style.color = "var(--pink-medium)";
    playSound('incorrect');
    state.currentScore -= 1; // Deduct 1 point for wrong answer
  }
}

// Shared lesson completion reward sequence
function handleLessonCompletion() {
  const lesson = state.activeLesson;
  if (!lesson) return;

  const alreadyDone = state.completedLessons.includes(lesson.id);
  if (!alreadyDone) {
    state.completedLessons.push(lesson.id);
    state.totalStars += 5; // 5 stars per lesson completion
  }

  // Update UI stars counters
  document.getElementById('total-stars').innerText = state.totalStars;
  document.getElementById('rc-preview-stars').innerText = state.totalStars;

  updateProgressUI();
  calculateFilterCounts();
  renderLessonsGrid();
  startConfetti();

  // Show victory modal body
  const modalContent = document.getElementById('modal-interactive-content');
  modalContent.innerHTML = `
    <div class="success-screen">
      <div class="success-star-ring">
        <div class="success-star-main">★</div>
      </div>
      <h3>Excellent Work!</h3>
      <p>You have successfully completed this lesson and earned <strong>+5 Gold Stars</strong>!</p>
    </div>
  `;

  const actBtn = document.getElementById('modal-action-btn');
  actBtn.innerText = 'Back to Classrooms';
  actBtn.className = 'btn btn-gold';
  actBtn.setAttribute('onclick', 'closeLessonModal()');

  saveToLocalStorage();
}

// --- Extracurricular Tab Routing ---
function initExtraTab() {
  switchExtraView(state.activeExtra);
}

function switchExtraView(extraId) {
  playSound('click');
  state.activeExtra = extraId;

  document.querySelectorAll('.extra-tab-btn').forEach(btn => {
    if (btn.getAttribute('data-extra') === extraId) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  document.querySelectorAll('.extra-subview').forEach(view => {
    view.classList.remove('active');
  });

  document.getElementById(`extra-${extraId}`).classList.add('active');

  // Trigger drawings setup if needed
  if (extraId === 'games') {
    initMemoryGame();
  }
}

// --- Email button functions ---
function openEmailForBallet() {
  playSound('click');
  window.location.href = 'mailto:?subject=I%20am%20interested%20in%20ballet!&body=Hello%20Miss%20Grace%2C%20I%20would%20like%20to%20learn%20more%20about%20ballet%20from%20Country%20Tops%20Elementary.';
}

function openEmailForArt() {
  playSound('click');
  window.location.href = 'mailto:?subject=I%20am%20interested%20in%20art!&body=Hello%20Miss%20Grace%2C%20I%20would%20like%20to%20learn%20more%20about%20art%20from%20Country%20Tops%20Elementary.';
}

function openEmailForSports() {
  playSound('click');
  window.location.href = 'mailto:?subject=I%20am%20interested%20in%20sports!&body=Hello%20Miss%20Grace%2C%20I%20would%20like%20to%20learn%20more%20about%20sports%20from%20Country%20Tops%20Elementary.';
}

// --- 🎮 Playground (Memory Match Game) ---
const schoolIcons = [
  // SVG Strings for cards
  `<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v2.93zm6.9-2.54c.59-.93.9-2.01.9-3.16 0-3.54-2.9-6.43-6.43-6.43S5.04 8.46 5.04 12s2.9 6.43 6.43 6.43c1.59 0 3.06-.58 4.21-1.52l4.28 4.28c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41l-4.39-4.39z"/></svg>`,
  `<svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>`, // Star
  `<svg viewBox="0 0 24 24"><path d="M21.59 11.59l-9.17-9.17c-.78-.78-2.05-.78-2.83 0l-9.17 9.17c-.78.78-.78 2.05 0 2.83l9.17 9.17c.78.78 2.05.78 2.83 0l9.17-9.17c.78-.78.78-2.05 0-2.83zM12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/></svg>`,
  `<svg viewBox="0 0 24 24"><path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/></svg>`, // Graduation cap
  `<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>`, // Information
  `<svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.5 11.35z"/></svg>`,
  `<svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>`, // Bubble
  `<svg viewBox="0 0 24 24"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>`
];

let memoryCards = [];
let flippedCards = [];
let matchedCount = 0;

function initMemoryGame() {
  const board = document.getElementById('memory-board');
  if (!board) return;
  board.innerHTML = '';
  flippedCards = [];
  matchedCount = 0;
  document.getElementById('memory-score').innerText = matchedCount;

  // Duplicate icons array to make pairs
  const pairs = [...schoolIcons, ...schoolIcons];
  
  // Shuffle cards
  const shuffled = pairs
    .map((val, idx) => ({ val, sort: Math.random(), id: idx }))
    .sort((a, b) => a.sort - b.sort);

  shuffled.forEach(item => {
    const card = document.createElement('div');
    card.className = 'memory-card';
    card.setAttribute('data-id', item.id);
    card.setAttribute('data-val-idx', schoolIcons.indexOf(item.val));
    
    card.innerHTML = `
      <div class="memory-card-inner">
        <div class="memory-card-front"></div>
        <div class="memory-card-back">
          ${item.val}
        </div>
      </div>
    `;

    card.addEventListener('click', flipMemoryCard);
    board.appendChild(card);
  });
}

function flipMemoryCard() {
  if (flippedCards.length >= 2) return;
  if (this.classList.contains('flipped') || this.classList.contains('matched')) return;

  playSound('click');
  this.classList.add('flipped');
  flippedCards.push(this);

  if (flippedCards.length === 2) {
    const val1 = flippedCards[0].getAttribute('data-val-idx');
    const val2 = flippedCards[1].getAttribute('data-val-idx');

    if (val1 === val2) {
      // MATCH
      setTimeout(() => {
        flippedCards.forEach(c => {
          c.classList.add('matched');
          c.removeEventListener('click', flipMemoryCard);
        });
        flippedCards = [];
        matchedCount++;
        document.getElementById('memory-score').innerText = matchedCount;
        playSound('correct');

        if (matchedCount === 8) {
          // VICTORY
          setTimeout(() => {
            playSound('cheer');
            startConfetti();
            state.totalStars += 10;
            document.getElementById('total-stars').innerText = state.totalStars;
            document.getElementById('rc-preview-stars').innerText = state.totalStars;
            updateProgressUI();
            saveToLocalStorage();
          }, 400);
        }
      }, 500);
    } else {
      // MISMATCH
      setTimeout(() => {
        flippedCards.forEach(c => c.classList.remove('flipped'));
        flippedCards = [];
        playSound('incorrect');
      }, 1000);
    }
  }
}

function resetMemoryGame() {
  initMemoryGame();
}

// --- Miss Grace's Office Form Actions ---
function publishAnnouncement() {
  playSound('click');
  const txt = document.getElementById('announcement-input').value.trim();
  if (txt === "") return;

  state.announcement = txt;
  document.getElementById('bulletin-text').innerText = txt;
  
  // Show quick notification
  alert("Chalkboard announcement posted! Go check the School Yard!");
  saveToLocalStorage();
}

function awardDirectStars() {
  playSound('cheer');
  const name = document.getElementById('student-name').value.trim();
  const count = parseInt(document.getElementById('star-count').value);
  const reason = document.getElementById('star-reason').value.trim();

  state.totalStars += count;
  document.getElementById('total-stars').innerText = state.totalStars;
  document.getElementById('rc-preview-stars').innerText = state.totalStars;

  const rewardMsg = `Awarded ${count} Gold Stars to ${name} for "${reason || 'being a great student'}"! 🌟`;
  alert(rewardMsg);
  
  // Reset star input form
  document.getElementById('star-reason').value = '';

  updateProgressUI();
  updateReportCardPreview();
  saveToLocalStorage();
}

function updateReportCardPreview() {
  const name = document.getElementById('report-student-name').value.trim();
  const comments = document.getElementById('report-comments').value.trim();

  document.getElementById('rc-preview-name').innerText = name || "Active Student";
  document.getElementById('rc-preview-comments').innerText = comments || "Keep up the amazing work!";

  // Calculate subject ratios
  const subjects = ['math', 'english', 'science', 'socialstudies'];
  subjects.forEach(sub => {
    const total = lessonsData.filter(l => l.subject === sub).length;
    const completed = lessonsData.filter(l => l.subject === sub && state.completedLessons.includes(l.id)).length;
    
    document.getElementById(`rc-${sub}-count`).innerText = `${completed} / ${total}`;
    
    // Status text
    const statusText = completed === total ? 'Complete! 🎓' : completed > 0 ? 'In Progress' : 'Needs Study';
    document.getElementById(`rc-${sub}-status`).innerText = statusText;
  });
}

function resetSchoolYear() {
  const confirmReset = confirm("Are you sure you want to reset the school year? This clears all student stars, completed lessons, and trophies.");
  if (confirmReset) {
    playSound('incorrect');
    state.completedLessons = [];
    state.totalStars = 0;
    state.sportsScore = 0;
    state.sportsTrophies = 0;
    state.announcement = "Welcome to Country Tops Elementary! Be sure to work hard on your lessons and try out our new Fun Clubs. Let's make it a wonderful week! - Miss Grace";
    
    // Update local variables and save
    document.getElementById('bulletin-text').innerText = state.announcement;
    document.getElementById('announcement-input').value = state.announcement;
    document.getElementById('total-stars').innerText = 0;
    document.getElementById('rc-preview-stars').innerText = 0;
    document.getElementById('sports-score').innerText = 0;
    document.getElementById('sports-trophies').innerText = 0;

    // Reset DOM lists
    filterGrade('all');
    filterSubject('all');
    updateProgressUI();
    renderLessonsGrid();
    updateReportCardPreview();
    
    saveToLocalStorage();
    alert("School records reset successfully! Welcome to a new school year.");
  }
}

// Initializing the app
window.addEventListener('DOMContentLoaded', () => {
  loadFromLocalStorage();
  calculateFilterCounts();
  renderLessonsGrid();
});
