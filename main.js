'use strict'

const floorInput = document.getElementById('floor');
const liftInput = document.getElementById('lift');
const submitBTN = document.getElementById('submit');
console.log("hello print", floorInput)


const inputArea = document.getElementsByClassName('input-area');
const outputArea = document.getElementsByClassName('output-area');
const liftArea = document.getElementsByClassName('building');


const backBTN = document.getElementById('back');


let floor = 0;
let lift = 0;
let freeLift = [];
let busyLift = [];


function handleFloorInputChange(e) {
    floor = e.target.value;
    if (floor < 0 || floor > 99) {
        alert(`You have entered ${floor} as your floor. Please enter a number between 1 and 99.`);
        floorInput.focus();
    }
};


function handleLiftInputChange(e) {
    lift = Number(e.target.value);
    let screenSize = window.innerWidth;
    if (lift < 0 || lift > 15) {
        alert(`You have entered ${lift} as your lift. Please enter a number between 1 and 15. Because you have enough space in your screen.`);
        liftInput.focus();
    } else if (screenSize <= 1100 && lift > 4) {
        alert(`You have entered ${lift} as your lift. Please enter a number between 1 and 4. Because you have not enough space in your screen.`);
        liftInput.focus();
    }
    for (let i = 0; i < lift; i++)
        freeLift.push(i);
};


function generateBuilding() {
    let floorHTML = '';
    for (let i = floor - 1; i >= 0; i--) {
        let liftButtons = '';
        if (i === floor - 1) {
            liftButtons = `<button id="down" class="lift-button move" data-btn-floor="${i}">⬇️</button>`;
        } else if (i === 0) {
            liftButtons = `<button id="up" class="lift-button move" data-btn-floor="${i}">⬆️</button>`;
        } else {
            liftButtons = `<button id="up" class="lift-button move" data-btn-floor="${i}">⬆️</button>
               <button id="down" class="lift-button move" data-btn-floor="${i}">⬇️</button>`;
        }
        let liftAreaHTML = i === 0 ? generateLift(lift) : '';
        floorHTML += `
               <div class="floor" id="floor${i}">
                    <div class="lift-buttons">
                         ${liftButtons}
                    </div>
                    <div class="lift-area">
                         ${liftAreaHTML}
                    </div>
               </div>
               `;
    }
    liftArea[0].innerHTML = floorHTML;
};


function generateLift(numOfLifts) {
    let liftElements = '';
    for (let i = 0; i < numOfLifts; i++) {
        liftElements += `
          <div class="lift" id="lift${i}" data-current-floor="0" data-is-moving="false">
               <div class="lift-door door-left"></div>
               <div class="lift-door door-right"></div>
          </div>`;
    }
    return liftElements;
};


submitBTN.addEventListener('click', (e) => {
    e.preventDefault();
    inputArea[0].classList.add('hide');
    outputArea[0].classList.remove('hide');
    generateBuilding();
    addMoveEventListener();
});


const addMoveEventListener = () => {
    const moveBTN = document.getElementsByClassName('move');
    console.log(`Total move button: ${moveBTN.length}`);
    for (let i = 0; i < moveBTN.length; i++) {
        moveBTN[i].addEventListener('click', moveLift);
    }
};


function moveLift(e) {
    e.preventDefault();
    const floorDiv = e.target.parentNode.parentNode;
    var [x, requestedFloorNo] = floorDiv.id.split("floor");
    for (let i = 0; i < freeLift.length; i++) {
        const lift = document.getElementById(`lift${freeLift[0]}`);
        if (lift.dataset.isMoving === "false") {
            let floorCalled = Math.abs(requestedFloorNo - lift.dataset.currentFloor);
            let travelDuration = floorCalled * 2;
            let gateOpenDuration = travelDuration * 1000;
            let gateCloseDuration = gateOpenDuration + 2600;
            let resetLiftDuration = gateCloseDuration + 1000;
            console.log(`Lift come from ${lift.dataset.currentFloor} to ${requestedFloorNo} in ${travelDuration} seconds`);
            lift.style.transform = `translateY(${((requestedFloorNo) * -128)}px)`;
            lift.style.transition = `transform ${travelDuration}s ease-in-out`;
            lift.dataset.isMoving = true;
            e.target.classList.add('active-btn');


            let lGate = document.getElementsByClassName('door-left')[freeLift[0]];
            let rGate = document.getElementsByClassName('door-right')[freeLift[0]];
            setTimeout(() => {
                lGate.classList.add("animation");
                rGate.classList.add("animation");
                console.log("Door Open");
            }, `${gateOpenDuration}`);

            setTimeout(() => {
                lGate.classList.remove("animation");
                rGate.classList.remove("animation");
                e.target.classList.remove('active-btn');
                console.log("Door close");
            }, `${gateCloseDuration}`);

            freeLift.shift(busyLift.push(freeLift[0]));

            setTimeout(() => {
                freeLift.push(busyLift.shift());
                freeLift.sort();
                lift.dataset.isMoving = false;
                console.log("Lift Reset");
            }, `${resetLiftDuration}`);

            lift.setAttribute("data-current-floor", requestedFloorNo);
            break;
        }
    }
};

function showInputArea(e) {
    e.preventDefault();
    window.location.reload();
};

backBTN.addEventListener('click', showInputArea);

floorInput.addEventListener('change', handleFloorInputChange);
liftInput.addEventListener('change', handleLiftInputChange);