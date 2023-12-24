//import { GLTFLoader } from '../';
//import * as THREE from 'three'; // Import THREE library

// ---------------------------ADD PLANET FUNCTIONS-------------------------------------
export function addPlanet(modelUrl, scene, camera, renderer, planetsArray, addMarsEnabled, planetSettings, scale, planetProperties, cameraDirection) {
    // Remove the previous planet's event listener (if any)
    if (planetsArray.length > 0) {
        renderer.domElement.removeEventListener('click', planetsArray[0].listener);
    }

    // Add the new planet's event listener
    const planetListener = (event) => {
        console.log('Click event triggered');
        // Calculate the click position in normalized device coordinates (NDC)
        const mouse = new THREE.Vector2();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        // Create a raycaster to check for intersections with the scene
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);

        // Check for intersections with the scene objects
        const intersects = raycaster.intersectObjects(scene.children);

        // If there's no intersection, add a new planet at the clicked position
        if (intersects.length === 0) {
            console.log('No intersection detected');
            // Load the 3D model
            const gltfLoader = new GLTFLoader(); // Use THREE.GLTFLoader here


            gltfLoader.load(modelUrl, (gltfScene) => {
                if (addMarsEnabled) {
                    console.log('Adding Mars planet'); // Use the new variable instead of addMarsEnabled
                    const loadedModel = gltfScene.scene;

                    loadedModel.scale.set(scale, scale, scale);
                    
                    const initialVelocity = cameraDirection.clone().multiplyScalar(planetSettings.initialVelocityMagnitude);
                    loadedModel.mass = planetSettings.mass
                    loadedModel.initialVelocity = planetSettings.initialVelocityMagnitude;

                    console.log('Model assigned:', loadedModel);
                    // Convert the click position to a 3D vector in the scene coordinates
                    const position = new THREE.Vector3();
                    position.set(mouse.x, mouse.y, 0.5).unproject(camera);

                    initialVelocity.applyQuaternion(camera.quaternion); // Apply camera's orientation

                    // Position the model at the clicked position
                    loadedModel.position.copy(position);

                    // Add the model to the scene
                    scene.add(loadedModel);

                    planetProperties.push({
                        type: planetSettings.type,
                        mass: planetSettings.mass,
                        model: loadedModel,
                        force: new THREE.Vector3(), // Initialize force vector
                        velocity: initialVelocity,
                    });

                    // Store the planet's model in the array
                    planetsArray[0].model = loadedModel;

                    addMarsEnabled = false;

                }
            });
        }
    };

    // Attach the event listener to the renderer's DOM element
    renderer.domElement.addEventListener('click', planetListener);

    // Store the planet's event listener in the planetsArray
    planetsArray[0] = { listener: planetListener };

    console.log('Planet listener added');
}

// ------------------------------- PLANET ROTATION -------------------------------------------

export function startMarsRotation(marsSpheres) {
    console.log('Starting Mars rotation...');
    if (marsSpheres.length === 0) return;

    const rotateMars = () => {
        console.log('Rotating Mars...')
        for (const marsMesh of marsSpheres) {
            console.log("marsMesh:", marsMesh);
            if (marsMesh) {
                console.log("marsMesh.rotation.y:", marsMesh.rotation.y); // Add this line to log rotation.y
                marsMesh.rotation.y += 0.005;
            }
        }
        requestAnimationFrame(rotateMars);
    }

    rotateMars();
}

// Function to start the Earth rotation
export function startEarthRotation(earthSpheres) {
    if (earthSpheres.length === 0) return;
  
    const rotateEarth = () => {
      for (const earthMesh of earthSpheres) {
        earthMesh.rotation.y += 0.005; // Adjust the rotation speed as needed
      }
      requestAnimationFrame(rotateEarth);
    }
  
    rotateEarth();
  }