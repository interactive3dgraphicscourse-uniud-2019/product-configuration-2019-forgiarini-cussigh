let controls, stats;

var textureParameters = {
  material: "plastic",
  color: "_1",
  repeatS: 1.0,
  repeatT: 1.0,
  normalScale: 0.0,
}

var path;
var normalMap;
var diffuseMap;
var specularMap;
var roughnessMap;

var uniforms = {
  specularMap: { type: "t", value: specularMap },
  diffuseMap: { type: "t", value: diffuseMap },
  roughnessMap: { type: "t", value: roughnessMap },
  pointLightPosition1: { type: "v3", value: new THREE.Vector3() },
  pointLightPosition2: { type: "v3", value: new THREE.Vector3() },
  normalMap: { type: "t", value: normalMap },
  normalScale: { type: "v2", value: new THREE.Vector2(1, 1) },
  clight1: { type: "v3", value: new THREE.Vector3() },
  clight2: { type: "v3", value: new THREE.Vector3() },
  textureRepeat: { type: "v2", value: new THREE.Vector2(1, 1) }
};

let vs;
let fs;

var ourMaterial;

var loader;

function loadTexture(file) {
  var texture = new THREE.TextureLoader().load(file, function (texture) {

    texture.minFilter = THREE.LinearMipMapLinearFilter;
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.offset.set(0, 0);
    texture.needsUpdate = true;
    renderWorld();
  })
  return texture;
}
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
  loader.load("models/table2.obj", function (obj) {
    let geometry = obj.detail.loaderRootNode.children[0].geometry;
    geometry.center();
    mesh = new THREE.Mesh(geometry, ourMaterial);
    mesh.scale.multiplyScalar(0.05);
    THREE.BufferGeometryUtils.computeTangents(geometry);
    scene.add(mesh);
  });
  createLights();
}

function createTools() {
  // Creating a GUI with options.

  let menuData = {
    partID: "table",
    partName: "Piano Tavolo",
    roughness: {
      min: 0.0,
      max: 5.0,
      step: 0.2,
      start: 0
    },
    textures: [{
      typeID: "wood",
      typeSelect: "Wood",
      colors: [
        {
          id: "_1",
          alt: "bambo",
          iconURL: "textures\\tables\\wood\\wood_1_Diffuse.jpg",
        },
        {
          id: "_2",
          alt: "acero",
          iconURL: "textures\\tables\\wood\\wood_2_Diffuse.jpg",
        },
        {
          id: "_3",
          alt: "ebano",
          iconURL: "textures\\tables\\wood\\wood_3_Diffuse.jpg",
        },
        {
          id: "_4",
          alt: "olmo",
          iconURL: "textures\\tables\\wood\\wood_4_Diffuse.jpg",
        },
        {
          id: "_5",
          alt: "pino",
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
  textureParameters.color = name;
  diffuseMap = loadTexture(path + textureParameters.material + textureParameters.color + "_Diffuse.jpg");
  ourMaterial.needsUpdate = true;
}

/**
* @param {String} name Texture ID
* @param {String} color Texture color ID
* @param {String} part Object part name
*/

let updateTexture = function (name, color, part) {
  console.log("need to update *" + part + "* texture with *" + name + "*" + " color *" + color + "*");
  textureParameters.material = name;
  textureParameters.color = color;
  path = "textures/tables/" + textureParameters.material + "/";
  normalMap = loadTexture(path + textureParameters.material + "_Normal.jpg");
  diffuseMap = loadTexture(path + textureParameters.material + textureParameters.color + "_Diffuse.jpg");
  specularMap = loadTexture(path + textureParameters.material + "_Specular.jpg");
  roughnessMap = loadTexture(path + textureParameters.material + "_Roughness.jpg");
}

let updateTextureRoughness = function (part, val) {
  console.log("need to update *" + part + "* roughness with *" + val + "*");
  textureParameters.normalScale = val;
}

function createLoader() {
  var manager = new THREE.LoadingManager();
  manager.onStart = function (url, itemsLoaded, itemsTotal) {
    console.log('Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
  };

  manager.onLoad = function () {
    console.log('Loading complete!');
  };

  manager.onProgress = function (url, itemsLoaded, itemsTotal) {
    console.log('Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
  };

  manager.onError = function (url) {
    console.log('There was an error loading ' + url);
  };

  loader = new THREE.OBJLoader2(manager);
  loader.useIndices = true;
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

  vs = document.getElementById("vertex").textContent;
  fs = document.getElementById("fragment").textContent;
  ourMaterial = new THREE.ShaderMaterial({ uniforms: uniforms, vertexShader: vs, fragmentShader: fs });
  ourMaterial.vertexTangents = true;
  ourMaterial.needsUpdate = true;
  
  createLoader();

  createScene();

  updateWorld();
}

function updateUniforms() {

  uniforms.clight1.value = new THREE.Vector3(
    light1Parameters.red * light1Parameters.intensity,
    light1Parameters.green * light1Parameters.intensity,
    light1Parameters.blue * light1Parameters.intensity);

  uniforms.clight2.value = new THREE.Vector3(
    light2Parameters.red * light2Parameters.intensity,
    light2Parameters.green * light2Parameters.intensity,
    light2Parameters.blue * light2Parameters.intensity);

  uniforms.textureRepeat.value = new THREE.Vector2(textureParameters.repeatS, textureParameters.repeatT);
  uniforms.diffuseMap.value = diffuseMap;
  uniforms.specularMap.value = specularMap;
  uniforms.roughnessMap.value = roughnessMap;
  uniforms.normalMap.value = normalMap;
  uniforms.normalScale.value = new THREE.Vector2(textureParameters.normalScale, textureParameters.normalScale);
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
