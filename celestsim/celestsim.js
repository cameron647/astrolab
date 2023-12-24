// ---------------------- IMPORTS ----------------------
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { addPlanet } from './celestsim/actions/eventlistener'; // Import the function from the separate file
import { GUI } from 'dat.gui';
import { calculateForces } from './staticgravity'; import { updateVelocities } from './staticgravity'; import { updatePositions } from './staticgravity';

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
let addVenusEnabled = false
const earthSpheres = []; // Array to store all Earth spheres
const marsSpheres = []
const venusSpheres = []

// Master list of all planets
const planetProperties = [];

const G = 6.67430e-11; // Gravitational constant
const timeStep = 0.5; // Time step for integration


// PLANET MASSES DAT.GUI:
const _minMassEarth = 1000;
const _maxMassEarth = 5.97e24;
const _minMassMars = 1000
const _maxMassMars = 6.41e23
const _minMassVenus = 1000
const _maxMassVenus = 4.87e24

// PLANET SETTINGS DAT.GUI
const _earthSettings = {
    type: 'earth',
	mass: 5.97e24,
};

const _marsSettings = {
    type: 'mars',
    mass: 6.41e23,
};

const _venusSettings = {
    type: 'venus',
    mass: 4.87e24,
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
// Venus
const addVenusButton = document.getElementById('add-venus-button');
addVenusButton.addEventListener('click', () => {
  addVenusEnabled = true;

  if (addVenusEnabled === true) {
    addPlanet('/celestsim/3Dmodels/venus.glb', scene, camera, renderer, venusSpheres, addVenusEnabled, _venusSettings, 1.7, planetProperties)
  }
});
// Mars
const addMarsButton = document.getElementById('add-mars-button');
addMarsButton.addEventListener('click', () => {
  console.log('Add Mars button clicked');
  addMarsEnabled = true;

  if (addMarsEnabled === true) {
    console.log('Adding Mars planet using addPlanet function');
    addPlanet('/celestsim/3Dmodels/mars.glb', scene, camera, renderer, marsSpheres, addMarsEnabled, _marsSettings, 0.8, planetProperties)
  }
});
//Earth
renderer.domElement.addEventListener('click', (event) => {
  if (addEarthEnabled === true) {
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
      sphere.initialVelocityMag = _earthSettings.initialVelocityMag;

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
        velocity: new THREE.Vector3(),
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

const gui = new GUI()
gui.domElement.id = 'gui';
const venusFolder = gui.addFolder('Venus')
venusFolder.add(_venusSettings, 'mass', _minMassVenus, _maxMassVenus).step(10000).name('Mass').onChange((value) => {
    updateMass(venusSpheres, value);
});
const earthFolder = gui.addFolder('Earth')
earthFolder.add(_earthSettings, 'mass', _minMassEarth, _maxMassEarth).step(10000).name('Mass').onChange((value) => {
    updateMass(earthSpheres, value);
});
const marsFolder = gui.addFolder('Mars')
marsFolder.add(_marsSettings, 'mass', _minMassMars, _maxMassMars).step(10000).name('Mass').onChange((value) => {
    updateMass(marsSpheres, value);
});

// ---------------------- ANIMATE ----------------------
function animate() {
  controls.update();
  calculateForces(planetProperties, G, 10e6);
  updateVelocities(planetProperties, timeStep, camera);
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

// -----------------------------------------------------------------------------------------------------------------

// STATIC GRAVITY INTERACTION

export function calculateForces(planetProperties, G, distanceScale) {
  for (let i = 0; i < planetProperties.length; i++) {
      for (let j = i + 1; j < planetProperties.length; j++) {

          const planet1 = planetProperties[i];
          const planet2 = planetProperties[j];

          console.log('Calculating forces for planets:', planet1.type, planet2.type);
          if (planet1.model && planet2.model) {
              console.log('Both models are defined. Calculating force...');
              const r = planet2.model.position.clone().sub(planet1.model.position);
              const scaledR = r.clone().multiplyScalar(distanceScale);
              const distanceSq = scaledR.lengthSq();
              const forceMagnitude = (G * planet1.mass * planet2.mass) / distanceSq;
              const force = scaledR.normalize().multiplyScalar(forceMagnitude);

              console.log('Force:', force);
              planet1.force.add(force);
              planet2.force.sub(force);
          } else {
              console.log('One or both models are undefined'); // Debug: Check if models are defined
          }
      }
  }
}

export function updateVelocities(planetProperties, timeStep) {
  for (const planet of planetProperties) {

      const acceleration = planet.force.clone().divideScalar(planet.mass);
      planet.velocity.add(acceleration.clone().multiplyScalar(timeStep));
      planet.force.set(0, 0, 0); // Reset the force for the next iteration

  }
}

export function updatePositions(planetProperties, timeStep, scene) {
  for (const planet of planetProperties) {
      console.log('Updating position for planet:', planet.type);
      console.log('Old position:', planet.model.position);
      planet.model.position.add(planet.velocity.clone().multiplyScalar(timeStep));
      console.log('New position:', planet.model.position);

      scene.add(planet.model);
  }
}