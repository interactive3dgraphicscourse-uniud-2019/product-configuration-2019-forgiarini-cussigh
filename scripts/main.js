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
  //renderer.gammaInput = true;
  //renderer.gammaOutput = true;
  //renderer.shadowMap.enabled = true;
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
  createLights();

  let vs = document.getElementById("vertex").textContent;
  let fs = document.getElementById("fragment").textContent;
  let tc = new TextureController("./textures/tables/");
  console.log(tc);
  sceneObjectsControllers = [];

  sceneObjectsControllers.push(new ObjPartController({
    vertexShader: vs,
    fragmentShader: fs,
    modelName: "plane",
    partID: "2345",
    partDescription: "Piano Tavolo",
    lights: [light1Parameters, light2Parameters],
    textureData: {
      id: "wood", 
      color: "_2"
    },
    textureController: tc
  }));

  sceneObjectsControllers.push(new ObjPartController({
    vertexShader: vs,
    fragmentShader: fs,
    modelName: "legs",
    partID: "1234",
    partDescription: "Gambe Tavolo",
    lights: [light1Parameters, light2Parameters],
    textureData: {
      id: "plastic", 
      color: "_4"
    },
    textureController: tc
  }));
}

function createTools() {
  // Creating a GUI with options.
  let avaiableTextures = [{
    typeID: "wood",
    typeSelect: "Wood",
    colors: [
      {
        id: "_1",
        alt: "ebano",
        iconURL: "textures\\tables\\wood\\wood_1_Diffuse.jpg",
      },
      {
        id: "_2",
        alt: "pioppo",
        iconURL: "textures\\tables\\wood\\wood_2_Diffuse.jpg",
      },
      {
        id: "_3",
        alt: "olmo",
        iconURL: "textures\\tables\\wood\\wood_3_Diffuse.jpg",
      },
      {
        id: "_4",
        alt: "acero",
        iconURL: "textures\\tables\\wood\\wood_4_Diffuse.jpg",
      },
      {
        id: "_5",
        alt: "mogano",
        iconURL: "textures\\tables\\wood\\wood_5_Diffuse.jpg",
      },
    ]
  },
  {
    typeID: "plastic",
    typeSelect: "Plastica",
    colors: [
      {
        id: "_1",
        alt: "bianco",
        iconURL: "textures\\tables\\plastic\\plastic_1_Diffuse.jpg",
      },
      {
        id: "_2",
        alt: "rosso",
        iconURL: "textures\\tables\\plastic\\plastic_2_Diffuse.jpg",
      },
      {
        id: "_3",
        alt: "verde",
        iconURL: "textures\\tables\\plastic\\plastic_3_Diffuse.jpg",
      },
      {
        id: "_4",
        alt: "blu",
        iconURL: "textures\\tables\\plastic\\plastic_4_Diffuse.jpg",
      },
      {
        id: "_5",
        alt: "marrone",
        iconURL: "textures\\tables\\plastic\\plastic_5_Diffuse.jpg",
      },
      {
        id: "_6",
        alt: "grigio",
        iconURL: "textures\\tables\\plastic\\plastic_6_Diffuse.jpg",
      },
    ]
  },
  ];

  let optionsContainer = document.getElementById("editorOptions");
  let partsWrapper = optionsContainer.querySelectorAll(".parts-container")[0];
  let controllers = [];
  controllers.push(new EditorController(optionsContainer));

  sceneObjectsControllers.forEach(objControl => {
    let menuData = {
      partID: objControl.name,
      partName: objControl.description,
      roughness: {
        min: 0.0,
        max: 5.0,
        step: 0.2,
        start: 0
      },
      textures: avaiableTextures
    }
    let partMenuContainer = buildMenuOptions(partsWrapper, menuData);
    controllers.push(new EditorPartController(partMenuContainer, objControl));
  });
}

let sceneObjectsControllers;

function init() {
  scene = new THREE.Scene();
  show_debug_tools = true;
  enable_shadows = true;
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
  createTools();

  updateWorld();
}

function updateUniforms() {
  sceneObjectsControllers.forEach(objControl => {
    objControl.updateUniforms();
  });
}

function updateWorld() {
  requestAnimationFrame(updateWorld);
  updateUniforms();
  controls.update();
  if (show_debug_tools) {
    stats.update();
  }
  renderWorld();
}

function renderWorld() {
  renderer.render(scene, camera);
}
