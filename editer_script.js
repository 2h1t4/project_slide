const game = document.getElementById("game");
const player = document.getElementById("player");
const rect = game.getBoundingClientRect();
const notes = document.getElementById("notes");
const notesList = [];
const startTime = performance.now();
const travelTime = 1400; 
const judgeLineY = 850;
const judgeText = document.getElementById("judgeText");
const judgeTime = document.getElementById("judgeTime");
const score = document.getElementById("score");
const combo = document.getElementById("combo");
const life = document.getElementById("life");
const music = document.getElementById("music");
let offset = 260;
let numNotes = 0;

let playerX = 385;
const playerWidth = 120;
const noteWidth = 100;

let audioStartTime = 0;
let isPlaying = false;

console.log("エディター読み込み完了（Smooth Audio Clock適用済み）");

document.addEventListener("mousemove", (event) => {
    let x = event.clientX - rect.left;
    x -= playerWidth / 2;
    if (x < 0) {
        x = 0;
    }
    if (x > game.clientWidth - playerWidth) {
        x = game.clientWidth - playerWidth;
    }
    playerX = x;
    player.style.left = x + "px";
});

let ispressed = false;

document.addEventListener("keydown", (event) => {
    if (event.code === "Enter") return; 
    if (event.repeat) return;
    ispressed = true;
});


function getSmoothMusicTime() {
    if (!isPlaying) {
        return music.currentTime * 1000;
    }
    const smoothTime = performance.now() - audioStartTime;
    const actualTime = music.currentTime * 1000;

    // 音源の実際の再生時間と大幅な開きがある場合は位置補正
    if (Math.abs(smoothTime - actualTime) > 150) {
        audioStartTime = performance.now() - actualTime;
        return actualTime;
    }
    return smoothTime;
}

// BPMとタイムライングリッド線
let bpm = 114;
let noteIntervalSec = 60 / bpm;
let totalDurationSec = 180;
const gridLinesList = [];

function initTimelineLines(totalDurationSec, bpm) {
    const container = document.getElementById("gridLine");
    if (!container) return;
    container.innerHTML = "";
    gridLinesList.length = 0;

    const intervalSec = 60 / bpm;
    let count = 0;

    for (let t = 0; t <= totalDurationSec; t += intervalSec) {
        const line = document.createElement("div");
        line.className = "grid-line";
        if (count % 4 === 0) {
            line.classList.add("bar-line");
        }
        container.appendChild(line);

        gridLinesList.push({
            timeMs: t * 1000,
            element: line
        });
        count++;
    }
}
initTimelineLines(totalDurationSec, bpm);

function updateTimelineLines(currentMusicTime) {
    for (let i = 0; i < gridLinesList.length; i++) {
        const lineObj = gridLinesList[i];
        const remain = lineObj.timeMs - currentMusicTime;
        const progress = 1 - remain / travelTime;
        const y = progress * judgeLineY;

        if (y >= -20 && y <= judgeLineY + 60) {
            lineObj.element.style.display = "block";
            lineObj.element.style.top = `${y}px`;
        } else {
            lineObj.element.style.display = "none";
        }
    }
}

// ノーツの生成と管理
function createNote(x, noteTime) {
    const newNote = document.createElement("div");
    newNote.className = "note";
    newNote.style.left = x + "px";
    notes.appendChild(newNote);
    notesList.push({
        x: x,
        noteTime: noteTime,
        element: newNote
    });
}

function clearNotes() {
    notesList.forEach(note => {
        if (note.element && note.element.parentNode) {
            note.element.remove();
        }
    });
    notesList.length = 0;
}

function loadChartData(data) {
    clearNotes();
    numNotes = data.length;
    let accumulatedTime = 0;
    data.forEach(item => {
        accumulatedTime += item.noteTime;
        createNote(item.x, accumulatedTime);
    });
}

// 起動時に chart.json を自動取得試行
async function loadDefaultChart() {
    try {
        const res = await fetch("chart.json");
        if (res.ok) {
            const data = await res.json();
            loadChartData(data);
        }
    } catch (e) {
        console.log("chart.json 自動読込スキップ（ファイル選択ボタンから読込可能）:", e);
    }
}
loadDefaultChart();

// ファイル選択UIからの読み込みハンドラ
const chartInput = document.getElementById("chartInput");
if (chartInput) {
    chartInput.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                loadChartData(data);
            } catch (err) {
                alert("JSONファイルの読み込みに失敗しました。フォーマットを確認してください。");
            }
        };
        reader.readAsText(file);
    });
}

