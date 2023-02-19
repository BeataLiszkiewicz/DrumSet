class PercussionSound {
  constructor(name, key, sample, icon) {
    this.name = name;
    this.key = key;
    this.sample = sample;
    this.icon = icon;
  }
  playSound() {
    const music = new Howl({
      src: [`./assets/sounds/${this.sample}`],
    });

    music.play();
  }
}

const featuresList = [
  ["boom", "g", "Boom.wav", "fa-bomb"],
  ["clap", "w", "Clap.wav", "fa-hands-clapping"],
  ["hihat", "s", "HiHat.wav", "fa-hat-cowboy-side"],
  ["kick", "d", "Kick.wav", "fa-person-running"],
  ["openhat", "f", "OpenHat.wav", "fa-lock-open"],
  ["ride", "h", "Ride.wav", "fa-horse"],
  ["snare", "j", "Snare.wav", "fa-drum"],
  ["tink", "l", "Tink.wav", "fa-droplet"],
  ["tom", "k", "Tom.wav", "fa-user"],
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
    document.getElementById(divIdentifier).style.textShadow = "0 0 4px #ffffffcf, 0 0 11px #ffffffcf, 0 0 19px #ffffffcf,0 0 40px rgba(34, 98, 217, 0.486), 0 0";
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
