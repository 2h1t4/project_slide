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
    };
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
createNote(200,2000);
createNote(100,2500);
createNote(300,3000);
createNote(400,3500);
createNote(500,4000);
createNote(600,4100);
createNote(700,4200);
createNote(600,4300);
createNote(400,4400);
createNote(300,4500);
createNote(300,4600);
createNote(350,4700);
createNote(450,5000);
createNote(600,5160);
createNote(200,6000);
createNote(600,6050);




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
let totalNote = notesList.length;
let noteScore = 1000000 / totalNote;
let sumScore = 0;
function scoreCheck(text){
    
    
    if (text == "perfect"){
        sumScore += noteScore;
    }else if (text == "great"){
        sumScore += noteScore * 0.7;
    }
    score.textContent = sumScore;
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
            console.log(error);

            break;
        }
        
    }
}
let _y = 2000;
function gameLoop(){
    checkHit();
    updatanote();
    ispressed = false;

    requestAnimationFrame(gameLoop);
        

    
}
gameLoop();
const playerY = player.getBoundingClientRect().top - game.getBoundingClientRect().top;
console.log("player=" + playerY);