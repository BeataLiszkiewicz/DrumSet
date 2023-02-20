class PercussionSound {
  constructor(name, key, sample, icon) {
    this.name = name;
    this.key = key;
    this.sample = sample[0];
    this.sample2 = sample[1];
    this.icon = icon;
  }
  playSound() {
    const music = new Howl({
      src: [
        `./assets/sounds/${this.sample}`,
        `./assets/sounds/${this.sample2}`,
      ],
    });

    music.play();
  }
}

const featuresList = [
  ["boom", "g", ["Boom.wav", "Boom.mp3"], "fa-bomb"],
  ["clap", "w", ["Clap.wav", "Clap.mp3"], "fa-hands-clapping"],
  ["hihat", "s", ["HiHat.wav", "HiHat.mp3"], "fa-hat-cowboy-side"],
  ["kick", "d", ["Kick.wav", "Kick.mp3"], "fa-person-running"],
  ["openhat", "f", ["OpenHat.wav", "OpenHat.mp3"], "fa-lock-open"],
  ["ride", "h", ["Ride.wav", "Ride.mp3"], "fa-horse"],
  ["snare", "j", ["Snare.wav", "Snare.mp3"], "fa-drum"],
  ["tink", "l", ["Tink.wav", "Tink.mp3"], "fa-droplet"],
  ["tom", "k", ["Tom.wav", "Tom.mp3"], "fa-user"],
];

const soundsList = [];

featuresList.forEach((feature) => {
  const [name, key, sample, icon] = feature;

  soundsList.push(new PercussionSound(name, key, sample, icon));
});

// Function call playSound method for certain object from soundList array. Position of object in array is given as argument to the function.
function soundAfterEvent(soundIndex) {
  soundsList[soundIndex].playSound();
}

// Function create <i> tag with class from Font Awsme library in first div.icon without child.
// If there is no div.icon without child, user gets choice if next sounch should erase current sound history or not.
// Approval for deletion is store in a session storage.
// Icon class is taken from soundsList array, based on argument given to the function.
function iconAfterEvent(soundIndex) {
  const iconDivList = document.getElementsByClassName("icon");
  const iconList = document.querySelectorAll(".fa-solid");

  function addIcon() {
    for (let i = 0; i < iconDivList.length; i++) {
      if (iconDivList[i].firstChild === null) {
        const icon = document.createElement("i");
        icon.classList.add("fa-solid", soundsList[soundIndex].icon);
        icon.setAttribute("id", soundsList[soundIndex].icon);
        iconDivList[i].appendChild(icon);
        break;
      }
    }
  }

  function deleteIcon() {
    for (let i = 0; i < iconList.length; i++) {
      iconList[i].remove();
    }
  }

  if (iconList.length < iconDivList.length) {
    addIcon();
  } else if (sessionStorage.getItem("SAMPLE_REMOVAL_CONFIRMED")) {
    deleteIcon();
    addIcon();
  } else if (
    confirm(
      "This action will erase sound history. Would you like to continue anyway? When you confirm, alert will not be shown again"
    )
  ) {
    sessionStorage.setItem("SAMPLE_REMOVAL_CONFIRMED", "true");
    deleteIcon();
    addIcon();
  }
}

function buttonShadowOn(keyIdentifier) {
  document.getElementById(keyIdentifier).style.boxShadow =
    "0 0 4px #ffffff, 0 0 11px #ffffff, 0 0 19px #ffffffcf,0 0 40px rgba(34, 98, 217, 0.486), 0 0 80px rgb(34, 98, 217, 0.486),0 0 90px rgb(34, 98, 217, 0.486), 0 0 100px rgb(34, 98, 217, 0.486),0 0 ";
}

function buttonShadowOff(keyIdentifier) {
  setTimeout(function () {
    document.getElementById(keyIdentifier).style.boxShadow = "none";
  }, 300);
}

soundsList.forEach((sound, index) => {
  document.getElementById(sound.name).addEventListener("mousedown", () => {
    buttonShadowOn(sound.name);
    soundAfterEvent(index);
    iconAfterEvent(index);
    buttonShadowOff(sound.name);
  });
});

document.addEventListener("keydown", function (event) {
  const keys = soundsList.map((sound) => sound.key).indexOf(event.key);
  if (keys > -1) {
    buttonShadowOn(soundsList[keys].name);
    soundAfterEvent(keys);
    iconAfterEvent(keys);
    buttonShadowOff(soundsList[keys].name);
  }
});

// Function collect all icon#id and based on them call playSound method from soundsList array.
// Order of played sounds is same as order of icons in .music.
// When <div> in .music is empty, function does nothing for this div.
function divEffectOn(divIdentifier) {
  document.getElementById(divIdentifier).style.textShadow = "none";
  document.getElementById(divIdentifier).style.color = "#ffffff8b";
}

