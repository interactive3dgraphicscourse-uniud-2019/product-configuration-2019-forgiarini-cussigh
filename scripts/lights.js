// default: white, 1.0 intensity
ambientLight = new THREE.Vector3(0.3, 0.3, 0.3);

let lightsInSceneParameters = [
    {
        red: 1.0,
        green: 1.0,
        blue: 1.0,
        intensity: 0.6,
        position: new THREE.Vector3(7.0, 10.0, 7.0)
    },
    {
        red: 1.0,
        green: 1.0,
        blue: 1.0,
        intensity: 0.6,
        position: new THREE.Vector3(-7.0, 10.0, -7.0)
    },
    {
        red: 1.0,
        green: 1.0,
        blue: 1.0,
        intensity: 0.1,
        position: new THREE.Vector3(-0.0, -10.0, -0.0)
    },
];

function createMeshLights() {
    lightsInSceneParameters.forEach(lightParam => {
        let mesh = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 16),
            new THREE.MeshBasicMaterial({ color: 0xffff00, wireframe: true }));
        mesh.position.set(lightParam.position.x, lightParam.position.y, lightParam.position.z);
        scene.add(mesh);
    });
}