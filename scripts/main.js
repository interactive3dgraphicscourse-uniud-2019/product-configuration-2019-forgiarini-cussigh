let controls, stats;

/**
 * Creates an istance of THREE.OrbitControls used to move the camera.
 */
function createControls() {
  controls = new THREE.OrbitControls(camera, renderer.domElement);

  // disabling key commands
  controls.enableKeys = false;

  //call this only in static scenes (i.e., if there is no animation loop)
  //controls.addEventListener( 'change', render );
}

/**
 * Usefull function to handle resize event of browser. It updates renderer dimensions.
 * @param {Event} e resize event
 */
let resizeListener = e => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
};

/**
 * Creates an istance of THREE.WebGLRenderer and links to the body.
 */
function createRenderer() {
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0xf0f0f0);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.gammaInput = true;
  renderer.gammaOutput = true;
  renderer.shadowMap.enabled = true;
  document.body.appendChild(renderer.domElement);
}

/**
 * Creates an istance of THREE.PerspectiveCamera and links to the body.
 * If position and lookAt parameters are not passed, camera will be placed at 2,5,10 and look at 0,0,0.
 *
 * @param {Object} [position] Vector3 of camera position
 * @param {Object} [lookAt]   Vector3 of camera lookAt
 */
function createCamera(position, lookAt) {
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  position =
    typeof position == "undefined" ? new THREE.Vector3(10, 20, 20) : position;
  camera.position.set(position.x, position.y, position.z);
  lookAt = typeof lookAt == "undefined" ? new THREE.Vector3(0, 0, 0) : lookAt;
  camera.lookAt(lookAt);
}

function createScene() {
  var geometry = new THREE.BoxGeometry(1, 1, 1);
  var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  var cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
}
let textureParametersTable = {
  material: "wood",
  type: 1
};

function createTools() {
  // Creating a GUI with options.

  let menuData = {
    partID: "table",
    partName: "Piano Tavolo",
    roughness: {
      min: 0,
      max: 100,
      start: 100
    },
    textures: [{
      typeID: "wood",
      typeSelect: "Wood",
      colors: [
        {
          id: "bambo",
          iconURL: "https://upload.wikimedia.org/wikipedia/commons/c/cd/Facebook_logo_%28square%29.png",
        },
        {
          id: "acero",
          iconURL: "https://upload.wikimedia.org/wikipedia/commons/c/cd/Facebook_logo_%28square%29.png",
        },
        {
          id: "pino",
          iconURL: "https://upload.wikimedia.org/wikipedia/commons/c/cd/Facebook_logo_%28square%29.png",
        },
        {
          id: "mogano",
          iconURL: "https://upload.wikimedia.org/wikipedia/commons/c/cd/Facebook_logo_%28square%29.png",
        },
        {
          id: "ebano",
          iconURL: "https://upload.wikimedia.org/wikipedia/commons/c/cd/Facebook_logo_%28square%29.png",
        },
      ]
    },
    {
      typeID: "metal",
      typeSelect: "Metallo",
      colors: [
        {
          id: "oro",
          iconURL: "https://upload.wikimedia.org/wikipedia/commons/c/cd/Facebook_logo_%28square%29.png",
        },
        {
          id: "ferro",
          iconURL: "https://upload.wikimedia.org/wikipedia/commons/c/cd/Facebook_logo_%28square%29.png",
        },
        {
          id: "argento",
          iconURL: "https://upload.wikimedia.org/wikipedia/commons/c/cd/Facebook_logo_%28square%29.png",
        },
      ]
    },
    {
      typeID: "plastic",
      typeSelect: "Plastica",
      colors: [
        {
          id: "rosso",
          iconURL: "https://upload.wikimedia.org/wikipedia/commons/c/cd/Facebook_logo_%28square%29.png",
        },
        {
          id: "bianco",
          iconURL: "https://upload.wikimedia.org/wikipedia/commons/c/cd/Facebook_logo_%28square%29.png",
        },
        {
          id: "verde",
          iconURL: "https://upload.wikimedia.org/wikipedia/commons/c/cd/Facebook_logo_%28square%29.png",
        },
        {
          id: "arancione",
          iconURL: "https://upload.wikimedia.org/wikipedia/commons/c/cd/Facebook_logo_%28square%29.png",
        },
      ]
    },
    ]
  }

  let optionsContainer = document.getElementById("editorOptions");
  let partContainer = buildMenuOptions(optionsContainer, menuData);
  let control = new EditorPartController(partContainer, "table");

}

/**
 * @param {String} name Texture color
 * @param {String} part Object part name
 */
let updateTextureColor = function (name, part) {
  console.log("need to update *" + part + "* color with *" + name + "*");
}

/**
* @param {String} name Texture ID
* @param {String} color Texture color ID
* @param {String} part Object part name
*/
let loadTexture = function (name, color, part) {
  console.log("need to update *" + part + "* texture with *" + name + "*" + " color *" + color + "*");
}

let updateTextureRoughness = function (part, val) {
  console.log("need to update *" + part + "* roughness with *" + val + "*");
}

function init() {
  scene = new THREE.Scene();
  show_debug_tools = true;
  enable_shadows = true;
  createTools();
  createRenderer();

  createCamera(new THREE.Vector3(10, 10, 20));

  // controls for camera
  createControls();

  // creating stats of frame
  if (show_debug_tools) {
    stats = createStats();
    // uncomment if you need to draw coordinate axes when building the scene
    Coordinates.drawAllAxes();
  }

  // add listener for resize event of window to update renderer
  window.addEventListener("resize", resizeListener, false);
  createScene();
  updateWorld();
}

function updateWorld() {
  requestAnimationFrame(updateWorld);
  controls.update();
  if (show_debug_tools) {
    stats.update();
  }
  renderWorld();
}

function renderWorld() {
  renderer.render(scene, camera);
}
