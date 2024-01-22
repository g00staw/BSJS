const gamesBoardContainer =  document.querySelector('#gamesboard-container')
const optionContainer = document.querySelector('.option-container')
const flipShip = document.querySelector('#flip-ship')

// fliping
let angle = 0
function flip(){
    const optionShips = Array.from(optionContainer.children)
        if(angle === 0){
            angle = 90
        } 
        else {
            angle = 0
        }
        optionShips.forEach(optionShip => optionShip.style.transform = `rotate(${angle}deg)`)
}

flipShip.addEventListener('click', flip)

// creating board

const witdh = 10

function createBoard(color, user){
    const gameBoardContainer = document.createElement('div')
    gameBoardContainer.classList.add('game-board')
    gameBoardContainer.style.backgroundColor = color
    gameBoardContainer.id = user

    for(let i = 0; i < witdh * witdh; i++){
        const block = document.createElement('div')
        block.classList.add('block')
        block.id = i
        gameBoardContainer.append(block)
    }

    gamesBoardContainer.append(gameBoardContainer)
}

createBoard('gray', 'player')
createBoard('yellow', 'bot')

// creating ships

class Ship{
    constructor(name, length){
        this.name = name
        this.length = length
    }
}

const dest = new Ship('dest', 2)
const sub = new Ship('sub', 3)
const cru = new Ship('cru', 3)
const batt = new Ship('batt', 4)
const carr = new Ship('carr', 5)

const ships = [dest, sub, cru, batt, carr]

//42;25

function addShipPiece() {
    const allBoardBlocks = document.querySelectorAll('#computer div')
    let randomBoolean = Math.random() < 0.5
    let isHorizontal = randomBoolean
    let randomStartIndex = Math.floor(Math.random() * witdh * witdh)
    console.log(randomStartIndex)

}
addShipPiece(dest)