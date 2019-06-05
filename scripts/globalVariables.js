let scene, camera, renderer;

let controls, stats;

let show_debug_tools;
let show_fps;

const X_AXIS = new THREE.Vector3(1, 0, 0);
const Y_AXIS = new THREE.Vector3(0, 1, 0);
const Z_AXIS = new THREE.Vector3(0, 0, 1);

const MAX_DIFFERENCE_ANGLE = Math.pow(10,-6);

const MOBILE_WIDTH = 768;
const MODELS_PATH = "models/";
const TEXTURES_PATH = "textures/";

let htmlParser;

let sceneObjectsControllers;
let textureController;

let menuControllers;
let partsControllers;