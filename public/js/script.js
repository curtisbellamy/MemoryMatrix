// init the game in the specified html div container
function StartGame(htmlContainer) {
    localStorage.setItem("score", "0")

    const gameJsFileName = '/js/script.js';
    const SoundPaths = {
        lvUp: '../Assets/sound/level-up.mp3',
    };

    // icons
    const pauseIcon = `<i class="material-icons">pause</i>`;
    const resumeIcon = `<i class="material-icons">play_arrow</i>`;
    const soundIcon = `<i class="material-icons">volume_up</i>`;
    const mutedIcon = `<i class="material-icons">volume_off</i>`;
    const terminateIcon = `<i class="material-icons">done_outline</i>`;
    const restartIcon = `<i class="material-icons" style="font-size:50px;">refresh</i>`;


    const filePath = (function getFilePath() {
        let scripts = document.getElementsByTagName('script');

        for (let i = 0; i < scripts.length; ++i) {
            const src = scripts[i].src;
            const lastSlash = src.lastIndexOf('/');
            if (src.substring(lastSlash+1) === gameJsFileName){
                return path = src.substring(0, lastSlash+1);
            }
        }
    })();



    const Sound = {
        lvUp: null, 
    };


    (function createGame() {

        htmlContainer.innerHTML = `
            <div id="content-container">

                <div id="toolbar">
                    <div id="controls">
                        <button id="pause" class="controlButtons">${pauseIcon}</button>
                        <button id="mute" class="controlButtons">${soundIcon}</button>
                        <button id="terminate" class="controlButtons">${terminateIcon}</button>

                    </div>
                    <div class="pull-top pull-right">
                        <b class="status">SCORE: <span id="score">--</span></b>
                        <b class="status">TILES: <span id="tilesRemaining">--</span></b>
                    </div>
                </div>
                <div id="game-container"><button id="play">PLAY</button></div>
            </div>
        `;


        GameControl();
        initSounds();
    })();


    function GameControl() {
        const pauseBtn = document.getElementById('pause');
        pauseBtn.onclick = pauseBtnClick.bind(null, pauseBtn);

        const muteBtn = document.getElementById('mute');
        muteBtn.onclick = muteBtnClick.bind(null, muteBtn);

        const terminateBtn = document.getElementById('terminate');
        terminateBtn.onclick = terminateBtnClick.bind(null, terminateBtn);

        document.getElementById('play').onclick = () => {
            resetGameStateAndRun();
        };
    }

    function initSounds() {
        Sound.lvUp = new Audio(filePath + SoundPaths.lvUp);
        console.log(filePath)
    }

    let row, col, tilesTobeClicked, prevLvScore, score;

    function resetGameStateAndRun() {
        row = 5;
        col = 5;
        tilesTobeClicked = 4;
        prevLvScore = 0;
        score = 0;

        reset();
    }

    function reset() {
        cleanUpPrevLevelState();
        updateGameStatusBar();
        createNewTiles();
        pickRandomCorrectTiles();
        flashTargetTiles(1500, 
                rotateTiles.bind(null, 500, () => {
                    allowClick = true;
                })
            );
    }

    let tileClicked = 0, wrongClick = false, allowClick = false;

    const allTiles = [], targetTiles = [];


    function cleanUpPrevLevelState() {
        tileClicked = 0;
        wrongClick = false;
        allowClick = false;
        allTiles.length = 0;
        targetTiles.length = 0;
    }

    function updateGameStatusBar() {
        document.getElementById('score').innerText = (score === undefined) ? '--' : score;
        document.getElementById('tilesRemaining').innerText = (tilesTobeClicked === undefined) ? '--' : tilesTobeClicked - tileClicked;

    }


    function createNewTiles() {

        const tilesContainer = document.createElement('div');
        tilesContainer.setAttribute('id', 'tileContainer');

        const gameContainer = document.getElementById('game-container');

        gameContainer.innerHTML = '';
        gameContainer.appendChild(tilesContainer);

        // create new tiles
        for (let y = 0; y < row; ++y) {
            let row = document.createElement('div');
            row.setAttribute('class', 'tileRows');
            tilesContainer.appendChild(row);

            for (let x = 0; x < col; ++x) {
                let tile = document.createElement('button');
                tile.setAttribute('class', 'tiles');
                tile.onclick = () => { tileClick(tile) }
                row.appendChild(tile)
                allTiles.push(tile)
            }
        }
    }

    function tileClick(tile) {
        if (!allowClick) {
            return;
        }
        
        ++tileClicked;


        tile.onclick = null;

        tile.classList.add('flip-transform');

        checkClickedTileIsCorrect(tile);

        if (tileClicked == tilesTobeClicked) {
            allowClick = false;
            evalCurrentLevel();
        }
    }


    function checkClickedTileIsCorrect(tile) {
        if (targetTiles.includes(tile)) {
            ++score;
            localStorage.setItem("score", String(score))
            updateGameStatusBar();
            tile.classList.add('correct-tiles-lw');
        } else {
            wrongClick = true;
            --score;
            localStorage.setItem("score", String(score))
            updateGameStatusBar();
            tile.classList.add('wrong-tiles-lw');
        }
    }


    function evalCurrentLevel() {

        revealResult();

        setTimeout(() => {
            if (score <= 0) {

                gameOver();
            } else {

                if (wrongClick) {
                    decreaseDifficulty();
                } else {
                    increaseDifficulty();
                }
                prevLvScore = score;
                reset();
            }
        }, 850);
    }

    function pickRandomCorrectTiles() {
        while (targetTiles.length < tilesTobeClicked) {
            let rd = Math.floor(Math.random() * allTiles.length)
            if (!targetTiles.includes(allTiles[rd]))
                targetTiles.push(allTiles[rd])
        }
    }


    function flashTargetTiles(ms = 1000, callback) {
        const promises = [];
        targetTiles.forEach((tile) => {

            tile.classList.add('targetTiles');

            promises.push(setTimeoutPromise(() => {

                tile.classList.remove('targetTiles');
            }, ms))
        })
        if (callback) {
            Promise.all(promises)
            .then(callback)
        }
    }


    function setTimeoutPromise(func, ms) {
        return new Promise((res) => {
            setTimeout(() => {
                func();
                res();
            }, ms);
        });
    }


    function rotateTiles(ms = 500, callback) {
        const tiles = document.getElementById('tileContainer');

        setTimeout(() => {
            if (Math.random() < 0.5) {
                tiles.classList.add('rotatecw');
            } else {
                tiles.classList.add('rotateccw')
            }

            if (callback) {
                callback();
            }
        }, ms);
    }



    function revealResult() {
        targetTiles.forEach((tile) => {
            tile.classList.add('targetTiles');
        })
    }

    function gameOver() {

        const gameOverText = document.createElement('h1');
        gameOverText.setAttribute('id', 'gameOver');
        gameOverText.innerText = 'Game Over';

        const restartBtn = document.createElement('button');
        restartBtn.setAttribute('id', 'restart');
        restartBtn.innerHTML = restartIcon;
        restartBtn.onclick = resetGameStateAndRun;

        const gameContainer =  document.getElementById('game-container');
        gameContainer.innerHTML = '';
        gameContainer.appendChild(gameOverText);
        gameContainer.appendChild(restartBtn);
    }


    function increaseDifficulty() {
        playSoundEffect(Sound.lvUp);

        // max 7x7
        if (row < 7 || col < 7) {
            if (row === col) {
                ++col;
            } else {
                ++row;
            }
            ++tilesTobeClicked;
        }
    }


    function decreaseDifficulty() {
        // min 3x3
        if (row > 3 || col > 3) {
            if (row === col) {
                --row;
            } else {
                --col;
            }
            --tilesTobeClicked;
        }
    }


    let gameIsPaused = false;

    function pauseGame() {

        score = prevLvScore;
        updateGameStatusBar();
        
        gameIsPaused = true;

        createHightlightResumeBtn();
    }

    function createHightlightResumeBtn() {
        const resumeBtn = document.createElement('button');
        resumeBtn.innerText = 'Resume';
        resumeBtn.setAttribute('id', 'resume');
        resumeBtn.onclick = () => {
            document.getElementById('pause').click();
        };

        const gameContainer = document.getElementById('game-container');
        gameContainer.innerHTML = '';
        gameContainer.appendChild(resumeBtn);
    }


    function resumeGame() {
        if (gameIsPaused) {
            gameIsPaused = false;


            if (isNaN(tilesTobeClicked)) {
                resetGameStateAndRun();
            } else{
                reset();
            }
        }
    }

    function pauseBtnClick(btn) {
        if (btn.innerHTML === pauseIcon) {
            pauseGame();
            btn.innerHTML = resumeIcon;
        } else {
            resumeGame();
            btn.innerHTML = pauseIcon;
        }
    }

    // Get the modal
    let modal = document.getElementById("myModal");

    // Get the <span> element that closes the modal
    let span = document.getElementsByClassName("close")[0].onclick = () => {
        modal.style.display = "none";
    }

    let noBtn = document.getElementById("noBtn").onclick = () => {
        modal.style.display = "none";
    }

    let yesBtn = document.getElementById("yesBtn").onclick = () => {
        modal.style.display = "none";
        result()
    }

    function terminateBtnClick(btn) {
        btn.onclick = function() {
            modal.style.display = "block";
        }
    }

    window.onclick = function(event) {
        if (event.target == modal) {
          modal.style.display = "none";
        }
      }


    let allowSound = true;

    function muteGame() {
        allowSound = false;
    }

    function unmuteGame() {
        allowSound = true;
    }

    function muteBtnClick(btn) {
        if (btn.innerHTML === soundIcon) {
            btn.innerHTML = mutedIcon;
            muteGame();
        } else {
            btn.innerHTML = soundIcon;
            unmuteGame();
        }
    }

    function playSoundEffect(sound) {
        if (allowSound) {
            sound.currentTime = 0;
            sound.play();
        }
    }

    return {
        restart: () => {
            resetGameStateAndRun();
        },
        pause: pauseGame,
        resume: resumeGame,
        mute: muteGame,
        unmute: unmuteGame,

        end: () => {
            let cs = score;
            revealResult();
            allowClick = false;
            return cs;
        },
        getScore: () => {
            return score;
        }
    };
}

