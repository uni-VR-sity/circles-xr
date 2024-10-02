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
  //let prevPreset = mol_manager.getAttribute('molecule-manager')["currentPreset"];
  //console.log('Previous preset is:' + GlobalPreset);

  let start_button = document.querySelector('#startButtonGroup');

  if (ActiveState == 'null' || ActiveState == 'resetting') {
    if (GlobalPreset == 'null') {
      //console.log('First Preset press');
      Indicator.setAttribute('circles-button', {
        button_color: 'rgb(101,199,93)',
        button_color_hover: 'rgb(66,133,61)'
      });

      //manager.setAttribute('molecule-manager', {currentPreset: value});
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


function startExperience() {

  ActiveState = 'playing';

  //turn off start button
  let start_button = document.querySelector('#startButtonGroup');
  start_button.setAttribute('circles-interactive-visible', 'false');

  //turn on reset button
  let reset_button = document.querySelector('#resetButtonGroup');
  reset_button.setAttribute('circles-interactive-visible', 'true');

  let holders = document.querySelectorAll('.holder');
  //console.log(holders[0]);

  for (let i = 0; i < holders.length; i++){
    holders[i].emit('setState', {value : 'unbound'});
  }

  //Create a randomly placed glucose molecule
  var sample = 0;
  while (sample < 40) {
    mol_manager.emit('mol_initial_spawn', { value: 'lactose', pos: 'null', rot: 'null' });
    mol_manager.emit('mol_initial_spawn', { value: 'glucose', pos: 'null', rot: 'null' });
    //mol_manager.emit('mol_initial_spawn', {value : 'galactose', pos : 'null', rot : 'null'});
    //mol_manager.emit('mol_initial_spawn', {value : 'allolactose', pos : 'null', rot : 'null'});
    mol_manager.emit('mol_initial_spawn', { value: 'camp', pos: 'null', rot: 'null' });
    sample++;
  }
  mol_manager.emit('mol_initial_spawn', {value : 'mRNA-rep', pos : { x: -1.5, y: 1.85, z: -5.95 }, rot : 'null'});

  mol_manager.emit('mol_spawn', {value : 'permease', pos : { x: 0, y: 3, z: 2 }, rot : 'null'});

  mol_manager.emit('mol_initial_spawn', {value : 'beta-gal', pos : { x: 0.5, y: 1.85, z: 0 }, rot : 'null'});

  //mol_manager.emit('mol_initial_spawn', {value : 'mRNA-lac', pos : { x: 1.65, y: 1.55, z: -5.3 }, rot : 'null'});
  mol_manager.emit('mol_initial_spawn', {value : 'repressor', pos : { x: 2, y: 1.55, z: -5.3 }, rot : 'null'});

};


function resetExperience() {

  if (ActiveState == 'playing') {
    let start_button = document.querySelector('#startButtonGroup');
    start_button.setAttribute('circles-interactive-visible', 'true');

    let reset_button = document.querySelector('#resetButtonGroup');
    reset_button.setAttribute('circles-interactive-visible', 'false');

    //Get a list of all the molecules
    let sample = document.querySelectorAll('.molecule');
    //console.log(sample[0]);

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

function setDynamicLocation(id, position, rotation) {
  const object = document.querySelector('#' + id);
  console.log('Setting new dynamic position of ' + id);

  object.removeAttribute('dynamic-body');

  object.setAttribute('position', position);
  object.setAttribute('rotation', rotation);

  object.emit('throw');

  object.setAttribute('dynamic-body', { shape: 'none' });

}
