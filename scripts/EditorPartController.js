
let updateTexture = function (name, part) {
    console.log("need to update *" + part + "* texture with *" + name + "*");
}

let iconSelectHandler = function (controller, e) {
    let textureID = this.getAttribute("data-icon-id");
    if (controller.currentTextureSelected == textureID) {
        return;
    }
    controller.clearTextureSelection();
    controller.currentTextureSelected = textureID;
    this.classList += " selected";
    updateTexture(textureID, controller.name);
}

let textureTypeSelectHandler = function (controller, e) {
    let selectedType = this.value;
    if (controller.currentTextureTypeSelected == selectedType) {
        return;
    }
    controller.hideTexturesAvaiable();
    controller.showTextureTypes(selectedType);
    controller.currentTextureTypeSelected = selectedType;
}

class EditorPartController {
    constructor(domEl, name, data) {
        let el = domEl;
        let partName = name;
        this.container = el;
        this.name = partName;

        this.selectTextureContainer = this.container.querySelectorAll(".avaiable-materials")[0];
        this.selectTextureMenu = this.container.querySelectorAll(".select-texture-material")[0];
        this.textures = this.container.querySelectorAll(".texture-icon-wrapper");
        this.texturesTypes = this.container.querySelectorAll(".available-textures");

        let that = this;

        this.textures.forEach(tex => {
            tex.addEventListener('click', iconSelectHandler.bind(tex, that), false);
        });

        this.selectTextureMenu.addEventListener("change", textureTypeSelectHandler.bind(this.selectTextureMenu, that), false);
        this.currentTextureTypeSelected = "wood";
        this.currentTextureSelected = "ebano";
    }

    clearTextureSelection() {
        this.textures.forEach(textureWrapper => {
            textureWrapper.classList.remove("selected");
        });
    }

    hideTexturesAvaiable() {
        this.texturesTypes.forEach(textureTypeWrapper => {
            if (!textureTypeWrapper.classList.contains("hide")) {
                textureTypeWrapper.classList += " hide";
            }
        });
    }
    showTextureTypes(typeName) {
        this.texturesTypes.forEach(textureTypeWrapper => {
            if (textureTypeWrapper.getAttribute("data-texture-type") == typeName) {
                textureTypeWrapper.classList.remove("hide");
                return;
            }
        });
    }
}

function buildMenuOptions(container, data) {
    tmpl.arg = "part";
    let tmpl_obj = {
        name_id: data.partID,
        name: data.partName
    };

    let parser = new DOMParser();
    let objectPartEL = parser.parseFromString(tmpl("tmpl-insert-part-wrapper", tmpl_obj), "text/xml");
    let objectPartEditor = objectPartEL.firstChild;
    let selectTextureType = objectPartEditor.querySelectorAll(".select-texture-material")[0];
    let textureTypes = objectPartEditor.querySelectorAll(".available-colors")[0];

    data.textures.forEach(item => {
        tmpl.arg = "texture";
        let tmpl_obj = {
            type_name: item.typeID,
            type: item.typeSelect
        }
        let optionEL = parser.parseFromString(tmpl("tmpl-option-texture-type", tmpl_obj), "text/xml");
        let option = optionEL.firstChild;
        selectTextureType.appendChild(option);

        let typeWrapperEL = parser.parseFromString(tmpl("tmpl-insert-texture-type-wrapper", tmpl_obj), "text/xml");
        let typeWrapper = typeWrapperEL.firstChild;

        tmpl.arg = "texture_info";
        item.colors.forEach(texture => {
            let id = texture.id;
            let iconUrl = texture.iconURL;
            let tmpl_obj = {
                id: id,
                url: iconUrl
            };

            let textureWrapperEL = parser.parseFromString(tmpl("tmpl-insert-texture-icon-wrapper", tmpl_obj), "text/xml");
            let textureWrapper = textureWrapperEL.firstChild;
            typeWrapper.appendChild(textureWrapper);
        });
        textureTypes.appendChild(typeWrapper);
    });
    console.log(container);
    let func = function (container, objectPartEditor) {
        console.log({ container, objectPartEditor });
        container.appendChild(objectPartEditor);
        
    }
    setTimeout(func.bind(null, container, objectPartEditor), 3000);
}
