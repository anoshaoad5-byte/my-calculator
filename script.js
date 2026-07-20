let input = document.getElementById('inputBox');
let buttons = document.querySelectorAll('.row button, .sci-buttons button');
let sciToggle = document.getElementById('sciToggle');
let sciButtons = document.getElementById('sciButtons');
let backBtn = document.getElementById('backBtn');

let string = "";

function sin(x) { return Math.sin(x * Math.PI / 180); }
function cos(x) { return Math.cos(x * Math.PI / 180); }
function tan(x) { return Math.tan(x * Math.PI / 180); }
function log(x) { return Math.log10(x); }
function ln(x) { return Math.log(x); }
function sqrt(x) { return Math.sqrt(x); }
function factorial(n) {
    n = Math.round(n);
    if (n < 0) return NaN;
    let result = 1;
    for (let i = 2; i <= n; i++) result *= i;
    return result;
}

let audioCtx = null;
function playClickSound() {
    if (!audioCtx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        audioCtx = new AudioCtx();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.value = 700;

    gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.08);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.08);
}

buttons.forEach(button => {
    button.addEventListener('click', (e) => {
        playClickSound();

        let value = e.target.dataset.value || e.target.textContent.trim();

        if (value === '=') {
            calculate();
        }
        else if (value === 'AC') {
            string = "";
            input.value = string;
        }
        else if (value === 'DEL') {
            string = string.substring(0, string.length - 1);
            input.value = string;
        }
        else {
            string += value;
            input.value = string;
        }
    });
});

function calculate() {
    try {
        let expression = string
            .replace(/\^/g, '**')
            .replace(/π/g, 'Math.PI')
            .replace(/(\d+(\.\d+)?)!/g, 'factorial($1)');

        let result = eval(expression);
        if (result === undefined || Number.isNaN(result)) {
            input.value = "Error";
            string = "";
            return;
        }
        string = String(result);
        input.value = string;
    } catch (err) {
        input.value = "Error";
        string = "";
    }
}

function enterScientificMode() {
    sciButtons.classList.add('show');
    sciToggle.classList.add('active');
    backBtn.style.display = 'inline-block';
}

function exitScientificMode() {
    sciButtons.classList.remove('show');
    sciToggle.classList.remove('active');
    backBtn.style.display = 'none';
}

sciToggle.addEventListener('click', () => {
    playClickSound();
    enterScientificMode();
});

backBtn.addEventListener('click', () => {
    playClickSound();
    exitScientificMode();
});

exitScientificMode();

/* ================= Help chatbot ================= */

const helpBtn = document.getElementById('helpBtn');
const helpPanel = document.getElementById('helpPanel');
const helpClose = document.getElementById('helpClose');
const helpMessages = document.getElementById('helpMessages');
const helpInput = document.getElementById('helpInput');
const helpSend = document.getElementById('helpSend');

const helpKnowledge = [
    { keywords: ['sci', 'scientific'], answer: "The SCI button switches to scientific mode, revealing sin, cos, tan, log, ln, √, x^y, π, e, brackets and x! (factorial). Tap the orange Back button to return to the simple calculator." },
    { keywords: ['back'], answer: "The orange Back button appears only in scientific mode — tap it to return to the simple calculator layout." },
    { keywords: ['ac', 'clear', 'reset'], answer: "AC clears the entire display and starts a fresh calculation." },
    { keywords: ['del', 'delete', 'backspace'], answer: "DEL removes the last character you typed, one at a time." },
    { keywords: ['%', 'percent'], answer: "% works like a normal modulo/percent operator, e.g. 50%2 gives the remainder." },
    { keywords: ['sin'], answer: "sin( calculates the sine of an angle in degrees, e.g. sin(30) = 0.5." },
    { keywords: ['cos'], answer: "cos( calculates the cosine of an angle in degrees, e.g. cos(60) = 0.5." },
    { keywords: ['tan'], answer: "tan( calculates the tangent of an angle in degrees." },
    { keywords: ['ln'], answer: "ln( calculates the natural logarithm (base e) of a number." },
    { keywords: ['log'], answer: "log( calculates the base-10 logarithm of a number." },
    { keywords: ['sqrt', 'square root', '√'], answer: "√( (sqrt) calculates the square root of a number, e.g. √(9) = 3." },
    { keywords: ['x^y', 'power', '^'], answer: "x^y raises a number to a power, e.g. 2^3 = 8." },
    { keywords: ['factorial', 'x!', '!'], answer: "x! calculates a factorial, e.g. 5! = 120." },
    { keywords: ['pi', 'π'], answer: "π inserts the value of pi (3.14159...) into your expression." },
    { keywords: ['bracket', 'parenthes', '(', ')'], answer: "Use ( and ) in scientific mode to group parts of a longer expression, just like on paper." },
    { keywords: ['sound', 'beep', 'click', 'voice', 'noise'], answer: "Every button press plays a short click/beep sound automatically — no setting needed. Make sure your device volume is turned up." },
    { keywords: ['equal', '='], answer: "= evaluates whatever expression is currently on the display." },
    { keywords: ['point', 'decimal', '.'], answer: "The . button inserts a decimal point, e.g. 3.14." },
    { keywords: ['hi', 'hello', 'hey'], answer: "Hi, I'm Vedhi 🪆! Ask me about any button — for example \"what does SCI do?\" or \"how do I use sqrt?\"." }
];

const helpFallback = "Hmm, I'm not sure about that one 🪆. Try asking about a specific button, like AC, DEL, SCI, Back, sin, cos, tan, log, ln, sqrt, x^y, π, x!, or the click sound.";

function addHelpMessage(text, sender) {
    let bubble = document.createElement('div');
    bubble.className = 'msg ' + sender;
    bubble.textContent = text;
    helpMessages.appendChild(bubble);
    helpMessages.scrollTop = helpMessages.scrollHeight;
}

function answerHelpQuestion(question) {
    let lower = question.toLowerCase();
    for (let entry of helpKnowledge) {
        if (entry.keywords.some(k => lower.includes(k))) {
            return entry.answer;
        }
    }
    return helpFallback;
}

function sendHelpMessage() {
    let text = helpInput.value.trim();
    if (text === '') return;

    addHelpMessage(text, 'user');
    helpInput.value = '';

    let reply = answerHelpQuestion(text);
    setTimeout(() => addHelpMessage(reply, 'bot'), 300);
}

helpBtn.addEventListener('click', () => {
    playClickSound();
    helpPanel.classList.add('show');
    if (helpMessages.children.length === 0) {
        addHelpMessage("Hi, I'm Vedhi 🪆 — your calculator helper! Ask me what any button does, e.g. \"what does SCI do?\" or \"how do I use log?\".", 'bot');
    }
    helpInput.focus();
});

helpClose.addEventListener('click', () => {
    helpPanel.classList.remove('show');
});

helpSend.addEventListener('click', sendHelpMessage);

helpInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        sendHelpMessage();
    }
});