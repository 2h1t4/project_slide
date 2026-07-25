const game = document.getElementById("game")
const player = document.getElementById("player");
const rect = game.getBoundingClientRect();
const notes = document.getElementById("notes");
const notesList = [];
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
    ispressed = true;
});

function createNote(x,y){
    const newNote = document.createElement("div");
    newNote.className = "note";

    newNote.style.left = x + "px";
    newNote.style.top = y + "px";
    notes.appendChild(newNote);
    notesList.push({
        x: x,
        y: y,
        element:newNote
    });
}
createNote(200,-100);
createNote(100,-200);
createNote(300,-300);
createNote(400,-400);
createNote(500,-500);
createNote(500,-550);
createNote(500,-600);
createNote(500,-650);
createNote(500,-700);
createNote(500,-750);
createNote(300,-900);
createNote(350,-920);
createNote(400,-940);
createNote(450,-960);
createNote(450,-1160);
createNote(460,-1163);




function updatanote(){
    for(let i = notesList.length - 1; i >= 0; i--){
        const note = notesList[i];
        note.y += 5;
        note.element.style.top = note.y + "px";

        if(note.y > 660){
            note.element.remove();
            notesList.splice(i,1);
            console.log("miss");
        }        
    }
}

function checkHit(){
    const playerRect = player.getBoundingClientRect();

    for(let i = notesList.length - 1; i >= 0; i--){
        const note = notesList[i];
        const noteRect = note.element.getBoundingClientRect();
        
        if(
            ispressed == true &&
            playerRect.left < noteRect.right &&
            playerRect.right > noteRect.left &&
            playerRect.top -20 < noteRect.bottom &&
            playerRect.top - 11 > noteRect.bottom 
        ){
            note.element.remove();
            notesList.splice(i,1);
            console.log("miss");
            break;
        }
        else if(
            ispressed == true &&
            playerRect.left < noteRect.right &&
            playerRect.right > noteRect.left &&
            playerRect.top -10 < noteRect.bottom &&
            playerRect.top - 1 > noteRect.bottom 
        ){
            note.element.remove();
            notesList.splice(i,1);
            console.log("great");
            break;
        }
        else if(
            ispressed == true &&
            playerRect.left < noteRect.right &&
            playerRect.right > noteRect.left &&
            playerRect.top  < noteRect.bottom &&
            playerRect.bottom - 10 > noteRect.top 
        ){
            note.element.remove();
            notesList.splice(i,1);
            console.log("perfect");
            break;
        }
        else if(
            ispressed == true &&
            playerRect.left < noteRect.right &&
            playerRect.right > noteRect.left &&
            playerRect.bottom -9  < noteRect.top &&
            playerRect.bottom + 1 > noteRect.top 
        ){
            note.element.remove();
            notesList.splice(i,1);
            console.log("great");
            break;
        }
    }
}
function gameLoop(){
    updatanote();
    checkHit();
    ispressed = false;

    requestAnimationFrame(gameLoop);
    
}
gameLoop();
