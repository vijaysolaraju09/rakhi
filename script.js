// Utility: toast and reveal
const toast = (msg)=> {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(()=>el.classList.remove('show'), 1800);
};

// IntersectionObserver for reveal panels
const io = new IntersectionObserver((entries)=> {
  entries.forEach(e=>{
    if(e.isIntersecting){ e.target.classList.add('visible'); }
  })
}, {threshold: 0.2});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

// ===== Scene 1: Flight =====
const plane = document.getElementById('plane');
const path = document.getElementById('flightPath');
const takeFlightBtn = document.getElementById('takeFlight');
const landedMsg = document.getElementById('landedMsg');

let inFlight = false;
takeFlightBtn.addEventListener('click', ()=>{
  if(inFlight) return;
  inFlight = true;
  takeFlightBtn.disabled = true;
  takeFlightBtn.textContent = 'Flying…';

  const pathLen = path.getTotalLength();
  const duration = 3500; // ms
  const start = performance.now();

  function tick(now){
    const t = Math.min(1, (now - start) / duration);
    const eased = easeInOutCubic(t);
    const p = path.getPointAtLength(pathLen * eased);
    const ahead = path.getPointAtLength(Math.max(0, Math.min(pathLen, pathLen * eased + 1)));
    const angle = Math.atan2(ahead.y - p.y, ahead.x - p.x) * 180/Math.PI;
    plane.setAttribute('transform', `translate(${p.x},${p.y}) rotate(${angle})`);
    if(t < 1){
      requestAnimationFrame(tick);
    }else{
      toast('Touchdown in India 🇮🇳');
      landedMsg.classList.remove('hidden');
      takeFlightBtn.textContent = 'Replay';
      takeFlightBtn.disabled = false;
      inFlight = false;
    }
  }
  requestAnimationFrame(tick);
});

function easeInOutCubic(x){ return x<0.5 ? 4*x*x*x : 1 - Math.pow(-2*x+2,3)/2; }

// ===== Scene 2: Characters & Rakhi =====
const broHand = document.getElementById('bro-hand');
const rakhi = document.getElementById('rakhi');
const giftArea = document.getElementById('gift-area');
let rakhiTied = false;

broHand.addEventListener('click', ()=>{
  if(rakhiTied) return;
  rakhi.classList.remove('hidden');
  requestAnimationFrame(()=> rakhi.classList.add('on'));
  rakhiTied = true;
  toast('Rakhi tied! 🎀');
  setTimeout(()=>{
    giftArea.classList.remove('hidden');
    toast('A gift appears 🎁');
  }, 700);
});

// Gift long-press + drag to open
const gift = document.getElementById('gift');
const lid = document.getElementById('lid');
const overlay = document.getElementById('overlay');
const closeOverlay = document.getElementById('closeOverlay');

let pressTimer=null, armed=false, startY=0;

const onPointerDown = (e)=>{
  if(!rakhiTied){ toast('First tie the rakhi on my hand!'); return; }
  const target = e.target.closest('#lid'); if(!target) return;
  e.preventDefault();
  startY = (e.touches ? e.touches[0].clientY : e.clientY);
  pressTimer = setTimeout(()=>{ armed=true; toast('Now drag up ⬆️'); }, 500);
};

const onPointerMove = (e)=>{
  if(!armed) return;
  const y = (e.touches ? e.touches[0].clientY : e.clientY);
  const dy = y - startY; // negative up
  const clamped = Math.max(-120, Math.min(0, dy));
  lid.style.transform = `translateY(${clamped}px) rotate(${clamped/20}deg)`;
  if(dy < -100){ openBox(); cleanupDrag(); }
};

function cleanupDrag(){
  clearTimeout(pressTimer); pressTimer=null; armed=false; startY=0;
  if(!gift.classList.contains('open')){ lid.style.transform=''; }
}
function openBox(){
  gift.classList.add('open');
  setTimeout(()=> overlay.classList.remove('hidden'), 480);
}

gift.addEventListener('mousedown', onPointerDown);
gift.addEventListener('touchstart', onPointerDown, {passive:false});
window.addEventListener('mousemove', onPointerMove, {passive:false});
window.addEventListener('touchmove', onPointerMove, {passive:false});
window.addEventListener('mouseup', cleanupDrag);
window.addEventListener('touchend', cleanupDrag);
window.addEventListener('touchcancel', cleanupDrag);

closeOverlay.addEventListener('click', ()=> overlay.classList.add('hidden'));

// Accessibility: Skip to bond scroll helper
document.getElementById('skipToBond').addEventListener('click', (e)=>{
  landedMsg.classList.remove('hidden');
});
