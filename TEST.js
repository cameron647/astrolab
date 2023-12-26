// ---------------------- IMPORTS ----------------------
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { addPlanet } from './celestsim/actions/eventlistener'; // Import the function from the separate file
import { GUI } from 'dat.gui';
import { calculateForces } from './staticgravity'; import { updateVelocities } from './staticgravity'; import { updatePositions } from './staticgravity';
import { rungeKuttaIntegration } from './celestsim/RK4';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

//  ---------------------- Create the scene, camera, and renderer  ----------------------
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// ---------------------- ORBIT CONTROLS ----------------------
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableRotate = true; // Enable rotation
controls.enablePan = true; // Enable panning
controls.enableZoom = true; // Enable zooming
controls.enableDamping = false; // Disable damping for smoother movement
controls.autoRotate = false; // Disable auto-rotation

// Position the camera
camera.position.z = 5;

// ---------------------- VARIABLES ----------------------
let addMarsEnabled = false
let addEarthEnabled = false;
let addVenusEnabled = false;
let addMercuryEnabled = false;
let addJupiterEnabled = false;
let addSaturnEnabled = false;
let addUranusEnabled = false;
let addNeptuneEnabled = false;
const earthSpheres = []; // Array to store all Earth spheres
const marsSpheres = []
const venusSpheres = []
const mercurySpheres = []
const jupiterSpheres = []
const saturnSpheres = []
const uranusSpheres =[];
const neptuneSpheres = [];

// Master list of all planets
const planetProperties = [];

const G = 6.67430e-11; // Gravitational constant
const timeStep = 0.5; // Time step for integration


// PLANET MASSES DAT.GUI:
const _minMassEarth = 1;
const _maxMassEarth = 99999999999;
const _minMassMars = 1;
const _maxMassMars = 99999999999;
const _minMassVenus = 1;
const _maxMassVenus = 99999999999;
const _minMassMercury = 1;
const _maxMassMercury = 99999999999;
const _minMassJupiter = 1;
const _maxMassJupiter = 99999999999999;
const _minMassSaturn = 1;
const _maxMassSaturn = 99999999999;
const _minMassUranus = 1;
const _maxMassUranus = 99999999999;
const _minMassNeptune = 1;
const _maxMassNeptune = 99999999999;

// PLANET SETTINGS DAT.GUI
const _earthSettings = {
    type: 'earth',
	  mass: 5970000000,
    initialVelocityMagnitude: 0,
};

// past mars mass: 6410000000
const _marsSettings = {
    type: 'mars',
    mass: 639579000,
    initialVelocityMagnitude: 0,
};

// past venus mass: 4870000000
const _venusSettings = {
    type: 'venus',
    mass: 4867057500,
    initialVelocityMagnitude: 0,
};

const _mercurySettings = {
  type: 'mercury',
  mass: 330041100,
  initialVelocityMagnitude: 0,
};

const _jupiterSettings = {
  type: 'jupiter',
  mass: 1.8e10,
  initialVelocityMagnitude: 0,
};

const _saturnSettings = {
  type: 'saturn',
  mass: 5.0e7,
  initialVelocityMagnitude: 0,
};

const _uranusSettings = {
  type: 'uranus',
  mass: 86800000000,
  initialVelocityMagnitude: 0,
};

const _neptuneSettings = {
  type: 'neptune',
  mass: 102000000000,
  initialVelocityMagnitude: 0,
};

//  ---------------------- JS FOR MENU  ----------------------

const menuTrigger = document.getElementById('menu-trigger');
const menuItems = document.getElementById('menu-items');

menuTrigger.addEventListener('click', () => {
    menuItems.classList.toggle('active'); // Toggle the active class
});

// ---------------------- EVENT LISTENER BUTTON FOR EARTH ----------------------
const addEarthButton = document.getElementById('add-earth-button');
addEarthButton.addEventListener('click', () => {
  addEarthEnabled = true;
});

