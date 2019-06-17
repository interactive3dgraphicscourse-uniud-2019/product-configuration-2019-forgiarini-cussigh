
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
  
  mobileController.updateVisibility();

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
    partID: tablePlaneID,
    partDescription: "Table Top",
    lights: lightsInSceneParameters,
    materialsAvaiable: ["wood", "stone", "plastic", "marble", "aluminium"],
    textureData: {
      id: "wood",
      color: "_1",
      normalScale: 1.0
    },
    textureController: textureController
  }));

  sceneObjectsControllers.push(new ObjPartController({
    vertexShader: vs,
    fragmentShader: fs,
    modelName: "legs",
    partID: tableLegsID,
    partDescription: "Table Legs",
    materialsAvaiable: ["wood", "stone", "plastic"],
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
      max: 1.7,
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
      max: 1.3,
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
    typeID: "stone",
    typeSelect: "Stone",
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
    ]
  },
  ];

  let optionsContainer = document.getElementById("editorOptions");
  let partsWrapper = optionsContainer.querySelectorAll(".parts-container")[0];

  menuControllers = [];
  partsControllers = [];
  sceneObjectsControllers.forEach(objControl => {
    let menuData = {
      partID: objControl.partHandledID,
      partName: objControl.description,
      textures: avaiableTextures,
      controller: objControl
    }
    let partMenuContainer = DomUtils.buildMenuOptions(partsWrapper, menuData);
    partsControllers.push({
      type: "editorPart",
      istance: new EditorPartController(partMenuContainer, objControl),
      partID: objControl.partHandledID
    });
  });

  DomUtils.addSeparators(partsWrapper, "tmpl-part-separator");
  menuControllers.push({
    type: "editor", istance: new EditorController(optionsContainer, ".parts-container")
  });

  let previewPath = "images/";

  let presets = [
    {
      preview: previewPath + "tavolo1.jpg",
      alt: "marble table",
      data: [{
        //table
        partID: tablePlaneID,
        dataToApply: {
          material: "marble",
          color: "_1",
          roughness: 0.6
        }
      }, {
        // legs
        partID: tableLegsID,
        dataToApply: {
          material: "stone",
          color: "_4",
          roughness: 0.2
        }
      }]
    },
    {
      preview: previewPath + "tavolo2.jpg",
      alt: "aluminium table",
      data: [{
        //table
        partID: tablePlaneID,
        dataToApply: {
          material: "aluminium",
          color: "_1",
          roughness: 0.17
        }
      }, {
        // legs
        partID: tableLegsID,
        dataToApply: {
          material: "wood",
          color: "_2",
          roughness: 1.0
        }
      }]
    },
    {
      preview: previewPath + "tavolo3.jpg",
      alt: "wood table",
      data: [{
        //table
        partID: tablePlaneID,
        dataToApply: {
          material: "wood",
          color: "_1",
          roughness: 1
        }
      }, {
        // legs
        partID: tableLegsID,
        dataToApply: {
          material: "stone",
          color: "_3",
          roughness: 0.3
        }
      }]
    },
    {
      preview: previewPath + "tavolo4.jpg",
      alt: "plastic table",
      data: [{
        //table
        partID: tablePlaneID,
        dataToApply: {
          material: "plastic",
          color: "_4",
          roughness: 1
        }
      }, {
        // legs
        partID: tableLegsID,
        dataToApply: {
          material: "wood",
          color: "_1",
          roughness: 0.1
        }
      }]
    },
  ];

  let presetsContainer = document.getElementById("presetsContainer");
  let presetsWrapper = presetsContainer.querySelectorAll(".presets-list-container")[0];
  for (let i = 0; i < presets.length; i++) {
    DomUtils.buildPresetObj(presetsWrapper, presets[i]);
  }

  let presetController = new PresetController(presetsWrapper, partsControllers);

  DomUtils.addSeparators(presetsWrapper, "tmpl-preset-separator");

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
    stats = DomUtils.createStats();
  }

  if (show_debug_tools) {
    // uncomment if you need to draw coordinate axes when building the scene
    Coordinates.drawAllAxes();
  }

  // add listener for resize event of window to update renderer
  window.addEventListener("resize", resizeListener, false);
  mobileController = new MobileController();
  
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
