// STATIC GRAVITY INTERACTION

export function calculateForces(planetProperties, G, additionalForce = new THREE.Vector3()) {
    const totalForce = new THREE.Vector3();

    for (let i = 0; i < planetProperties.length; i++) {
        for (let j = i + 1; j < planetProperties.length; j++) {
            const planet1 = planetProperties[i];
            const planet2 = planetProperties[j];

            if (planet1.model && planet2.model) {
                const r = planet2.model.position.clone().sub(planet1.model.position);
                const distanceSq = r.lengthSq();

                if (distanceSq > 0) { // Avoid division by zero
                    let forceMagnitude;

                    if (planet1.velocity.lengthSq() === 0 && planet2.velocity.lengthSq() === 0) {
                        forceMagnitude = (-G * planet1.mass * planet2.mass) / distanceSq;
                    } else if (planet1.velocity.lengthSq() === 0 && planet2.velocity.lengthSq() !== 0) {
                        // Check if planet1 is static and planet2 is not at the origin
                        forceMagnitude = (-G * planet1.mass * planet2.mass) / distanceSq;
                    } else {
                        forceMagnitude = (-G * planet1.mass * planet2.mass) / distanceSq;
                    }

                    const force = r.normalize().multiplyScalar(forceMagnitude);

                    planet1.force.add(force);
                    planet2.force.sub(force);

                    totalForce.add(force);
                }
            }
        }
    }

    return totalForce.add(additionalForce);
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