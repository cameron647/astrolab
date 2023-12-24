import { calculateForces } from "../staticgravity";

export function rungeKuttaIntegration(planetProperties, G, timeStep) {
    for (const planet of planetProperties) {
        const k1 = calculateForces(planetProperties, G).clone().divideScalar(planet.mass);
        const k2 = calculateForces(planetProperties, G, k1.clone().multiplyScalar(timeStep / 2)).clone().divideScalar(planet.mass);
        const k3 = calculateForces(planetProperties, G, k2.clone().multiplyScalar(timeStep / 2)).clone().divideScalar(planet.mass);
        const k4 = calculateForces(planetProperties, G, k3.clone().multiplyScalar(timeStep)).clone().divideScalar(planet.mass);

        const acceleration = k1.clone().add(k2.clone().multiplyScalar(2)).add(k3.clone().multiplyScalar(2)).add(k4).multiplyScalar(1 / 6);

        planet.velocity.add(acceleration.clone().multiplyScalar(timeStep));
        planet.force.set(0, 0, 0); // Reset the force for the next iteration
    }}