// ---------------------- EVENT LISTENERS  ----------------------
// Mercury
const addMercuryButton = document.getElementById('add-mercury-button')
addMercuryButton.addEventListener('click', () => {
  addMercuryEnabled = true;

  if (addMercuryEnabled === true) {
    const cameraDirection = new THREE.Vector3(0, 0, -1)
    console.log('CAMERA DIRECTION:', cameraDirection)
    addPlanet('/celestsim/3Dmodels/mercury.glb', scene, camera, renderer, mercurySpheres, addMercuryEnabled, _mercurySettings, 0.001, planetProperties, cameraDirection)
  }
});

// Venus
const addVenusButton = document.getElementById('add-venus-button');
addVenusButton.addEventListener('click', () => {
  addVenusEnabled = true;

  if (addVenusEnabled === true) {
    const cameraDirection = new THREE.Vector3(0, 0, -1)
    console.log('CAMERA DIRECTION:', cameraDirection)
    addPlanet('/celestsim/3Dmodels/venus.glb', scene, camera, renderer, venusSpheres, addVenusEnabled, _venusSettings, 1.7, planetProperties, cameraDirection)
  }
});
// Mars
const addMarsButton = document.getElementById('add-mars-button');
addMarsButton.addEventListener('click', () => {
  console.log('Add Mars button clicked');
  addMarsEnabled = true;

  if (addMarsEnabled === true) {
    const cameraDirection = new THREE.Vector3(0, 0, -1)
    console.log('CAMERA DIRECTION:', cameraDirection)
    console.log('Adding Mars planet using addPlanet function');
    addPlanet('/celestsim/3Dmodels/mars.glb', scene, camera, renderer, marsSpheres, addMarsEnabled, _marsSettings, 0.8, planetProperties, cameraDirection)
  }
});

// Jupiter
const addJupiterButton = document.getElementById('add-jupiter-button');
addJupiterButton.addEventListener('click', () => {
  console.log('Add Jupiter button clicked');
  addJupiterEnabled = true;

  if (addJupiterEnabled === true) {
    const cameraDirection = new THREE.Vector3(0, 0, -1)
    console.log('CAMERA DIRECTION:', cameraDirection)
    console.log('Adding Jupiter planet using addPlanet function');
    addPlanet('/celestsim/3Dmodels/jupiter.glb', scene, camera, renderer, jupiterSpheres, addJupiterEnabled, _jupiterSettings, 35, planetProperties, cameraDirection)
  }
});

// Saturn
const addSaturnButton = document.getElementById('add-saturn-button');
addSaturnButton.addEventListener('click', () => {
  console.log('Add Saturn button clicked');
  addSaturnEnabled = true;

  if (addSaturnEnabled === true) {
    const cameraDirection = new THREE.Vector3(0, 0, -1)
    console.log('CAMERA DIRECTION:', cameraDirection)
    console.log('Adding Jupiter planet using addPlanet function');
    addPlanet('/celestsim/3Dmodels/saturn.glb', scene, camera, renderer, saturnSpheres, addSaturnEnabled, _saturnSettings, 0.18, planetProperties, cameraDirection)
  }
});

// Uranus
const addUranusButton = document.getElementById('add-uranus-button');
addUranusButton.addEventListener('click', () => {
  console.log('Add Uranus button clicked');
  addUranusEnabled = true;

  if (addUranusEnabled === true) {
    const cameraDirection = new THREE.Vector3(0, 0, -1)
    console.log('CAMERA DIRECTION:', cameraDirection)
    console.log('Adding Uranus planet using addPlanet function');
    addPlanet('/celestsim/3Dmodels/uranus.glb', scene, camera, renderer, uranusSpheres, addUranusEnabled, _uranusSettings, 7, planetProperties, cameraDirection)
  }
});

// Neptune
const addNeptuneButton = document.getElementById('add-neptune-button');
addNeptuneButton.addEventListener('click', () => {
  console.log('Add Neptune button clicked');
  addNeptuneEnabled = true;

  if (addNeptuneEnabled === true) {
    const cameraDirection = new THREE.Vector3(0, 0, -1)
    console.log('CAMERA DIRECTION:', cameraDirection)
    console.log('Adding Uranus planet using addPlanet function');
    addPlanet('/celestsim/3Dmodels/neptune.glb', scene, camera, renderer, neptuneSpheres, addNeptuneEnabled, _neptuneSettings, 9, planetProperties, cameraDirection)
  }
});


