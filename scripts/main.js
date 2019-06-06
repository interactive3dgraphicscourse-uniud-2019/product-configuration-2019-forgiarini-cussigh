
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
    controller.istance.updateDimensions();
  });
};

/**
 * Creates an istance of THREE.WebGLRenderer and links to the body.
 */
function createRenderer() {
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0xfafafa);
  renderer.setPixelRatio(window.devicePixelRatio);
  let canvasContainer = document.getElementById("rendererContainer");
  canvasContainer.appendChild(renderer.domElement);
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
    partDescription: "Table Top",
    lights: lightsInSceneParameters,
    materialsAvaiable: ["wood", "metal", "plastic", "marble", "aluminium"],
    textureData: {
      id: "wood",
      color: "_2",
      normalScale: 3.45
    },
    textureController: textureController
  }));

  sceneObjectsControllers.push(new ObjPartController({
    vertexShader: vs,
    fragmentShader: fs,
    modelName: "legs",
    partID: "1234",
    partDescription: "Table Legs",
    materialsAvaiable: ["wood", "metal", "plastic"],
    lights: lightsInSceneParameters,
    textureData: {
      id: "wood",
      color: "_5",
      normalScale: 0.75
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
        alt: "white",
        iconURL: "",
        iconColor: "#dfd4c2"
      },
      {
        id: "_2",
        alt: "yellow",
        iconURL: "",
        iconColor: "#dbb77b"
      },
      {
        id: "_3",
        alt: "brown",
        iconURL: "",
        iconColor: "#7e5f29"
      },
      {
        id: "_4",
        alt: "dark brown",
        iconURL: "",
        iconColor: "#4f3210"
      },
      {
        id: "_5",
        alt: "darkest brown",
        iconURL: "",
        iconColor: "#5f3525"
      },
    ]
  },
  {
    typeID: "plastic",
    typeSelect: "Plastic",
    roughness: {
      min: 0.15,
      max: 2.3,
      step: 0.05,
      start: 0.0
    },
    colors: [
      {
        id: "_1",
        alt: "white",
        iconURL: "",
        iconColor: "#d1d2cd"
      },
      {
        id: "_2",
        alt: "red",
        iconURL: "",
        iconColor: "#9e2423"
      },
      {
        id: "_3",
        alt: "green",
        iconURL: "",
        iconColor: "#1e5f3f"
      },
      {
        id: "_4",
        alt: "blue",
        iconURL: "",
        iconColor: "#2b717b"
      },
      {
        id: "_5",
        alt: "brown",
        iconURL: "",
        iconColor: "#99824e"
      },
      {
        id: "_6",
        alt: "grey",
        iconURL: "",
        iconColor: "#999999"
      },
    ]
  },
  {
    typeID: "metal",
    typeSelect: "Metal",
    roughness: {
      min: 0.0,
      max: 1.0,
      step: 0.01,
      start: 0.0
    },
    colors: [
      {
        id: "_1",
        alt: "brown",
        iconURL: "",
        iconColor: "#8c7958"
      },
      {
        id: "_2",
        alt: "red",
        iconURL: "",
        iconColor: "#8f5047"
      },
      {
        id: "_3",
        alt: "grey",
        iconURL: "",
        iconColor: "#7d7371"
      },
      {
        id: "_4",
        alt: "black",
        iconURL: "",
        iconColor: "#000000"
      },
    ]
  },
  {
    typeID: "marble",
    typeSelect: "Marble",
    roughness: {
      min: 0.0,
      max: 1.0,
      step: 0.02,
      start: 0.0
    },
    colors: [
      {
        id: "_1",
        alt: "pink",
        iconURL: "",
        iconColor: "#d4bbbe"
      },
      {
        id: "_2",
        alt: "green",
        iconURL: "",
        iconColor: "#98b098"
      },
      {
        id: "_3",
        alt: "grey",
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
      step: 0.002,
      start: 0.0
    },
    colors: [
      {
        id: "_1",
        alt: "grey",
        iconURL: "",
        iconColor: "#979ca0"
      },
      {
        id: "_2",
        alt: "yellow",
        iconURL: "",
        iconColor: "#958e67"
      },
    ]
  },
  ];

  let optionsContainer = document.getElementById("editorOptions");
  let partsWrapper = optionsContainer.querySelectorAll(".parts-container")[0];

  menuControllers = [];
  partsControllers = [];
  sceneObjectsControllers.forEach(objControl => {
    let menuData = {
      partID: objControl.name,
      partName: objControl.description,
      textures: avaiableTextures,
      controller: objControl
    }
    let partMenuContainer = buildMenuOptions(partsWrapper, menuData);
    partsControllers.push({
      type: "editorPart",
      istance: new EditorPartController(partMenuContainer, objControl),
      partID: objControl.name
    });
  });

  EditorController.addSeparators(partsWrapper, "tmpl-part-separator");
  menuControllers.push({
    type: "editor", istance: new EditorController(optionsContainer, ".parts-container")
  });

  let previewPath = "images/";

  let presets = [
    {
      preview: previewPath + "tavolo1.jpg",
      alt: "marble table",
      plane: {
        material: "marble",
        color: "_1",
        roughness: 0.6
      },
      legs: {
        material: "metal",
        color: "_4",
        roughness: 0.2
      }
    },
    {
      preview: previewPath + "tavolo2.jpg",
      alt: "aluminium table",
      plane: {
        material: "aluminium",
        color: "_1",
        roughness: 0.17
      },
      legs: {
        material: "wood",
        color: "_2",
        roughness: 2.0
      }
    },
    {
      preview: previewPath + "tavolo3.jpg",
      alt: "wood table",
      plane: {
        material: "wood",
        color: "_1",
        roughness: 1.5
      },
      legs: {
        material: "metal",
        color: "_3",
        roughness: 0.3
      }
    },
    {
      preview: previewPath + "tavolo4.jpg",
      alt: "plastic table",
      plane: {
        material: "plastic",
        color: "_4",
        roughness: 1.5
      },
      legs: {
        material: "wood",
        color: "_1",
        roughness: 0.1
      }
    },
  ];

  let presetsContainer = document.getElementById("presetsContainer");
  let presetsWrapper = presetsContainer.querySelectorAll(".presets-list-container")[0];
  for (let i = 0; i < presets.length; i++) {
    buildPresetObj(presetsWrapper, presets[i]);
  }

  let presetController = new PresetController(presetsWrapper, partsControllers);

  EditorController.addSeparators(presetsWrapper, "tmpl-preset-separator");

  menuControllers.push({
    type: "editor", istance: new EditorController(presetsContainer, ".presets-list-container")
  });
}

function init() {
  show_debug_tools = false;
  show_fps = false;
  if (show_debug_tools) {
    console.log("Follow the 🐇...");
  }

  htmlParser = new DOMParser();

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
