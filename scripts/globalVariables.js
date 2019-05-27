let scene, camera, renderer;

let show_debug_tools;
let enable_shadows;

const X_AXIS = new THREE.Vector3(1, 0, 0);
const Y_AXIS = new THREE.Vector3(0, 1, 0);
const Z_AXIS = new THREE.Vector3(0, 0, 1);

const MAX_DIFFERENCE_ANGLE = Math.pow(10,-6);

let htmlParser;