//Earth
renderer.domElement.addEventListener('click', (event) => {
  if (addEarthEnabled === true) {
    const cameraDirection = new THREE.Vector3(0, 0, -1)
    console.log('CAMERA DIRECTION:', cameraDirection);

    console.log('event listener true');
    // Calculate the click position in normalized device coordinates (NDC)
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Create a raycaster to check for intersections with the scene
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);


    // Check for intersections with the scene objects
    const intersects = raycaster.intersectObjects(scene.children);

    // If there's no intersection, add a new sphere at the clicked position
    if (intersects.length === 0) {
      // Create a new sphere geometry and material
    
      const size = 5.8;
      const geometry = new THREE.SphereGeometry(size, 32, 32);
      const material = new THREE.MeshPhongMaterial();

      // Create the sphere mesh and add it to the scene
      const sphere = new THREE.Mesh(geometry, material);
      sphere.mass = _earthSettings.mass

      const initialVelocity = cameraDirection.clone().multiplyScalar(_earthSettings.initialVelocityMagnitude);
      console.log('Initial VELOCITY:', initialVelocity)
      sphere.initialVelocity = _earthSettings.initialVelocityMagnitude
      console.log('INTIAL VELOCITY AFTER:', sphere.initialVelocity)
      
      initialVelocity.applyQuaternion(camera.quaternion);
      
      //sphere.initialVelocity = _earthSettings.initialVelocityMagnitude

      const textureLoader = new THREE.TextureLoader();
      textureLoader.load('/celestsim/earthmap1k.jpg', (texture) => {
        material.map = texture;
        material.needsUpdate = true; // Update material to apply the texture
      });

      const bumpMapUrl = '/celestsim/earthbump1k.jpg';
      textureLoader.load(bumpMapUrl, (bumpMapTexture) => {
        material.bumpMap = bumpMapTexture;
        material.needsUpdate = true; // Update material to apply the bump map
      });

      const specularMapUrl = '/celestsim/earthspec1k.jpg';
      textureLoader.load(specularMapUrl, (specularMapTexture) => {
        material.specularMap = specularMapTexture;
        material.needsUpdate = true; // Update material to apply the specular map
      });

      // Convert the click position to a 3D vector in the scene coordinates
      const position = new THREE.Vector3();
      position.set(mouse.x, mouse.y, 0.1).unproject(camera);

      // Position the sphere at the clicked position
      sphere.position.copy(position);

      // Add the new sphere to the scene
      console.log('before scene add sphere:', sphere)
      scene.add(sphere);

      // Store the Earth sphere in the array
      earthSpheres.push(sphere);

      console.log('Adding Earth to planetProperties:', sphere);
      planetProperties.push({
        type: 'earth',
        mass: _earthSettings.mass,
        model: sphere,
        force: new THREE.Vector3(), // Initialize force vector
        velocity: initialVelocity,
        initialVelocityMag: _earthSettings.initialVelocityMag
        });

      // Start the Earth rotation
      //startEarthRotation(earthSpheres);

      addEarthEnabled = false;
    }
  }
});

// ---------------------- LIGHTS ----------------------
const light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
scene.add(light);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
scene.add(directionalLight);

// ---------------------- DAT.GUI ----------------------

function updateMass(planetArray, value) {
    for (const planet of planetArray) {
      planet.mass = value; // Update the planet's mass
    }
  }

  function updatevel(planetArray, value) {
    for (const planet of planetArray) {
      planet.initialVelocityMagnitude = value; // Update the planet's velocity
    }
  }

