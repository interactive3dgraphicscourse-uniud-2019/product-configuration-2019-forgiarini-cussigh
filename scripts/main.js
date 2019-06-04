
/**
 * Creates an istance of THREE.OrbitControls used to move the camera.
 */
function createControls(lookAt) {
  controls = new THREE.OrbitControls(camera, renderer.domElement);

  // disabling key commands
  controls.enableKeys = false;
  lookAt = typeof lookAt == "undefined" ? new THREE.Vector3(0, 0, 0) : lookAt;
  controls.target = lookAt;
  //call this only in static scenes (i.e., if there is no animation loop)
  //controls.addEventListener( 'change', render );
}

/**
 * Usefull function to handle resize event of browser. It updates renderer dimensions.
 * @param {Event} e resize event
 */
function resizeListener(e) {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);

  menuControllers.forEach(controller => {
    if (controller.type == "editor") {
      controller.istance.updateDimensions();
    }
  });
};

/**
 * Creates an istance of THREE.WebGLRenderer and links to the body.
 */
function createRenderer() {
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0xf0f0f0);
  renderer.setPixelRatio(window.devicePixelRatio);
  document.body.appendChild(renderer.domElement);
}

/**
 * Creates an istance of THREE.PerspectiveCamera and links to the body.
 * If position and lookAt parameters are not passed, camera will be placed at 2,5,10 and look at 0,0,0.
 *
 * @param {Object} [position] Vector3 of camera position
 */
function createCamera(position) {
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  position =
    typeof position == "undefined" ? new THREE.Vector3(10, 20, 20) : position;
  camera.position.set(position.x, position.y, position.z);
}

function createScene() {
  if (show_debug_tools) {
    createMeshLights();
  }

  let vs = document.getElementById("vertexShader").textContent;
  let fs = document.getElementById("fragmentShader").textContent;

  textureController = new TextureController(TEXTURES_PATH + "tables/");
  sceneObjectsControllers = [];

  sceneObjectsControllers.push(new ObjPartController({
    vertexShader: vs,
    fragmentShader: fs,
    modelName: "plane",
    partID: "2345",
    partDescription: "Piano Tavolo",
    lights: lightsInSceneParameters,
    materialsAvaiable: ["wood", "metal", "plastic", "marble","aluminium"],
    textureData: {
      id: "wood",
      color: "_1",
      normalScale: 0.1
    },
    textureController: textureController
  }));

  sceneObjectsControllers.push(new ObjPartController({
    vertexShader: vs,
    fragmentShader: fs,
    modelName: "legs",
    partID: "1234",
    partDescription: "Gambe Tavolo",
    materialsAvaiable: ["wood", "metal", "plastic"],
    lights: lightsInSceneParameters,
    textureData: {
      id: "metal",
      color: "_3",
      normalScale: 0.4
    },
    textureController: textureController
  }));
}

