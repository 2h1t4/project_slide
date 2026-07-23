const game = document.getElementById("game")
const player = document.getElementById("player");
const rect = game.getBoundingClientRect()
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

function createNote(x){
    const note = document.createElement("div");
    note.className = "note";

    note.style.left = x + "px";
    note.style.top = "0px";
    game.appendChild(note);
}
createNote(10);