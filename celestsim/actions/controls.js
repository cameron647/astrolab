// import * as THREE from 'three';
// import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// CREATE SCENE
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

// RENDER
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// ORBIT CONTROLS
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableRotate = true; // Enable rotation
controls.enablePan = true; // Enable panning
controls.enableZoom = true; // Enable zooming
controls.enableDamping = false; // Disable damping for smoother movement
controls.autoRotate = false; // Disable auto-rotation

// IMPORTING GLTF
const celestscene = '/celestsim/3Dmodels/mars.glb';
const gltfloader = new GLTFLoader();

let loadedModel;

gltfloader.load(celestscene, (gltfScene) => {
	loadedModel = gltfScene;
	console.log(loadedModel);

	
	scene.add(gltfScene.scene);
})

// CAMERA
camera.position.z = 5

//LIGHTS
const light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
scene.add( light );
const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
scene.add( directionalLight );


function animate() {

	controls.update();
	requestAnimationFrame( animate );

	renderer.render( scene, camera );
}

animate();