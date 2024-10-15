let GlobalPreset = 'null';
let ActiveState = 'null';

let ready = false;

let scene;
let mol_manager;

// to be called once the scene is loaded to perform setup tasks*****************************
function setup() {
  // add collision events to both objects
  mol_manager = document.querySelector('#dna_model');

  scene = document.querySelector('#scene');
}


// called when the start button is pressed **************************************************
function setPreset(value) {
  //console.log('Set preset to:' + value);

  // get the collision indicators
  let Indicator = document.querySelector('#' + value + 'Button');

  mol_manager = document.querySelector('#dna_model');

  let start_button = document.querySelector('#startButtonGroup');

  if (ActiveState == 'null' || ActiveState == 'resetting') {
    if (GlobalPreset == 'null') {
      //console.log('First Preset press');
      Indicator.setAttribute('circles-button', {
        button_color: 'rgb(101,199,93)',
        button_color_hover: 'rgb(66,133,61)'
      });

      mol_manager.emit('set', { value });
      GlobalPreset = value;

    } else if (GlobalPreset != value) {
      //console.log('Preset press');

      // Set previous button back to red
      document.querySelector('#' + GlobalPreset + 'Button').setAttribute('circles-button', {
        button_color: 'rgb(224, 37, 18)',
        button_color_hover: 'rgb(145, 31, 19)'
      });

      // Set button to green
      Indicator.setAttribute('circles-button', {
        button_color: 'rgb(101,199,93)',
        button_color_hover: 'rgb(66,133,61)'
      });

      mol_manager.emit('set', { value });
      GlobalPreset = value;

    } else {
      //console.log('The preset was already: ' + value);
      mol_manager.emit('set', { value });
      GlobalPreset = value;
    }

    start_button.setAttribute('circles-interactive-visible', 'true');

  }

};

function toggleSlides(value){
  let leftButton = document.querySelector('#leftScrollButton');
  let rightButton = document.querySelector('#rightScrollButton');

  let mainPage = document.querySelector('#slide_00');
  let page01 = document.querySelector('#slide_01');
  let page02 = document.querySelector('#slide_02');
  let page03 = document.querySelector('#slide_03');

  if(mainPage.getAttribute('visible') && value == 'right'){
    leftButton.setAttribute('visible', 'true');
    
    page01.setAttribute('visible', 'true');
    mainPage.setAttribute('visible', 'false');

    //console.log("Flipped page");
  }else if(page01.getAttribute('visible') && value == 'left'){
    leftButton.setAttribute('visible', 'false');

    mainPage.setAttribute('visible', 'true');
    page01.setAttribute('visible', 'false');
    
    //console.log("Flipped page");
  }else if(page01.getAttribute('visible') && value == 'right'){
    page02.setAttribute('visible', 'true');
    page01.setAttribute('visible', 'false');
    
    //console.log("Flipped page");
  }else if(page02.getAttribute('visible') && value == 'left'){
    page01.setAttribute('visible', 'true');
    page02.setAttribute('visible', 'false');
    
    //console.log("Flipped page");
  }else if(page02.getAttribute('visible') && value == 'right'){
    rightButton.setAttribute('visible', 'false');

    page03.setAttribute('visible', 'true');
    page02.setAttribute('visible', 'false');
    
    //console.log("Flipped page");
  }else if(page03.getAttribute('visible') && value == 'left'){
    rightButton.setAttribute('visible', 'true');

    page02.setAttribute('visible', 'true');
    page03.setAttribute('visible', 'false');
    
    //console.log("Flipped page");
  }
};

function startExperience() {

  ActiveState = 'playing';

  //turn off start button
  let start_button = document.querySelector('#startButtonGroup');
  start_button.setAttribute('circles-interactive-visible', 'false');

  //turn on reset button
  let reset_button = document.querySelector('#resetButtonGroup');
  reset_button.setAttribute('circles-interactive-visible', 'true');

  let holders = document.querySelectorAll('.holder');

  for (let i = 0; i < holders.length; i++){
    holders[i].emit('setState', {value : 'unbound'});
  }

  //Create a randomly placed glucose molecule
  var sample = 0;
  while (sample < 40) {
    mol_manager.emit('mol_initial_spawn', { value: 'lactose', pos: 'null', rot: 'null' });
    mol_manager.emit('mol_initial_spawn', { value: 'glucose', pos: 'null', rot: 'null' });
    mol_manager.emit('mol_initial_spawn', { value: 'cAMP', pos: 'null', rot: 'null' });
    sample++;
  }


};


function resetExperience() {

  if (ActiveState == 'playing') {
    let start_button = document.querySelector('#startButtonGroup');
    start_button.setAttribute('circles-interactive-visible', 'true');

    let reset_button = document.querySelector('#resetButtonGroup');
    reset_button.setAttribute('circles-interactive-visible', 'false');

    //Get a list of all the molecules
    let sample = document.querySelectorAll('.molecule');

    //Purge the molecules
    for (let i = 0; i < sample.length; i++) {
      sample[i].parentNode.removeChild(sample[i]);
      //console.log("killed");
    }

    let holders = document.querySelectorAll('.holder');

    for (let i = 0; i < holders.length; i++){
      holders[i].emit('setState', {value : 'null'});
    }

    ActiveState = 'resetting';
  }

};

function pause(anim) {
  //console.log('Pause animation');
  document.querySelector(anim).setAttribute('animation-mixer', {
    timeScale: 0
  });
}

function play(anim) {
  //console.log('Play animation');
  document.querySelector(anim).setAttribute('animation-mixer', {
    timeScale: 1
  });
}

function setInvisible(id) {
  let object = document.querySelector(id);

  object.setAttribute('visible', 'false');
}

function tutorialToggle() {
  sample = document.querySelectorAll('.tutorial');
  let Indicator = document.querySelector('#infoButton');

  if(sample[0].getAttribute('visible')){
    
    // Set button to red
    Indicator.setAttribute('circles-button', {
      button_color: 'rgb(224, 37, 18)',
      button_color_hover: 'rgb(145, 31, 19)'
    });

    sample.forEach((element) => element.setAttribute('visible', 'false'));
  }else{
    // Set button to green
    Indicator.setAttribute('circles-button', {
      button_color: 'rgb(101,199,93)',
      button_color_hover: 'rgb(66,133,61)'
    });

    sample.forEach((element) => element.setAttribute('visible', 'true'));
  }
}

function setDynamicLocation(id, position, rotation) {
  const object = document.querySelector('#' + id);
  console.log('Setting new dynamic position of ' + id);

  object.removeAttribute('dynamic-body');

  object.setAttribute('position', position);
  object.setAttribute('rotation', rotation);

  object.emit('throw');

  object.setAttribute('dynamic-body', { shape: 'none' });

}
