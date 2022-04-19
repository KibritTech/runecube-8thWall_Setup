/* globals io */
// #### We need to mention that io will be a global variable. Required by JSLINT

// #### Importing the Data
import RUNE_DATA from "./RUNE_DATA";

//#### Socket connection
const socket = io("https://shielded-everglades-33939.herokuapp.com");

//#### Logging the connection
socket.on("connect", () => {
  console.log("Connection Establised");
});

//#### Socket event for End Game

socket.on("finish_game", (res) => {
  window.location = "https://testcubeapp.herokuapp.com/leaderboard";
});

//#### Click sound
let clickSound;
setTimeout(() => {
  clickSound = document.querySelector("#clickSound");
}, 500);

let scene;

setTimeout(() => {
  //#### Scene element
  scene = document.querySelector("#scene");
  //#### Button Element
  const startButton = document.querySelector("#startButton");

  startButton.addEventListener("click", () => {
    const queryString = window.location.search;
    let urlParams;
    let _username;
    if (queryString !== "") {
      urlParams = new URLSearchParams(queryString);
      _username = urlParams.get("username");

      //#### Firing the user_reconnected event
      socket.emit("user_reconnected", {
        ewew: socketID,
        sid: socket.id,
        test: "zehlem getdi",
        username: _username,
        role: "explorer",
      });
    }

    //#### Firing the game_started event
    setTimeout(() => {
      socket.emit("game_started", () => {
        console.log(socket.id);
      });
    }, 200);

    scene.style.visibility = "visible";
    document.querySelector(".scene__UI").style.display = "none";
  });
}, 1500);

//#### Random Number Generator
//#### If end is undefined, range will be set to negative start <-> positive start
function generateRandomNumber(start, end) {
  if (end === undefined) {
    return Math.floor(Math.random() * (start - start * -1) + start * -1);
  }
  return Math.floor(Math.random() * (start - end) + end);
}

//#### Generates random position and returns the object
function generateRandomPosition() {
  return {
    x: generateRandomNumber(100),
    y: generateRandomNumber(50, 1),
    z: generateRandomNumber(100),
  };
}

//#### Generates a rune
function generateRune(_scene, _color, _value, _entity) {
  const position = generateRandomPosition();
  const rune = document.createElement(_entity);
  rune.classList.add("rune");
  rune.setAttribute("color", _color.toLowerCase());
  rune.setAttribute("position", position);
  rune.setAttribute("value", _value);
  rune.setAttribute("scale", "2 2 2");
  rune.setAttribute("animation__2", {
    property: "rotation",
    from: "0 0 0",
    to: `${generateRandomNumber(360)} ${generateRandomNumber(
      360
    )} ${generateRandomNumber(360)}`,
    dur: 15000,
    easing: "linear",
    dir: "alternate",
    loop: true,
  });
  rune.setAttribute("animation", {
    property: "position",
    from: `${position.x}  ${position.y} ${position.z} `,
    to: `${position.x + generateRandomNumber(20)}  ${
      position.y + generateRandomNumber(10)
    } ${position.z + generateRandomNumber(20)} `,
    dur: 15000,
    easing: "linear",
    dir: "alternate",
    loop: true,
  });
  if (_value === "Cylinder") {
    rune.setAttribute("height", "5");
  }
  rune.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    clickSound.play();
    socket.emit("check_rune", {
      value: _value,
      color: _color,
    });
    rune.setAttribute("animation", {
      property: "scale",
      to: "0 0 0",
      dur: 1000,
      easing: "easeOutElastic",
      loop: false,
    });

    setTimeout(() => {
      generateRune(scene, _color, _value, _entity);
    }, 1000);
  });
  _scene.appendChild(rune);
}

//#### This function will gather all rune objects and add event listener to them

//#### Generating 50 Runes on start
//#### Running it after 2 seconds gives time to engine to compile its things
setTimeout(() => {
  RUNE_DATA.forEach((el) => {
    for (let i = 0; i < 4; i++) {
      //#### Order =>  _scene, _color, _value, _entity
      generateRune(scene, el.color, el.value, el.entity);
    }
  });
}, 2500);
