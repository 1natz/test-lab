const tiles = ['red', 'blue', 'green', 'yellow'];
let sequence = [];
let playerSequence = [];
let score = 0;
let highScore = localStorage.getItem('colorMemoryHighScore') || 0;
let isPlaying = false;

// --- Web Audio API Synth ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playTone(frequency, type, duration) {
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = type; // 'sine', 'square', 'sawtooth', 'triangle'
    oscillator.frequency.value = frequency;

    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + duration);
}

function playTileSound(color) {
    const tones = {
        red: 329.63, // E4
        blue: 261.63, // C4
        green: 392.00, // G4
        yellow: 523.25 // C5
    };
    playTone(tones[color] || 440, 'sine', 0.2);
}

function playGameOverSound() {
    playTone(150, 'sawtooth', 0.4);
}
// ---------------------------
    playTileSound(color); // Triggers audio synth on flash!
    setTimeout(() => {
        tile.classList.remove('active');
    }, 300);
}

document.querySelectorAll('.tile').forEach(tile => {
    tile.addEventListener('click', (e) => {
        if (!isPlaying) return;
        const color = e.target.dataset.color;
        playerSequence.push(color);
        flashTile(color); // flashTile handles the click sound automatically

        const currentIndex = playerSequence.length - 1;
        if (playerSequence[currentIndex] !== sequence[currentIndex]) {
            playGameOverSound(); // Triggers error sound on failure!
            const finalScore = score - 1;
            if (finalScore > highScore) {
                highScore = finalScore;
                localStorage.setItem('colorMemoryHighScore', highScore);
                alert(`New High Score! 🎉 Score: ${finalScore}`);
            } else {
                alert(`Game Over! Final Score: ${finalScore}`);
            }
            document.getElementById('start-btn').style.display = 'block';
            updateScoreDisplay();
            isPlaying = false;
            return;
        }

        if (playerSequence.length === sequence.length) {
            isPlaying = false;
            setTimeout(nextRound, 1000);
        }
    });
});
