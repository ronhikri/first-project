var gBoard;
var vSize = 4;
var size = 16;
var gGame;
const moqesh = '🎆';
const flag = '🏳‍🌈';
var second = 0;
var millsec = 0;
var gSetTimeout;
var gTimer;
var sizeLoopArr = 3;
var boolHints;
var boolSafeClick1;
var boolSafeClick2;
var boolSafeClick3;

function initGame() {
    var posBth = document.querySelector('.position');
    posBth.style.display = 'none';
    var elbth1 = document.querySelector('.haim1');
    elbth1.innerHTML = '🧡';
    var elbth2 = document.querySelector('.haim2');
    elbth2.innerHTML = '🧡';
    var elbth3 = document.querySelector('.haim3');
    elbth3.innerHTML = '🧡';

    if (gTimer) clearInterval(gTimer);
    second = 0;
    millsec = 0;
    boolHints=false;
    boolSafeClick1=false;
    boolSafeClick2=false;
    boolSafeClick3=false;
    game = createGgame();
    gBoard = createBoard();
    renderBoard();
}


function createGgame() {
    var game = {
        isOn: false,
        shownCount: 0,
        markedCount: 0,
        secPassed: 0,
        countBooms: 0,
        countDied: 0
    }
    return game;

}
function createBoard() {
    var gBoard = [];
    for (var i = 0; i < vSize; i++) {
        gBoard[i] = [];
        for (var j = 0; j < vSize; j++) {
            var cell = {
                mineAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }


            gBoard[i][j] = cell;
        }

    }
    return gBoard;

}


function renderBoard() {
    var num = 0;
    var strHtml = '';
    for (var i = 0; i < gBoard.length; i++) {
        var row = gBoard[i];
        strHtml += '<tr>';
        for (var j = 0; j < row.length; j++) {
            // figure class name
            var tdId = `cell-${i}-${j}`;

            strHtml += `<td id="${tdId}" onclick="cellclicked(this,${i},${j})" oncontextmenu="cellRightCilck(this,${i},${j})">${''}</td>`
        }
        strHtml += '</tr>';
    }
    var elMat = document.querySelector('.board');
    elMat.innerHTML = strHtml;
}
function cellclicked(element, i, j) {
    if (!game.isOn) {
        startTheGame(i, j);
    }
    if (!boolHints) {
        if (gBoard[i][j].isShown === false) {
            console.log('h');
            if (gBoard[i][j].isMine === false) {
                var countNeigh = countNeighboreCell(i, j);
                if (countNeigh > 0) {
                    cellWithNeighbores(i, j, countNeigh);
                    gBoard[i][j].isShown = true;
                    game.shownCount++;

                } else {
                    clickNothingNeighbores(i, j);
                    gBoard[i][j].isShown = true;
                    game.shownCount++;






                }
                if (game.markedCount === game.countBooms - game.countDied && game.shownCount === size - game.countBooms) {
                    victoryGame();
                }

            } else {
                diedLife(i, j);

            }
        }
    } else {
        checkHimts(i, j);
    }
}
function cellRightCilck(element, i, j) {
    if (!gBoard[i][j].isShown) {
        toggleCellBoard(i, j);
        if (game.markedCount === game.countBooms - game.countDied && game.shownCount === size - game.countBooms) {
            victoryGame();

        }

    }
}