function createTools() {
  // Creating a GUI with options.
  let avaiableTextures = [{
    typeID: "wood",
    typeSelect: "Wood",
    roughness: {
      min: 0.0,
      max: 4.0,
      step: 0.05,
      start: 0.0
    },
    colors: [
      {
        id: "_1",
        alt: "ebano",
        iconURL: "",
        iconColor: "#dfd4c2"
      },
      {
        id: "_2",
        alt: "pioppo",
        iconURL: "",
        iconColor: "#dbb77b"
      },
      {
        id: "_3",
        alt: "olmo",
        iconURL: "",
        iconColor: "#7e5f29"
      },
      {
        id: "_4",
        alt: "acero",
        iconURL: "",
        iconColor: "#4f3210"
      },
      {
        id: "_5",
        alt: "mogano",
        iconURL: "",
        iconColor: "#5f3525"
      },
    ]
  },
  {
    typeID: "plastic",
    typeSelect: "Plastica",
    roughness: {
      min: 0.15,
      max: 2.3,
      step: 0.05,
      start: 0.0
    },
    colors: [
      {
        id: "_1",
        alt: "bianco",
        iconURL: "",
        iconColor: "#d1d2cd"
      },
      {
        id: "_2",
        alt: "rosso",
        iconURL: "",
        iconColor: "#9e2423"
      },
      {
        id: "_3",
        alt: "verde",
        iconURL: "",
        iconColor: "#1e5f3f"
      },
      {
        id: "_4",
        alt: "blu",
        iconURL: "",
        iconColor: "#2b717b"
      },
      {
        id: "_5",
        alt: "marrone",
        iconURL: "",
        iconColor: "#99824e"
      },
      {
        id: "_6",
        alt: "grigio",
        iconURL: "",
        iconColor: "#999999"
      },
    ]
  },
  {
    typeID: "metal",
    typeSelect: "Metallo",
    roughness: {
      min: 0.0,
      max: 1.0,
      step: 0.05,
      start: 0.0
    },
    colors: [
      {
        id: "_1",
        alt: "ferro",
        iconURL: "",
        iconColor: "#8c7958"
      },
      {
        id: "_2",
        alt: "pandino",
        iconURL: "",
        iconColor: "#8f5047"
      },
      {
        id: "_3",
        alt: "rame",
        iconURL: "",
        iconColor: "#7d7371"
      },
      {
        id: "_4",
        alt: "ossidiana",
        iconURL: "",
        iconColor: "#000000"
      },
    ]
  },
  {
    typeID: "marble",
    typeSelect: "Marmo",
    roughness: {
      min: 0.0,
      max: 1.0,
      step: 0.05,
      start: 0.0
    },
    colors: [
      {
        id: "_1",
        alt: "marble1",
        iconURL: "",
        iconColor: "#d4bbbe"
      },
      {
        id: "_2",
        alt: "marble2",
        iconURL: "",
        iconColor: "#98b098"
      },
      {
        id: "_3",
        alt: "marble3",
        iconURL: "",
        iconColor: "#c0c0c0"
      },
    ]
  },

  {
    typeID: "aluminium",
    typeSelect: "Aluminium",
    roughness: {
      min: 0.12,
      max: 0.26,
      step: 0.02,
      start: 0.0
    },
    colors: [
      {
        id: "_1",
        alt: "aluminium1",
        iconURL: "",
        iconColor: "#979ca0"
      },
      {
        id: "_2",
        alt: "aluminium2",
        iconURL: "",
        iconColor: "#958e67"
      },
    ]
  },
  ];

  let optionsContainer = document.getElementById("editorOptions");
  let partsWrapper = optionsContainer.querySelectorAll(".parts-container")[0];

  menuControllers = [];
  sceneObjectsControllers.forEach(objControl => {
    let menuData = {
      partID: objControl.name,
      partName: objControl.description,
      textures: avaiableTextures,
      controller: objControl
    }
    let partMenuContainer = buildMenuOptions(partsWrapper, menuData);
    menuControllers.push({
      type: "editorPart", istance: new EditorPartController(partMenuContainer, objControl)
    });
  });

  menuControllers.push({
    type: "editor", istance: new EditorController(optionsContainer)
  });
}

function init() {
  show_debug_tools = false;
  show_fps = true;
  if (show_debug_tools) {
    console.log("Follow the 🐇...");
  }

  htmlParser = new DOMParser();;

  scene = new THREE.Scene();

  createRenderer();

  let cameraPosition = new THREE.Vector3(
    2.792848812291361,
    6.611740148960574,
    7.46642801695597
  );
  createCamera(cameraPosition);

  let cameraLookAt = new THREE.Vector3(
    0,
    2.05,
    0
  )
  // controls for camera
  createControls(cameraLookAt);

  // creating stats of frame
  if (show_fps) {
    stats = Util.createStats();
  }

  if (show_debug_tools) {
    // uncomment if you need to draw coordinate axes when building the scene
    Coordinates.drawAllAxes();
  }

  // add listener for resize event of window to update renderer
  window.addEventListener("resize", resizeListener, false);

  createScene();
  createTools();

  updateWorld();
}

function updateWorld() {
  requestAnimationFrame(updateWorld);
  controls.update();
  if (show_fps) {
    stats.update();
  }
  renderWorld();
}

function renderWorld() {
  renderer.render(scene, camera);
}
