<<<<<<< HEAD

document.querySelectorAll('.card').forEach(card => {
    card.onclick = () => {

        // 現在選択されているカードを解除
        document.querySelector('.selected')
            ?.classList.remove('selected');

        // クリックしたカードを選択状態にする
        card.classList.add('selected');

        // 曲情報を更新
        document.querySelector('.info').innerHTML = `
            <button class="game-start">GAME START</button>
            <h2>${card.querySelector('h2').textContent}</h2>
            <p>${card.querySelector('p').textContent}</p>
        `;
    };
});

document.querySelector('.back-btn').addEventListener('click', () => {
    window.location.href = "./Music select screen.html";
});

const levelButtons = document.querySelectorAll(".level-btn");
const cards = document.querySelectorAll(".card");

levelButtons.forEach(button => {
    button.addEventListener("click", () => {

        // レベルボタンの選択切り替え
        document.querySelector(".level-btn.active")
            ?.classList.remove("active");
        button.classList.add("active");

        // 選択したレベル
        const selectedLevel = button.dataset.level;

        // 曲を表示・非表示
        cards.forEach(card => {
            if (
                selectedLevel === "All" ||
                card.dataset.level === selectedLevel
            ) {
                card.style.display = "";
            } 
            else {
                card.style.display = "none";
            }

        });

                // 表示されている曲があればSTART表示
        if (visibleCount > 0) {
            startButton.style.display = "block";
        } else {
            startButton.style.display = "none";
        }

    });
});

=======

document.querySelectorAll('.card').forEach(card => {
    card.onclick = () => {

        // 現在選択されているカードを解除
        document.querySelector('.selected')
            ?.classList.remove('selected');

        // クリックしたカードを選択状態にする
        card.classList.add('selected');

        // 曲情報を更新
        document.querySelector('.info').innerHTML = `
            <button class="game-start">GAME START</button>
            <h2>${card.querySelector('h2').textContent}</h2>
            <p>${card.querySelector('p').textContent}</p>
        `;
    };
});

document.querySelector('.back-btn').addEventListener('click', () => {
    window.location.href = "./MusicSelectScreen.html";
});

const levelButtons = document.querySelectorAll(".level-btn");
const cards = document.querySelectorAll(".card");

levelButtons.forEach(button => {
    button.addEventListener("click", () => {

        // レベルボタンの選択切り替え
        document.querySelector(".level-btn.active")
            ?.classList.remove("active");
        button.classList.add("active");

        // 選択したレベル
        const selectedLevel = button.dataset.level;

        // 曲を表示・非表示
        cards.forEach(card => {
            if (
                selectedLevel === "All" ||
                card.dataset.level === selectedLevel
            ) {
                card.style.display = "";
            } 
            else {
                card.style.display = "none";
            }

        });

                // 表示されている曲があればSTART表示
        if (visibleCount > 0) {
            startButton.style.display = "block";
        } else {
            startButton.style.display = "none";
        }

    });
});

>>>>>>> a8a747f230fc880c8a92d5f1d73e3c0ec13e5d9d
