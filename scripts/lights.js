// default: white, 1.0 intensity
var light1Parameters = {
    red: 1.0,
    green: 1.0,
    blue: 1.0,
    intensity: 1.0,
    position: new THREE.Vector3(7.0, 7.0, 7.0)
}

var light2Parameters = {
    red: 1.0,
    green: 1.0,
    blue: 1.0,
    intensity: 1.0,
    position: new THREE.Vector3(-7.0, 7.0, -7.0)
}

function createLights() {

    let lightMesh1 = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0xffff00, wireframe: true }));
    lightMesh1.position.set(light1Parameters.position.x, light1Parameters.position.y, light1Parameters.position.z);
    scene.add(lightMesh1);


    let lightMesh2 = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0xffff00, wireframe: true }));
    lightMesh2.position.set(light2Parameters.position.x, light2Parameters.position.y, light2Parameters.position.z);
    scene.add(lightMesh2);
}