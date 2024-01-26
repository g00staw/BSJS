const gamesBoardContainer =  document.querySelector('#gamesboard-container')
const optionContainer = document.querySelector('.option-container')
const flipShip = document.querySelector('#flip-ship')
const startButton = document.querySelector('#start-button')
const infoDisplay = document.querySelector('#info')
const turnDisplay = document.querySelector('#turn-display')
const playerNameBoard = document.querySelector('#player-board-name')
const bodyHtml = document.querySelector('#body-main')
const infoBoard = document.querySelector('#game-info')

var playerName
var theme

window.onload = function() {

    var playerNameJSON = localStorage.getItem('playerData')
    var themeChoiceJSON = localStorage.getItem('themeData')

    playerName = JSON.parse(playerNameJSON)
    theme = JSON.parse(themeChoiceJSON)

    playerNameBoard.textContent = `Plansza gracza: ${playerName.name}`
    console.log(theme.theme)
    if (theme.theme == "black") {
        bodyHtml.style.background = "url(https://images.unsplash.com/photo-1529753253655-470be9a42781?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)";

    } else if (theme.theme == "blue") {
        bodyHtml.style.background = "url(https://images.unsplash.com/photo-1568145675395-66a2eda0c6d7?q=80&w=2535&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)";
        gamesBoardContainer.style.backgroundColor = "rgb(0,60,179,0.3)"
        optionContainer.style.backgroundColor = "rgb(0,60,179,0.3)"
        infoBoard.style.backgroundColor = "rgb(0,60,179,0.3)"
    } else if (theme.theme == "white") {
        bodyHtml.style.background = "url(https://images.unsplash.com/photo-1492931307820-62fa5a68e0df?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)";
        gamesBoardContainer.style.backgroundColor = "rgb(255,255,255,0.75)"
        optionContainer.style.backgroundColor = "rgb(255,255,255,0.75)"
        infoBoard.style.backgroundColor = "rgb(255,255,255,0.75)"
        infoBoard.style.color = "rgb(0,0,0)"
    }

    alert("Rozłóż statki na swojej planszy, następni kliknij przycisk 'Start' aby rozpocząć grę.");

}

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

const width = 10

function createBoard(color, user){
    const gameBoardContainer = document.createElement('div')
    gameBoardContainer.classList.add('game-board')
    gameBoardContainer.style.backgroundColor = color
    gameBoardContainer.id = user

    for(let i = 0; i < width * width; i++){
        const block = document.createElement('div')
        block.classList.add('block')
        block.id = i
        gameBoardContainer.append(block)
    }

    gamesBoardContainer.append(gameBoardContainer)
}

createBoard('lightblue', 'player')
createBoard('darkblue', 'computer')

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
let notDropped

//42;25

function getValidity(allBoardBlocks, isHorizontal, startIndex, ship){
    let validStart = isHorizontal ? startIndex <= width * width - ship.length ? startIndex : 
        width * width - ship.length : 
        startIndex <= width * width - width * ship.length ? startIndex : 
            startIndex - ship.length * width + width
        // 53;49

    let shipBlocks = []

    for(let i = 0; i < ship.length; i++){
        if(isHorizontal) { 
            shipBlocks.push(allBoardBlocks[Number(validStart) + i])
        }
        else {
            shipBlocks.push(allBoardBlocks[Number(validStart) + i * width]);
        }
    }

    let valid

    if(isHorizontal) {
        shipBlocks.every((_shipBlock, index) => 
            valid = shipBlocks[0].id % width !== width - (shipBlocks.length - (index + 1)))
    } else {
        shipBlocks.every((_shipBlock, index) => 
            valid = shipBlocks[0].id < 90 + (width * index + 1)
        )
    }

    const notTaken = shipBlocks.every(shipBlock => !shipBlock.classList.contains('taken'))

    return {shipBlocks, valid, notTaken}
}

function addShipPiece(user, ship, startId){
    const allBoardBlocks = document.querySelectorAll(`#${user} div`)
    let randomBoolean = Math.random() < 0.5
    let isHorizontal = user === 'player' ? angle === 0 : randomBoolean
    let randomStartIndex = Math.floor(Math.random() * width * width)
    
    // 1;07
    let startIndex = startId ? startId : randomStartIndex 

    
    const { shipBlocks, valid, notTaken} = getValidity(allBoardBlocks, isHorizontal, startIndex, ship)

    if(valid && notTaken) {
        shipBlocks.forEach(shipBlock => {
            shipBlock.classList.add(ship.name)
            shipBlock.classList.add('taken')
        })
    } else {
        if (user === 'computer') addShipPiece(user, ship, startId)
        if (user === 'player') notDropped = true
    }
    
}
ships.forEach(ship => addShipPiece('computer', ship))


