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
const chart = [
    {x:100, noteTime:1000},
    {x:250, noteTime:2000},
    {x:400, noteTime:3000},
    {x:650, noteTime:4000},
]



function updatanote(currentTime){
    
    for(let i = notesList.length - 1; i >= 0; i--){
        const note = notesList[i];
    

        const remain = note.noteTime - currentTime;
        const progress = 1 - remain / travelTime;
        const y = progress * judgeLineY
        note.element.style.top = (y - 18)+ "px";
        const error = currentTime - note.noteTime;
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
let totalNote = notesList.length;
let noteScore = 1000000 / totalNote;
function scoreCheck(text){
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
function checkHit(currentTime){
    const playerRect = player.getBoundingClientRect();

    for(let i = notesList.length - 1; i >= 0; i--){
        const note = notesList[i];
        const noteRect = note.element.getBoundingClientRect();
        const error = Math.abs(currentTime - note.noteTime);
        const judgeError = note.noteTime - currentTime;
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

let totalPausedTime = 0;
let isPlaying = false;
document.addEventListener("keydown",(event) =>{
    if(event.code !== "Space")return;
    if(event.repeat)return;
    isPlaying = !isPlaying;

});


function gameLoop(){
    const currentTime = performance.now() - startTime;
    if(isPlaying){
        checkHit(currentTime);
        updatanote(currentTime);
        ispressed = false;
    }
    
    requestAnimationFrame(gameLoop);
}
gameLoop();
