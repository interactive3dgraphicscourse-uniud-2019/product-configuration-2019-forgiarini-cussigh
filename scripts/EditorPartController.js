
let updateTexture = function (name, part) {
    console.log("need to update *" + part + "* texture with *" + name + "*");
}

let optionsContainer = document.getElementById("editorOptions");

let tableOptions = {
    tableMatSelect: document.getElementById("table-material-select"),
    tablePlotSelect: document.getElementById("table-plot-select"),
    textures: {
        wood: document.getElementById("table-wood-textures"),
        metal: document.getElementById("table-metal-textures"),
        plastic: document.getElementById("table-plastic-textures"),
    },
    plotsAvaiable: document.getElementById("table-avaiable-plots-container")
};

tableOptions.tableMatSelect.addEventListener("change", e => {
    let selectedVal = e.target.selectedOptions[0].value;
    for (const key of Object.keys(tableOptions.textures)) {
        if (!tableOptions.textures[key].classList.contains("hide")) {
            tableOptions.textures[key].classList += " hide";
        }
    }

    switch (selectedVal) {
        case "wood":
            console.log("wood selected");
            tableOptions.textures.wood.classList.remove("hide");
            break;
        case "metal":
            console.log("metal selected");
            tableOptions.textures.metal.classList.remove("hide");
            break;
        case "plastic":
            console.log("plastic selected");
            tableOptions.textures.plastic.classList.remove("hide");
            break;
        default:
            break;
    }
});

tableOptions.tablePlotSelect.addEventListener("change", e => {
    console.log("selected: " + e.target.selectedOptions[0].value);
});


let iconSelectHandler = function(controller) {
    var attribute = this.getAttribute("data-icon-id");
    updateTexture(attribute, controller.name);
}

class EditorPartController {
    constructor(domEl, name) {
        let el = domEl;
        let partName = name;
        this.container = el;
        this.name = partName;

        this.selectTextureContainer = this.container.querySelectorAll(".avaiable-materials")[0];
        this.selectTextureMenu = this.container.querySelectorAll(".select-texture-material")[0];
        this.textures = this.container.querySelectorAll(".texture-icon-wrapper");
        this.texturesTypes = this.container.querySelectorAll(".available-textures");
        this.texturesTypesNames = [];

        let that = this;
        
        this.texturesTypes.forEach(type => {
            that.texturesTypesNames.push(type.dataset.textureType);
        });
        
        this.texturesTypesNames.forEach(element => {
            let el = document.createElement("option");
            el.value = element;
            that.selectTextureMenu.appendChild(el);
        });

        this.textures.forEach(tex => {
            tex.addEventListener('click', iconSelectHandler.bind(tex, that), false);
        });
    }
}

let optionsContainer = document.getElementById("editorOptions");
let tableEditorContainer = optionsContainer.querySelectorAll(".part")[0];
console.log(tableEditorContainer);
let control = new EditorPartController(tableEditorContainer, "table");