// dragging p ships
let draggedShip
const optionShips = Array.from(optionContainer.children)
optionShips.forEach(optionShip => optionShip.addEventListener('dragstart', dragStart))

const allPlayerBlocks = document.querySelectorAll('#player div')
allPlayerBlocks.forEach(playerBlock => {
    playerBlock.addEventListener('dragover', dragOver)
    playerBlock.addEventListener('drop', dropShip)
})

function dragStart(e) {
    notDropped = false
    draggedShip = e.target
}

function dragOver(e) {
    e.preventDefault()
    const ship = ships[draggedShip.id]
    highLightArea(e.target.id, ship)
}

function dropShip(e) {
    const startId = e.target.id
    const ship = ships[draggedShip.id]
    addShipPiece('player', ship, startId)
    if(!notDropped){
        draggedShip.remove()
    }
}

// add highlight

function highLightArea(startIndex, ship){
    const allBoardBlocks = document.querySelectorAll('#player div')
    let isHorizontal = angle === 0

    const { shipBlocks, valid, notTaken } = getValidity(allBoardBlocks, isHorizontal, startIndex, ship)
    
    if(valid && notTaken){
        shipBlocks.forEach(shipBlock => {
            shipBlock.classList.add('hover')
            setTimeout(() =>  shipBlock.classList.remove('hover'), 500)
        })
    }
}

let gameOver = false
let playerTurn

var playerHitsNumber = document.querySelector('#hits')
var shotsNumber = document.querySelector('#shoots')
var missedShots = document.querySelector('#missed')

let missedShotsNumber = 0
let playerHitsNumberNumber = 0
let shotsNumberNumber = 0


// start

function startGame(){
    if(playerTurn === undefined){
        if(optionContainer.children.length != 0){
            infoDisplay.textContent = 'Rozłóż wszystkie swoje statki na planszy!'
        } else{
            const allBoardBlocks = document.querySelectorAll('#computer div')
            allBoardBlocks.forEach(block => block.addEventListener('click', handleClick))
            playerTurn = true
            turnDisplay.textContent = 'Twoja tura!'
            infoDisplay.textContent = 'Gra się zaczęła!'
            startButton.style.animation = "none"
            flipShip.style.animation = "none"
        }
        
    }

}

startButton.addEventListener('click', startGame)

let playerHits = []
let computerHits = []
const playerSunkShips = []
const computerSunkShips = []

function handleClick(e){
    if(!gameOver){

        if(e.target.classList.contains('boom') && e.target.classList.contains('taken')){
            infoDisplay.textContent = "Przcież ten statek został trafiony! Utrata tury!"
            shotsNumberNumber++
            missedShotsNumber++
        }
        if(e.target.classList.contains('taken') && !e.target.classList.contains('boom')){
            e.target.classList.add('boom')
            infoDisplay.textContent = "Trafiłeś wrogi statek!"
            boomAUDIO.play()
            shotsNumberNumber++
            playerHitsNumberNumber = shotsNumberNumber - missedShotsNumber
            let classes = Array.from(e.target.classList)
            classes = classes.filter(className => className !== 'block')
            classes = classes.filter(className => className !== 'boom')
            classes = classes.filter(className => className !== 'taken')
            playerHits.push(...classes)
            checkScore('player', playerHits, playerSunkShips)
        }
        if(!e.target.classList.contains('taken') && !e.target.classList.contains('boom')) {
            infoDisplay.textContent = "Pudło!"
            missAUDIO.play()
            e.target.classList.add('empty')
            shotsNumberNumber++
            missedShotsNumber++
        }
        
        playerTurn = false
        const allBoardBlocks = document.querySelectorAll('#computer div')
        allBoardBlocks.forEach(block => block.replaceWith(block.cloneNode(true)))
        setTimeout(computerGo, 3000)

        shotsNumber.textContent = ` ${shotsNumberNumber}`
        playerHitsNumber.textContent = `${playerHitsNumberNumber}`
        missedShots.textContent = `${missedShotsNumber}`
    }
    
}

// bot turn

//audio 
let boomAUDIO = new Audio('sounds/boom.mp3')
let missAUDIO = new Audio('sounds/miss.mp3')
let audioWIN = new Audio('sounds/win.mp3')
let audioLOSE = new Audio('sounds/lose.mp3')
let sinkShipAudio = new Audio('sounds/destroyed-ship.mp3')

let muteCheckbox = document.getElementById('mute');


