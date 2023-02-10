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
  ["kick", "d", "Kick.wav", "fa-drum"],
  ["openhat", "f", "OpenHat.wav", "fa-lock-open"],
  ["ride", "h", "Ride.wav", "fa-compact-disc"],
  ["snare", "j", "Snare.wav", "fa-grip-lines-vertical"],
  ["tink", "l", "Tink.wav", "fa-circle-stop"],
  ["tom", "k", "Tom.wav", "fa-drum-steelpan"],
];

const soundsList = [];

featuresList.forEach((feature) => {
  const [name, key, sample, icon] = feature;

  soundsList.push(new PercussionSound(name, key, sample, icon));
});

function soundAfterEvent(soundIndex) {
  soundsList[soundIndex].playSound();
}

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

//With anonymous function in EventListener, function is not called directly but we can pass function definition and pass argument to it.
soundsList.forEach((sound, index) => {
  document.getElementById(sound.name).addEventListener("mousedown", () => {
    soundAfterEvent(index);
    iconAfterEvent(index);
  });
});

document.addEventListener("keydown", function (event) {
  const keys = soundsList.map((sound) => sound.key).indexOf(event.key);
  if (keys > -1) {
    soundAfterEvent(keys);
    iconAfterEvent(keys);
  }
});

function playList() {
  const soundsIcons = document.querySelectorAll(".fa-solid");
  const iconDivList = document.getElementsByClassName("icon");
  if (soundsIcons.length === 0) {
    alert("You have no sounds on your list. Use sounds buttons to add them.");
  } else {
    for (let i = 0; i < iconDivList.length; i++) {
      if (iconDivList[i].firstChild === null) {
      } else {
        const soundToPlay = soundsList.filter(
          (sound) => sound.icon === document.getElementById(i).firstChild.id
        );
        soundToPlay[0].playSound();
      }
    }
  }
}

document.getElementById("play").addEventListener("mousedown", playList);
