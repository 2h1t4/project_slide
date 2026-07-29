const game = document.getElementById("game")
const player = document.getElementById("player");
const rect = game.getBoundingClientRect();
const notes = document.getElementById("notes");
const notesList = [];
const startTime = performance.now();
const travelTime = 1500; 
const judgeLineY = 850;
const judgeText = document.getElementById("judgeText");
const judgeTime = document.getElementById("judgeTime");
const score = document.getElementById("score");
const combo = document.getElementById("combo");
const life = document.getElementById("life");
document.getElementById('game').style.cursor = 'none';
let timeCount = 0;
let numNotes = 0;

function calcTime(spawnTime){
    timeCount += spawnTime
    return timeCount;
}

console.log("読み込ませる");
document.addEventListener("mousemove",(event)=>{

    let x = event.clientX - rect.left;
    x -= player.offsetWidth / 2;
    if(x < 0){
        x = 0;
    }
    if(x > game.clientWidth - player.offsetWidth){
        x = game.clientWidth - player.offsetWidth
    }
    player.style.left = x + "px";
});

let ispressed = false;

document.addEventListener("keydown",(event) =>{
    if(event.code === "Enter")return; 
    if(event.repeat)return;
    ispressed = true;
    console.log("ahin");
});

function createNote(x,noteTime){
    const newNote = document.createElement("div");
    newNote.className = "note";

    newNote.style.left = x + "px";
    notes.appendChild(newNote);
    notesList.push({
        x: x,
        noteTime: noteTime,
        element:newNote
    });
}


async function loadChart(fileName){
    const res = await fetch(fileName);

    if(!res.ok){
        throw new Error("ファイルが開けませんでした");
    }

    const data = await res.json();

    numNotes = data.length;
    data.forEach(element => {
        createNote(
            element.x,
            calcTime(element.noteTime)
        );
    });
}
loadChart("chart.json");




function updatanote(){
    
    const currenTime = performance.now() - startTime;
    for(let i = notesList.length - 1; i >= 0; i--){
        const note = notesList[i];
    

        const remain = note.noteTime - currenTime;
        const progress = 1 - remain / travelTime;
        const y = progress * judgeLineY
        note.element.style.top = (y - 18)+ "px";
        const error = currenTime - note.noteTime;
        if(error > 500){
            note.element.remove();
            notesList.splice(i,1);
            showJudge("miss");
            comboCount("miss");
            
        }        
    }
}
function showJudge(text,judgeError){
    judgeText.textContent = text;
    judgeText.style.opacity = 1;
    judgeTime.textContent = judgeError;
    judgeTime.style.opacity = 1;

    setTimeout(() => {
        judgeText.style.opacity = 0;
        judgeTime.style.opacity = 0;
    }, 300);
}

let sumScore = 0;
score.textContent = Math.floor(sumScore).toString().padStart(7, "0");
function scoreCheck(text){   
    let noteScore = 1000000 / numNotes;
    if (text == "perfect"){
        sumScore += noteScore;
    }else if (text == "great"){
        sumScore += noteScore * 0.7;
    }
    score.textContent = Math.floor(sumScore).toString().padStart(7, "0");
}

let totalConbo = 0; 
combo.textContent = totalConbo;
function comboCount(text){
    if (text == "perfect" || text == "great"){
        totalConbo += 1;
    }else if (text == "miss"){
        totalConbo = 0;
    }
    combo.textContent = totalConbo;
}

function checkHit(){
    const playerRect = player.getBoundingClientRect();
    const currenTime = performance.now() - startTime;

    for(let i = notesList.length - 1; i >= 0; i--){
        const note = notesList[i];
        const noteRect = note.element.getBoundingClientRect();
        const error = Math.abs(currenTime - note.noteTime);
        const judgeError = note.noteTime - currenTime;
        if(
            ispressed == true &&
            playerRect.left < noteRect.right &&
            playerRect.right > noteRect.left &&
            error < 85 &&
            error > 80
        ){
            note.element.remove();
            notesList.splice(i,1);
            showJudge("miss",judgeError);
            comboCount("miss");
            
            console.log(error);

            break;
        }
        else if(
            ispressed == true &&
            playerRect.left < noteRect.right &&
            playerRect.right > noteRect.left &&
            error <= 80 &&
            error > 50
        ){
            note.element.remove();
            notesList.splice(i,1);
            showJudge("great",judgeError);
            scoreCheck("great");
            comboCount("great");
            console.log(error);
            break;
        }
        else if(
            ispressed == true &&
            playerRect.left < noteRect.right &&
            playerRect.right > noteRect.left &&
            error <= 50
        ){
            note.element.remove();
            notesList.splice(i,1);
            showJudge("perfect",judgeError);
            scoreCheck("perfect");
            comboCount("perfect");
            console.log(error);

            break;
        }
        
    }
}


function gameLoop(){
    checkHit();
    updatanote();
    ispressed = false;

    requestAnimationFrame(gameLoop);
}

gameLoop();
const playerY = player.getBoundingClientRect().top - game.getBoundingClientRect().top;
console.log("player=" + playerY);