function countNeighboresMinesInMat() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            if (gBoard[i][j].isMine === false) {
                gBoard[i][j].mineAroundCount = countNeighboreCell(i, j);
            }

        }
    }
}
function countNeighboreCell(idex, jdex) {
    var count = 0;
    for (var i = idex - 1; i <= idex + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = jdex - 1; j <= jdex + 1; j++) {
            if (j < 0 || j >= gBoard[0].length) continue;
            if (i === idex && j === jdex) continue;
            if (gBoard[i][j].isMine === true) count++;

        }
    }
    return count;

}
function getRandomInt(num1, num2) {
    var min = 0;
    var max = 0;
    num1 = Math.floor(num1);
    num2 = Math.floor(num2);
    if (num1 > num2) {
        max = num1;
        min = num2;
    } else {
        min = num1;
        max = num2;
    }
    var res = Math.floor(Math.random() * (max - min) + min);
    return res;

}
function secTimer() {
    millsec++;
    if (millsec === 10) {
        millsec = 0;
        second++;
    }
    game.secPassed = second;
    var timeEl = document.querySelector('.timer h2');
    timeEl.innerText = `the time from start game is ${second}: ${millsec}`

}
function createPositions(idx, jdx) {
    var arr = [];
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (i === idx && j === jdx) continue;
            pos = {
                i: i,
                j: j
            }
            arr.push(pos);
        }
    }
    return arr;
}
function getRandomMine(idx, jdx) {
    var arr = createPositions(idx, jdx);
    for (var i = 0; i < sizeLoopArr; i++) {
        var index = getRandomInt(0, arr.length);
        var pos = arr[index];
        gBoard[pos.i][pos.j].isMine = true;
        arr.splice(index, 1);
    }
}
function getMarkedCell(i, j) {
    var elCell = document.querySelector(`#cell-${i}-${j}`);
    elCell.classList.add('selected');
}
function writeCountNeighboresMines(i, j, count) {
    var elCell = document.querySelector(`#cell-${i}-${j}`);
    elCell.innerText = count;

}
function startTheGame(i, j) {
    getRandomMine(i, j);
    countNeighboresMinesInMat();
    renderBoard();
    game.isOn = true;
    game.countBooms = countBoomsInMat();
    console.log(game.countBooms);
    gTimer = setInterval(secTimer, 100);

}
function cellWithNeighbores(i, j, count) {
    getMarkedCell(i, j);
    writeCountNeighboresMines(i, j, count);


}
function clickNothingNeighbores(idx, jdx) {
    cellWithNeighbores(idx, jdx, 0);
    for (var i = idx - 1; i <= idx + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = jdx - 1; j <= jdx + 1; j++) {
            if (j < 0 || j >= gBoard[0].length) continue;
            if (i === idx && j === jdx) continue;
            var count = countNeighboreCell(i, j);
            cellWithNeighbores(i, j, count);
            if (gBoard[i][j].isShown === false) {
                gBoard[i][j].isShown = true;
                game.shownCount++;
            }
        }
    }
}
function gameOver() {
    clearInterval(gTimer);
    var posBth = document.querySelector('.position');
    posBth.style.display = 'block';
    posBth.innerText = 'Game Over';
    loopAboutMines();
    gSetTimeout = setTimeout(resertFunc, 5000);
}
function rendercell(i, j, value) {
    var elcell = document.querySelector(`#cell-${i}-${j}`);
    elcell.innerHTML = value;
}
function loopAboutMines() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j].isMine) {
                rendercell(i, j, moqesh);
            }
        }
    }
}
function toggleCellBoard(i, j) {
    if (!gBoard[i][j].isMarked) {
        gBoard[i][j].isMarked = true;
        rendercell(i, j, flag);
        game.markedCount++;

    } else {
        gBoard[i][j].isMarked = false;
        rendercell(i, j, '');
        game.markedCount--;
    }
}
function countBoomsInMat() {
    var count = 0;
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j].isMine) count++;
        }
    }
    return count;
}
function victoryGame() {
    clearInterval(gTimer);
    var posBth = document.querySelector('.position');
    posBth.style.display = 'block';
    posBth.innerText = 'victory';
    localStore();
    gSetTimeout = setTimeout(resertFunc, 5000);

}
function resertFunc() {
    initGame();
}
function updateTable() {
    vSize = 4;
    size = 16
    sizeLoopArr = 3;
    initGame();

}
function updateMiddle() {
    vSize = 8;
    size = 64;
    sizeLoopArr = 12;
    initGame();
}
function updateHard() {
    vSize = 12;
    size = 144;
    sizeLoopArr = 15;
    initGame();
}
function diedLife(i, j) {
    game.countDied++;
    switch (game.countDied) {
        case 1:
            var elbth = document.querySelector('.haim1');
            elbth.innerHTML = '🤍';
            break;
        case 2:
            var elbth = document.querySelector('.haim2');
            elbth.innerHTML = '🤍';
            break;
        case 3:
            var elbth = document.querySelector('.haim3');
            elbth.innerHTML = '🤍';
            gameOver();
            break

    }
    gBoard[i][j].isShown = true;
    rendercell(i, j, moqesh);

}
function makeHints() {
    boolHints = true;
}
function checkHimts(i, j) {
    if (gBoard[i][j].isShown) return;
    checkCellHints(i, j);
    checkNeighborsHints(i, j);
    setTimeout(removeHintss, 1000, i, j);
}
function checkNeighborsHints(idx, jdx) {
    for (var i = idx - 1; i <= idx + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = jdx - 1; j <= jdx + 1; j++) {
            if (j < 0 || j >= gBoard[0].length) continue;
            if (i === idx && j === jdx) continue;
            checkCellHints(i, j);
        }
    }


}
function checkCellHints(i, j) {
    if (gBoard[i][j].isShown) return;
    var cellEl = document.querySelector(`#cell-${i}-${j}`);
    cellEl.classList.add('hints');
    if (gBoard[i][j].isMine) {
        rendercell(i, j, moqesh);
    } else {
        rendercell(i, j, gBoard[i][j].mineAroundCount);
    }


}
function removeHintss(i, j) {
    removeHints(i, j);
    removeNeighboresHints(i, j);
    boolHints = false;

}
function removeHints(i, j) {
    if (gBoard[i][j].isShown) return;
    var cellEl = document.querySelector(`#cell-${i}-${j}`);
    cellEl.classList.remove('hints');
    rendercell(i, j, '');

}
function removeNeighboresHints(idx, jdx) {
    for (var i = idx - 1; i <= idx + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = jdx - 1; j <= jdx + 1; j++) {
            if (j < 0 || j >= gBoard[0].length) continue;
            if (i === idx && j === jdx) continue;
            removeHints(i, j);
        }
    }

}
function safeclickone() {
    if (!boolSafeClick1) {
        makeSafeCell();
        boolSafeClick1 = true;
    }

}
function makeSafeCell() {
    var res = createEmptyCells();
    var index = getRandomInt(0, res.length);
    var pos = res[index];
    var cellEl = document.querySelector(`#cell-${pos.i}-${pos.j}`);
    cellEl.classList.add('safeclick');
    setTimeout(removeSafe, 2000, pos.i, pos.j);


}
function createEmptyCells() {
    var res = [];
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j].isMine || gBoard[i][j].isShown) continue;
            var pos = {
                i: i,
                j: j
            }
            res.push(pos);
        }
    }
    return res;
}
function removeSafe(i, j) {
    var cellEl = document.querySelector(`#cell-${i}-${j}`);
    cellEl.classList.remove('safeclick');

}
function safeclicktwo() {
    if (!boolSafeClick2) {
        makeSafeCell();
        boolSafeClick2 = true;

    }
}
function safeclickthree() {
    if (!boolSafeClick3) {
        makeSafeCell();
        boolSafeClick3 = true;

    }

}
function localStore(){
    var bestScore=localStorage.getItem('best');
    if(bestScore){
        if(second<=bestScore){
            localStorage.setItem('best',second);

        }
    }else{
        localStorage.setItem('best',second);

    }
    var besting=localStorage.getItem('best');
    var elh2=document.querySelector('.bestscore h2');
    elh2.innerText=`The best score is ${besting}`;
}