muteCheckbox.addEventListener('change', function() {
    if(this.checked) {
        boomAUDIO.muted = true
        missAUDIO.muted = true
        audioWIN.muted = true
        audioLOSE.muted = true
        sinkShipAudio.muted = true
    } else {
        boomAUDIO.muted = false
        missAUDIO.muted = false
        audioWIN.muted = false
        audioLOSE.muted = false
        sinkShipAudio.muted = false
    }
})

function computerGo(){
    if(!gameOver){
        turnDisplay.textContent = 'Tura bota.'
        infoDisplay.textContent = 'Bot celuje . . .'

        setTimeout(() => {
            let randomGo = Math.floor(Math.random() * width * width)
            const allBoardBlocks = document.querySelectorAll('#player div')

            if(allBoardBlocks[randomGo].classList.contains('taken') &&
               allBoardBlocks[randomGo].classList.contains('boom')
            ){
                computerGo()  
                return
            } else if (
                allBoardBlocks[randomGo].classList.contains('taken') &&
                !allBoardBlocks[randomGo].classList.contains('boom')
            ) {
                allBoardBlocks[randomGo].classList.add('boom')
                infoDisplay.textContent = 'Bot trafił w twój statek!'
                boomAUDIO.play()
                let classes = Array.from(allBoardBlocks[randomGo].classList)
                classes = classes.filter(className => className !== 'block')
                classes = classes.filter(className => className !== 'boom')
                classes = classes.filter(className => className !== 'taken')
                computerHits.push(...classes)
                checkScore('computer', computerHits, computerSunkShips)

            } else{
                // 1;33
                infoDisplay.textContent = 'Pudło!'
                missAUDIO.play()
                allBoardBlocks[randomGo].classList.add('empty')
            }
        }, 3000)

        setTimeout(() => {
            playerTurn = true
            turnDisplay.textContent = `Tura gracza: ${playerName.name}`
            infoDisplay.textContent = 'Oddaj strzał!'
            const allBoardBlocks = document.querySelectorAll('#computer div')
            allBoardBlocks.forEach(block => block.addEventListener('click', handleClick))

        }, 6000)
    }
}

function checkScore(user, userHits, userSunkShips){
    
    function checkShip(shipName, shipLength) {
        if(userHits.filter(storedShipName => storedShipName === shipName).length === shipLength){
            let sinkedShip
            if(shipName === 'cru') { sinkedShip = "krążownik"} 
            if(shipName === 'sub') { sinkedShip = "łódź podwodna" }
            if(shipName === 'carr') { sinkedShip = "lotniskowiec" }
            if(shipName === 'dest') { sinkedShip = "niszczyciel" }
            if(shipName === 'batt') { sinkedShip = "okręt bojowy" }
            

            if(user === 'player'){
                infoDisplay.textContent = `Zatopiłeś/aś ${sinkedShip} bota!`
                sinkShipAudio.play()
                playerHits = userHits.filter(storedShipName => storedShipName !== shipName)
            }
            if(user === 'computer'){
                infoDisplay.textContent = `Bot zatopił twój ${sinkedShip}!`
                sinkShipAudio.play()
                computerHits = userHits.filter(storedShipName => storedShipName !== shipName)
            }
            userSunkShips.push(shipName)
        }
    }

    checkShip('dest', 2)
    checkShip('sub', 3)
    checkShip('cru', 3)
    checkShip('batt', 4)
    checkShip('carr', 5)

    console.log('playerHits', playerHits)
    console.log('playerSunkShips', playerSunkShips)



    if(playerSunkShips.length === 5){
        audioWIN.play();
        infoDisplay.textContent = 'WYGRANA! Zatopiłeś/aś wszystkie statki bota!';
        boomAUDIO.muted = true;
        audioWIN.play();
        setTimeout(function() {
            // Pusty blok kodu
        }, 3000);
        alert('WYGRANA! Zatopiłeś/aś wszystkie statki bota!', audioWIN.play());
        gameOver = true;
    }
    if(computerSunkShips.length === 5){
        audioLOSE.play();
        infoDisplay.textContent = 'PRZEGRANA! Bot zatopił wszystkie twoje statki!';
        boomAUDIO.muted = true;
        audioLOSE.play();
        setTimeout(function() {
            // Pusty blok kodu
        }, 3000);
        alert('PRZEGRANA! Bot zatopił wszystkie twoje statki!',  audioLOSE.play());
        gameOver = true;
    }

}

var slider = document.getElementById("myRange");

// Aktualizacja skali diva za każdym razem, gdy suwak jest przesuwany
slider.oninput = function() {
    gamesBoardContainer.style.transform = "scale(" + this.value + ")"
    gamesBoardContainer.style.margin = this.value * 50 + "px";
}

function myFunction() {
    location.reload()
}