function divEffectOff(divIdentifier) {
  setTimeout(function () {
    document.getElementById(divIdentifier).style.color = "#ffffffcf";
    document.getElementById(divIdentifier).style.textShadow =
      "0 0 4px #ffffffcf, 0 0 11px #ffffffcf, 0 0 19px #ffffffcf,0 0 40px rgba(34, 98, 217, 0.486), 0 0";
  }, 240);
}

function playList() {
  const soundsIcons = document.querySelectorAll(".fa-solid");
  const iconDivList = document.getElementsByClassName("icon");

  if (soundsIcons.length === 0) {
    alert("You have no sounds on your list. Use sounds buttons to add them.");
  } else {
    for (let i = 0; i < iconDivList.length; i++) {
      play(i);
    }
  }
}

function play(i) {
  setTimeout(function () {
    if (document.getElementById(i).firstChild === null) {
      doNothing(i);
    } else {
      task(i);
    }
  }, i * 240);
}

function doNothing(i) {
  divEffectOn(i);
  divEffectOff(i);
}

function task(i) {
  const soundToPlay = soundsList.filter(
    (sound) => sound.icon === document.getElementById(i).firstChild.id
  );
  divEffectOn(i);
  soundToPlay[0].playSound();
  divEffectOff(i);
}

document.getElementById("play").addEventListener("mousedown", () => {
  buttonShadowOn("play");
  playList();
  buttonShadowOff("play");
});
document.addEventListener("keydown", function (event) {
  if (event.key === "p") {
    if (!sessionStorage.getItem("KEYBOARD_CHANGE_INSTRUCTION")) {
      alert(
        "To change sound history with your keyboard, press Spacebar then select with arrows icon you want to erase and confirm deletion by pressing Enter. To turn of edition mode, press Spacebar again"
      );
      sessionStorage.setItem("KEYBOARD_CHANGE_INSTRUCTION", "true");
    }
    buttonShadowOn("play");
    playList();
    buttonShadowOff("play");
  }
});

// Function allows to delete icon from history after click on icon parent.
function historyChange(divId) {
  if (document.getElementById(divId).firstChild) {
    document.getElementById(divId).firstChild.remove();
  }
}

const soundHistory = document.getElementsByClassName("icon");
for (let i = 0; i < soundHistory.length; i++) {
  document.getElementById(soundHistory[i].id).addEventListener("click", () => {
    historyChange(i);
  });
}

// Function mark active div with icon when user navigates among it with arrows
function markCurrentPosition(id) {
  document.getElementById(id).style.borderColor = "lightblue";
}

// Function unmark inactive div with icon when user navigates among it with arrows
function unmarkLastPosition(id) {
  document.getElementById(id).style.borderColor = "rgba(255, 255, 255, 0.177)";
}

const currentPosition = [];
document.addEventListener("keydown", function (event) {
  if (event.key === " ") {
    if (currentPosition.length < 1) {
      markCurrentPosition(0);
      currentPosition.push(0);
    } else {
      unmarkLastPosition(currentPosition[0]);
      currentPosition.length = 0;
    }
  }
});

document.addEventListener("keydown", function (event) {
  if (currentPosition.length === 1) {
    switch (event.key) {
      case "ArrowRight":
        if (currentPosition[0] === 15) {
          currentPosition.length = 0;
          currentPosition.push(0);
          markCurrentPosition(0);
          unmarkLastPosition(15);
        } else {
          let position = currentPosition[0];
          markCurrentPosition(Number(currentPosition[0]) + 1);
          currentPosition.push(Number(currentPosition[0]) + 1);
          currentPosition.splice(0, 1);
          unmarkLastPosition(position);
        }
        break;

      case "ArrowLeft":
        if (currentPosition[0] === 0) {
          markCurrentPosition(15);
          unmarkLastPosition(0);
          currentPosition.length = 0;
          currentPosition.push(15);
        } else {
          let position = currentPosition[0];
          markCurrentPosition(Number(currentPosition[0]) - 1);
          currentPosition.push(Number(currentPosition[0]) - 1);
          currentPosition.splice(0, 1);
          unmarkLastPosition(position);
        }
        break;

      case "ArrowDown":
      case "ArrowUp":
        if (currentPosition[0] < 8) {
          let position = currentPosition[0];
          markCurrentPosition(Number(currentPosition[0]) + 8);
          currentPosition.push(Number(currentPosition[0]) + 8);
          currentPosition.splice(0, 1);
          unmarkLastPosition(position);
        } else if (currentPosition[0] >= 8) {
          let position = currentPosition[0];
          markCurrentPosition(Number(currentPosition[0]) - 8);
          currentPosition.push(Number(currentPosition[0]) - 8);
          currentPosition.splice(0, 1);
          unmarkLastPosition(position);
        }
        break;
    }
  }
});

document.addEventListener("keydown", function (event) {
  if (event.key === "Enter" && currentPosition.length === 1) {
    historyChange(Number(currentPosition[0]));
  }
});
