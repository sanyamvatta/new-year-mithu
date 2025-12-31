// --- 1. REMOVE PRELOADER ---
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    preloader.style.opacity = '0';
    setTimeout(() => {
        preloader.style.display = 'none';
    }, 800);
});

// --- 2. SCROLL REVEAL ---
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.hidden').forEach((el) => observer.observe(el));

// --- 3. VIBE BUTTON ---
const vibes = [
    "You look really pretty today. 🌸",
    "Sending a virtual hug... Loading... 🤗",
    "Remember that time you snorted laughing? Cute. 🐽",
    "I'm obsessed with you. Just saying. 👀",
    "You are my favorite notification. 📱",
    "Stop stressing. I got you. 🛡️"
];

function dispenseVibe() {
    const display = document.getElementById('vibe-display');
    const randomVibe = vibes[Math.floor(Math.random() * vibes.length)];
    display.style.opacity = 0;
    setTimeout(() => {
        display.innerHTML = randomVibe;
        display.style.opacity = 1;
    }, 200);
    fireConfetti(30); // Small burst
}

// --- 4. POLAROID LOGIC (CLICK TO CHANGE) ---
function nextImage(polaroidElement) {
    const images = polaroidElement.querySelectorAll('img');
    let activeIndex = 0;

    // Find current active
    images.forEach((img, index) => {
        if(img.classList.contains('active')) {
            activeIndex = index;
            img.classList.remove('active');
        }
    });

    // Calculate next
    let nextIndex = (activeIndex + 1) % images.length;
    images[nextIndex].classList.add('active');
}

// --- 5. CONFETTI ENGINE ---
const canvas = document.getElementById('confetti-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let confetti = [];

function fireConfetti(amount = 100) {
    for (let i = 0; i < amount; i++) {
        confetti.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            color: `hsl(${Math.random() * 360}, 100%, 75%)`,
            size: Math.random() * 8 + 4,
            velocity: { x: Math.random() * 4 - 2, y: Math.random() * 5 + 2 }
        });
    }
}

function renderConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    confetti.forEach((p, index) => {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        
        p.y += p.velocity.y;
        p.x += p.velocity.x;

        if (p.y > canvas.height) confetti.splice(index, 1);
    });

    requestAnimationFrame(renderConfetti);
}

// Start loop
renderConfetti();

function startCelebration() {
    for(let i=0; i<6; i++) {
        setTimeout(() => fireConfetti(100), i * 300);
    }
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// --- MUSIC PLAYLIST LOGIC ---
const musicPlayer = document.getElementById('bg-music');
const musicBtn = document.getElementById('music-toggle');
musicPlayer.volume = 0.17;
// Song List (Make sure filenames match exactly)
const playlist = ['song1.mp3', 'song2.mp3'];
let currentSongIndex = 0;
let isPlaying = false;

// 1. Function to Load & Play a Song
function playTrack(index) {
    musicPlayer.src = playlist[index];
    musicPlayer.load();
    if (isPlaying) {
        musicPlayer.play().catch(e => console.log("Interaction needed first"));
    }
}

// 2. Main Toggle Function (Start/Stop)
function toggleMusic() {
    if (isPlaying) {
        musicPlayer.pause();
        musicBtn.innerHTML = "🎵 Play Music";
        isPlaying = false;
    } else {
        // If no source is set yet, load the first song
        if (!musicPlayer.src) {
            playTrack(currentSongIndex);
        }
        musicPlayer.play();
        musicBtn.innerHTML = "⏸️ Pause";
        isPlaying = true;
    }
}

// 3. Next Song Function
function nextSong() {
    currentSongIndex = (currentSongIndex + 1) % playlist.length; // Loop back to 0
    isPlaying = true; // Force play state
    playTrack(currentSongIndex);
    musicPlayer.play();
    musicBtn.innerHTML = "⏸️ Pause";
}

// 4. Auto-Play Next Song When Ended
musicPlayer.addEventListener('ended', () => {
    nextSong();
});

// 5. "AUTO START" ON FIRST INTERACTION
// Browsers block autoplay. We hook into the "Let's Start" button
// so the music starts "automatically" when she enters the site.
document.querySelector('.hero-btn').addEventListener('click', () => {
    if (!isPlaying) {
        isPlaying = true;
        playTrack(0); // Start Song 1
        musicPlayer.play();
        musicBtn.innerHTML = "⏸️ Pause";
    }
});

// Initialize first song (but don't play yet)
playTrack(0);

// --- VOW GAME LOGIC ---
let sealCount = 0;
const targetClicks = 100;
const sealBtn = document.getElementById('seal-btn');
const counterDisplay = document.getElementById('counter-display');
const rewardBox = document.getElementById('special-reward');

function sealVow() {
    // 1. Increment Count
    sealCount++;
    counterDisplay.innerText = `Seals: ${sealCount} / ${targetClicks}`;
    
    // 2. Add Pop Animation to Counter
    counterDisplay.classList.add('pop-anim');
    setTimeout(() => counterDisplay.classList.remove('pop-anim'), 200);

    // 3. Mini Confetti Burst on Every Click (Fun feedback!)
    fireConfetti(15); // Small burst

    // 4. Check for Win
    if (sealCount === targetClicks) {
        triggerWin();
    }
}

function triggerWin() {
    // Disable button so she doesn't keep clicking
    sealBtn.disabled = true;
    sealBtn.innerText = "VOW SEALED FOREVER! 🔒";
    sealBtn.style.backgroundColor = "#ccc"; // Grey out button
    
    // Show Reward
    rewardBox.style.display = "block";
    
    // HUGE Confetti Explosion
    startCelebration();
}