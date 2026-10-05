onst tiles = ['red', 'blue', 'green', 'yellow'];
let sequence = [];
let playerSequence = [];
let score = 0;
let highScore = localStorage.getItem('colorMemoryHighScore') || 0;
let isPlaying = false;

document.getElementById('score').innerText = `Score: 0 | High Score: ${highScore}`;

function startGame() {
    sequence = [];
    playerSequence = [];
    score = 0;
    updateScoreDisplay();
    document.getElementById('start-btn').style.display = 'none';
    nextRound();
}

function updateScoreDisplay() {
    document.getElementById('score').innerText = `Score: ${score > 0 ? score - 1 : 0} | High Score: ${highScore}`;
}

function nextRound() {
    playerSequence = [];
    score++;
    updateScoreDisplay();
    const randomTile = tiles[Math.floor(Math.random() * tiles.length)];
    sequence.push(randomTile);
    playSequence();
}

function playSequence() {
    isPlaying = false;
    let i = 0;
    const interval = setInterval(() => {
        if (i >= sequence.length) {
            clearInterval(interval);
            isPlaying = true;
            return;
        }
        flashTile(sequence[i]);
        i++;
    }, 600);
}

function flashTile(color) {
    const tile = document.getElementById(color);
    tile.classList.add('active');
    setTimeout(() => {
        tile.classList.remove('active');
    }, 300);
}

document.querySelectorAll('.tile').forEach(tile => {
    tile.addEventListener('click', (e) => {
        if (!isPlaying) return;
        const color = e.target.dataset.color;
        playerSequence.push(color);
        flashTile(color);

        const currentIndex = playerSequence.length - 1;
        if (playerSequence[currentIndex] !== sequence[currentIndex]) {
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