function saveChart(chartData) {
    const json = JSON.stringify(chartData, null, 4);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "chart.json";
    a.click();
    URL.revokeObjectURL(url);
}

// スムーズな音楽時間計算関数 (Smooth Audio Clock + offset)
function getSmoothMusicTime() {
    if (!isPlaying) {
        return (music.currentTime * 1000) - offset;
    }
    const smoothTime = (performance.now() - audioStartTime) - offset;
    const actualTime = (music.currentTime * 1000) - offset;

    if (Math.abs(smoothTime - actualTime) > 150) {
        audioStartTime = performance.now() - (music.currentTime * 1000);
        return actualTime;
    }
    return smoothTime;
}

// 判定表示・スコア・コンボ関数
function showJudge(text, judgeError) {
    judgeText.textContent = text;
    judgeText.style.opacity = 1;
    if (judgeTime) {
        judgeTime.textContent = judgeError ? Math.round(judgeError) : "";
        judgeTime.style.opacity = 1;
    }

    setTimeout(() => {
        judgeText.style.opacity = 0;
        if (judgeTime) judgeTime.style.opacity = 0;
    }, 300);
}

let sumScore = 0;
if (score) score.textContent = Math.floor(sumScore).toString().padStart(7, "0");

function scoreCheck(text) {   
    let noteScore = numNotes > 0 ? 1000000 / numNotes : 0;
    if (text == "perfect") {
        sumScore += noteScore;
    } else if (text == "great") {
        sumScore += noteScore * 0.7;
    }
    if (score) score.textContent = Math.floor(sumScore).toString().padStart(7, "0");
}

let totalConbo = 0; 
if (combo) combo.textContent = totalConbo;

function comboCount(text) {
    if (text == "perfect" || text == "great") {
        totalConbo += 1;
    } else if (text == "miss") {
        totalConbo = 0;
    }
    if (combo) combo.textContent = totalConbo;
}

function checkHit(currentTime) {
    const playerRight = playerX + playerWidth;

    for (let i = notesList.length - 1; i >= 0; i--) {
        const note = notesList[i];
        const noteLeft = note.x;
        const noteRight = note.x + noteWidth;

        const error = Math.abs(currentTime - note.noteTime);
        const judgeError = note.noteTime - currentTime;

        const isOverlapX = playerX < noteRight && playerRight > noteLeft;

        if (
            ispressed == true &&
            isOverlapX &&
            error < 85 &&
            error > 80
        ) {
            note.element.remove();
            notesList.splice(i, 1);
            showJudge("miss", judgeError);
            comboCount("miss");
            break;
        }
        else if (
            ispressed == true &&
            isOverlapX &&
            error <= 80 &&
            error > 50
        ) {
            note.element.remove();
            notesList.splice(i, 1);
            showJudge("great", judgeError);
            scoreCheck("great");
            comboCount("great");
            break;
        }
        else if (
            ispressed == true &&
            isOverlapX &&
            error <= 50
        ) {
            note.element.remove();
            notesList.splice(i, 1);
            showJudge("perfect", judgeError);
            scoreCheck("perfect");
            comboCount("perfect");
            break;
        }
    }
}

function updatanote(currentTime) {
    for (let i = notesList.length - 1; i >= 0; i--) {
        const note = notesList[i];
        const remain = note.noteTime - currentTime;
        const progress = 1 - remain / travelTime;
        const y = progress * judgeLineY;
        
        if (y >= -50 && y <= judgeLineY + 100) {
            note.element.style.display = "block";
            note.element.style.top = (y - 18) + "px";
        } else if (y < -50) {
            note.element.style.display = "none";
        }

        const error = currentTime - note.noteTime;
        if (isPlaying && error > 500) {
            note.element.remove();
            notesList.splice(i, 1);
            showJudge("miss");
            comboCount("miss");
        }
    }
}

document.addEventListener("keydown", (event) => {
    if (event.code !== "Enter") return;
    if (event.repeat) return;

    isPlaying = !isPlaying;

    if (isPlaying) {
        audioStartTime = performance.now() - (music.currentTime * 1000);
        music.play();
    } else {
        music.pause();
    }
});

function gameLoop() {
    const currentMusicTime = getSmoothMusicTime();
    updateTimelineLines(currentMusicTime);

    if (isPlaying) {
        checkHit(currentMusicTime);
        updatanote(currentMusicTime);
        ispressed = false;
    } else {
        updatanote(currentMusicTime);
    }

    requestAnimationFrame(gameLoop);
}
gameLoop();
