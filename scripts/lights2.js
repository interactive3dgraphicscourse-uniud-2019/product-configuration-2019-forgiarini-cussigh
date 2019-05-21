// default: white, 1.0 intensity
var light1Parameters = {
    red: 1.0,
    green: 1.0,
    blue: 1.0,
    intensity: 1.0,
}

var light2Parameters = {
    red: 1.0,
    green: 1.0,
    blue: 1.0,
    intensity: 1.0,
}
let lightMesh1;
let lightMesh2;

function createLights() {

    lightMesh1 = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0xffff00, wireframe: true }));
    lightMesh1.position.set(7.0, 7.0, 7.0);
    uniforms.pointLightPosition1.value = new THREE.Vector3(lightMesh1.position.x,
        lightMesh1.position.y,
        lightMesh1.position.z);

    uniforms2.pointLightPosition1.value = new THREE.Vector3(lightMesh1.position.x,
        lightMesh1.position.y,
        lightMesh1.position.z);


    lightMesh2 = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0xffff00, wireframe: true }));
    lightMesh2.position.set(-7.0, 7.0, -7.0);
    uniforms.pointLightPosition2.value = new THREE.Vector3(lightMesh2.position.x,
        lightMesh2.position.y,
        lightMesh2.position.z);

    uniforms2.pointLightPosition2.value = new THREE.Vector3(lightMesh2.position.x,
        lightMesh2.position.y,
        lightMesh2.position.z);
    scene.add(lightMesh1);
    scene.add(lightMesh2);
}