const gui = new GUI()
gui.domElement.id = 'gui';
// DAT GUI FOR MERCURY ----------------------
const mercuryFolder = gui.addFolder('Mercury')
mercuryFolder.add(_mercurySettings, 'mass', _minMassMercury, _maxMassMercury).step(1).name('Mass').onChange((value) => {
  updateMass(mercurySpheres, value);
});
mercuryFolder.add(_mercurySettings, 'initialVelocityMagnitude', 0, 3).step(0.1).name('Initial Velocity Magnitude').onChange((value) => {
  updatevel(mercurySpheres, value);
});
//DAT GUI FOR VENUS ----------------------
const venusFolder = gui.addFolder('Venus')
venusFolder.add(_venusSettings, 'mass', _minMassVenus, _maxMassVenus).step(1).name('Mass').onChange((value) => {
    updateMass(venusSpheres, value);
});
venusFolder.add(_venusSettings, 'initialVelocityMagnitude', 0, 3).step(0.1).name('Initial Velocity Magnitude').onChange((value) => {
  updatevel(venusSpheres, value);
});
//DAT GUI FOR EARTH ----------------------
const earthFolder = gui.addFolder('Earth')
earthFolder.add(_earthSettings, 'mass', _minMassEarth, _maxMassEarth).step(1).name('Mass').onChange((value) => {
    updateMass(earthSpheres, value);
});
earthFolder.add(_earthSettings, 'initialVelocityMagnitude', 0, 3).step(0.1).name('Initial Velocity Magnitude').onChange((value) => {
  updatevel(earthSpheres, value);
});
//DAT GUI FOR MARS ----------------------
const marsFolder = gui.addFolder('Mars')
marsFolder.add(_marsSettings, 'mass', _minMassMars, _maxMassMars).step(1).name('Mass').onChange((value) => {
    updateMass(marsSpheres, value);
});
marsFolder.add(_marsSettings, 'initialVelocityMagnitude', 0, 3).step(0.1).name('Initial Velocity Magnitude').onChange((value) => {
  updatevel(marsSpheres, value);
});
//DAT GUI FOR JUPITER ----------------------
const jupiterFolder = gui.addFolder('Jupiter')
jupiterFolder.add(_jupiterSettings, 'mass', _minMassJupiter, _maxMassJupiter).step(1).name('Mass').onChange((value) => {
    updateMass(jupiterSpheres, value);
});
jupiterFolder.add(_jupiterSettings, 'initialVelocityMagnitude', 0, 3).step(0.1).name('Initial Velocity Magnitude').onChange((value) => {
  updatevel(jupiterSpheres, value);
});
//DAT GUI FOR SATURN ----------------------
const saturnFolder = gui.addFolder('Saturn')
saturnFolder.add(_saturnSettings, 'mass', _minMassSaturn, _maxMassSaturn).step(1).name('Mass').onChange((value) => {
    updateMass(saturnSpheres, value);
});
saturnFolder.add(_saturnSettings, 'initialVelocityMagnitude', 0, 3).step(0.1).name('Initial Velocity Magnitude').onChange((value) => {
  updatevel(saturnSpheres, value);
});
//DAT GUI FOR URANUS ----------------------
const uranusFolder = gui.addFolder('Uranus')
uranusFolder.add(_uranusSettings, 'mass', _minMassUranus, _maxMassUranus).step(1).name('Mass').onChange((value) => {
    updateMass(uranusSpheres, value);
});
uranusFolder.add(_uranusSettings, 'initialVelocityMagnitude', 0, 3).step(0.1).name('Initial Velocity Magnitude').onChange((value) => {
  updatevel(uranusSpheres, value);
});
//DAT GUI FOR Neptune ----------------------
const neptuneFolder = gui.addFolder('Neptune')
neptuneFolder.add(_neptuneSettings, 'mass', _minMassNeptune, _maxMassNeptune).step(1).name('Mass').onChange((value) => {
    updateMass(neptuneSpheres, value);
});
neptuneFolder.add(_neptuneSettings, 'initialVelocityMagnitude', 0, 3).step(0.1).name('Initial Velocity Magnitude').onChange((value) => {
  updatevel(neptuneSpheres, value);
});
// ---------------------- ANIMATE ----------------------
function animate() {
  controls.update();

  rungeKuttaIntegration(planetProperties, G, timeStep);
  updatePositions(planetProperties, timeStep, scene);
  
    for (const planet of planetProperties) {
        console.log('Velocity values:')
        console.log(planet.type, planet.velocity.clone().length());
    }

  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

// Start the animation
animate();
